<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EquipoMantenimientoCgd;
use App\Models\Dictamen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Barryvdh\DomPDF\Facade\Pdf;

class EquipoMantenimientoCgdController extends Controller
{
    /** Datos base del equipo/área + checklist existente (si lo hay) + bandera de baja. */
    public function show($idEquipoSolicitud)
    {
        $base = DB::table('equipos_solicitud as es')
            ->join('solicitud as s', 's.id', '=', 'es.id_solicitud')
            ->join('datos_equipos as de', 'de.id', '=', 'es.id_equipo')
            ->join('areas as a', 'a.id', '=', 's.id_area')
            ->leftJoin('cat_tipo_equipo as te', 'te.id', '=', 'de.id_tipo')
            ->leftJoin('cat_marca as ma', 'ma.id', '=', 'de.id_marca')
            ->leftJoin('cat_modelo as mo', 'mo.id', '=', 'de.id_modelo')
            ->where('es.id', $idEquipoSolicitud)
            ->select(
                'es.id as id_equipo_solicitud',
                'es.id_equipo',
                's.id_area',
                'a.area',
                'de.no_inventario',
                'de.no_serie',
                'te.TipoEquipo as tipo_equipo',
                'ma.marca',
                'mo.modelo'
            )
            ->first();

        if (!$base) {
            return response()->json(['message' => 'Equipo de solicitud no encontrado'], 404);
        }

        // Ejecutamos ambas consultas de forma limpia
        $checklist = EquipoMantenimientoCgd::where('id_equipo_solicitud', $idEquipoSolicitud)->first();

        $yaSugeridoBaja = Dictamen::where('id_equipo', $base->id_equipo)
            ->where('sugiere_baja', 1)
            ->exists();

        return response()->json([
            'base' => $base,
            'checklist' => $checklist,
            'ya_sugerido_baja' => $yaSugeridoBaja,
        ]);
    }

    /** Upsert por id_equipo_solicitud. */
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_equipo_solicitud' => 'required|integer|exists:equipos_solicitud,id',
            'id_area' => 'required|integer|exists:areas,id',
            'responsable' => 'nullable|string|max:150',
            'no_extension' => 'nullable|string|max:10',
            'contrasena' => 'nullable|string|max:100',

            'eq_valoracion' => 'boolean', 'eq_respaldo_informacion' => 'boolean',
            'eq_cargador_cables' => 'boolean', 'eq_reinicio_constante' => 'boolean',
            'eq_activacion_ofimatica' => 'boolean', 'eq_activacion_so' => 'boolean',
            'eq_error_pantalla_azul' => 'boolean', 'eq_actualizaciones_so' => 'boolean',
            'eq_no_retiene_carga' => 'boolean', 'eq_no_funciona_teclado_completo' => 'boolean',
            'eq_no_enciende' => 'boolean', 'eq_instalacion_software_adicional' => 'boolean',
            'eq_no_inicia_so' => 'boolean', 'eq_observaciones' => 'nullable|string',

            'mt_valoracion' => 'boolean', 'mt_no_funciona' => 'boolean',
            'mt_teclas_incorrectas' => 'boolean', 'mt_conector_mal_estado' => 'boolean',
            'mt_observaciones' => 'nullable|string',

            'imp_valoracion' => 'boolean', 'imp_cable_corriente' => 'boolean',
            'imp_cable_datos' => 'boolean', 'imp_no_enciende' => 'boolean',
            'imp_atasca_hojas' => 'boolean', 'imp_no_jala_hojas' => 'boolean',
            'imp_manchado_hojas' => 'boolean', 'imp_riego_tinta' => 'boolean',
            'imp_no_imprime' => 'boolean', 'imp_errores_pantalla' => 'boolean',
            'imp_observaciones' => 'nullable|string',

            'recibio_nombre' => 'nullable|string|max:150',
            'entrego_nombre' => 'nullable|string|max:150',
        ]);

        $data['usuario_mov'] = $request->user()->usuario ?? null;

        $registro = EquipoMantenimientoCgd::updateOrCreate(
            ['id_equipo_solicitud' => $data['id_equipo_solicitud']],
            $data
        );

        return response()->json($registro, 201);
    }

    /** URL firmada de 5 min para window.open sin token en header. */
    public function pdfUrl($idEquipoSolicitud)
    {
        $url = URL::temporarySignedRoute(
            'equipo-mantenimiento-cgd.pdf.firmado',
            now()->addMinutes(5),
            ['id' => $idEquipoSolicitud]
        );

        return response()->json(['url' => $url]);
    }

    public function imprimirFirmado($idEquipoSolicitud)
    {
        return $this->pdf($idEquipoSolicitud);
    }

    public function pdf($idEquipoSolicitud)
    {
        $checklist = EquipoMantenimientoCgd::where('id_equipo_solicitud', $idEquipoSolicitud)->firstOrFail();

        // Consulta unificada para traer equipo, catálogos y área en un solo viaje a la base de datos
        $datos = DB::table('equipos_solicitud as es')
            ->join('datos_equipos as de', 'de.id', '=', 'es.id_equipo')
            ->join('solicitud as s', 's.id', '=', 'es.id_solicitud')
            ->join('areas as a', 'a.id', '=', 's.id_area')
            ->leftJoin('cat_tipo_equipo as te', 'te.id', '=', 'de.id_tipo')
            ->leftJoin('cat_marca as ma', 'ma.id', '=', 'de.id_marca')
            ->leftJoin('cat_modelo as mo', 'mo.id', '=', 'de.id_modelo')
            ->where('es.id', $idEquipoSolicitud)
            ->select(
                'de.no_inventario', 
                'te.TipoEquipo as tipo_equipo', 
                'ma.marca', 
                'mo.modelo',
                'a.area'
            )
            ->first();

        if (!$datos) {
            abort(404, 'Datos de equipo no encontrados para el reporte.');
        }

        $equipo = (object)[
            'no_inventario' => $datos->no_inventario,
            'tipo_equipo' => $datos->tipo_equipo,
            'marca' => $datos->marca,
            'modelo' => $datos->modelo,
        ];

        $area = $datos->area;

        $pdf = Pdf::loadView('pdf.equipo_mantenimiento_cgd', compact('checklist', 'equipo', 'area'))
            ->setPaper('letter');

        return $pdf->stream("mantenimiento_equipo_{$idEquipoSolicitud}.pdf");
    }
}