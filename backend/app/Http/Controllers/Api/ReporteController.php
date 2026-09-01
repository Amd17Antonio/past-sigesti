<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReporteService;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    public function __construct(private ReporteService $service) {}

    public function poa()
    {
        return response()->json($this->service->listarPoa());
    }

    public function actividades(Request $request)
    {
        // Limpieza y tipado estricto de parámetros de entrada para evitar consultas ineficientes
        $idPoa = $request->filled('id_poa') ? (int) $request->get('id_poa') : null;
        $del = $request->filled('del') ? $request->get('del') : null;
        $al = $request->filled('al') ? $request->get('al') : null;
        
        $pagina = max(1, (int) $request->get('pagina', 1));
        $porPagina = (int) $request->get('por_pagina', 20);

        $resultado = $this->service->actividades($idPoa, $del, $al, $pagina, $porPagina);

        return response()->json($resultado);
    }
}