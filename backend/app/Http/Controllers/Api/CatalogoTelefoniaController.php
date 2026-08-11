<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CatalogoTelefoniaController extends Controller
{
    public function index()
    {
        $registros = DB::table('usuarios_telefonia as ut')
            ->leftJoin('areas as a', 'a.id', '=', 'ut.area_id')
            ->leftJoin('cat_categoria_telefonia as c', 'c.id', '=', 'ut.categoria_id')
            ->select(
                'ut.id', 'ut.nombre', 'ut.apellido_paterno', 'ut.apellido_materno',
                'ut.extension', 'ut.puesto', 'ut.correo_institucional', 'ut.mac',
                'ut.modelo', 'ut.numero_serie', 'ut.edificio', 'ut.nivel', 'ut.status',
                'a.area', 'c.categoria'
            )
            ->orderBy('ut.id', 'desc')
            ->get();

        $conteos = DB::table('solicitudes_telefonia')
            ->select('usuario_id', DB::raw('COUNT(*) as total'))
            ->groupBy('usuario_id')
            ->pluck('total', 'usuario_id');

        $jefeDe = DB::table('jefe_secretaria as js')
            ->join('usuarios_telefonia as sec', 'sec.id', '=', 'js.secretaria_id')
            ->select('js.jefe_id', 'sec.nombre as secretaria_nombre')
            ->get()
            ->groupBy('jefe_id');

        $secretariaDe = DB::table('jefe_secretaria as js')
            ->join('usuarios_telefonia as jefe', 'jefe.id', '=', 'js.jefe_id')
            ->select('js.secretaria_id', 'jefe.nombre as jefe_nombre')
            ->get()
            ->groupBy('secretaria_id');

        $registros = $registros->map(function ($r) use ($conteos, $jefeDe, $secretariaDe) {
            $r->total_solicitudes = $conteos[$r->id] ?? 0;
            $r->vinculado_como_jefe_de = isset($jefeDe[$r->id])
                ? $jefeDe[$r->id]->pluck('secretaria_nombre')->implode(', ')
                : null;
            $r->vinculado_como_secretaria_de = isset($secretariaDe[$r->id])
                ? $secretariaDe[$r->id]->pluck('jefe_nombre')->implode(', ')
                : null;
            return $r;
        });

        return response()->json($registros);
    }

    public function update(Request $request, int $id)
{
    // Convierte cadenas vacías a null para que "nullable" funcione como se espera
    $request->merge(collect($request->only([
        'apellido_paterno', 'apellido_materno', 'puesto', 'correo_institucional',
        'modelo', 'numero_serie', 'mac', 'edificio', 'nivel',
    ]))->map(fn ($v) => $v === '' ? null : $v)->toArray());

    $data = $request->validate([
        'nombre' => 'sometimes|string|max:100',
        'apellido_paterno' => 'nullable|string|max:100',
        'apellido_materno' => 'nullable|string|max:100',
        'puesto' => 'nullable|string|max:200',
        'correo_institucional' => 'nullable|email|max:150',
        'extension' => 'sometimes|string|max:10',
        'modelo' => 'nullable|string|max:100',
        'numero_serie' => 'nullable|string|max:100',
        'mac' => ['nullable', 'string', 'regex:/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/'],
        'edificio' => 'nullable|string|max:20',
        'nivel' => 'nullable|string|max:20',
    ], [
        'mac.regex' => 'La MAC no tiene un formato válido (XX:XX:XX:XX:XX:XX).',
    ]);

    DB::table('usuarios_telefonia')->where('id', $id)->update([
        ...$data,
        'updated_at' => now(),
    ]);

    return response()->json(['message' => 'Línea telefónica actualizada']);
}

    public function destroy(int $id)
    {
        DB::table('usuarios_telefonia')->where('id', $id)->update([
            'status' => 'Baja',
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Línea telefónica dada de baja']);
    }
}