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

    // Trámites que, al activarse, requieren capturar la extensión oficial asignada.
    private const TRAMITES_REQUIEREN_EXTENSION_ASIGNADA = ['SOLICITAR_TELEFONO'];

    public function index(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $query = DB::table('v_solicitudes_telefonia as v')
            ->leftJoin('solicitudes_telefonia as st', 'st.id', '=', 'v.id')
            ->select(
                'v.*',
                'st.usuario_mov',
                'st.extension_asignada',
                'st.did_asignado',
                'st.tipo_clave',
                'st.clave_asignada'
            )
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
            // Se guarda tal cual lo capturó el wizard; se usa después al activar el servicio
            // para aplicar los cambios correspondientes al usuario real de telefonía.
            'detalle' => isset($data['detalle']) ? json_encode($data['detalle']) : null,
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

        // El detalle se guarda como JSON crudo en la BD; se decodifica para que el
        // frontend lo reciba ya como objeto (usado para prellenar el modal de editar).
        if (isset($s->detalle) && is_string($s->detalle)) {
            $s->detalle = json_decode($s->detalle, true);
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

        $update = [
            'observaciones' => $data['observaciones'] ?? $actual->observaciones,
            'updated_at' => now(),
        ];

        // Si mandan `detalle`, reemplaza lo guardado (el frontend envía el objeto completo,
        // ya mergeado con lo que no cambió, para no perder datos previos).
        if (array_key_exists('detalle', $data)) {
            $update['detalle'] = $data['detalle'] !== null ? json_encode($data['detalle']) : null;
        }

        DB::table('solicitudes_telefonia')->where('id', $id)->update($update);

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
            'extension_asignada' => 'nullable|string|max:10',
            'did_asignado' => 'nullable|string|max:20',
            'tipo_clave' => 'nullable|in:PIN,CN',
            'clave_asignada' => 'nullable|string|max:50',
        ]);

        $nuevo = $data['estatus'];
        $tramite = $solicitud->tipo_tramite;
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

            // Solo "Solicitar Teléfono" requiere capturar la extensión oficial asignada;
            // los demás trámites ya operan sobre un usuario/extensión existente.
            if (in_array($tramite, self::TRAMITES_REQUIEREN_EXTENSION_ASIGNADA, true)) {
                $request->validate(['extension_asignada' => 'required|string|max:10'], [
                    'extension_asignada.required' => 'La extensión asignada es obligatoria para activar el servicio.',
                ]);

                // Evita reasignar una extensión que ya está activa en otro trámite.
                $extensionEnUso = DB::table('solicitudes_telefonia')
                    ->where('extension_asignada', $data['extension_asignada'])
                    ->where('estatus', 'activo')
                    ->where('id', '<>', $id)
                    ->exists();
                if ($extensionEnUso) {
                    return response()->json(['message' => 'Esa extensión ya está asignada a otro trámite activo.'], 422);
                }

                $update['extension_asignada'] = $data['extension_asignada'];
                $update['did_asignado'] = $data['did_asignado'] ?? null;
            }

            // El cambio de PIN/CN sí exige capturar el nuevo valor al activar.
            if ($tramite === 'CAMBIO_PIN_CN') {
                $request->validate([
                    'tipo_clave' => 'required|in:PIN,CN',
                    'clave_asignada' => 'required|string|max:50',
                ], [
                    'tipo_clave.required' => 'Selecciona el tipo de clave (PIN o CN).',
                    'clave_asignada.required' => 'Captura el nuevo valor de la clave.',
                ]);
            }

            // Para "Solicitar Teléfono" la clave es opcional, pero si se captura una,
            // debe venir el tipo, y viceversa.
            if (!empty($data['clave_asignada']) && empty($data['tipo_clave'])) {
                return response()->json(['message' => 'Selecciona el tipo de clave (PIN o CN).'], 422);
            }
            if (!empty($data['tipo_clave']) && empty($data['clave_asignada'])) {
                return response()->json(['message' => 'Captura el valor de la clave.'], 422);
            }
            if (!empty($data['tipo_clave']) && !empty($data['clave_asignada'])) {
                $update['tipo_clave'] = $data['tipo_clave'];
                $update['clave_asignada'] = $data['clave_asignada'];
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

        // Al activar el servicio, se aplican al usuario real de telefonía los datos
        // que la solicitud capturó según su tipo de trámite.
        if ($nuevo === 'activo') {
            $detalle = $solicitud->detalle ? json_decode($solicitud->detalle, true) : null;
            $this->aplicarCambiosAUsuario($solicitud->usuario_id, $tramite, $detalle, $update);
        }

        return response()->json(['message' => 'Estatus actualizado correctamente']);
    }

    /**
     * Aplica a `usuarios_telefonia` los cambios correspondientes al activar una solicitud,
     * según el tipo de trámite. `$detalle` es lo que se capturó en el wizard al crear la
     * solicitud; `$datosActivacion` es lo capturado en el propio modal de activación
     * (extensión asignada, clave nueva, etc.).
     */
    private function aplicarCambiosAUsuario(?int $usuarioId, string $tramite, ?array $detalle, array $datosActivacion): void
    {
        if (!$usuarioId) {
            return;
        }

        $update = [];

        switch ($tramite) {
            case 'SOLICITAR_TELEFONO':
                if (!empty($datosActivacion['extension_asignada'])) {
                    $update['extension'] = $datosActivacion['extension_asignada'];
                }
                if (!empty($datosActivacion['did_asignado'])) {
                    $update['did'] = $datosActivacion['did_asignado'];
                }
                if (!empty($datosActivacion['tipo_clave'])) {
                    $update['tipo_clave'] = $datosActivacion['tipo_clave'];
                }
                if (!empty($datosActivacion['clave_asignada'])) {
                    $update['clave_actual'] = $datosActivacion['clave_asignada'];
                }
                break;

            case 'CAMBIO_PIN_CN':
                if (!empty($datosActivacion['tipo_clave'])) {
                    $update['tipo_clave'] = $datosActivacion['tipo_clave'];
                }
                if (!empty($datosActivacion['clave_asignada'])) {
                    $update['clave_actual'] = $datosActivacion['clave_asignada'];
                }
                break;

            case 'CAMBIO_USUARIO':
                if ($detalle && isset($detalle['nuevo_usuario']) && is_array($detalle['nuevo_usuario'])) {
                    $n = $detalle['nuevo_usuario'];
                    foreach (['nombre', 'apellido_paterno', 'apellido_materno', 'rfc', 'curp',
                              'clave_puesto', 'correo_institucional', 'direccion', 'ubicacion',
                              'nivel', 'nodo'] as $campo) {
                        if (array_key_exists($campo, $n)) {
                            $update[$campo] = $n[$campo] !== '' ? $n[$campo] : null;
                        }
                    }
                    if (isset($n['equipo_computo'])) {
                        $update['equipo_computo'] = in_array($n['equipo_computo'], ['Si', true, 1], true);
                    }
                    if (isset($n['internet'])) {
                        $update['internet'] = in_array($n['internet'], ['Si', true, 1], true);
                    }
                }
                break;

            case 'MODIFICAR_DATOS':
                if ($detalle && isset($detalle['campos_modificados']) && is_array($detalle['campos_modificados'])) {
                    $c = $detalle['campos_modificados'];
                    foreach (['nombre', 'apellido_paterno', 'apellido_materno', 'rfc', 'curp',
                              'clave_puesto', 'puesto', 'correo_institucional', 'direccion',
                              'ubicacion', 'nivel', 'nodo'] as $campo) {
                        if (array_key_exists($campo, $c)) {
                            $update[$campo] = $c[$campo] !== '' ? $c[$campo] : null;
                        }
                    }
                    if (isset($c['equipo_computo'])) {
                        $update['equipo_computo'] = in_array($c['equipo_computo'], ['Si', true, 1], true);
                    }
                    if (isset($c['internet'])) {
                        $update['internet'] = in_array($c['internet'], ['Si', true, 1], true);
                    }
                }
                break;

            case 'CAMBIO_DID':
                if ($detalle) {
                    if (!empty($detalle['nueva_extension'])) {
                        $update['extension'] = $detalle['nueva_extension'];
                    }
                    if (!empty($detalle['numero_did'])) {
                        $update['did'] = $detalle['numero_did'];
                    }
                }
                break;

            case 'CAMBIO_CATEGORIA':
                if ($detalle) {
                    foreach (['puesto', 'correo_institucional', 'clave_puesto', 'direccion'] as $campo) {
                        if (!empty($detalle[$campo])) {
                            $update[$campo] = $detalle[$campo];
                        }
                    }
                    if (!empty($detalle['categoria_id'])) {
                        $update['categoria_id'] = $detalle['categoria_id'];
                    }
                }
                break;

            // JEFE_SECRETARIA, CAMBIO_FAX, FAX, OTROS: no requieren actualización
            // automática del usuario de telefonía al activarse.
            default:
                break;
        }

        if (!empty($update)) {
            $update['updated_at'] = now();
            DB::table('usuarios_telefonia')->where('id', $usuarioId)->update($update);
        }
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

    public function actualizarAsignacion(Request $request, int $id)
    {
        $usuario = $request->user();

        $solicitud = DB::table('solicitudes_telefonia')->where('id', $id)->first();
        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        if ($solicitud->estatus !== 'activo') {
            return response()->json([
                'message' => 'Solo se puede editar la asignación cuando el servicio está activo.',
            ], 422);
        }

        $data = $request->validate([
            'extension_asignada' => 'required|string|max:10',
            'did_asignado' => 'nullable|string|max:20',
            'tipo_clave' => 'nullable|in:PIN,CN',
            'clave_asignada' => 'nullable|string|max:50',
        ], [
            'extension_asignada.required' => 'La extensión asignada es obligatoria.',
        ]);

        if (!empty($data['clave_asignada']) && empty($data['tipo_clave'])) {
            return response()->json(['message' => 'Selecciona el tipo de clave (PIN o CN).'], 422);
        }
        if (!empty($data['tipo_clave']) && empty($data['clave_asignada'])) {
            return response()->json(['message' => 'Captura el valor de la clave.'], 422);
        }

        $extensionEnUso = DB::table('solicitudes_telefonia')
            ->where('extension_asignada', $data['extension_asignada'])
            ->where('estatus', 'activo')
            ->where('id', '<>', $id)
            ->exists();
        if ($extensionEnUso) {
            return response()->json(['message' => 'Esa extensión ya está asignada a otro trámite activo.'], 422);
        }

        DB::table('solicitudes_telefonia')->where('id', $id)->update([
            'extension_asignada' => $data['extension_asignada'],
            'did_asignado' => $data['did_asignado'] ?? null,
            'tipo_clave' => $data['tipo_clave'] ?? null,
            'clave_asignada' => $data['clave_asignada'] ?? null,
            'usuario_mov' => $usuario->usuario,
            'updated_at' => now(),
        ]);

        // Refleja también el cambio en el usuario real de telefonía.
        DB::table('usuarios_telefonia')->where('id', $solicitud->usuario_id)->update([
            'extension' => $data['extension_asignada'],
            'did' => $data['did_asignado'] ?? null,
            'tipo_clave' => $data['tipo_clave'] ?? null,
            'clave_actual' => $data['clave_asignada'] ?? null,
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Asignación actualizada correctamente']);
    }

    public function imprimirResguardo(int $id)
{
    $s = DB::table('solicitudes_telefonia as st')
        ->leftJoin('usuarios_telefonia as ut', 'ut.id', '=', 'st.usuario_id')
        ->select('st.*', 'ut.nombre', 'ut.apellido_paterno', 'ut.apellido_materno',
            'ut.puesto', 'ut.extension', 'ut.mac', 'ut.numero_serie', 'ut.modelo')
        ->where('st.id', $id)
        ->first();

    if (!$s) {
        abort(404, 'Solicitud no encontrada');
    }

    $pdf = Pdf::loadView('pdf.resguardo_telefonico', ['s' => $s])->setPaper('letter');
    return $pdf->stream("resguardo_telefonia_{$s->id}.pdf");
}

}
