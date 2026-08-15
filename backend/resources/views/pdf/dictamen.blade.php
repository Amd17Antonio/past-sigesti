<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dictamen {{ $dictamen->folio }}/{{ $dictamen->ejercicio }}</title>
    <style>
        @page {
            size: letter;
            margin: 130px 105px 60px 40px; /* top amplio para el membrete fijo */
        }

        body { font-family: sans-serif; font-size: 10px; color: #111; line-height: 1.35; }

        /* ---- Membrete (se repite en cada página) ---- */
        .membrete-fixed {
            position: fixed;
            top: -110px;
            left: -40px;
            right: -105px;
            padding: 15px 40px 8px 40px;
            border-bottom: 2px solid #7a1f6b;
        }
        .membrete-fixed table { width: 100%; border: none; }
        .membrete-fixed td { border: none; vertical-align: middle; padding: 0; }
        .membrete-fixed .logo-cell img { height: 60px; }

        /* ---- Franja / marca de agua lateral (se repite en cada página) ---- */
        .franja-lateral {
            position: fixed;
            top: -30px;
            right: -105px;
            width: 98px;
            height: 700px;
            z-index: -1;
        }
        .franja-lateral img { width: 100%; height: 170%; }

        .leyenda { text-align: center; font-size: 8px; margin: 4px 0; }
        .titulo { text-align: center; font-weight: bold; font-size: 11px; margin: 6px 0 14px 0; }
        .folio { font-weight: bold; font-size: 10px; }
        .fecha { margin: 4px 0 14px 0; }

        .dirigido { font-weight: bold; font-size: 9px; margin-bottom: 2px; }
        .puesto { margin-bottom: 2px; }
        .presente { margin-bottom: 14px; }

        p { margin: 0 0 6px 0; text-align: justify; }

        table.equipos { width: 100%; border-collapse: collapse; margin: 6px 0 10px 0; font-size: 8px; }
        table.equipos th, table.equipos td { border: 1px solid #000; padding: 3px; text-align: center; }
        table.equipos th { font-weight: bold; }

        .lista-item { margin: 0 0 4px 14px; font-weight: bold; font-size: 8.5px; text-align: justify; }

        .firma-bloque { text-align: center; margin-top: 40px; }
        .firma-nombre { font-weight: bold; font-size: 11px; margin-top: 10px; }
        .firma-cargo { font-size: 11px; margin-top: 4px; }
        .firma-nota { font-size: 7.5px; text-align: center; margin-top: 8px; padding: 0 40px; }

        .pie-derecha { text-align: right; }
        .tecnico-info { font-size: 6.5px; margin-top: 20px; }

        /* ---- Pie con dirección (solo página principal) ---- */
        .pie-institucional {
            margin-top: 15px;
            font-size: 7.5px;
            color: #333;
            border-top: 1px solid #ccc;
            padding-top: 6px;
        }
        .pie-institucional table { width: 100%; border: none; }
        .pie-institucional td { border: none; padding: 1px 0; vertical-align: top; }
        .pie-institucional .icono { width: 14px; }

        .pagina-notas { page-break-before: always; }
        .notas-titulo { font-weight: bold; font-size: 8px; }
        .notas-folio { text-align: right; font-weight: bold; font-size: 8px; margin-bottom: 10px; }
        .nota-item { font-size: 8px; margin: 0 0 6px 14px; text-align: justify; }

        .pagina-anexo { page-break-before: always; }
        table.anexo { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8px; }
        table.anexo th, table.anexo td { border: 1px solid #000; padding: 3px; text-align: center; }
    </style>
</head>
<body>

    {{-- ================= MEMBRETE (repite en todas las páginas) ================= --}}
    <div class="franja-lateral">
        <img src="{{ public_path('images/Lateral.png') }}" alt="">
    </div>

    <div class="membrete-fixed">
        <table>
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('images/logo-atid.jpg') }}" alt="Logo">
                </td>
            </tr>
        </table>
    </div>

    {{-- ================= PÁGINA 1: DICTAMEN ================= --}}
    @if($leyendaAnio)
        <p class="leyenda">{{ $leyendaAnio }}</p>
    @endif

    <p class="titulo">DICTAMEN DE EQUIPO DE CÓMPUTO</p>

    <p class="folio">No. {{ $dictamen->folio }}/{{ $fecha->format('Y') }}</p>
    <p class="fecha">Tlalixtac de Cabrera, Oaxaca, {{ $fecha->format('d') }} de {{ $meses[$fecha->format('n') - 1] }} de {{ $fecha->format('Y') }}.</p>

    <p class="dirigido">{{ $solicitud->solicitante }}</p>

    @if($puestoLineas)
        @foreach($puestoLineas as $linea)
            <p class="puesto">{{ $linea }}</p>
        @endforeach
    @else
        <p class="puesto">{{ $solicitud->puesto }}</p>
    @endif

    <p class="presente">P R E S E N T E.</p>

    <p>{!! $textoAtencion !!}</p>

    @if(!$listarAnexo)
        <table class="equipos">
            <thead>
                <tr>
                    <th>Equipo</th><th>Marca</th><th>Modelo</th><th>Serie</th><th>No. Inventario</th>
                </tr>
            </thead>
            <tbody>
                @foreach($equipos as $e)
                    <tr>
                        <td>{{ $e->tipo }}</td>
                        <td>{{ $e->marca }}</td>
                        <td>{{ $e->modelo }}</td>
                        <td>{{ $e->no_serie }}</td>
                        <td>{{ $e->no_inventario }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if($dictamen->fallas)
        <p>Por presentar las siguientes fallas:</p>
        <p class="lista-item">. {{ $dictamen->fallas }}</p>
    @endif

    <p>Me permito informarle que como parte del soporte técnico se realizaron los siguientes trabajos:</p>
    @foreach($servicios as $s)
        <p class="lista-item">. {{ $s }}</p>
    @endforeach

    <p>Dictamen:</p>
    @foreach($puntosDictamen as $p)
        <p class="lista-item">. {{ $p }}</p>
    @endforeach

    <div class="firma-bloque">
        <p>Atentamente</p>
        <p class="firma-nombre">{{ $firma['nombre'] }}</p>
        <p class="firma-cargo">{{ $firma['cargo'] }}</p>
        @if($firma['nota'])
            <p class="firma-nota">{{ $firma['nota'] }}</p>
        @endif
    </div>

    <p class="pie-derecha" style="margin-top: 20px;">{{ $dictamen->expediente }} Ccp. Archivo</p>
    @foreach($copias as $c)
        <p class="pie-derecha">{{ $c }}</p>
    @endforeach

    <div class="tecnico-info">
        <p>T.: {{ $tecnicoSiglas }}</p>
        <p>F.S.: {{ $dictamen->id_solicitud }}</p>
        <p>F.H.I.: {{ now()->format('d-m-Y H:i:s') }}</p>
    </div>

    {{-- ---- Pie institucional con dirección (solo esta página) ---- --}}
    <div class="pie-institucional">
        <table>
            <tr>
                <td class="icono">📍</td>
                <td>Ciudad Administrativa (Edificio 4 "Rodolfo Morales", Nivel 3)<br>
                    Carretera Internacional Oaxaca - Istmo km. 11.5<br>
                    Tlalixtac de Cabrera, Oaxaca C.P. 68270</td>
            </tr>
            <tr>
                <td class="icono">☎</td>
                <td>Tel. 951 501 5000. Ext. 11924</td>
            </tr>
            <tr>
                <td class="icono">✉</td>
                <td>https://www.oaxaca.gob.mx/honestidad</td>
            </tr>
        </table>
    </div>

    {{-- ================= PÁGINA 2: NOTAS ================= --}}
    <div class="pagina-notas">
        <p class="notas-titulo">Notas:</p>
        <p class="notas-folio">No. {{ $dictamen->folio }}/{{ $fecha->format('Y') }}</p>

        @if($dictamen->tipo_falla === 'FISICA' || $dictamen->tipo_falla === 'Física')
            <p class="nota-item">1. En caso ser necesario, la Dirección Administrativa será la única responsable de adquirir y cubrir los gastos que involucre la adquisición de piezas y servicio de reparación externa en coordinación con el Departamento de Recursos Materiales y Servicios Generales; si el equipo es enviado a reparación a un taller externo es necesario que el proveedor garantice el trabajo de mantenimiento realizado.</p>
            <p class="nota-item">2. Esta Unidad es responsable de solicitar a la Dirección Administrativa a través del Departamento de Recursos Materiales y Servicios Generales el envío a garantía de equipos de cómputo y periféricos que así lo requieran, previa solicitud de servicio a los Distribuidores correspondientes. Tales equipos serán regresados a esta Unidad para su revisión y entrega al usuario correspondiente.</p>
            <p class="nota-item">3. La Dirección Administrativa a través del Departamento de Recursos Materiales y Servicios Generales, será la encargada de transportar y elegir el/los proveedor/es que llevará/n a cabo los trabajos de reparación externa y/o envío de garantía, en cuyo caso será necesario tomar en cuenta los accesorios que se entreguen por parte del área solicitante tales como: cables de corriente, cables de impresora, cartuchos de tinta, tóner, entre otros.</p>
            <p class="nota-item">4. Si los equipos de cómputo o periféricos funcionan correctamente y las Direcciones (Unidades o Departamentos) desean darlos de baja de su inventario o reasignarlos, es responsabilidad de dichas Direcciones argumentar los motivos para tales efectos ante el Departamento de Recursos Materiales y Servicios Generales y/o la Dirección Administrativa.</p>
            <p class="nota-item">5. En caso de ser necesario y para el mejor funcionamiento de los equipos, se sugiere sustituir las piezas o partes sólo por piezas originales.</p>
            <p class="nota-item">6. Es responsabilidad de la Dirección Administrativa el tiempo que se tarden en reemplazar o adquirir piezas o consumibles para el mejor funcionamiento de los equipos de cómputo y periféricos.</p>
        @else
            <p class="nota-item">1. En caso ser necesario, la Dirección Administrativa será la única responsable de adquirir y cubrir los gastos que involucre la adquisición de piezas y servicio de reparación externa en coordinación con el Departamento de Recursos Materiales y Servicios Generales; si el equipo es enviado a reparación a un taller externo es necesario que el proveedor garantice el trabajo de mantenimiento realizado.</p>
            <p class="nota-item">2. Esta Unidad es responsable de solicitar a la Dirección Administrativa a través del Departamento de Recursos Materiales y Servicios Generales el envío a garantía de equipos de cómputo y periféricos que así lo requieran, previa solicitud de servicio a los Distribuidores correspondientes. Tales equipos serán regresados a esta Unidad para su revisión y entrega al usuario correspondiente.</p>
            <p class="nota-item">3. La Dirección Administrativa a través del Departamento de Recursos Materiales y Servicios Generales, será la encargada de transportar y elegir el/los proveedor/es que llevará/n a cabo los trabajos de reparación externa y/o envío de garantía, en cuyo caso será necesario tomar en cuenta los accesorios que se entreguen por parte del área solicitante tales como: cables de corriente, cables de impresora, cartuchos de tinta, tóner, entre otros.</p>
            <p class="nota-item">4. Si los equipos de cómputo o periféricos funcionan correctamente y las Direcciones (Unidades o Departamentos) desean darlos de baja de su inventario o reasignarlos, es responsabilidad de dichas Direcciones argumentar los motivos para tales efectos ante el Departamento de Recursos Materiales y Servicios Generales y/o la Dirección Administrativa.</p>
            <p class="nota-item">5. En caso de ser necesario y para el mejor funcionamiento de los equipos, se sugiere sustituir las piezas o partes sólo por piezas originales.</p>
            <p class="nota-item">6. Es responsabilidad de la Dirección Administrativa el tiempo que se tarden en reemplazar o adquirir piezas o consumibles para el mejor funcionamiento de los equipos de cómputo y periféricos.</p>
            <p class="nota-item">7. Si los usuarios y/o resguardantes de los equipos requieren de algún software (programa o paquetería) adicional o diferente a los instalados es necesario solicitarlo a esta Unidad mediante memorándum.</p>
            <p class="nota-item">8. Los usuarios y/o resguardantes del equipo son los únicos responsables de la instalación y alteración de software instalado, de bandas anchas y otro dispositivo personal que pueda dañar, cambiar, modificar o alterar la configuración de los mismos.</p>
            <p class="nota-item">9. Será responsabilidad de los usuarios y/o resguardantes de los equipos la realización de cambios a la configuración del sistema operativo, actualizaciones, aplicaciones y antivirus.</p>
            <p class="nota-item">10. Será responsabilidad de los usuarios y/o resguardantes de los equipos que al momento de guardar los archivos, asignen nombres cortos (tanto a los archivos como a las carpetas); debido a que al realizar el respaldo de la información contenida en el disco duro pueden No copiarse algunos archivos debido al tamaño de la ruta del archivo o carpeta; por tales motivos esta Unidad No se hace responsable de la pérdida de información.</p>
            <p class="nota-item">11. El soporte técnico se realizará de acuerdo a lo establecido en el memorándum, tarjeta informativa o solicitud verbal; debe especificarse cuando se requiera respaldo de información.</p>
            <p class="nota-item">12. Será responsabilidad de los usuarios y/o resguardantes las descargas realizadas de internet debido a que algunos programas maliciosos pueden dañar los equipos.</p>
            <p class="nota-item">13. En caso de reincidir en el mal manejo del equipo de cómputo, se remitirá mediante memorándum al jefe inmediato y a la Dirección Administrativa, el dictamen referido.</p>
        @endif

        <div class="tecnico-info">
            <p>T.: {{ $tecnicoSiglas }}</p>
            <p>F.S.: {{ $dictamen->id_solicitud }}</p>
            <p>F.H.I.: {{ now()->format('d-m-Y H:i:s') }}</p>
        </div>
    </div>

    {{-- ================= PÁGINA 3: ANEXO 1 (solo si hay 4+ equipos) ================= --}}
    @if($listarAnexo)
        <div class="pagina-anexo">
            <p style="text-align:right; font-weight:bold; font-size: 9px;">Anexo 1</p>
            <p class="notas-folio">No. {{ $dictamen->folio }}/{{ $fecha->format('Y') }}</p>
            <table class="anexo">
                <thead>
                    <tr>
                        <th>No.</th><th>Equipo</th><th>Marca</th><th>Modelo</th><th>Serie</th><th>No. Inventario</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($equipos as $i => $e)
                        <tr>
                            <td>{{ $i + 1 }}</td>
                            <td>{{ $e->tipo }}</td>
                            <td>{{ $e->marca }}</td>
                            <td>{{ $e->modelo }}</td>
                            <td>{{ $e->no_serie }}</td>
                            <td>{{ $e->no_inventario }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="tecnico-info">
                <p>T.: {{ $tecnicoSiglas }}</p>
                <p>F.S.: {{ $dictamen->id_solicitud }}</p>
                <p>F.H.I.: {{ now()->format('d-m-Y H:i:s') }}</p>
            </div>
        </div>
    @endif

</body>
</html>