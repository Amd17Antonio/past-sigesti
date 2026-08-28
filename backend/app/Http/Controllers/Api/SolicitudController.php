<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\NotificacionService;

class SolicitudController extends Controller
{
    public function pendientes(Request $request)
{
    $usuario = $request->user();
    $rol = $usuario->rol->nombre ?? null;

    $query = DB::table('solicitud as s')
        ->leftJoin('areas as a', 'a.id', '=', 's.id_area')
        ->leftJoin('situacion as si', 'si.id', '=', 's.id_situacion')
        ->select(
            's.id', 's.solicitante', 's.extension',
            DB::raw("COALESCE(a.area, 'Sin área asignada') as area"),
            's.descripcion', 's.prioridad', 's.fecha_solicitud',
            's.id_situacion', 'si.situacion', 's.edificio', 's.nivel',
            's.num_documento', 's.status_uie', 's.usr_crea'
        )
        ->where('s.id_situacion', 1)
        ->where(function ($q) {
            $q->whereYear('s.fecha_solicitud', '>=', 2023);
        })
        ->orderBy('s.id', 'desc');

    if ($rol === 'Usuario Solicitante') {
        $query->where('s.usr_crea', $usuario->usuario);
    }

    return response()->json($query->get());
}

    // Solicitudes ya asignadas (pestaña "Asignadas")
    public function asignadas(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $query = DB::table('v_solicitudes_asignadas')->orderBy('id', 'desc');

        if ($rol === 'Soporte Técnico') {
            // Solo lo que tiene asignado a él mismo
            $query->where('id_soporte', $usuario->id_soporte);
        }
        // Administrador (y por ahora Capturista) ven todas

        return response()->json($query->get());
    }

    public function misAsignadas(Request $request)
{
    $usuario = $request->user();

    if (!$usuario->id_soporte) {
        return response()->json([]);
    }

    $registros = DB::table('v_solicitudes_asignadas')
        ->where('id_soporte', $usuario->id_soporte)
        ->orderBy('id', 'desc')
        ->get();

    return response()->json($registros);
}

    public function asignables(Request $request)
{
    $usuario = $request->user();
    $rol = $usuario->rol->nombre ?? null;

    if ($rol === 'Soporte Técnico') {
        if (!$usuario->id_soporte) {
            return response()->json([]);
        }
        $soporte = DB::table('soporte')->where('id', $usuario->id_soporte)->first();
        return response()->json($soporte ? [$soporte] : []);
    }

    if ($rol === 'Administrador') {
        $rolesPermitidos = ['Administrador', 'Soporte Técnico'];
    } elseif ($rol === 'Capturista') {
        $rolesPermitidos = ['Soporte Técnico'];
    } else {
        return response()->json([]);
    }

    $lista = Usuario::whereHas('rol', fn($q) => $q->whereIn('nombre', $rolesPermitidos))
        ->whereNotNull('id_soporte')
        ->with('soporte')
        ->get()
        ->map(fn($u) => [
            'id' => $u->soporte->id ?? null,
            'nombre' => $u->soporte->nombre ?? $u->nombre,
        ])
        ->filter(fn($item) => $item['id'] !== null)
        ->unique('id')
        ->values();

    return response()->json($lista); // arreglo plano, SIN envolver en {opciones: ...}
}

    public function historial(Request $request)
{
    $usuario = $request->user();
    $rol = $usuario->rol->nombre ?? null;

    if ($rol === 'Usuario Solicitante') {
        $misIds = DB::table('solicitud')->where('usr_crea', $usuario->usuario)->pluck('id');
        $registros = DB::table('v_historial_solicitudes')
            ->whereIn('id', $misIds)
            ->whereNotNull('fecha_cierre')
            ->orderBy('id', 'desc')
            ->get();
    } elseif ($rol === 'Soporte Técnico') {
        $registros = DB::table('v_historial_solicitudes')
            ->where('id_soporte', $usuario->id_soporte)
            ->whereNotNull('fecha_cierre')
            ->orderBy('id', 'desc')
            ->get();
    } else {
        // Administrador (y Capturista, si aplica): todas las cerradas, sin importar técnico
        $registros = DB::table('v_historial_solicitudes')
            ->whereNotNull('fecha_cierre')
            ->orderBy('id', 'desc')
            ->get();
    }

    $idsEvaluadas = DB::table('encuesta')
        ->whereIn('id_solicitud', $registros->pluck('id'))
        ->whereNotNull('tipo_respuesta')
        ->distinct()
        ->pluck('id_solicitud')
        ->flip();

    $registros->transform(function ($r) use ($idsEvaluadas) {
        $r->evaluada = isset($idsEvaluadas[$r->id]);
        return $r;
    });

    return response()->json($registros);
}

    public function asignar(Request $request, int $id)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $data = $request->validate([
            'id_soporte' => 'required|integer',
        ]);

        if ($rol === 'Usuario Solicitante') {
            return response()->json(['message' => 'No tienes permiso para asignar solicitudes'], 403);
        }

        if ($rol === 'Soporte Técnico') {
            if ($data['id_soporte'] != $usuario->id_soporte) {
                return response()->json(['message' => 'Solo puedes autoasignarte'], 403);
            }
        }

        if ($rol === 'Capturista') {
            $valido = Usuario::where('id_soporte', $data['id_soporte'])
                ->whereHas('rol', fn($q) => $q->where('nombre', 'Soporte Técnico'))
                ->exists();
            if (!$valido) {
                return response()->json(['message' => 'Solo puedes asignar a personal de Soporte Técnico'], 403);
            }
        }

        if ($rol === 'Administrador') {
            $valido = Usuario::where('id_soporte', $data['id_soporte'])
                ->whereHas('rol', fn($q) => $q->whereIn('nombre', ['Administrador', 'Soporte Técnico']))
                ->exists();
            if (!$valido) {
                return response()->json(['message' => 'Asignación no permitida'], 403);
            }
        }

        DB::table('solicitud')->where('id', $id)->update([
            'id_soporte' => $data['id_soporte'],
            'id_situacion' => 2,
            'fecha_asignacion' => now(),
            'usr_asigna' => $usuario->usuario,
        ]);

        return response()->json(['message' => 'Solicitud asignada correctamente']);
    }

    // Agrega una nota de seguimiento sin cerrar la solicitud
    public function seguimiento(Request $request, int $id)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $data = $request->validate([
            'seguimiento' => 'required|string|max:2000',
        ]);

        $solicitud = DB::table('solicitud')->where('id', $id)->first();

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        if ($rol === 'Soporte Técnico' && $solicitud->id_soporte != $usuario->id_soporte) {
            return response()->json(['message' => 'No puedes dar seguimiento a una solicitud que no tienes asignada'], 403);
        }

        if (!in_array($rol, ['Soporte Técnico', 'Administrador'])) {
            return response()->json(['message' => 'No tienes permiso para esta acción'], 403);
        }

        $fecha = now()->format('d/m/Y H:i');
        $nuevaEntrada = "[{$fecha} - {$usuario->usuario}] {$data['seguimiento']}";
        $textoFinal = $solicitud->seguimiento
            ? $solicitud->seguimiento . "\n" . $nuevaEntrada
            : $nuevaEntrada;

        DB::table('solicitud')->where('id', $id)->update([
            'seguimiento' => $textoFinal,
        ]);

        return response()->json(['message' => 'Seguimiento agregado correctamente']);
    }

    // Cierra la solicitud (pasa a Historial)
    public function cerrar(Request $request, int $id)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $data = $request->validate([
            'id_poa' => 'required|integer|exists:cat_poa,id',
            'num_servicios' => 'required|integer|min:0',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        $solicitud = DB::table('solicitud')->where('id', $id)->first();

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        if ($solicitud->id_situacion != 2) {
            return response()->json(['message' => 'Solo se pueden cerrar solicitudes asignadas'], 422);
        }

        if ($rol === 'Soporte Técnico' && $solicitud->id_soporte != $usuario->id_soporte) {
            return response()->json(['message' => 'No puedes cerrar una solicitud que no tienes asignada'], 403);
        }

        if (!in_array($rol, ['Soporte Técnico', 'Administrador'])) {
            return response()->json(['message' => 'No tienes permiso para cerrar solicitudes'], 403);
        }

        DB::table('solicitud')->where('id', $id)->update([
            'id_situacion' => 3,
            'fecha_cierre' => now(),
            'id_poa' => $data['id_poa'],
            'num_servicios' => $data['num_servicios'],
            'observaciones' => $data['observaciones'] ?? $solicitud->observaciones,
        ]);

        return response()->json(['message' => 'Solicitud cerrada correctamente']);
    }

    // Catálogo de POA para el select del modal "Cerrar servicio"
    public function poa()
    {
        return response()->json(
            DB::table('cat_poa')->orderBy('poa')->get()
        );
    }

    public function store(Request $request)
{
    $usuario = $request->user();
    $rol = $usuario->rol->nombre ?? null;

    $reglaArea = $rol === 'Usuario Solicitante' ? 'nullable|integer' : 'required|integer';

    $data = $request->validate([
        'solicitante' => 'required|string|max:80',
        'puesto' => 'nullable|string|max:200',
        'tipo_documento' => 'nullable|string|max:25',
        'num_documento' => 'nullable|string|max:50',
        'fecha_memo' => 'nullable|date',
        'fecha_memo_recibido' => 'nullable|date',
        'id_area' => $reglaArea,
        'descripcion' => 'required|string|max:500',
        'prioridad' => 'nullable|string|max:10',
        'extension' => 'nullable|integer',
        'edificio' => 'nullable|integer',
        'nivel' => 'nullable|string|max:2',
        'id_soporte' => 'nullable|integer',
    ]);

    // Si el Solicitante no manda área, usamos la que ya tiene asignada su cuenta (id_area en usuarios)
    if ($rol === 'Usuario Solicitante' && empty($data['id_area'])) {
        $data['id_area'] = $usuario->id_area;
    }

    $idSoporte = $data['id_soporte'] ?? null;
    unset($data['id_soporte']);

    $situacionInicial = 1;
    $camposAsignacion = [];

    if ($idSoporte) {
        if ($rol === 'Capturista') {
            $valido = Usuario::where('id_soporte', $idSoporte)
                ->whereHas('rol', fn($q) => $q->where('nombre', 'Soporte Técnico'))
                ->exists();
            if (!$valido) {
                return response()->json(['message' => 'Solo puedes asignar a personal de Soporte Técnico'], 403);
            }
        } elseif ($rol === 'Administrador') {
            $valido = Usuario::where('id_soporte', $idSoporte)
                ->whereHas('rol', fn($q) => $q->whereIn('nombre', ['Administrador', 'Soporte Técnico']))
                ->exists();
            if (!$valido) {
                return response()->json(['message' => 'Asignación no permitida'], 403);
            }
        }

        $situacionInicial = 2;
        $camposAsignacion = [
            'id_soporte' => $idSoporte,
            'fecha_asignacion' => now(),
            'usr_asigna' => $usuario->usuario,
        ];
    }


    $id = DB::table('solicitud')->insertGetId([
        ...$data,
        ...$camposAsignacion,
        'fecha_solicitud' => now(),
        'id_situacion' => $situacionInicial,
        'usr_crea' => $usuario->usuario,
        'ip' => $request->ip(),
        'num_servicios' => 1,
        'status_uie' => 1,//0 ahora toda solicitud entra visible a "Solicitudes"
    ]);

    if ($rol === 'Usuario Solicitante') {
        app(NotificacionService::class)->crearNuevaSolicitud(
            $id,
            $data['solicitante'],
            $data['descripcion'],
            ['Administrador', 'Capturista', 'Soporte Técnico']
        );
    }

    return response()->json(['id' => $id, 'message' => 'Solicitud creada correctamente'], 201);
}

public function update(Request $request, int $id)
{
    $data = $request->validate([
        'solicitante' => 'sometimes|string|max:80',
        'puesto' => 'nullable|string|max:200',
        'extension' => 'nullable|integer',
        'id_area' => 'sometimes|integer|exists:areas,id',
        'descripcion' => 'nullable|string|max:500',
        'tipo_documento' => 'nullable|string|max:25',
        'num_documento' => 'nullable|string|max:50',
        'prioridad' => 'nullable|string|max:10',
        'fecha_memo' => 'nullable|date',
        'fecha_memo_recibido' => 'nullable|date',
        'observaciones' => 'nullable|string',
        'edificio' => 'nullable|integer',
        'nivel' => 'nullable|string|max:2',
        'seguimiento' => 'nullable|string',
    ]);

    DB::table('solicitud')->where('id', $id)->update($data);

    return response()->json(['message' => 'Solicitud actualizada correctamente']);
}

// Devuelve el historial de seguimiento guardado (para mostrarlo al reabrir el modal)
public function verSeguimiento(int $id)
{
    $solicitud = DB::table('solicitud')->where('id', $id)->first();

    if (!$solicitud) {
        return response()->json(['message' => 'Solicitud no encontrada'], 404);
    }

    return response()->json([
        'seguimiento' => $solicitud->seguimiento,
    ]);
}

}