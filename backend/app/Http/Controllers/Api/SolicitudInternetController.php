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

    public const ESTATUS_LABELS = [
        'generado_uie' => 'GENERADO POR UIE',
        'atendiendo_dt' => 'ATENDIENDO POR DIRECCIÓN GENERAL DE TECNOLOGÍAS E INNOVACIÓN DIGITAL',
        'activo' => 'SERVICIO ACTIVO',
        'baja' => 'BAJA DEL SERVICIO',
        'eliminado' => 'ELIMINADO',
    ];

    public function show(int $id)
    {
        $s = DB::table('solicitud_internet as si')
            ->join('areas as a', 'a.id', '=', 'si.id_area')
            ->join('datos_equipos as de', 'de.id', '=', 'si.id_equipo')
            ->leftJoin('cat_tipo_equipo as te', 'te.id', '=', 'de.id_tipo')
            ->leftJoin('cat_marca as ma', 'ma.id', '=', 'de.id_marca')
            ->leftJoin('cat_so as so', 'so.id', '=', 'de.id_so')
            ->join('cat_cargo as c', 'c.id', '=', 'si.id_cargo')
            ->select(
                'si.*', 'a.area', 'de.no_inventario', 'de.mac_ethernet', 'de.mac_wifi',
                // Se manda tanto 'tipo_equipo' (usado por CambiarEstatusModal) como
                // 'tipo' (usado por EditarSolicitudInternetModal) para no romper nada.
                'te.TipoEquipo as tipo_equipo',
                'te.TipoEquipo as tipo',
                'so.sistema',
                'ma.marca', 'c.cargo'
            )
            ->where('si.id', $id)
            ->first();

        if (!$s) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        return response()->json(['solicitud' => $s]);
    }

    public function update(Request $request, int $id)
    {
        $actual = DB::table('solicitud_internet')->where('id', $id)->first();

        if (!$actual) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        // Una vez que Tecnologías la tomó, ya no se edita libremente:
        // el único camino es el cambio de estatus.
        if ($actual->estatus !== 'generado_uie') {
            return response()->json([
                'message' => 'Esta solicitud ya está en atención de la Dirección General de Tecnologías e Innovación Digital y no puede editarse. Usa el cambio de estatus para darle seguimiento.',
            ], 422);
        }

        $data = $request->validate([
            'usuario_internet' => 'sometimes|string|max:150',
            'id_cargo' => 'sometimes|integer',
            'id_area' => 'sometimes|integer',
            'id_autoriza' => 'sometimes|integer',
            'correo' => 'sometimes|email|max:150',
            'tel_ext' => 'sometimes|integer',
            'tipo_conexion' => 'sometimes|in:cableada,inalambrica',
            'nivel_filtrado' => 'sometimes|in:1,2',
            'edificio' => 'sometimes|in:2,3,4,6',
            'nivel' => 'sometimes|in:PB,1,2,3',
            'puerto' => 'nullable|integer',
            'justificacion' => 'nullable|string',
            'mac_ethernet' => ['nullable', 'string', 'regex:/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/'],
            'mac_wifi' => ['nullable', 'string', 'regex:/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/'],
            'motivo_actualizacion' => 'nullable|string',
        ]);

        $macEthernet = $data['mac_ethernet'] ?? null;
        $macWifi = $data['mac_wifi'] ?? null;
        unset($data['mac_ethernet'], $data['mac_wifi']);

        DB::table('solicitud_internet')->where('id', $id)->update([
            ...$data,
            'updated_at' => now(),
        ]);

        if ($macEthernet || $macWifi) {
            $actualizarEquipo = [];
            if ($macEthernet) $actualizarEquipo['mac_ethernet'] = $macEthernet;
            if ($macWifi) $actualizarEquipo['mac_wifi'] = $macWifi;
            DB::table('datos_equipos')->where('id', $actual->id_equipo)->update($actualizarEquipo);
        }

        return response()->json(['message' => 'Solicitud actualizada']);
    }

    public function cambiarEstatus(Request $request, int $id)
    {
        $usuario = $request->user();

        $solicitud = DB::table('solicitud_internet')->where('id', $id)->first();
        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $data = $request->validate([
            'estatus' => 'required|in:generado_uie,atendiendo_dt,activo,baja',
            'folio_glpi' => 'nullable|string|max:50',
            'observacion_glpi' => 'nullable|string',
            'motivo_baja' => 'nullable|string',
        ]);

        $nuevo = $data['estatus'];
        $update = [
            'estatus' => $nuevo,
            'usuario_mov' => $usuario->usuario,
            'updated_at' => now(),
        ];

        if ($nuevo === 'atendiendo_dt') {
            $request->validate(['folio_glpi' => 'required|string|max:50'], [
                'folio_glpi.required' => 'El folio GLPI es obligatorio para pasar a este estatus.',
            ]);
            $update['folio_glpi'] = $data['folio_glpi'];
            $update['observacion_glpi'] = $data['observacion_glpi'] ?? null;
            $update['fecha_atendiendo_dt'] = now();
        }

        if ($nuevo === 'activo') {
            if ($solicitud->estatus === 'activo') {
                return response()->json(['message' => 'Esta solicitud ya se encuentra activa.'], 422);
            }

            // Evita que el mismo equipo tenga dos accesos a internet activos a la vez
            $yaActivo = DB::table('solicitud_internet')
                ->where('id_equipo', $solicitud->id_equipo)
                ->where('estatus', 'activo')
                ->where('id', '<>', $id)
                ->exists();

            if ($yaActivo) {
                return response()->json([
                    'message' => 'Este equipo ya cuenta con un acceso a internet activo. Da de baja el acceso anterior antes de activar uno nuevo.',
                ], 422);
            }

            $update['fecha_activo'] = now();
        }

        if ($nuevo === 'baja') {
            $request->validate(['motivo_baja' => 'required|string|min:5'], [
                'motivo_baja.required' => 'El motivo de baja es obligatorio.',
                'motivo_baja.min' => 'Describe el motivo de baja con más detalle.',
            ]);
            $update['motivo_baja'] = $data['motivo_baja'];
            $update['fecha_baja'] = now();
        }

        if ($nuevo === 'generado_uie' && !$solicitud->fecha_generado_uie) {
            $update['fecha_generado_uie'] = now();
        }

        DB::table('solicitud_internet')->where('id', $id)->update($update);

        return response()->json(['message' => 'Estatus actualizado correctamente']);
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