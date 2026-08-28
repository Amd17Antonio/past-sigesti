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
    // TICKETS (basado en la tabla `solicitud`)
    // ------------------------------------------------------------
    public function tickets(Request $request)
    {
        [$desde, $hasta] = $this->rango($request);
        $anio = (int) $request->get('anio', now()->year);

        $creados = DB::table('solicitud')
            ->whereBetween('fecha_solicitud', [$desde, $hasta])
            ->count();

        $asignados = DB::table('solicitud')
            ->whereNotNull('fecha_asignacion')
            ->whereBetween('fecha_asignacion', [$desde, $hasta])
            ->count();

        $concluidos = DB::table('solicitud')
            ->whereNotNull('fecha_cierre')
            ->whereBetween('fecha_cierre', [$desde, $hasta])
            ->count();

        $asignadosSinAtender = DB::table('solicitud')
            ->where('id_situacion', 2)
            ->whereNull('fecha_cierre')
            ->whereNotNull('fecha_asignacion')
            ->whereBetween('fecha_asignacion', [$desde, $hasta])
            ->count();

        // Serie mensual: tickets resueltos en el ejercicio (por mes)
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

        // Técnico con más tickets concluidos en el rango
        $topTecnico = DB::table('solicitud as s')
            ->join('soporte', 'soporte.id', '=', 's.id_soporte')
            ->whereNotNull('s.fecha_cierre')
            ->whereBetween('s.fecha_cierre', [$desde, $hasta])
            ->select('soporte.nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('soporte.id', 'soporte.nombre')
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'creados' => $creados,
            'asignados' => $asignados,
            'concluidos' => $concluidos,
            'asignados_sin_atender' => $asignadosSinAtender,
            'serie_mensual' => $serie,
            'anio' => $anio,
            'top_tecnico' => $topTecnico,
        ]);
    }

    // ------------------------------------------------------------
    // DICTÁMENES
    // ------------------------------------------------------------
    public function dictamenes(Request $request)
    {
        [$desde, $hasta] = $this->rango($request);
        $anio = (int) $request->get('anio', now()->year);

        $generados = DB::table('dictamen')
            ->whereBetween('fecha_dictamen', [$desde, $hasta])
            ->count();

        $sugeridosBaja = DB::table('dictamen')
            ->where('sugiere_baja', 1)
            ->whereBetween('fecha_dictamen', [$desde, $hasta])
            ->count();

        $equiposDictaminados = DB::table('dictamen as d')
            ->join('equipos_solicitud as es', 'es.id_solicitud', '=', 'd.id_solicitud')
            ->whereBetween('d.fecha_dictamen', [$desde, $hasta])
            ->distinct()
            ->count('es.id_equipo');

        // Solicitudes cerradas y autorizadas para dictamen que aún no tienen uno (backlog)
        $pendientesAutorizar = DB::table('solicitud as s')
            ->leftJoin('dictamen as d', 'd.id_solicitud', '=', 's.id')
            ->whereNull('d.id')
            ->whereNotNull('s.fecha_cierre')
            ->whereNotNull('s.fecha_autoriza_dictamen')
            ->count();

        $filas = DB::table('dictamen')
            ->selectRaw('MONTH(fecha_dictamen) as mes, COUNT(*) as total')
            ->whereYear('fecha_dictamen', $anio)
            ->groupBy('mes')
            ->pluck('total', 'mes');

        $serie = [];
        for ($m = 1; $m <= 12; $m++) {
            $serie[] = (int) ($filas[$m] ?? 0);
        }

        $topTecnico = DB::table('dictamen as d')
            ->join('solicitud as s', 's.id', '=', 'd.id_solicitud')
            ->join('soporte', 'soporte.id', '=', 's.id_soporte')
            ->whereBetween('d.fecha_dictamen', [$desde, $hasta])
            ->select('soporte.nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('soporte.id', 'soporte.nombre')
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'generados' => $generados,
            'equipos_dictaminados' => $equiposDictaminados,
            'sugeridos_baja' => $sugeridosBaja,
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