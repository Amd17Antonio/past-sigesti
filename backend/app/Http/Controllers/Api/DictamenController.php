<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DictamenController extends Controller
{
    private function columnasFiltrables(): array
    {
        return [
            'folio_sistema'   => 'v.folio_sistema',
            'folio_dictamen'  => 'v.folio_dictamen',
            'fecha_dictamen'  => 'v.fecha_dictamen',
            'expediente'      => 'v.expediente',
            'area'            => 'v.area',
            'no_inventario'   => 'v.no_inventario',
        ];
    }

    public function index(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $porPagina = (int) $request->get('por_pagina', 10);
        $pagina = max(1, (int) $request->get('pagina', 1));
        $filtros = $this->columnasFiltrables();

        $query = DB::table('v_dictamenes as v')
            ->select('v.*');

        if ($rol === 'Usuario Solicitante') {
            $misIds = DB::table('solicitud')
                ->where('usr_crea', $usuario->usuario)
                ->pluck('id');

            $query->whereIn('v.folio_sistema', $misIds);
        }

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

        $total = (clone $query)->count();

        $registros = $query
            ->forPage($pagina, $porPagina)
            ->get();

        return response()->json([
            'registros'      => $registros,
            'total'          => $total,
            'pagina'         => $pagina,
            'por_pagina'     => $porPagina,
            'total_paginas'  => max(1, (int) ceil($total / $porPagina)),
        ]);
    }

    /**
     * Solicitudes disponibles para generar dictamen.
     * Se muestran únicamente las solicitudes asignadas
     * que aún no tienen dictamen.
     */
    public function solicitudesDisponibles()
{
    $registros = DB::table('solicitud as s')
        ->join('areas as a', 'a.id', '=', 's.id_area')
        ->leftJoin('soporte as sp', 'sp.id', '=', 's.id_soporte')
        ->leftJoin('dictamen as d', 'd.id_solicitud', '=', 's.id')
        ->whereNull('d.id')
        ->whereNotNull('s.fecha_cierre')
        ->whereNotNull('s.fecha_autoriza_dictamen')
        ->select(
            's.id',
            's.solicitante',
            'a.area',
            's.num_documento',
            'sp.nombre as tecnico',
            's.descripcion'
        )
        ->orderByDesc('s.id')
        ->limit(200)
        ->get();

    $ids = $registros->pluck('id');

    $equiposPorSolicitud = DB::table('equipos_solicitud as es')
        ->join('v_equipos as e', 'e.id', '=', 'es.id_equipo')
        ->whereIn('es.id_solicitud', $ids)
        ->select('es.id_solicitud', 'e.no_inventario')
        ->get()
        ->groupBy('id_solicitud');

    $registros->transform(function ($r) use ($equiposPorSolicitud) {
        $equipos = $equiposPorSolicitud->get($r->id, collect());
        $r->equipos = $equipos->pluck('no_inventario')->filter()->implode(', ');
        return $r;
    });

    return response()->json($registros);
}

    /**
     * Equipos asociados a una solicitud.
     */
    public function equiposDeSolicitud(int $idSolicitud)
    {
        $registros = DB::table('v_equipos_dictamen')
            ->where('id_solicitud', $idSolicitud)
            ->get();

        return response()->json($registros);
    }

    /**
     * Obtiene el siguiente folio disponible.
     */
    public function siguienteFolio()
    {
        $ejercicio = now()->year;

        $max = DB::table('dictamen')
            ->where('ejercicio', $ejercicio)
            ->max('folio');

        return response()->json([
            'ejercicio' => $ejercicio,
            'folio' => ($max ?? 0) + 1,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_solicitud' => 'required|integer|exists:solicitud,id',
            'id_equipo' => 'nullable|integer',
            'ejercicio' => 'required|integer',
            'folio' => 'required|integer',
            'servicio' => 'nullable|string',
            'dictamen' => 'required|string',
            'expediente' => 'nullable|string|max:500',
            'copias' => 'nullable|string|max:500',
            'fallas' => 'nullable|string|max:500',
            'tipo_falla' => 'nullable|string|max:10',
            'sugiere_baja' => 'boolean',
        ]);

        $id = DB::table('dictamen')->insertGetId([
            ...$data,
            'fecha_dictamen' => now(),
        ]);

        DB::table('solicitud')
            ->where('id', $data['id_solicitud'])
            ->update([
                'status_uie' => 3,
            ]);

        return response()->json([
            'id' => $id,
            'message' => 'Dictamen creado correctamente',
        ], 201);
    }

    public function update(Request $request, int $id)
{
    $data = $request->validate([
        'servicio' => 'nullable|string',
        'dictamen' => 'sometimes|string',
        'expediente' => 'nullable|string|max:500',
        'copias' => 'nullable|string|max:500',
        'fallas' => 'nullable|string|max:500',
        'tipo_falla' => 'nullable|string|max:10',
        'sugiere_baja' => 'boolean',
        'fecha_dictamen' => 'nullable|date',
    ]);

    DB::table('dictamen')
        ->where('id', $id)
        ->update($data);

    return response()->json([
        'message' => 'Dictamen actualizado correctamente',
    ]);
}

    public function show(int $id)
    {
        $dictamen = DB::table('dictamen')
            ->where('id', $id)
            ->first();

        if (!$dictamen) {
            return response()->json([
                'message' => 'Dictamen no encontrado',
            ], 404);
        }

        return response()->json($dictamen);
    }

}