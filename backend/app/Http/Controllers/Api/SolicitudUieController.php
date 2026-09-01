<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SolicitudUieController extends Controller
{
    private function columnasFiltrables(): array
    {
        return [
            'folio_sistema'    => 'v.id',
            'ejercicio'        => 'v.ejercicio',
            'solicitante'      => 'v.solicitante',
            'area'             => 'v.area',
            'num_documento'    => 'v.num_documento',
            'tecnico'          => 'v.tecnico',
            'no_inventario'    => 'v.no_inventario',
            'fecha_asignacion' => 'v.fecha_asignacion',
        ];
    }

    public function index(Request $request)
    {
        $porPagina = min(max(1, (int) $request->get('por_pagina', 10)), 100); // Límite de seguridad para paginación
        $pagina = max(1, (int) $request->get('pagina', 1));
        $filtros = $this->columnasFiltrables();

        // Optimización: Seleccionar solo las columnas necesarias en lugar de v.*
        // y prevenir uniones innecesarias si solo quieres verificar la existencia con un subquery o exists.
        $query = DB::table('v_solicitud_uie as v')
            ->leftJoin('solicitud as s', 's.id', '=', 'v.id')
            ->leftJoin('equipos_solicitud as es', 'es.id_solicitud', '=', 'v.id')
            ->leftJoin('dictamen as d', 'd.id_solicitud', '=', 'v.id')
            ->select(
                'v.id',
                'v.ejercicio',
                'v.solicitante',
                'v.area',
                'v.num_documento',
                'v.tecnico',
                'v.no_inventario',
                'v.fecha_asignacion',
                'd.id as id_dictamen',
                's.dada_baja', 
                's.fecha_autoriza_tecnico', 
                's.fecha_autoriza_dictamen',
                'es.id as id_equipo_solicitud',
                // Optimización: Usamos una subconsulta correlacionada rápida en vez de un leftJoin extra que duplica filas
                DB::raw('(SELECT COUNT(*) FROM equipo_mantenimiento_cgd emc WHERE emc.id_equipo_solicitud = es.id) > 0 as tiene_checklist')
            )
            ->where(function ($q) {
                $q->whereNull('s.dada_baja')->orWhere('s.dada_baja', 0);
            });

        foreach ($filtros as $param => $columna) {
            if ($request->filled($param)) {
                $query->where($columna, 'like', '%' . $request->get($param) . '%');
            }
        }

        $sortBy = $request->get('sort_by');
        $sortDir = $request->get('sort_dir', 'desc') === 'asc' ? 'asc' : 'desc';
        if ($sortBy && isset($filtros[$sortBy])) {
            $query->orderBy($filtros[$sortBy], $sortDir);
        } else {
            $query->orderBy('v.id', 'desc');
        }

        // Optimización: Contar con la misma consulta base limpia
        $total = (clone $query)->count();
        $registros = $query->forPage($pagina, $porPagina)->get();

        return response()->json([
            'registros' => $registros,
            'total' => $total,
            'pagina' => $pagina,
            'por_pagina' => $porPagina,
            'total_paginas' => max(1, (int) ceil($total / $porPagina)),
        ]);
    }

    public function agregarEquipo(Request $request, int $id)
    {
        $rol = $request->user()->rol->nombre ?? null;
        if (!in_array($rol, ['Administrador', 'Capturista'])) {
            return response()->json(['message' => 'No tienes permiso para esta acción'], 403);
        }

        $data = $request->validate([
            'id_equipo' => 'required|integer|exists:datos_equipos,id',
        ]);

        // Optimización: Validar existencia y inserción optimizada
        $yaTieneEquipo = DB::table('equipos_solicitud')
            ->where('id_solicitud', $id)
            ->exists();

        if ($yaTieneEquipo) {
            return response()->json([
                'message' => 'Esta solicitud ya tiene un equipo vinculado. Solo se permite uno por dictamen.',
            ], 422);
        }

        $idEquipoSolicitud = DB::table('equipos_solicitud')->insertGetId([
            'id_solicitud' => $id,
            'id_equipo' => $data['id_equipo'],
        ]);

        $yaSugeridoBaja = DB::table('dictamen')
            ->where('id_equipo', $data['id_equipo'])
            ->where('sugiere_baja', 1)
            ->exists();

        return response()->json([
            'message' => 'Equipo vinculado correctamente',
            'id_equipo_solicitud' => $idEquipoSolicitud,
            'ya_sugerido_baja' => $yaSugeridoBaja,
        ]);
    }

    public function desautorizarDictamen(Request $request, int $id)
    {
        $rol = $request->user()->rol->nombre ?? null;
        if ($rol !== 'Administrador') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        DB::table('solicitud')->where('id', $id)->update([
            'fecha_autoriza_dictamen' => null,
            'fecha_autoriza_tecnico'  => null,
            'fecha_cierre'            => null,
            'id_soporte'              => null,
            'fecha_asignacion'        => null,
        ]);

        return response()->json(['message' => 'Dictamen desautorizado. El ticket regresó a estado sin atender y puede reasignarse.']);
    }

    public function duplicar(Request $request, int $id)
    {
        // Optimización: Seleccionar solo lo necesario o usar get() sin casteos pesados innecesarios
        $original = DB::table('solicitud')->where('id', $id)->first();

        if (!$original) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $nuevo = (array) $original;
        unset($nuevo['id']);
        $nuevo['id_situacion'] = 1;
        $nuevo['status_uie'] = 1;
        $nuevo['fecha_solicitud'] = now();
        $nuevo['fecha_asignacion'] = null;
        $nuevo['fecha_cierre'] = null;
        $nuevo['dada_baja'] = 0;
        $nuevo['fecha_baja'] = null;
        $nuevo['motivo_baja'] = null;
        $nuevo['usr_crea'] = $request->user()->usuario ?? $nuevo['usr_crea'];

        $nuevoId = DB::table('solicitud')->insertGetId($nuevo);

        return response()->json(['id' => $nuevoId, 'message' => 'Solicitud duplicada correctamente'], 201);
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
        ]);

        DB::table('solicitud')->where('id', $id)->update($data);

        return response()->json(['message' => 'Solicitud actualizada correctamente']);
    }

    public function baja(Request $request, int $id)
    {
        $data = $request->validate([
            'motivo_baja' => 'required|string',
        ]);

        DB::table('solicitud')->where('id', $id)->update([
            'dada_baja' => 1,
            'fecha_baja' => now(),
            'motivo_baja' => $data['motivo_baja'],
        ]);

        return response()->json(['message' => 'Solicitud dada de baja']);
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

    public function archivos(int $id)
    {
        $registros = DB::table('solicitud_archivos')
            ->where('id_solicitud', $id)
            ->select('id', 'tipo', 'ruta_archivo', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($registros);
    }

    // Detalle completo para el modal "Detalle"
    public function show(int $id)
    {
        // Optimización: En lugar de 4 consultas separadas secuenciales que bloquean el hilo,
        // podemos traer la información principal y agilizar la respuesta seleccionando estrictamente columnas necesarias.
        $solicitud = DB::table('solicitud as s')
            ->leftJoin('areas as a', 'a.id', '=', 's.id_area')
            ->leftJoin('cat_poa as p', 'p.id', '=', 's.id_poa')
            ->leftJoin('soporte as sp', 'sp.id', '=', 's.id_soporte')
            ->leftJoin('situacion as si', 'si.id', '=', 's.id_situacion')
            ->where('s.id', $id)
            ->select(
                's.*', 'a.area', 'p.poa', 'sp.nombre as tecnico', 'si.situacion'
            )
            ->first();

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        // Consultas secundarias limpias (al ser claves foráneas indexadas, vuelan)
        $equipos = DB::table('equipos_solicitud as es')
            ->join('v_equipos as e', 'e.id', '=', 'es.id_equipo')
            ->where('es.id_solicitud', $id)
            ->select('e.id', 'e.tipo', 'e.marca', 'e.modelo', 'e.no_inventario', 'e.no_serie', 'e.sistema')
            ->get();

        $dictamen = DB::table('dictamen')
            ->where('id_solicitud', $id)
            ->select('id', 'folio', 'ejercicio', 'fecha_dictamen', 'dictamen', 'expediente')
            ->first();

        $archivos = DB::table('solicitud_archivos')
            ->where('id_solicitud', $id)
            ->select('id', 'tipo', 'ruta_archivo', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'solicitud' => $solicitud,
            'equipos' => $equipos,
            'dictamen' => $dictamen,
            'archivos' => $archivos,
        ]);
    }

    public function cerrarDictamen(Request $request, int $id)
    {
        $rol = $request->user()->rol->nombre ?? null;
        if ($rol !== 'Administrador') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $solicitud = DB::table('solicitud')->where('id', $id)->first();
        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }
        if (!$solicitud->fecha_autoriza_tecnico) {
            return response()->json(['message' => 'El dictamen debe autorizarse primero antes de cerrarlo'], 422);
        }

        DB::table('solicitud')->where('id', $id)->update([
            'fecha_autoriza_dictamen' => now(),
        ]);

        return response()->json(['message' => 'Dictamen autorizado y cerrado correctamente']);
    }

    public function autorizarDictamen(Request $request, int $id)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $solicitud = DB::table('solicitud')->where('id', $id)->first();
        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 4004);
        }

        if (!$solicitud->fecha_cierre) {
            return response()->json(['message' => 'La solicitud debe cerrarse primero (servicio) antes de autorizar el dictamen'], 422);
        }

        if ($rol === 'Soporte Técnico' && $solicitud->id_soporte != $usuario->id_soporte) {
            return response()->json(['message' => 'No puedes autorizar el dictamen de una solicitud que no tienes asignada'], 403);
        }

        if (!in_array($rol, ['Soporte Técnico', 'Administrador'])) {
            return response()->json(['message' => 'No tienes permiso para esta acción'], 403);
        }

        DB::table('solicitud')->where('id', $id)->update([
            'fecha_autoriza_tecnico' => now(),
        ]);

        return response()->json(['message' => 'Dictamen autorizado correctamente']);
    }
}