<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
        // Alineado con el criterio usado en SolicitudController::historial():
        // solo cuenta como evaluada si hay al menos una respuesta real (tipo_respuesta no nulo).
        $existe = DB::table('encuesta')
            ->where('id_solicitud', $idSolicitud)
            ->whereNotNull('tipo_respuesta')
            ->exists();

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

        $ahora = now();
        $registrosAInsertar = [];

        // 1. Mapeamos todas las respuestas de las preguntas en un solo lote (Batch Insert)
        foreach ($data['respuestas'] as $r) {
            $registrosAInsertar[] = [
                'id_solicitud' => $data['id_solicitud'],
                'id_pregunta' => $r['id_pregunta'],
                'tipo_respuesta' => $r['tipo_respuesta'],
                'observaciones' => null,
                'usuario' => $usuario->usuario,
                'fecha' => $ahora,
            ];
        }

        // 2. Si hay observaciones, las agregamos al mismo lote masivo o se insertan de manera directa
        if (!empty($data['observaciones'])) {
            $registrosAInsertar[] = [
                'id_solicitud' => $data['id_solicitud'],
                'id_pregunta' => null,
                'tipo_respuesta' => null,
                'observaciones' => $data['observaciones'],
                'usuario' => $usuario->usuario,
                'fecha' => $ahora,
            ];
        }

        // Se realiza la inserción en una sola consulta masiva a la base de datos
        if (!empty($registrosAInsertar)) {
            DB::table('encuesta')->insert($registrosAInsertar);
        }

        return response()->json(['message' => 'Evaluación registrada, ¡gracias!']);
    }

    public function resumen(Request $request)
    {
        $del = $request->get('del');
        $al = $request->get('al');

        $base = DB::table('encuesta as e')
            ->leftJoin('solicitud as s', 's.id', '=', 'e.id_solicitud');

        if ($del) {
            $base->whereDate('e.fecha', '>=', $del);
        }
        if ($al) {
            $base->whereDate('e.fecha', '<=', $al);
        }

        // Obtenemos los conteos de B, R y M agrupados de forma directa en una sola consulta
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