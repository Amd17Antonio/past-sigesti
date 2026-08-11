<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EncuestaController extends Controller
{
    public function preguntas()
    {
        return response()->json(
            DB::table('cat_preguntas')->where('estatus', 1)->get()
        );
    }

    public function yaEvaluada(int $idSolicitud)
    {
        $existe = DB::table('encuesta')->where('id_solicitud', $idSolicitud)->exists();
        return response()->json(['evaluada' => $existe]);
    }

    public function store(Request $request)
{
    $usuario = $request->user();

    $data = $request->validate([
        'id_solicitud' => 'required|integer',
        'respuestas' => 'required|array|min:1',
        'respuestas.*.id_pregunta' => 'required|integer',
        'respuestas.*.tipo_respuesta' => 'required|in:B,R,M',
        'observaciones' => 'nullable|string|max:1000',
    ]);

    foreach ($data['respuestas'] as $r) {
        DB::table('encuesta')->insert([
            'id_solicitud' => $data['id_solicitud'],
            'id_pregunta' => $r['id_pregunta'],
            'tipo_respuesta' => $r['tipo_respuesta'],
            'usuario' => $usuario->usuario,
            'fecha' => now(),
        ]);
    }

    if (!empty($data['observaciones'])) {
        DB::table('encuesta')->insert([
            'id_solicitud' => $data['id_solicitud'],
            'id_pregunta' => null,
            'tipo_respuesta' => null,
            'observaciones' => $data['observaciones'],
            'usuario' => $usuario->usuario,
            'fecha' => now(),
        ]);
    }

    return response()->json(['message' => 'Evaluación registrada, ¡gracias!']);
}

public function resumen(Request $request)
{
    $del = $request->get('del');
    $al = $request->get('al');

    $base = DB::table('encuesta as e')
        ->leftJoin('solicitud as s', 's.id', '=', 'e.id_solicitud');

    if ($del) $base->whereDate('e.fecha', '>=', $del);
    if ($al) $base->whereDate('e.fecha', '<=', $al);

    $conteos = (clone $base)
        ->whereNotNull('e.tipo_respuesta')
        ->select('e.tipo_respuesta', DB::raw('count(*) as total'))
        ->groupBy('e.tipo_respuesta')
        ->pluck('total', 'tipo_respuesta');

    $observaciones = (clone $base)
        ->whereNotNull('e.observaciones')
        ->where('e.observaciones', '!=', '')
        ->select('e.id_solicitud', 's.solicitante', 'e.observaciones', 'e.fecha')
        ->orderByDesc('e.fecha')
        ->limit(200)
        ->get();

    return response()->json([
        'buenas' => (int) ($conteos['B'] ?? 0),
        'regulares' => (int) ($conteos['R'] ?? 0),
        'malas' => (int) ($conteos['M'] ?? 0),
        'observaciones' => $observaciones,
    ]);
}
}