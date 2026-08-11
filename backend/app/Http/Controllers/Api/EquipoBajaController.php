<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class EquipoBajaController extends Controller
{
    private function baseQuery()
    {
        return DB::table('dictamen as d')
            ->join('solicitud as s', 's.id', '=', 'd.id_solicitud')
            ->join('areas as a', 'a.id', '=', 's.id_area')
            ->leftJoin('datos_equipos as eq', 'eq.id', '=', 'd.id_equipo')
            ->leftJoin('cat_tipo_equipo as t', 't.id', '=', 'eq.id_tipo')
            ->leftJoin('cat_marca as ma', 'ma.id', '=', 'eq.id_marca')
            ->leftJoin('cat_modelo as mo', 'mo.id', '=', 'eq.id_modelo')
            ->where('d.sugiere_baja', 1)
            ->select(
                'd.id as id_dictamen',
                DB::raw("CONCAT(d.folio, '/', d.ejercicio) as no_dictamen"),
                'd.fecha_dictamen', 'd.dictamen', 'd.expediente',
                's.id as folio_solicitud', 's.solicitante',
                'a.area',
                't.TipoEquipo as tipo', 'ma.marca', 'mo.modelo',
                'eq.no_serie', 'eq.no_inventario'
            );
    }

    private function columnasFiltrables(): array
    {
        return [
            'no_dictamen' => DB::raw("CONCAT(d.folio, '/', d.ejercicio)"),
            'solicitante' => 's.solicitante',
            'area' => 'a.area',
            'tipo' => 't.TipoEquipo',
            'marca' => 'ma.marca',
            'no_inventario' => 'eq.no_inventario',
        ];
    }

    public function index(Request $request)
    {
        $porPagina = (int) $request->get('por_pagina', 10);
        $pagina = max(1, (int) $request->get('pagina', 1));

        $query = $this->baseQuery();

        foreach (['solicitante', 'area', 'tipo', 'marca', 'no_inventario'] as $param) {
            if ($request->filled($param)) {
                $columna = match ($param) {
                    'solicitante' => 's.solicitante',
                    'area' => 'a.area',
                    'tipo' => 't.TipoEquipo',
                    'marca' => 'ma.marca',
                    'no_inventario' => 'eq.no_inventario',
                };
                $query->where($columna, 'like', '%' . $request->get($param) . '%');
            }
        }

        $sortBy = $request->get('sort_by');
        $sortDir = $request->get('sort_dir', 'desc') === 'asc' ? 'asc' : 'desc';
        $mapaOrden = [
            'solicitante' => 's.solicitante', 'area' => 'a.area',
            'tipo' => 't.TipoEquipo', 'marca' => 'ma.marca',
            'no_inventario' => 'eq.no_inventario', 'fecha_dictamen' => 'd.fecha_dictamen',
        ];
        if ($sortBy && isset($mapaOrden[$sortBy])) {
            $query->orderBy($mapaOrden[$sortBy], $sortDir);
        } else {
            $query->orderBy('d.fecha_dictamen', 'desc');
        }

        $total = (clone $query)->count();
        $registros = $query->forPage($pagina, $porPagina)->get();

        return response()->json([
            'registros' => $registros, 'total' => $total, 'pagina' => $pagina,
            'por_pagina' => $porPagina, 'total_paginas' => max(1, (int) ceil($total / $porPagina)),
        ]);
    }

    // Exporta TODOS los registros filtrados (sin paginar) a un archivo abrible en Excel
    public function exportar(Request $request)
{
    $query = $this->baseQuery();

    foreach (['solicitante', 'area', 'tipo', 'marca', 'no_inventario'] as $param) {
        if ($request->filled($param)) {
            $columna = match ($param) {
                'solicitante' => 's.solicitante',
                'area' => 'a.area',
                'tipo' => 't.TipoEquipo',
                'marca' => 'ma.marca',
                'no_inventario' => 'eq.no_inventario',
            };
            $query->where($columna, 'like', '%' . $request->get($param) . '%');
        }
    }

    $registros = $query->orderBy('d.fecha_dictamen', 'desc')->get();

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    $encabezados = ['No. Dictamen', 'Fecha', 'Solicitante', 'Área', 'Tipo', 'Marca', 'Modelo', 'No. Serie', 'No. Inventario', 'Dictamen', 'Expediente'];
    $sheet->fromArray($encabezados, null, 'A1');

    $fila = 2;
    foreach ($registros as $r) {
        $sheet->fromArray([
            $r->no_dictamen, $r->fecha_dictamen, $r->solicitante, $r->area,
            $r->tipo, $r->marca, $r->modelo, $r->no_serie, $r->no_inventario,
            $r->dictamen, $r->expediente,
        ], null, "A{$fila}");
        $fila++;
    }

    foreach (range('A', 'K') as $col) {
        $sheet->getColumnDimension($col)->setAutoSize(true);
    }

    $nombreArchivo = 'equipos_baja_' . now()->format('Y-m-d') . '.xlsx';

    return response()->streamDownload(function () use ($spreadsheet) {
        $writer = new Xlsx($spreadsheet);
        $writer->save('php://output');
    }, $nombreArchivo, [
        'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]);
}
}