<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // Roles que requieren fila en la tabla `soporte`
    private const ROLES_CON_SOPORTE = ['Administrador', 'Soporte Técnico'];

    /**
     * Listado de usuarios (para la tabla de administración de usuarios)
     */
    public function index(Request $request)
    {
        $usuarios = Usuario::with(['rol', 'area', 'soporte'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'usuario' => $u->usuario,
                'clave' => $u->clave,
                'nombre' => $u->nombre,
                'rol_id' => $u->rol_id,
                'rol' => $u->rol->nombre ?? null,
                'id_area' => $u->id_area,
                'area' => $u->area->area ?? null,
                'id_soporte' => $u->id_soporte,
                'extension' => $u->soporte->extension ?? null,
                'status' => (string) $u->status === "\x01" || (int) $u->status === 1,
            ]);

        return response()->json($usuarios);
    }

    /**
     * Alta de usuario. Si el rol es Administrador o Soporte Técnico,
     * crea también su fila correspondiente en `soporte` dentro de la
     * misma transacción para no dejar vínculos huérfanos.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'usuario' => 'required|string|max:25|unique:usuarios,usuario',
            'clave' => 'required|string|min:6|max:25',
            'nombre' => 'required|string|max:150',
            'rol_id' => 'required|integer|exists:roles,id',
            'id_area' => 'nullable|integer|exists:areas,id',
            'extension' => 'nullable|integer',
            'ip' => 'nullable|string|max:25',
            'cel' => 'nullable|integer',
            'hrs' => 'nullable|integer',
        ]);

        $rol = DB::table('roles')->where('id', $data['rol_id'])->first();
        $requiereSoporte = $rol && in_array($rol->nombre, self::ROLES_CON_SOPORTE);

        $usuarioCreado = DB::transaction(function () use ($data, $requiereSoporte) {
            $idSoporte = null;

            if ($requiereSoporte) {
                $idSoporte = DB::table('soporte')->insertGetId([
                    'nombre' => $data['nombre'],
                    'extension' => $data['extension'] ?? null,
                    'status' => 1,
                ]);
            }

            $id = DB::table('usuarios')->insertGetId([
                'usuario' => $data['usuario'],
                'clave' => $data['clave'],
                'new_clave' => $data['clave'],
                'id_soporte' => $idSoporte,
                'id_area' => $data['id_area'] ?? null,
                'ip' => $data['ip'] ?? null,
                'cel' => $data['cel'] ?? null,
                'hrs' => $data['hrs'] ?? null,
                'status' => 1,
                'nombre' => $data['nombre'],
                'rol_id' => $data['rol_id'],
            ]);

            return Usuario::with(['rol', 'soporte'])->find($id);
        });

        return response()->json($usuarioCreado, 201);
    }

    public function show(string $id)
    {
        $usuario = Usuario::with(['rol', 'area', 'soporte'])->find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($usuario);
    }

    /**
     * Actualiza un usuario. Si cambia de un rol sin soporte a uno con
     * soporte, crea la fila en `soporte` que faltaba. Si cambia de rol
     * con soporte a sin soporte, deja el vínculo en NULL (no borra el
     * histórico en `soporte` para no romper solicitudes ya cerradas).
     */
    public function update(Request $request, string $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $data = $request->validate([
            'usuario' => ['sometimes', 'string', 'max:25', Rule::unique('usuarios', 'usuario')->ignore($usuario->id)],
            'clave' => 'nullable|string|min:6|max:25',
            'nombre' => 'sometimes|string|max:150',
            'rol_id' => 'sometimes|integer|exists:roles,id',
            'id_area' => 'nullable|integer|exists:areas,id',
            'extension' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        $nuevoRolId = $data['rol_id'] ?? $usuario->rol_id;
        $rol = DB::table('roles')->where('id', $nuevoRolId)->first();
        $requiereSoporte = $rol && in_array($rol->nombre, self::ROLES_CON_SOPORTE);

        DB::transaction(function () use ($usuario, $data, $requiereSoporte) {
            $idSoporte = $usuario->id_soporte;

            if ($requiereSoporte && !$idSoporte) {
                // Pasó a un rol que necesita soporte y no tenía: se crea
                $idSoporte = DB::table('soporte')->insertGetId([
                    'nombre' => $data['nombre'] ?? $usuario->nombre,
                    'extension' => $data['extension'] ?? null,
                    'status' => 1,
                ]);
            } elseif ($requiereSoporte && $idSoporte && (isset($data['nombre']) || isset($data['extension']))) {
                // Sigue requiriendo soporte: mantenemos el nombre sincronizado
                DB::table('soporte')->where('id', $idSoporte)->update([
                    'nombre' => $data['nombre'] ?? $usuario->nombre,
                    'extension' => $data['extension'] ?? DB::raw('extension'),
                ]);
            } elseif (!$requiereSoporte) {
                // Ya no requiere soporte: desvinculamos (no se borra la fila en `soporte`)
                $idSoporte = null;
            }

            $update = array_filter([
                'usuario' => $data['usuario'] ?? null,
                'nombre' => $data['nombre'] ?? null,
                'rol_id' => $data['rol_id'] ?? null,
                'id_area' => array_key_exists('id_area', $data) ? $data['id_area'] : null,
                'status' => array_key_exists('status', $data) ? $data['status'] : null,
            ], fn($v) => $v !== null);

            $update['id_soporte'] = $idSoporte;

            if (!empty($data['clave'])) {
                $update['clave'] = $data['clave'];
                $update['new_clave'] = $data['clave'];
            }

            DB::table('usuarios')->where('id', $usuario->id)->update($update);
        });

        return response()->json(Usuario::with(['rol', 'area', 'soporte'])->find($usuario->id));
    }

    /**
     * Baja lógica (no elimina la fila para no romper el histórico de
     * solicitudes ya asignadas a este usuario)
     */
    public function destroy(string $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        DB::table('usuarios')->where('id', $id)->update(['status' => 0]);

        return response()->json(['message' => 'Usuario dado de baja correctamente']);
    }


    public function roles()
    {
        return response()->json(DB::table('roles')->orderBy('id')->get());
    }
}