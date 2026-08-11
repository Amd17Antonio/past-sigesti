<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReporteService
{
    public function listarPoa()
    {
        return DB::table('cat_poa')->orderBy('id')->get();
    }

    private function baseQuery(?int $idPoa, ?string $del, ?string $al)
    {
        $servicios = DB::table('servicios_solicitud as ss')
            ->join('cat_servicios as cs', 'cs.id', '=', 'ss.id_servicio')
            ->select('ss.id_solicitud', DB::raw('GROUP_CONCAT(cs.servicio SEPARATOR ", ") as servicios'))
            ->groupBy('ss.id_solicitud');

        $query = DB::table('solicitud as s')
            ->leftJoin('cat_poa as po', 'po.id', '=', 's.id_poa')
            ->leftJoin('dictamen as d', 'd.id_solicitud', '=', 's.id')
            ->leftJoinSub($servicios, 'sv', 'sv.id_solicitud', '=', 's.id')
            ->where('s.id_situacion', 3)
            ->whereNotNull('s.fecha_cierre')
            ->select(
                's.id',
                's.solicitante',
                's.fecha_cierre as fecha',
                'sv.servicios as servicio',
                's.num_servicios',
                'po.poa',
                'po.id as id_poa',
                DB::raw("CASE WHEN d.id IS NOT NULL THEN CONCAT(d.folio, '/', d.ejercicio) ELSE NULL END as no_dictamen")
            );

        if ($idPoa) {
            $query->where('s.id_poa', $idPoa);
        }

        if ($del) {
            $query->whereDate('s.fecha_cierre', '>=', $del);
        }

        if ($al) {
            $query->whereDate('s.fecha_cierre', '<=', $al);
        }

        return $query;
    }

    public function actividades(?int $idPoa, ?string $del, ?string $al, int $pagina, int $porPagina): array
    {
        $query = $this->baseQuery($idPoa, $del, $al)->orderBy('s.id', 'desc');

        $total = (clone $query)->count();
        $registros = $query->forPage($pagina, $porPagina)->get();

        $contador = null;
        if ($idPoa) {
            $todos = $this->baseQuery($idPoa, $del, $al)->get();
            $conDictamen = $todos->whereNotNull('no_dictamen')->count();
            $sinDictamen = $todos->count() - $conDictamen;
            $contador = ['con_dictamen' => $conDictamen, 'sin_dictamen' => $sinDictamen];
        }

        return [
            'registros' => $registros,
            'total' => $total,
            'pagina' => $pagina,
            'por_pagina' => $porPagina,
            'total_paginas' => max(1, (int) ceil($total / $porPagina)),
            'contador' => $contador,
        ];
    }
}