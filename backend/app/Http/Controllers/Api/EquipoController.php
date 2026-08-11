<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EquipoController extends Controller
{
    // ---------------------------------------------------------
    // Ya existentes — usados por Solicitud de Internet, sin cambios
    // ---------------------------------------------------------

    public function buscar(string $noInventario)
    {
        $equipo = DB::table('v_equipos')
            ->where('no_inventario', $noInventario)
            ->first();

        if (!$equipo) {
            return response()->json(['message' => 'Equipo no encontrado'], 404);
        }

        $macs = DB::table('datos_equipos')
            ->where('id', $equipo->id)
            ->select('mac_ethernet', 'mac_wifi')
            ->first();

        $ultimaSolicitud = DB::table('solicitud_internet')
            ->where('id_equipo', $equipo->id)
            ->orderBy('id', 'desc')
            ->select('usuario_internet', 'id_cargo', 'id_area', 'correo', 'tel_ext', 'id_autoriza')
            ->first();

        return response()->json([
            ...(array) $equipo,
            ...(array) $macs,
            'ultima_solicitud' => $ultimaSolicitud,
        ]);
    }

    public function store(Request $request)
    {
        $usuario = $request->user();

        $data = $request->validate([
            'id_tipo' => 'required|integer',
            'id_marca' => 'required|integer',
            'id_modelo' => 'required|integer',
            'id_so' => 'required|integer',
            'no_serie' => 'nullable|string|max:50',
            'no_inventario' => 'required|string|max:50',
            'observacion' => 'nullable|string|max:100',
        ]);

        if (!empty($data['no_serie']) && strtoupper($data['no_serie']) !== 'S/N') {
            $existe = DB::table('datos_equipos')
                ->where('no_serie', $data['no_serie'])
                ->exists();

            if ($existe) {
                return response()->json([
                    'message' => 'Ya existe un equipo registrado con ese número de serie.',
                    'errors' => ['no_serie' => ['Número de serie duplicado']],
                ], 422);
            }
        }

        $id = DB::table('datos_equipos')->insertGetId([
            ...$data,
            'status' => 1,
            'usr' => $usuario->usuario,
            'fechausr' => now(),
        ]);

        $creado = DB::table('datos_equipos')
            ->join('cat_tipo_equipo', 'cat_tipo_equipo.id', '=', 'datos_equipos.id_tipo')
            ->join('cat_so', 'cat_so.id', '=', 'datos_equipos.id_so')
            ->where('datos_equipos.id', $id)
            ->select(
                'datos_equipos.id', 'datos_equipos.no_inventario',
                'cat_tipo_equipo.TipoEquipo as tipo', 'cat_so.sistema',
                'datos_equipos.mac_ethernet', 'datos_equipos.mac_wifi'
            )
            ->first();

        return response()->json($creado, 201);
    }

    public function verificarSerie(string $noSerie)
    {
        if (strtoupper($noSerie) === 'S/N') {
            return response()->json(['disponible' => true]);
        }

        $existe = DB::table('datos_equipos')->where('no_serie', $noSerie)->exists();
        return response()->json(['disponible' => !$existe]);
    }

    // ---------------------------------------------------------
    // Catálogo de equipos: listado, filtros, orden, paginación
    // (SIN lógica de mantenimiento — no está construida aún)
    // ---------------------------------------------------------

    private function baseQuery()
    {
        return DB::table('datos_equipos as d')
            ->leftJoin('cat_tipo_equipo as t', 't.id', '=', 'd.id_tipo')
            ->leftJoin('cat_marca as ma', 'ma.id', '=', 'd.id_marca')
            ->leftJoin('cat_modelo as mo', 'mo.id', '=', 'd.id_modelo')
            ->leftJoin('cat_so as s', 's.id', '=', 'd.id_so')
            ->leftJoin('comp_equipos as c', 'c.IdEquipo', '=', 'd.id')
            ->where('d.status', 1)
            ->select(
                'd.id', 'd.id_tipo', 'd.id_marca', 'd.id_modelo', 'd.id_so',
                'd.no_serie', 'd.no_inventario', 'd.mac_ethernet', 'd.mac_wifi', 'd.observacion',
                't.TipoEquipo as tipo', 'ma.marca', 'mo.modelo', 's.sistema',
                'c.Mac as mac'
            );
    }

    private function columnasFiltrables(): array
    {
        return [
            'tipo' => 't.TipoEquipo',
            'marca' => 'ma.marca',
            'modelo' => 'mo.modelo',
            'no_serie' => 'd.no_serie',
            'no_inventario' => 'd.no_inventario',
            'mac' => 'c.Mac',
        ];
    }

    public function index(Request $request)
    {
        $porPagina = (int) $request->get('por_pagina', 10);
        $pagina = max(1, (int) $request->get('pagina', 1));
        $filtros = $this->columnasFiltrables();

        $query = $this->baseQuery();

        foreach ($filtros as $param => $columna) {
            if ($request->filled($param)) {
                $query->where($columna, 'like', '%' . $request->get($param) . '%');
            }
        }

        $sortBy = $request->get('sort_by');
        $sortDir = $request->get('sort_dir', 'asc') === 'desc' ? 'desc' : 'asc';
        if ($sortBy && isset($filtros[$sortBy])) {
            $query->orderBy($filtros[$sortBy], $sortDir);
        } else {
            $query->orderBy('d.id', 'desc');
        }

        $total = (clone $query)->count();
        $registros = $query->forPage($pagina, $porPagina)->get();

        return response()->json([
            'registros' => $registros,
            'total' => $total,
            'pagina' => $pagina,
            'por_pagina' => $porPagina,
            'total_paginas' => max(1, (int) ceil($total / $porPagina)),
        ]);
    }

    public function show(int $id)
    {
        $equipo = $this->baseQuery()->where('d.id', $id)->first();

        if (!$equipo) {
            return response()->json(['message' => 'Equipo no encontrado'], 404);
        }

        return response()->json($equipo);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'id_tipo' => 'required|integer|exists:cat_tipo_equipo,id',
            'id_marca' => 'required|integer|exists:cat_marca,id',
            'id_modelo' => 'nullable|integer|exists:cat_modelo,id',
            'id_so' => 'nullable|integer|exists:cat_so,id',
            'no_serie' => 'nullable|string|max:50',
            'no_inventario' => 'nullable|string|max:50',
            'mac_ethernet' => 'nullable|string|max:50',
            'mac_wifi' => 'nullable|string|max:50',
            'observacion' => 'nullable|string|max:100',
        ]);

        DB::table('datos_equipos')->where('id', $id)->update([
            ...$data,
            'usr' => $request->user()->usuario,
        ]);

        return response()->json(['message' => 'Equipo actualizado correctamente']);
    }

    public function destroy(Request $request, int $id)
    {
        DB::table('datos_equipos')->where('id', $id)->update([
            'status' => 0,
            'usr' => $request->user()->usuario,
        ]);

        return response()->json(['message' => 'Equipo dado de baja correctamente']);
    }

    // ---------------------------------------------------------
    // Software instalado
    // ---------------------------------------------------------

    public function software(int $id)
    {
        $registros = DB::table('software_equipo as se')
            ->join('cat_software as cs', 'cs.id', '=', 'se.id_software')
            ->where('se.id_equipo', $id)
            ->select('se.id', 'cs.software', 'se.licencia', 'se.fecha')
            ->orderBy('se.id', 'desc')
            ->get();

        $catalogo = DB::table('cat_software')->where('status', 1)->orderBy('software')->get();

        return response()->json(['registros' => $registros, 'catalogo' => $catalogo]);
    }

    public function agregarSoftware(Request $request, int $id)
    {
        $data = $request->validate([
            'id_software' => 'required|integer|exists:cat_software,id',
            'licencia' => 'nullable|string|max:50',
            'fecha' => 'nullable|date',
        ]);

        DB::table('software_equipo')->insert([
            'id_equipo' => $id,
            'id_software' => $data['id_software'],
            'licencia' => $data['licencia'] ?? null,
            'fecha' => $data['fecha'] ?? now()->toDateString(),
            'usr' => $request->user()->usuario,
            'fechausr' => now(),
        ]);

        return response()->json(['message' => 'Software agregado correctamente'], 201);
    }

    public function eliminarSoftware(int $idRegistro)
    {
        DB::table('software_equipo')->where('id', $idRegistro)->delete();
        return response()->json(['message' => 'Software eliminado correctamente']);
    }

    // ---------------------------------------------------------
    // Extras: resguardo / red (comp_equipos)
    // ---------------------------------------------------------

    public function extras(int $id)
    {
        $registro = DB::table('comp_equipos as c')
            ->leftJoin('areas as a', 'a.id', '=', 'c.IdArea')
            ->where('c.IdEquipo', $id)
            ->select('c.*', 'a.area')
            ->first();

        return response()->json($registro);
    }

    public function guardarExtras(Request $request, int $id)
    {
        $data = $request->validate([
        'IdArea' => 'nullable|integer|exists:areas,id',
        'Resguardante' => 'nullable|string|max:150',
        'Usuario' => 'nullable|string|max:150',
        'Edificio' => 'nullable|integer',
        'ENivel' => 'nullable|string|max:2',
        'Puerto' => 'nullable|string|max:10',
        'Switch' => 'nullable|boolean',
        'Mac' => 'nullable|string|max:25',
        'Conexion' => 'nullable|string|max:25',
        'Nivel' => 'nullable|string|max:2',
        ]);

        $existe = DB::table('comp_equipos')->where('IdEquipo', $id)->first();

        if ($existe) {
            DB::table('comp_equipos')->where('IdEquipo', $id)->update([
                ...$data,
                'usr' => $request->user()->usuario,
            ]);
        } else {
            DB::table('comp_equipos')->insert([
                'IdEquipo' => $id,
                ...$data,
                'usr' => $request->user()->usuario,
            ]);
        }

        return response()->json(['message' => 'Datos de resguardo/red guardados correctamente']);
    }

    // ---------------------------------------------------------
    // Dictámenes del equipo (solo consulta histórica, sin alertas)
    // ---------------------------------------------------------

    public function dictamenes(int $id)
    {
        $registros = DB::table('dictamen')
            ->where('id_equipo', $id)
            ->orderBy('fecha_dictamen', 'desc')
            ->get();

        return response()->json($registros);
    }
}