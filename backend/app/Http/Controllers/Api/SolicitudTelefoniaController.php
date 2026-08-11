<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SolicitudTelefoniaController extends Controller
{
    private const TRAMITES = [
        'SOLICITAR_TELEFONO', 'CAMBIO_PIN_CN', 'CAMBIO_USUARIO', 'MODIFICAR_DATOS',
        'JEFE_SECRETARIA', 'CAMBIO_DID', 'CAMBIO_CATEGORIA', 'OTROS',
    ];

    public function index(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $query = DB::table('v_solicitudes_telefonia as v')
            ->leftJoin('solicitudes_telefonia as st', 'st.id', '=', 'v.id')
            ->select('v.*', 'st.usuario_mov')
            ->orderBy('v.id', 'desc');

        if ($rol !== 'Administrador') {
            $query->where('st.usuario_mov', $usuario->usuario);
        }

        return response()->json($query->get());
    }

    public function buscarUsuarioPorExtension(string $extension)
    {
        $usuario = DB::table('usuarios_telefonia')->where('extension', $extension)->first();

        if (!$usuario) {
            return response()->json(['message' => 'No se encontró un usuario de telefonía con esa extensión'], 404);
        }

        return response()->json($usuario);
    }

    public function storeUsuario(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido_paterno' => 'nullable|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'rfc' => 'nullable|string|max:13',
            'curp' => 'nullable|string|max:18',
            'clave_puesto' => 'nullable|string|max:30',
            'puesto' => 'nullable|string|max:200',
            'area_id' => 'nullable|integer',
            'correo_institucional' => 'nullable|email|max:150',
            'correo_externo' => 'nullable|email|max:150',
            'correo_jefe' => 'nullable|email|max:150',
            'direccion' => 'nullable|string|max:200',
            'ubicacion' => 'nullable|string|max:200',
            'extension' => 'required|string|max:10|unique:usuarios_telefonia,extension',
            'nivel' => 'nullable|string|max:20',
            'nodo' => 'nullable|string|max:50',
            'internet' => 'boolean',
            'equipo_computo' => 'boolean',
            'observaciones' => 'nullable|string',
            'modelo' => 'nullable|string|max:100',
            'mac' => [
                'nullable', 'string',
                'regex:/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/',
                'unique:usuarios_telefonia,mac',
            ],
            'numero_serie' => 'nullable|string|max:100|unique:usuarios_telefonia,numero_serie',
        ], [
            'mac.regex' => 'La MAC no tiene un formato válido (XX:XX:XX:XX:XX:XX).',
            'mac.unique' => 'Esa MAC ya está asignada a otro teléfono.',
            'numero_serie.unique' => 'Ese número de serie ya está registrado en otro teléfono.',
            'extension.unique' => 'Esa extensión ya está en uso.',
        ]);

        $id = DB::table('usuarios_telefonia')->insertGetId([
            ...$data,
            'status' => 'Activo',
            'created_at' => now(),
        ]);

        $creado = DB::table('usuarios_telefonia')->where('id', $id)->first();
        return response()->json($creado, 201);
    }

    public function store(Request $request)
    {
        $usuario = $request->user();

        $data = $request->validate([
            'usuario_id' => 'nullable|integer|exists:usuarios_telefonia,id',
            'tipo_tramite' => 'required|in:' . implode(',', self::TRAMITES),
            'observaciones' => 'nullable|string',
            'detalle' => 'nullable|array',
        ]);

        $id = DB::table('solicitudes_telefonia')->insertGetId([
            'usuario_id' => $data['usuario_id'] ?? null,
            'tipo_tramite' => $data['tipo_tramite'],
            'estatus' => 'GENERADA',
            'observaciones' => $data['observaciones'] ?? null,
            'detalle' => isset($data['detalle']) ? json_encode($data['detalle'], JSON_UNESCAPED_UNICODE) : null,
            'usuario_mov' => $usuario->usuario,
            'created_at' => now(),
        ]);

        // Arreglo Jefe-Secretaria también deja rastro en su tabla propia
        if ($data['tipo_tramite'] === 'JEFE_SECRETARIA'
            && isset($data['detalle']['jefe_usuario_id'], $data['detalle']['secretaria_usuario_id'])) {
            DB::table('jefe_secretaria')->insert([
                'jefe_id' => $data['detalle']['jefe_usuario_id'],
                'secretaria_id' => $data['detalle']['secretaria_usuario_id'],
                'mismos_privilegios' => $data['detalle']['mismos_privilegios'] ?? false,
                'observaciones' => $data['observaciones'] ?? null,
                'estatus' => 'activo',
                'created_at' => now(),
            ]);
        }

        return response()->json(['id' => $id, 'message' => 'Solicitud de telefonía creada'], 201);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'estatus' => 'sometimes|in:GENERADA,EN_PROCESO,AUTORIZADA,RECHAZADA,FINALIZADA',
            'observaciones' => 'nullable|string',
        ]);

        DB::table('solicitudes_telefonia')->where('id', $id)->update([
            ...$data,
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Solicitud actualizada']);
    }

    public function destroy(int $id)
    {
        DB::table('solicitudes_telefonia')->where('id', $id)->update([
            'estatus' => 'RECHAZADA',
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Solicitud dada de baja']);
    }

    public function categorias()
    {
        return response()->json(
            DB::table('cat_categoria_telefonia')->where('estatus', 'activo')->get()
        );
    }

    public function tiposClave()
    {
        return response()->json(
            DB::table('cat_tipo_clave')->orderBy('nombre')->get()
        );
    }
}