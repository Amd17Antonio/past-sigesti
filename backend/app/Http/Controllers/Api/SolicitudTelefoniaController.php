<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

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
            'estatus' => 'creado_cgd',
            'fecha_creado_cgd' => now(),
            'observaciones' => $data['observaciones'] ?? null,
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

    public function show(int $id)
{
    $s = DB::table('solicitudes_telefonia as st')
        ->leftJoin('usuarios_telefonia as ut', 'ut.id', '=', 'st.usuario_id')
        ->leftJoin('cat_categoria_telefonia as cat', 'cat.id', '=', 'ut.categoria_id')
        ->select('st.*', 'ut.nombre', 'ut.apellido_paterno', 'ut.apellido_materno',
            'ut.extension', 'ut.puesto', 'ut.correo_institucional', 'ut.edificio',
            'ut.nivel', 'ut.did', 'ut.modelo', 'ut.mac', 'ut.numero_serie', 'cat.categoria')
        ->where('st.id', $id)
        ->first();

    if (!$s) {
        return response()->json(['message' => 'Solicitud no encontrada'], 404);
    }

    return response()->json(['solicitud' => $s]);
}

public function update(Request $request, int $id)
{
    $actual = DB::table('solicitudes_telefonia')->where('id', $id)->first();
    if (!$actual) {
        return response()->json(['message' => 'Solicitud no encontrada'], 404);
    }

    if ($actual->estatus !== 'creado_cgd') {
        return response()->json([
            'message' => 'Esta solicitud ya está en atención de la Dirección General de Tecnologías e Innovación Digital y no puede editarse.',
        ], 422);
    }

    $data = $request->validate([
        'observaciones' => 'nullable|string',
        'detalle' => 'nullable|array',
    ]);

    DB::table('solicitudes_telefonia')->where('id', $id)->update([
        'observaciones' => $data['observaciones'] ?? $actual->observaciones,
        'updated_at' => now(),
    ]);

    return response()->json(['message' => 'Solicitud actualizada']);
}

public function cambiarEstatus(Request $request, int $id)
{
    $usuario = $request->user();

    $solicitud = DB::table('solicitudes_telefonia')->where('id', $id)->first();
    if (!$solicitud) {
        return response()->json(['message' => 'Solicitud no encontrada'], 404);
    }

    $data = $request->validate([
        'estatus' => 'required|in:creado_cgd,atendiendo_dgti,activo,baja',
        'folio_glpi' => 'nullable|string|max:50',
        'observacion_glpi' => 'nullable|string',
        'motivo_baja' => 'nullable|string',
    ]);

    $nuevo = $data['estatus'];
    $update = ['estatus' => $nuevo, 'usuario_mov' => $usuario->usuario, 'updated_at' => now()];

    if ($nuevo === 'atendiendo_dgti') {
        $request->validate(['folio_glpi' => 'required|string|max:50'], [
            'folio_glpi.required' => 'El folio GLPI es obligatorio para pasar a este estatus.',
        ]);
        $update['folio_glpi'] = $data['folio_glpi'];
        $update['observacion_glpi'] = $data['observacion_glpi'] ?? null;
        $update['fecha_atendiendo_dgti'] = now();
    }

    if ($nuevo === 'activo') {
        if ($solicitud->estatus === 'activo') {
            return response()->json(['message' => 'Esta solicitud ya se encuentra activa.'], 422);
        }
        if ($solicitud->usuario_id) {
            $yaActivo = DB::table('solicitudes_telefonia')
                ->where('usuario_id', $solicitud->usuario_id)
                ->where('estatus', 'activo')
                ->where('id', '<>', $id)
                ->exists();
            if ($yaActivo) {
                return response()->json([
                    'message' => 'Este usuario ya cuenta con un trámite de telefonía activo. Da de baja el anterior antes de activar uno nuevo.',
                ], 422);
            }
        }
        $update['fecha_activo'] = now();
    }

    if ($nuevo === 'baja') {
        $request->validate(['motivo_baja' => 'required|string|min:5'], [
            'motivo_baja.required' => 'El motivo de baja es obligatorio.',
        ]);
        $update['motivo_baja'] = $data['motivo_baja'];
        $update['fecha_baja'] = now();
    }

    if ($nuevo === 'creado_cgd' && !$solicitud->fecha_creado_cgd) {
        $update['fecha_creado_cgd'] = now();
    }

    DB::table('solicitudes_telefonia')->where('id', $id)->update($update);

    return response()->json(['message' => 'Estatus actualizado correctamente']);
}

    public function destroy(int $id)
    {
        DB::table('solicitudes_telefonia')->where('id', $id)->update([
            'estatus' => 'baja',
            'fecha_baja' => now(),
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
    
public function imprimir(int $id)
{
    $s = DB::table('solicitudes_telefonia as st')
        ->leftJoin('usuarios_telefonia as ut', 'ut.id', '=', 'st.usuario_id')
        ->select(
            'st.*',
            'ut.nombre', 'ut.apellido_paterno', 'ut.apellido_materno',
            'ut.puesto', 'ut.direccion', 'ut.correo_institucional',
            'ut.extension', 'ut.mac', 'ut.numero_serie'
        )
        ->where('st.id', $id)
        ->first();

    if (!$s) {
        abort(404, 'Solicitud no encontrada');
    }

    $pdf = Pdf::loadView('pdf.solicitud_telefonia', ['s' => $s])->setPaper('letter');
    return $pdf->stream("solicitud_telefonia_{$s->id}.pdf");
}
}