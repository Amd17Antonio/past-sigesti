<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class DictamenController extends Controller
{
    private function columnasFiltrables(): array
    {
        return [
            'folio_sistema'   => 'v.folio_sistema',
            'folio_dictamen'  => 'v.folio_dictamen',
            'fecha_dictamen'  => 'v.fecha_dictamen',
            'expediente'      => 'v.expediente',
            'area'            => 'v.area',
            'no_inventario'   => 'v.no_inventario',
        ];
    }

    public function index(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $porPagina = (int) $request->get('por_pagina', 10);
        $pagina = max(1, (int) $request->get('pagina', 1));
        $filtros = $this->columnasFiltrables();

        $query = DB::table('v_dictamenes as v')
            ->select('v.*');

       // if ($rol === 'Usuario Solicitante') {
       //     $misIds = DB::table('solicitud')
     //           ->where('usr_crea', $usuario->usuario)
       //         ->pluck('id');

         //   $query->whereIn('v.folio_sistema', $misIds);
     //   }

     if ($rol === 'Usuario Solicitante') {
    $query->where('v.id_area', $usuario->id_area)
          ->whereNotNull('v.fecha_autoriza_dictamen');
}

        foreach ($filtros as $param => $columna) {
            if ($request->filled($param)) {
                $query->where($columna, 'like', '%' . $request->get($param) . '%');
            }
        }

        $sortBy = $request->get('sort_by');
        $sortDir = $request->get('sort_dir', 'desc') === 'asc' ? 'asc' : 'desc';

        if ($sortBy && isset($filtros[$sortBy])) {
            $query->orderBy($filtros[$sortBy], $sortDir);
        } else {
            $query->orderBy('v.id', 'desc');
        }

        $total = (clone $query)->count();

        $registros = $query
            ->forPage($pagina, $porPagina)
            ->get();

        return response()->json([
            'registros'      => $registros,
            'total'          => $total,
            'pagina'         => $pagina,
            'por_pagina'     => $porPagina,
            'total_paginas'  => max(1, (int) ceil($total / $porPagina)),
        ]);
    }

    /**
     * Solicitudes disponibles para generar dictamen.
     * Se muestran únicamente las solicitudes asignadas
     * que aún no tienen dictamen.
     */
    public function solicitudesDisponibles()
{
    $registros = DB::table('solicitud as s')
        ->join('areas as a', 'a.id', '=', 's.id_area')
        ->leftJoin('soporte as sp', 'sp.id', '=', 's.id_soporte')
        ->leftJoin('dictamen as d', 'd.id_solicitud', '=', 's.id')
        ->whereNull('d.id')
        ->whereNotNull('s.fecha_cierre')
        //  ->whereNotNull('s.fecha_autoriza_dictamen')
        ->whereNotNull('s.fecha_autoriza_tecnico') 
        ->select(
            's.id',
            's.solicitante',
            'a.area',
            's.num_documento',
            'sp.nombre as tecnico',
            's.descripcion'
        )
        ->orderByDesc('s.id')
        ->limit(200)
        ->get();

    $ids = $registros->pluck('id');

    $equiposPorSolicitud = DB::table('equipos_solicitud as es')
        ->join('v_equipos as e', 'e.id', '=', 'es.id_equipo')
        ->whereIn('es.id_solicitud', $ids)
        ->select('es.id_solicitud', 'e.no_inventario')
        ->get()
        ->groupBy('id_solicitud');

    $registros->transform(function ($r) use ($equiposPorSolicitud) {
        $equipos = $equiposPorSolicitud->get($r->id, collect());
        $r->equipos = $equipos->pluck('no_inventario')->filter()->implode(', ');
        return $r;
    });

    return response()->json($registros);
}

    /**
     * Equipos asociados a una solicitud.
     */
    public function equiposDeSolicitud(int $idSolicitud)
    {
        $registros = DB::table('v_equipos_dictamen')
            ->where('id_solicitud', $idSolicitud)
            ->get();

        return response()->json($registros);
    }

    /**
     * Obtiene el siguiente folio disponible.
     */
    public function siguienteFolio()
    {
        $ejercicio = now()->year;

        $max = DB::table('dictamen')
            ->where('ejercicio', $ejercicio)
            ->max('folio');

        return response()->json([
            'ejercicio' => $ejercicio,
            'folio' => ($max ?? 0) + 1,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_solicitud' => 'required|integer|exists:solicitud,id',
            'id_equipo' => 'nullable|integer',
            'ejercicio' => 'required|integer',
            'folio' => 'required|integer',
            'servicio' => 'nullable|string',
            'dictamen' => 'required|string',
            'expediente' => 'nullable|string|max:500',
            'copias' => 'nullable|string|max:500',
            'fallas' => 'nullable|string|max:500',
            'tipo_falla' => 'nullable|string|max:10',
            'sugiere_baja' => 'boolean',
        ]);

        $id = DB::table('dictamen')->insertGetId([
            ...$data,
            'fecha_dictamen' => now(),
        ]);

        DB::table('solicitud')
            ->where('id', $data['id_solicitud'])
            ->update([
                'status_uie' => 3,
            ]);

        return response()->json([
            'id' => $id,
            'message' => 'Dictamen creado correctamente',
        ], 201);
    }

    public function update(Request $request, int $id)
{
    $data = $request->validate([
        'servicio' => 'nullable|string',
        'dictamen' => 'sometimes|string',
        'expediente' => 'nullable|string|max:500',
        'copias' => 'nullable|string|max:500',
        'fallas' => 'nullable|string|max:500',
        'tipo_falla' => 'nullable|string|max:10',
        'sugiere_baja' => 'boolean',
        'fecha_dictamen' => 'nullable|date',
    ]);

    DB::table('dictamen')
        ->where('id', $id)
        ->update($data);

    return response()->json([
        'message' => 'Dictamen actualizado correctamente',
    ]);
}

    public function show(int $id)
    {
        $dictamen = DB::table('dictamen')
            ->where('id', $id)
            ->first();

        if (!$dictamen) {
            return response()->json([
                'message' => 'Dictamen no encontrado',
            ], 404);
        }

        return response()->json($dictamen);
    }

/**
     * Última captura de dictamen para una solicitud (usado por el modal de Editar,
     * ya que una solicitud puede tener más de un registro en `dictamen`).
     */
    public function ultimoPorSolicitud(int $idSolicitud)
    {
        $dictamen = DB::table('dictamen')
            ->where('id_solicitud', $idSolicitud)
            ->orderByDesc('id')
            ->first();

        if (!$dictamen) {
            return response()->json(['message' => 'No hay dictamen registrado para esta solicitud'], 404);
        }

        return response()->json($dictamen);
    }

    // ------------------------------------------------------------------
    // Generación de PDF
    // ------------------------------------------------------------------

    public function pdf(int $id)
    {
        $data = $this->datosParaPdf($id);

        if (!$data) {
            return response()->json(['message' => 'Dictamen no encontrado'], 404);
        }

        $pdf = Pdf::loadView('pdf.dictamen', $data)->setPaper('letter');

        return $pdf->stream("dictamen_{$data['dictamen']->folio}_{$data['dictamen']->ejercicio}.pdf");
    }

    public function pdfUrl(int $id)
    {
        $existe = DB::table('dictamen')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Dictamen no encontrado'], 404);
        }

        $url = URL::temporarySignedRoute(
            'dictamen.pdf.firmado',
            now()->addMinutes(5),
            ['id' => $id]
        );

        return response()->json(['url' => $url]);
    }

    public function imprimirFirmado(int $id)
    {
        return $this->pdf($id);
    }

    /**
     * Arma todos los datos que necesita la vista pdf.dictamen,
     * replicando la lógica del generador FPDF original.
     */
    private function datosParaPdf(int $id): ?array
    {
        $dictamen = DB::table('dictamen')->where('id', $id)->first();
        if (!$dictamen) {
            return null;
        }

        $solicitud = DB::table('solicitud')->where('id', $dictamen->id_solicitud)->first();

        $tecnicoSiglas = DB::table('solicitud as s')
            ->join('soporte', 'soporte.id', '=', 's.id_soporte')
            ->where('s.id', $dictamen->id_solicitud)
            ->value('soporte.siglas');

        $equipos = DB::table('v_equipos_dictamen')
            ->where('id_solicitud', $dictamen->id_solicitud)
            ->select('tipo', 'marca', 'modelo', 'no_serie', 'no_inventario')
            ->get();

        // ---- tipo de documento (texto) ----
        $tipoDoctoMap = [
            'tarjeta'     => 'tarjeta informativa',
            'memorandum'  => 'memorándum',
            'oficio'      => 'oficio',
            'ninguno'     => 'ninguno',
            'sistema'     => 'solicitud mediante el sistema de soporte',
            'correo'      => 'solicitud mediante correo electrónico',
        ];
        $tipoDoctoRaw = strtolower($solicitud->tipo_documento ?? '');
        $tipoDocto = $tipoDoctoMap[$tipoDoctoRaw] ?? $tipoDoctoRaw;

        $noDocto = '';
        if (!in_array(strtoupper($solicitud->tipo_documento ?? ''), ['SISTEMA', 'CORREO'], true)) {
            $noDocto = $solicitud->num_documento
                ? ' número <strong>' . strtoupper($solicitud->num_documento) . '</strong>'
                : '';
        }

        // ---- texto "en atención a su..." ----
        $numEquipos = $equipos->count();
        $listarAnexo = $numEquipos >= 4;

        if ($tipoDoctoRaw === 'ninguno') {
            if ($numEquipos > 1) {
                $textoAtencion = $listarAnexo
                    ? 'En atención a su <strong>solicitud verbal</strong> se revisaron los equipos incluidos en el <strong>Anexo 1</strong>.'
                    : 'En atención a su <strong>solicitud verbal</strong> se revisaron los siguientes equipos:';
            } else {
                $textoAtencion = 'En atención a su <strong>solicitud verbal</strong> se revisó el siguiente equipo:';
            }
        } else {
            if ($numEquipos > 1) {
                $textoAtencion = $listarAnexo
                    ? "En atención a su {$tipoDocto}{$noDocto} se revisaron los equipos incluidos en el <strong>Anexo 1</strong>."
                    : "En atención a su {$tipoDocto}{$noDocto} se revisaron los siguientes equipos:";
            } else {
                $textoAtencion = "En atención a su {$tipoDocto}{$noDocto} se revisó el siguiente equipo:";
            }
        }

        // ---- fecha / leyenda del año ----
        $fecha = $dictamen->fecha_dictamen ? Carbon::parse($dictamen->fecha_dictamen) : now();
        $meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre',
                  'Octubre','Noviembre','Diciembre'];

        $leyendaAnio = $this->leyendaDelAnio($fecha);

        // ---- listas separadas por ; ----
        $servicios = $dictamen->servicio
            ? array_values(array_filter(array_map('trim', explode(';', $dictamen->servicio))))
            : [];
        $puntosDictamen = $dictamen->dictamen
            ? array_values(array_filter(array_map('trim', explode(';', $dictamen->dictamen))))
            : [];
        $copias = $dictamen->copias
            ? array_values(array_filter(array_map('trim', explode(',', $dictamen->copias))))
            : [];

        // ---- puesto: caso especial folios 132/136 (separado por ;) ----
        $puestoLineas = null;
        if (in_array((int) $dictamen->folio, [132, 136], true) && $solicitud->puesto) {
            $puestoLineas = array_values(array_filter(array_map('trim', explode(';', $solicitud->puesto))));
        }

        $firma = $this->datosFirma($dictamen->id_solicitud, $fecha);

        return compact(
            'dictamen', 'solicitud', 'tecnicoSiglas', 'equipos', 'tipoDocto', 'noDocto',
            'textoAtencion', 'listarAnexo', 'fecha', 'meses', 'leyendaAnio',
            'servicios', 'puntosDictamen', 'copias', 'puestoLineas', 'firma'
        );
    }

    private function leyendaDelAnio(Carbon $fecha): ?string
    {
        $anio = (int) $fecha->format('Y');

        $fijas = [
            2018 => '"2018, Año de la Erradicación del Trabajo Infantil"',
            2020 => '"2020, Año de la Pluriculturalidad de los Pueblos Indígenas y Afromexicano"',
            2021 => '"2021, AÑO DEL RECONOCIMIENTO AL PERSONAL DE SALUD, POR LA LUCHA CONTRA EL VIRUS SARS-CoV2, COVID-19"',
            2022 => '"2022, Año del Centenario de la Constitución Política del Estado Libre y Soberano de Oaxaca"',
            2023 => '"2023, AÑO DE LA INTERCULTURALIDAD"',
            2024 => '"2024, AÑO DEL BICENTENARIO DE LA INTEGRACIÓN DEL ESTADO DE OAXACA A LA REPÚBLICA MEXICANA"',
            2025 => '"2025, BICENTENARIO DE LA PRIMERA CONSTITUCIÓN POLÍTICA DEL ESTADO LIBRE Y SOBERANO DE OAXACA"',
        ];

        if ($anio === 2019) {
            $corte = Carbon::createFromFormat('d-m-Y H:i:s', '24-01-2019 23:59:59');
            if ($fecha->greaterThan($corte)) {
                return '"2019, Año por la Erradicación de la Violencia contra la Mujer"';
            }
            return null;
        }

        if (isset($fijas[$anio])) {
            return $fijas[$anio];
        }

        if ($anio >= 2026) {
            $denominacion = DB::table('cat_anio_denominacion')->where('ejercicio', $anio)->value('denominacion');
            if ($denominacion) {
                return '"2026, AÑO DEL BICENTENARIO DEL NATALICIO DE MARGARITA MAZA PARADA, EJEMPLO DE DIGNIDAD, LEALTAD Y SERVICIO A LA NACIÓN"';
            }
        }

        return null;
    }

    private function datosFirma(int $idSolicitud, Carbon $fecha): array
    {
        $anio = (int) $fecha->format('Y');

        if ($anio <= 2016) {
            return [
                'nombre' => 'L.I. Jesús Arista de la Rosa',
                'cargo'  => 'Jefe de la unidad',
                'nota'   => null,
            ];
        }

        if ($anio === 2017 && (int) $fecha->format('n') === 1) {
            return [
                'nombre' => 'L.I. Irving Guadalupe Sumano Martínez.',
                'cargo'  => 'Jefe del Departamento de Estadística.',
                'nota'   => null,
            ];
        }

        if ($idSolicitud === 3358) {
            return [
                'nombre' => 'L.I. Irving Guadalupe Sumano Martínez.',
                'cargo'  => 'Jefe del Departamento de Estadística.',
                'nota'   => null,
            ];
        }

        $inicioCoordinacion = Carbon::createFromFormat('Y-m-d', '2026-03-23');

        if ($fecha->greaterThanOrEqualTo($inicioCoordinacion)) {
            return [
                'nombre' => 'L.I. Romualdo Alejandro Guzmán García',
                'cargo'  => 'Coordinador de Gestión Digital',
                'nota'   => 'Denominación de Coordinación de Gestion Digital, mediante oficio '
                          . 'SA/SUBDCGPRH/DRH/UPO/DOP/004/2026 de fecha 13 de febrero del 2026',
            ];
        }

        return [
            'nombre' => 'L.I. Romualdo Alejandro Guzmán García',
            'cargo'  => 'Jefe de la Unidad de Informática y Estadística.',
            'nota'   => null,
        ];
    }

}