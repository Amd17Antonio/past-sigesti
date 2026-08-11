<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;

class SolicitudInternetController extends Controller
{
    public function index(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $query = DB::table('solicitud_internet as si')
            ->join('areas as a', 'a.id', '=', 'si.id_area')
            ->join('datos_equipos as de', 'de.id', '=', 'si.id_equipo')
            ->select(
                'si.id', 'si.tipo_solicitud', 'si.usuario_internet', 'a.area',
                'de.no_inventario', 'si.tipo_conexion', 'si.tel_ext',
                'si.correo', 'si.estatus'
            )
            ->orderBy('si.id', 'desc');

        if ($rol !== 'Administrador') {
            $query->where('si.id_usuario_crea', $usuario->id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
{
    $usuario = $request->user();

    $data = $request->validate([
        'id_equipo' => 'required|integer',
        'usuario_internet' => 'required|string|max:150',
        'id_cargo' => 'required|integer',
        'id_area' => 'required|integer',
        'id_autoriza' => 'required|integer',
        'correo' => 'required|email|max:150',
        'tel_ext' => 'required|integer',
        'tipo_conexion' => 'required|in:cableada,inalambrica',
        'nivel_filtrado' => 'required|in:1,2',
        'tipo_solicitud' => 'required|in:nueva,cambio',
        'edificio' => 'required|in:2,3,4,6',
        'nivel' => 'required|in:PB,1,2,3',
        'puerto' => 'nullable|integer',
        'justificacion' => 'nullable|string',
        'mac_ethernet' => ['nullable', 'string', 'regex:/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/'],
        'mac_wifi' => ['nullable', 'string', 'regex:/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/'],
    ]);

    $macEthernet = $data['mac_ethernet'] ?? null;
    $macWifi = $data['mac_wifi'] ?? null;
    unset($data['mac_ethernet'], $data['mac_wifi']);

    // Antes se forzaba id_enlace = 1, pero ese registro puede no existir
    // en cat_enlace_informatico y truena la llave foránea. Tomamos el
    // primer enlace informático disponible en el catálogo.
    $idEnlace = DB::table('cat_enlace_informatico')->orderBy('id')->value('id');

    if (!$idEnlace) {
        return response()->json([
            'message' => 'No hay ningún Enlace Informático registrado en el catálogo. Agrega uno antes de crear una solicitud.',
        ], 422);
    }

    $id = DB::table('solicitud_internet')->insertGetId([
        ...$data,
        'id_enlace' => $idEnlace,
        'estatus' => 'generado_uie',
        'fecha_generado_uie' => now(),
        'usuario_mov' => $usuario->usuario,
        'id_usuario_crea' => $usuario->id,
        'created_at' => now(),
    ]);

    if ($macEthernet || $macWifi) {
        $actualizarEquipo = [];
        if ($macEthernet) $actualizarEquipo['mac_ethernet'] = $macEthernet;
        if ($macWifi) $actualizarEquipo['mac_wifi'] = $macWifi;
        DB::table('datos_equipos')->where('id', $data['id_equipo'])->update($actualizarEquipo);
    }

    return response()->json(['id' => $id, 'message' => 'Solicitud de internet creada'], 201);
}

    public function update(Request $request, int $id)
{
    $data = $request->validate([
        'usuario_internet' => 'sometimes|string|max:150',
        'correo' => 'sometimes|email|max:150',
        'tel_ext' => 'sometimes|integer',
        'tipo_conexion' => 'sometimes|in:cableada,inalambrica',
        'nivel_filtrado' => 'sometimes|in:1,2',
        'edificio' => 'sometimes|in:2,3,4,6',
        'nivel' => 'sometimes|in:PB,1,2,3',
        'puerto' => 'nullable|integer',
        'justificacion' => 'nullable|string',
    ]);

    DB::table('solicitud_internet')->where('id', $id)->update([
        ...$data,
        'updated_at' => now(),
    ]);

    return response()->json(['message' => 'Solicitud actualizada']);
}

    public function destroy(int $id)
    {
        DB::table('solicitud_internet')->where('id', $id)->update([
            'estatus' => 'eliminado',
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Solicitud eliminada']);
    }

    public function pdf(int $id)
{
    $s = DB::table('solicitud_internet as si')
        ->join('areas as a', 'a.id', '=', 'si.id_area')
        ->join('datos_equipos as de', 'de.id', '=', 'si.id_equipo')
        ->leftJoin('cat_tipo_equipo as te', 'te.id', '=', 'de.id_tipo')
        ->join('cat_cargo as c', 'c.id', '=', 'si.id_cargo')
        ->leftJoin('cat_autoriza_internet as auth', 'auth.id', '=', 'si.id_autoriza')
        ->leftJoin('cat_enlace_informatico as enl', 'enl.id', '=', 'si.id_enlace')
        ->select(
            'si.*', 'a.area', 'de.no_inventario', 'de.mac_ethernet', 'de.mac_wifi',
            'te.TipoEquipo as tipo_equipo',
            'c.cargo',
            'auth.nombre as autoriza_nombre', 'auth.cargo as autoriza_cargo', 'auth.correo as autoriza_correo',
            'enl.enlace as enlace_nombre'
        )
        ->where('si.id', $id)
        ->firstOrFail();

    $pdf = Pdf::loadView('pdf.solicitud_internet', ['s' => $s]);
    return $pdf->stream("formato288_{$id}.pdf");
}

    public function pdfUrl($id)
    {
        $existe = DB::table('solicitud_internet')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $url = URL::temporarySignedRoute(
            'solicitud-internet.pdf.firmado',
            now()->addMinutes(5),
            ['id' => $id]
        );

        return response()->json(['url' => $url]);
    }

    public function imprimirFirmado($id)
    {
        return $this->pdf($id);
    }
}