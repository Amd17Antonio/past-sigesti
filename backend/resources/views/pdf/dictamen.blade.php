<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dictamen {{ $dictamen->folio }}/{{ $dictamen->ejercicio }}</title>
    <style>
        @page {
            size: letter;
            margin: 150px 60px 90px 100px;
        }

        body { font-family: sans-serif; font-size: 10px; color: #111; line-height: 1.35; }

        /* ---------- Membrete Superior Fijo ---------- */
        .membrete-fixed {
            position: fixed;
            top: -125px;
            left: -40px;
            right: -105px;
            padding: 5px 40px 0 40px;
            border-bottom: none;
        }
        .membrete-fixed table { width: 100%; border: none; }
        .membrete-fixed td { border: none; vertical-align: middle; padding: 0; }
        .membrete-fixed .logo-cell img { height: 60px; }
        
        .leyenda-membrete { 
            text-align: center; 
            font-size: 11px; 
            color: #666666; 
            margin: 0 0 3px 0; 
            padding-top: 0px;
        }

        /* ---------- Franja lateral decorativa (se repite en cada página) ---------- */
        .franja-lateral {
            position: fixed;
            top: -140px;
            right: -50px; 
            width: 128px;
            height: 1090px;
            z-index: -1;
        }
        .franja-lateral img { width: 150%; height: 165%; }

        /* ---------- Pie de Página institucional (anclado al fondo real de cada hoja con la misma técnica del membrete superior) ---------- */
        .pie-pagina-primera {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -60px;
            width: 100%;
            border: none !important;
        }
        .pie-pagina-primera table { 
            width: 100%; 
            border-collapse: collapse; 
            border: none !important;
        }
        .pie-pagina-primera td { border: none !important; padding: 0; vertical-align: middle; }
        
        .pie-pagina-primera .logo-cell { 
            width: 1%; 
            white-space: nowrap; 
            text-align: left; 
            padding-right: 6px; 
        }
        .pie-pagina-primera .logo-cell img { 
            height: 75px; 
            width: auto; 
            display: block; 
        }
        
        .pie-pagina-primera .texto-cell { 
            width: auto; 
            font-size: 12px; 
            color: #444; 
            line-height: 1.15; 
            padding-left: 0; 
        }
        .pie-pagina-primera .texto-cell span { display: block; margin-bottom: 1px; }

        /* ---------- Estilos de Texto y Tamaños Solicitados ---------- */
        .titulo { text-align: center; font-weight: bold; font-size: 14px; margin: 3px 0 14px 0; }
        
        /* Bloque inicial a 13px con separación a 0px entre líneas */
        .bloque-inicial-13 {
            font-size: 14px; /* 13 px*/
        }
        .bloque-inicial-13 p {
            margin: 0; 
        }
        .bloque-inicial-13 .folio { font-weight: bold; font-size: 14px; } /* 13 px*/
        .bloque-inicial-13 .fecha { margin-bottom: 14px; font-size: 14px; }/* 13 px*/
        .bloque-inicial-13 .dirigido { font-weight: bold; font-size: 14px; margin-top: 14px; } /* 13 px*/
        .bloque-inicial-13 .puesto { font-size: 14px; } /* 13 px*/
        .bloque-inicial-13 .presente { font-size: 14px; font-weight: bold; margin-bottom: 14px; } /* 13 px*/
        .bloque-inicial-13 .texto-atencion { font-size: 14px; text-align: justify; }/* 13 px*/

        /* Secciones de texto a 13px sin negritas */
        .seccion-13 {
            font-size: 14px; /* 13 px*/
            font-weight: normal;
            margin-top: 10px;
            margin-bottom: 4px;
            text-align: justify;
        }

        table.equipos { width: 100%; border-collapse: collapse; margin: 6px 0 10px 0; font-size: 12px; }
        table.equipos th, table.equipos td { border: 1px solid #000; padding: 3px; text-align: center; }
        table.equipos th { font-weight: bold; }

        /* Elementos de respuesta (listas) a 11.5px en negritas */
        .lista-item { 
            margin: 0 0 4px 28px; 
            font-weight: bold; 
            font-size: 11.5px; 
            text-align: justify; 
        }

        .firma-bloque { text-align: center; margin-top: 40px; }
        .firma-bloque .atentamente { font-size: 14px; } /* 13 px*/
        .firma-nombre { font-weight: bold; font-size: 14px; margin-top: 10px; } /* 13 px*/
        .firma-cargo { font-size: 14px; margin-top: 4px; } /* 13 px*/
        .firma-nota { font-size: 11px; text-align: center; margin-top: 8px; padding: 0 20px; }

        .pie-derecha { text-align: right; }
        .tecnico-info { font-size: 8.5px; margin-top: 20px; }
        .tecnico-info p { margin: 0; }

        .pagina-notas { 
            page-break-before: always; 
            margin-top: -24px; 
        }
        .notas-titulo { font-weight: bold; font-size: 8px; }
        .notas-folio { text-align: right; font-weight: bold; font-size: 8px; margin-bottom: 10px; }
        .nota-item { 
            font-size: 11.3px; 
            margin: 0 0 6px 21px; 
            text-align: justify; 
        }

        .nota-item .linea {
            display: block;
            text-align: justify;
            text-align-last: justify;
        }
        .nota-item .linea-final {
            display: block;
        }

        .pagina-anexo { page-break-before: always; }
        table.anexo { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8px; }
        table.anexo th, table.anexo td { border: 1px solid #000; padding: 3px; text-align: center; }
    </style>
</head>
<body>

    {{-- ================= ELEMENTOS FIJOS (Membrete superior y Franja Lateral) ================= --}}
    <div class="franja-lateral">
        <img src="{{ public_path('images/Lateral.png') }}" alt="">
    </div>

    <div class="membrete-fixed">
        <table>
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('images/Honestidad.png') }}" alt="Secretaría de Honestidad">
                </td>
            </tr>
        </table>
    </div>

    {{-- ================= PÁGINA 1: DICTAMEN (leyenda pegada al logo, subida para tocar el borde inferior de Honestidad.png) ================= --}}
    <div style="margin-top: -60px;">
        <p class="leyenda-membrete">2026, AÑO DEL BICENTENARIO DEL NATALICIO DE MARGARITA MAZA PARADA, EJEMPLO DE DIGNIDAD, LEALTAD Y <br> SERVICIO A LA NACIÓN</p>
        <p class="titulo">DICTAMEN DE EQUIPO DE CÓMPUTO</p> <br>

        <div class="bloque-inicial-13">
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

            <p class="texto-atencion">{!! $textoAtencion !!}</p>
        </div>

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
            <p class="seccion-13">Por presentar las siguientes fallas:</p>
            <p class="lista-item">. {{ $dictamen->fallas }}</p>
        @endif

        <p class="seccion-13">Me permito informarle que como parte del soporte técnico se realizaron los siguientes trabajos:</p>
        @foreach($servicios as $s)
            <p class="lista-item">. {{ $s }}</p>
        @endforeach

        <p class="seccion-13">Dictamen:</p>
        @foreach($puntosDictamen as $p)
            <p class="lista-item">. {{ $p }}</p>
        @endforeach

        <div class="firma-bloque">
            <p class="atentamente">Atentamente</p>
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
    </div>

    {{-- PIE DE PÁGINA INSTITUCIONAL (ANCLADO AL FONDO REAL DE LA HOJA) --}}
    <div class="pie-pagina-primera">
        <table>
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('images/utc.png') }}" alt="UTC">
                </td>
                <td class="texto-cell">
                    <span>Ciudad Administrativa Edificio 4 "Rodolfo Morales", Nivel 3</span>
                    <span>Carretera Internacional Oaxaca-Istmo, km. 11.5</span>
                    <span>Tlalixtac de Cabrera, Oaxaca C.P. 68270</span>
                    <span>Tel. 951 501 50 00, Ext. 11924</span>
                    <span>www.oaxaca.gob.mx/honestidad</span>
                </td>
            </tr>
        </table>
    </div>

    {{-- ================= PÁGINA 2: NOTAS ================= --}}
    <div class="pagina-notas">
        <p class="notas-titulo">Notas:</p>
        <p class="notas-folio">No. {{ $dictamen->folio }}/{{ $fecha->format('Y') }}</p>

        @if($dictamen->tipo_falla === 'FISICA' || $dictamen->tipo_falla === 'Física')
    <p class="nota-item">
        <span class="linea">1. En caso ser necesario, la Dirección Administrativa será la única responsable de adquirir y cubrir los gastos que</span>
        <span class="linea">involucre la adquisición de piezas y servicio de reparación externa en coordinación con el Departamento de Recursos</span>
        <span class="linea">Materiales y Servicios Generales; si el equipo es enviado a reparación a un taller externo es necesario que el proveedor</span>
        <span class="linea-final">garantice el trabajo de mantenimiento realizado.</span>
    </p>
    <p class="nota-item">
        <span class="linea">2. Esta Unidad es responsable de solicitar a la Dirección Administrativa a través del Departamento de Recursos</span>
        <span class="linea">Materiales y Servicios Generales el envío a garantía de equipos de cómputo y periféricos que así lo requieran, previa</span>
        <span class="linea">solicitud de servicio a los Distribuidores correspondientes. Tales equipos serán regresados a esta Unidad para su revisión</span>
        <span class="linea-final">y entrega al usuario correspondiente.</span>
    </p>
    <p class="nota-item">
        <span class="linea">3. La Dirección Administrativa a través del Departamento de Recursos Materiales y Servicios Generales, será la</span>
        <span class="linea">encargada de transportar y elegir el/los proveedor/es que llevará/n a cabo los trabajos de reparación externa y/o</span>
        <span class="linea">envío de garantía, en cuyo caso será necesario tomar en cuenta los accesorios que se entreguen por parte del área solicitante</span>
        <span class="linea-final">tales como: cables de corriente, cables de impresora, cartuchos de tinta, tóner, entre otros.</span>
    </p>
    <p class="nota-item">
        <span class="linea">4. Si los equipos de cómputo o periféricos funcionan correctamente y las Direcciones (Unidades o Departamentos)</span>
        <span class="linea">desean darlos de baja de su inventario o reasignarlos, es responsabilidad de dichas Direcciones argumentar los motivos</span>
        <span class="linea-final">para tales efectos ante el Departamento de Recursos Materiales y Servicios Generales y/o la Dirección Administrativa.</span>
    </p>
    <p class="nota-item">
        <span class="linea">5. En caso de ser necesario y para el mejor funcionamiento de los equipos, se sugiere sustituir las piezas o partes sólo por</span>
        <span class="linea-final">piezas originales.</span>
    </p>
    <p class="nota-item">
        <span class="linea">6. Es responsabilidad de la Dirección Administrativa el tiempo que se tarden en reemplazar o adquirir piezas o</span>
        <span class="linea-final">consumibles para el mejor funcionamiento de los equipos de cómputo y periféricos.</span>
    </p>
@else
    <p class="nota-item">
        <span class="linea">1. En caso ser necesario, la Dirección Administrativa será la única responsable de adquirir y cubrir los gastos que</span>
        <span class="linea">involucre la adquisición de piezas y servicio de reparación externa en coordinación con el Departamento de Recursos</span>
        <span class="linea">Materiales y Servicios Generales; si el equipo es enviado a reparación a un taller externo es necesario que el proveedor</span>
        <span class="linea-final">garantice el trabajo de mantenimiento realizado.</span>
    </p>
    <p class="nota-item">
        <span class="linea">2. Esta Unidad es responsable de solicitar a la Dirección Administrativa a través del Departamento de Recursos</span>
        <span class="linea">Materiales y Servicios Generales el envío a garantía de equipos de cómputo y periféricos que así lo requieran, previa</span>
        <span class="linea">solicitud de servicio a los Distribuidores correspondientes. Tales equipos serán regresados a esta Unidad para su revisión</span>
        <span class="linea-final">y entrega al usuario correspondiente.</span>
    </p>
    <p class="nota-item">
        <span class="linea">3. La Dirección Administrativa a través del Departamento de Recursos Materiales y Servicios Generales, será la</span>
        <span class="linea">encargada de transportar y elegir el/los proveedor/es que llevará/n a cabo los trabajos de reparación externa y/o</span>
        <span class="linea">envío de garantía, en cuyo caso será necesario tomar en cuenta los accesorios que se entreguen por parte del área solicitante</span>
        <span class="linea-final">tales como: cables de corriente, cables de impresora, cartuchos de tinta, tóner, entre otros.</span>
    </p>
    <p class="nota-item">
        <span class="linea">4. Si los equipos de cómputo o periféricos funcionan correctamente y las Direcciones (Unidades o Departamentos)</span>
        <span class="linea">desean darlos de baja de su inventario o reasignarlos, es responsabilidad de dichas Direcciones argumentar los motivos</span>
        <span class="linea-final">para tales efectos ante el Departamento de Recursos Materiales y Servicios Generales y/o la Dirección Administrativa.</span>
    </p>
    <p class="nota-item">
        <span class="linea">5. En caso de ser necesario y para el mejor funcionamiento de los equipos, se sugiere sustituir las piezas o partes sólo por</span>
        <span class="linea-final">piezas originales.</span>
    </p>
    <p class="nota-item">
        <span class="linea">6. Es responsabilidad de la Dirección Administrativa el tiempo que se tarden en reemplazar o adquirir piezas o</span>
        <span class="linea-final">consumibles para el mejor funcionamiento de los equipos de cómputo y periféricos.</span>
    </p>
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
