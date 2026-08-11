<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MantenimientoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MantenimientoController extends Controller
{
    public function __construct(private MantenimientoService $service) {}

    public function index(Request $request)
    {
        $porPagina = (int) $request->get('por_pagina', 10);
        $pagina = max(1, (int) $request->get('pagina', 1));

        $ultimo = $this->service->subconsultaUltimoMantenimiento();

        $query = DB::table('datos_equipos as d')
            ->leftJoin('cat_tipo_equipo as t', 't.id', '=', 'd.id_tipo')
            ->leftJoin('cat_marca as ma', 'ma.id', '=', 'd.id_marca')
            ->leftJoin('comp_equipos as c', 'c.IdEquipo', '=', 'd.id')
            ->leftJoinSub($ultimo, 'u', 'u.id_equipo', '=', 'd.id')
            ->where('d.status', 1)
            ->select(
                'd.id', 'd.no_inventario', 'd.no_serie',
                't.TipoEquipo as tipo', 'ma.marca',
                'c.Resguardante', 'c.Usuario',
                'u.fecha_mantenimiento', 'u.proxima_fecha', 'u.tipo as tipo_mantenimiento'
            );

        if ($request->filled('no_inventario')) {
            $query->where('d.no_inventario', 'like', '%' . $request->get('no_inventario') . '%');
        }

        if ($request->get('solo_alerta') === '1') {
            $todos = $query->get()->map(fn ($r) => $this->conSemaforo($r))
                ->filter(fn ($r) => $r->semaforo_color !== 'verde')
                ->values();

            $total = $todos->count();
            $registros = $todos->forPage($pagina, $porPagina)->values();
        } else {
            $total = (clone $query)->count();
            $registros = $query->forPage($pagina, $porPagina)->get()
                ->map(fn ($r) => $this->conSemaforo($r));
        }

        return response()->json([
            'registros' => $registros,
            'total' => $total,
            'pagina' => $pagina,
            'por_pagina' => $porPagina,
            'total_paginas' => max(1, (int) ceil($total / $porPagina)),
        ]);
    }

    public function alertas()
    {
        $ultimo = $this->service->subconsultaUltimoMantenimiento();

        $registros = DB::table('datos_equipos as d')
            ->leftJoin('cat_tipo_equipo as t', 't.id', '=', 'd.id_tipo')
            ->leftJoin('comp_equipos as c', 'c.IdEquipo', '=', 'd.id')
            ->leftJoinSub($ultimo, 'u', 'u.id_equipo', '=', 'd.id')
            ->where('d.status', 1)
            ->select(
                'd.id', 'd.no_inventario',
                't.TipoEquipo as tipo',
                'c.Resguardante', 'c.Usuario',
                'u.proxima_fecha'
            )
            ->get()
            ->map(fn ($r) => $this->conSemaforo($r))
            ->filter(fn ($r) => $r->semaforo_color !== 'verde')
            ->sortBy('semaforo_dias_restantes')
            ->values();

        return response()->json(['total' => $registros->count(), 'registros' => $registros]);
    }

    public function historial(int $idEquipo)
    {
        $registros = DB::table('mantenimientos')
            ->where('id_equipo', $idEquipo)
            ->orderBy('fecha_mantenimiento', 'desc')
            ->get();

        return response()->json($registros);
    }

    public function store(Request $request, int $idEquipo)
    {
        $data = $request->validate([
            'fecha_mantenimiento' => 'required|date',
            'proxima_fecha' => 'nullable|date|after_or_equal:fecha_mantenimiento',
            'tipo' => 'nullable|string|max:30',
            'descripcion' => 'nullable|string|max:255',
        ]);

        $data['proxima_fecha'] ??= $this->service->sugerirProximaFecha($data['fecha_mantenimiento']);

        $id = DB::table('mantenimientos')->insertGetId([
            'id_equipo' => $idEquipo,
            ...$data,
            'usr' => $request->user()->usuario,
        ]);

        $creado = DB::table('mantenimientos')->where('id', $id)->first();

        return response()->json($creado, 201);
    }

    public function destroy(int $id)
    {
        DB::table('mantenimientos')->where('id', $id)->delete();
        return response()->json(['message' => 'Registro de mantenimiento eliminado']);
    }

    private function conSemaforo(object $r): object
    {
        $s = $this->service->calcularSemaforo($r->proxima_fecha ?? null);
        $r->semaforo_color = $s['color'];
        $r->semaforo_motivo = $s['motivo'];
        $r->semaforo_dias_restantes = $s['dias_restantes'];
        return $r;
    }
}