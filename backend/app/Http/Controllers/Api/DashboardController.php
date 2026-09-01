<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Resuelve el rango de fechas: si el usuario manda desde/hasta se usa eso,
     * si no, se toma el mes actual completo.
     */
    private function rango(Request $request): array
    {
        $desde = $request->filled('desde')
            ? Carbon::parse($request->get('desde'))->startOfDay()
            : now()->startOfMonth();

        $hasta = $request->filled('hasta')
            ? Carbon::parse($request->get('hasta'))->endOfDay()
            : now()->endOfMonth();

        return [$desde, $hasta];
    }

    // ------------------------------------------------------------
    // TICKETS (Optimizado con Agregación Condicional Única)
    // ------------------------------------------------------------
    public function tickets(Request $request)
    {
        [$desde, $hasta] = $this->rango($request);
        $anio = (int) $request->get('anio', now()->year);

        // 1. Unificamos todos los KPIs independientes de la tabla solicitud en una sola consulta
        $kpis = DB::table('solicitud')
            ->selectRaw("
                SUM(CASE WHEN fecha_solicitud BETWEEN ? AND ? THEN 1 ELSE 0 END) as creados,
                SUM(CASE WHEN fecha_asignacion IS NOT NULL AND fecha_asignacion BETWEEN ? AND ? THEN 1 ELSE 0 END) as asignados,
                SUM(CASE WHEN fecha_cierre IS NOT NULL AND fecha_cierre BETWEEN ? AND ? THEN 1 ELSE 0 END) as concluidos,
                SUM(CASE WHEN id_situacion = 2 AND fecha_cierre IS NULL AND fecha_asignacion IS NOT NULL AND fecha_asignacion BETWEEN ? AND ? THEN 1 ELSE 0 END) as asignados_sin_atender
            ", [$desde, $hasta, $desde, $hasta, $desde, $hasta, $desde, $hasta])
            ->first();

        // 2. Serie mensual optimizada
        $filas = DB::table('solicitud')
            ->selectRaw('MONTH(fecha_cierre) as mes, COUNT(*) as total')
            ->whereNotNull('fecha_cierre')
            ->whereYear('fecha_cierre', $anio)
            ->groupBy('mes')
            ->pluck('total', 'mes');

        $serie = [];
        for ($m = 1; $m <= 12; $m++) {
            $serie[] = (int) ($filas[$m] ?? 0);
        }

        // 3. Técnico con más tickets concluidos en el rango
        $topTecnico = DB::table('solicitud as s')
            ->join('soporte', 'soporte.id', '=', 's.id_soporte')
            ->whereNotNull('s.fecha_cierre')
            ->whereBetween('s.fecha_cierre', [$desde, $hasta])
            ->select('soporte.nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('soporte.id', 'soporte.nombre')
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'creados' => (int) ($kpis->creados ?? 0),
            'asignados' => (int) ($kpis->asignados ?? 0),
            'concluidos' => (int) ($kpis->concluidos ?? 0),
            'asignados_sin_atender' => (int) ($kpis->asignados_sin_atender ?? 0),
            'serie_mensual' => $serie,
            'anio' => $anio,
            'top_tecnico' => $topTecnico,
        ]);
    }

    // ------------------------------------------------------------
    // DICTÁMENES (Optimizado con Agregación Condicional Única)
    // ------------------------------------------------------------
    public function dictamenes(Request $request)
    {
        [$desde, $hasta] = $this->rango($request);
        $anio = (int) $request->get('anio', now()->year);

        // 1. Unificamos KPIs principales de dictámenes en una sola consulta
        $kpis = DB::table('dictamen')
            ->selectRaw("
                SUM(CASE WHEN fecha_dictamen BETWEEN ? AND ? THEN 1 ELSE 0 END) as generados,
                SUM(CASE WHEN sugiere_baja = 1 AND fecha_dictamen BETWEEN ? AND ? THEN 1 ELSE 0 END) as sugeridos_baja
            ", [$desde, $hasta, $desde, $hasta])
            ->first();

        // 2. Equipos dictaminados de forma eficiente con distinct
        $equiposDictaminados = DB::table('dictamen as d')
            ->join('equipos_solicitud as es', 'es.id_solicitud', '=', 'd.id_solicitud')
            ->whereBetween('d.fecha_dictamen', [$desde, $hasta])
            ->distinct()
            ->count('es.id_equipo');

        // 3. Backlog: Solicitudes cerradas y autorizadas para dictamen que aún no tienen uno
        $pendientesAutorizar = DB::table('solicitud as s')
            ->leftJoin('dictamen as d', 'd.id_solicitud', '=', 's.id')
            ->whereNull('d.id')
            ->whereNotNull('s.fecha_cierre')
            ->whereNotNull('s.fecha_autoriza_dictamen')
            ->count();

        // 4. Serie mensual
        $filas = DB::table('dictamen')
            ->selectRaw('MONTH(fecha_dictamen) as mes, COUNT(*) as total')
            ->whereYear('fecha_dictamen', $anio)
            ->groupBy('mes')
            ->pluck('total', 'mes');

        $serie = [];
        for ($m = 1; $m <= 12; $m++) {
            $serie[] = (int) ($filas[$m] ?? 0);
        }

        // 5. Técnico top en dictámenes
        $topTecnico = DB::table('dictamen as d')
            ->join('solicitud as s', 's.id', '=', 'd.id_solicitud')
            ->join('soporte', 'soporte.id', '=', 's.id_soporte')
            ->whereBetween('d.fecha_dictamen', [$desde, $hasta])
            ->select('soporte.nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('soporte.id', 'soporte.nombre')
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'generados' => (int) ($kpis->generados ?? 0),
            'equipos_dictaminados' => $equiposDictaminados,
            'sugeridos_baja' => (int) ($kpis->sugeridos_baja ?? 0),
            'pendientes_autorizar' => $pendientesAutorizar,
            'serie_mensual' => $serie,
            'anio' => $anio,
            'top_tecnico' => $topTecnico,
        ]);
    }

    public function actividadesMesAnterior(Request $request)
    {
        $mesAnterior = now()->subMonthNoOverflow();
        $desde = $mesAnterior->copy()->startOfMonth();
        $hasta = $mesAnterior->copy()->endOfMonth();

        $registros = DB::table('cat_poa as p')
            ->leftJoin('solicitud as s', function ($join) use ($desde, $hasta) {
                $join->on('s.id_poa', '=', 'p.id')
                     ->whereNotNull('s.fecha_cierre')
                     ->whereBetween('s.fecha_cierre', [$desde, $hasta]);
            })
            ->select('p.poa', DB::raw('COUNT(s.id) as total'))
            ->groupBy('p.id', 'p.poa')
            ->orderBy('p.poa')
            ->get();

        return response()->json([
            'mes' => ucfirst($mesAnterior->locale('es')->translatedFormat('F Y')),
            'registros' => $registros,
        ]);
    }
}