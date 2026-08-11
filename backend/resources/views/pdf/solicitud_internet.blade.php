<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Solicitud de internet {{ $s->id }}</title>
    <style>
        @page {
            size: letter;
            margin: 28px 105px 28px 40px;
        }

        body { font-family: sans-serif; font-size: 10.2px; line-height: 1.26; color: #111; }

        /* ---------- Membrete (flujo normal: aparece UNA sola vez, arriba de la página 1) ---------- */
        .membrete {
            width: 100%;
            border-bottom: 2px solid #7a1f6b;
            padding-bottom: 5px;
            margin-bottom: 8px;
        }
        .membrete table { width: 100%; border: none; }
        .membrete td { border: none; vertical-align: middle; padding: 0; }
        .membrete .logo-cell img { height: 78px; }
        /* No hay .titulo-cell: el texto "TECNOLOGÍAS..." viene incluido en el logo */

        /* ---------- Pie de página (flujo normal: aparece UNA sola vez, al final del contenido de la página 1) ---------- */
        .pie-pagina {
            text-align: right;
            font-size: 8px;
            color: #555;
            border-top: 1px solid #ccc;
            padding-top: 4px;
            padding-right: 4px;
            margin-top: 8px;
        }

        /* ---------- Franja lateral decorativa (SOLO página 1) ----------
           position: absolute (no fixed): fixed repite en TODAS las páginas,
           que no es lo que queremos (solo debe verse en la página 1).
           Altura fijada un poco por debajo del alto físico completo de la
           hoja (792px) porque llevarla al 100% exacto dispara un bug de
           dompdf que mete una página en blanco de más. A 700px cubre casi
           toda la hoja sin ese problema. */
        .franja-lateral {
            position: absolute;
            top: -30px;
            right: -105px;
            width: 98px;
            height: 700px;
            z-index: -1;
        }
        .franja-lateral img { width: 100%; height: 170%; }

        /* ---------- Contenido ---------- */
        .titulo-principal { text-align: center; font-size: 10.5px; font-weight: bold; margin-bottom: 6px; }
        .subtitulo { text-align: center; font-size: 13px; font-weight: bold; margin: 10px 0; }
        table.formato { width: 100%; border-collapse: collapse; margin-bottom: 7px; }
        table.formato td, table.formato th { border: 1px solid #333; padding: 4px; vertical-align: top; }
        .celda-x { width: 24px; text-align: center; font-weight: bold; }
        .celda-nivel { width: 34px; text-align: center; font-weight: bold; }
        .nota-roja { color: #b91c1c; font-size: 8px; margin-top: 5px; font-weight: bold; }
        .nota { font-size: 8px; margin-top: 1px; }

        .firma-box { text-align: center; padding: 32px 10px 8px 10px; }
        .firma-linea { border-top: 1px solid #333; margin: 0 12px; padding-top: 3px; }

        /* Sección Solicita / Autoriza / Sello: SIN bordes de tabla,
           excepto la caja de "Sello de la dependencia". */
        table.solicita-autoriza { width: 100%; border-collapse: collapse; margin-bottom: 7px; }
        table.solicita-autoriza td, table.solicita-autoriza th { border: none; padding: 4px; vertical-align: top; text-align: center; }
        table.solicita-autoriza .col-sello { border: 1px solid #333; width: 34%; }
        table.solicita-autoriza .col-firma { width: 33%; }

        /* Vo.Bo. Enlace informático: texto simple, sin caja */
        .vobo { text-align: center; margin-bottom: 7px; }
        .vobo .firma-linea { display: inline-block; min-width: 260px; margin-top: 26px; }

        .page-break { page-break-before: always; }
        .sin-borde, .sin-borde td { border: none !important; }

        /* Encabezados grises en la hoja de justificación (Dependencia/Nombre/Cargo y Folio/Equipo/MAC/Nivel) */
        table.justificacion th { background-color: #d9d9d9; text-align: left; }
        table.justificacion td { text-align: left; }
    </style>
</head>
<body>

    <div class="franja-lateral">
        {{-- Sube la versión recoloreada (fondo blanco, patrón gris) a public/images/Lateral.png --}}
        <img src="{{ public_path('images/Lateral.png') }}" alt="">
    </div>

    <div class="membrete">
        <table>
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('images/logo-atid.jpg') }}" alt="Logo">
                </td>
            </tr>
        </table>
    </div>

    <p class="titulo-principal">
        "2026, AÑO DEL BICENTENARIO DEL NATALICIO DE MARGARITA MAZA PARADA, EJEMPLO DE DIGNIDAD, LEALTAD Y SERVICIO A LA NACIÓN"
    </p>

    <p class="subtitulo">
        FORMATO PARA SELECCIONAR LA CATEGORÍA DE FILTRADO DE CONTENIDO DE ACCESO A INTERNET
    </p>

    <p>Marcar con una X el nivel a elegir (donde el nivel 1 es el más bajo y el nivel 2 es el más alto) tomando en cuenta que, al seleccionar un nivel, tendrá además los privilegios del nivel anterior.</p>

    <table class="formato">
        <tr>
            <th class="celda-x">X</th>
            <th class="celda-nivel">NIVEL</th>
            <th>PRIVILEGIOS</th>
        </tr>
        <tr>
            <td class="celda-x">{{ $s->nivel_filtrado == 1 ? 'X' : '' }}</td>
            <td class="celda-nivel">1</td>
            <td>
                Correo Institucional, Finanzas y bancos, Negocios, Gobierno y organizaciones legales, Motores de búsqueda y portales,
                Aplicaciones basadas en Web, Arte y Cultura, Educación Infantil, Educación, Religión Mundial, Salud y Bienestar, Medicina,
                Misceláneo, Referencia, Restaurantes y bares, Sociedad y Estilo de Vida, Correo Electrónico Basado en Web, Educación sexual,
                Prevención de Abuso de Niños, Fuerzas armadas, Organizaciones generales, Contenido Dinámico, Folklore, Mensajería Instantánea,
                Noticias y Medios de Comunicación, Deportes, Web Chats, Grupos Defensores/Apoyo, Alcohol, Creencias Alternativas, Tabaco,
                Tecnologías de la información, Sitios web seguros, Corredor bursátil y Comercio, Grupos de noticias y paneles de mensajes,
                Intimidad Personal, Webs Personales y Blogs, Organizaciones Políticas, Compras y Subastas, Viajar, Radio por internet, Aborto.
            </td>
        </tr>
        <tr>
            <td class="celda-x">{{ $s->nivel_filtrado == 2 ? 'X' : '' }}</td>
            <td class="celda-nivel">2</td>
            <td>
                Alojamiento Web, Servidores de Contenido, Entretenimiento, Uso Compartido de Archivos y almacenamiento,
                Telefonía por Internet, Televisión por internet, Streaming Media y Redes Sociales.
            </td>
        </tr>
    </table>

    <p><strong>Para asignar los privilegios seleccionados requisite la siguiente información:</strong></p>

    <table class="formato">
        <tr>
            <th colspan="4">Conexión:</th>
            <th>Dirección MAC Nueva:</th>
            <th>Dirección MAC anterior<sup>1</sup>:</th>
        </tr>
        <tr>
            <td>Cableado:</td>
            <td class="celda-x">{{ $s->tipo_conexion === 'cableada' ? 'X' : '' }}</td>
            <td>Inalámbrico:</td>
            <td class="celda-x">{{ $s->tipo_conexion === 'inalambrica' ? 'X' : '' }}</td>
            <td>{{ $s->tipo_conexion === 'cableada' ? ($s->mac_ethernet ?? '-') : ($s->mac_wifi ?? '-') }}</td>
            <td>{{ $s->tipo_solicitud === 'cambio' ? ($s->motivo_actualizacion ?? '-') : '' }}</td>
        </tr>
        <tr>
            <th colspan="4">Tipo de Equipo:</th>
            <th>Fecha de solicitud:</th>
            <th>No. de nodo de red<sup>2</sup>:</th>
        </tr>
        <tr>
            <td>Escritorio:</td>
            <td class="celda-x">{{ str_contains(strtoupper($s->tipo_equipo ?? ''), 'ESCRITORIO') ? 'X' : '' }}</td>
            <td>Laptop:</td>
            <td class="celda-x">{{ str_contains(strtoupper($s->tipo_equipo ?? ''), 'LAPTOP') ? 'X' : '' }}</td>
            <td>{{ \Carbon\Carbon::parse($s->created_at)->format('d/m/Y') }}</td>
            <td>{{ $s->tipo_conexion === 'cableada' ? ($s->puerto ?? '-') : '' }}</td>
        </tr>
        @if(!str_contains(strtoupper($s->tipo_equipo ?? ''), 'ESCRITORIO') && !str_contains(strtoupper($s->tipo_equipo ?? ''), 'LAPTOP'))
        <tr>
            <td colspan="6">Otro (especifique): {{ $s->tipo_equipo ?? '-' }}</td>
        </tr>
        @endif
    </table>

    <!-- Solicita / Autoriza: SIN bordes de tabla. Sello de la dependencia: SÍ lleva caja. -->
    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma"><strong>Solicita</strong><br>Resguardante del equipo**</td>
            <td class="col-firma"><strong>Autoriza</strong><br>Jefe superior*</td>
            <td class="col-sello" rowspan="2">Sello de la dependencia</td>
        </tr>
        <tr>
            <td class="col-firma" style="padding-top:26px;">
                <div class="firma-linea">{{ $s->usuario_internet }}<br>Nombre y Firma</div>
            </td>
            <td class="col-firma" style="padding-top:26px;">
                <div class="firma-linea">{{ $s->autoriza_nombre ?? '-' }}<br>Nombre y Firma</div>
            </td>
        </tr>
    </table>

    <!-- Vo.Bo. Enlace informático: texto simple, sin caja -->
    <div class="vobo">
        <strong>Vo.Bo.</strong><br>
        Enlace informático<br>
        <div class="firma-linea">{{ $s->enlace_nombre ?? '-' }}<br>Nombre y Firma</div>
    </div>

    <p style="font-weight:bold; margin-top:8px; margin-bottom:4px;">Información interna (no rellenar)</p>
    <table class="formato">
        <tr>
            <td>
                Configuró: _______________ &nbsp;&nbsp;&nbsp; Fecha de atención: _______________ &nbsp;&nbsp;&nbsp; IP: _______________
            </td>
        </tr>
    </table>

    <p class="nota-roja">
        Todo tráfico en la red de las instalaciones del Gobierno del Estado es auditada y registrada por cuestiones de seguridad y transparencia,
        la información podrá ser entregada si es solicitada por una autoridad competente.
    </p>
    <p class="nota">*La autorización debe ser por un Director con nivel 20 o superior según la página de transparencia gubernamental, no se puede firmar por ausencia.</p>
    <p class="nota">*** No se puede firmar por ausencia.</p>
    <p class="nota">Nota: Para el nivel 2 se requiere una justificación detallada de las actividades de la persona que solicita el servicio.</p>
    <p class="nota"><sup>1</sup> Llenar en caso de que sea cambio de MAC</p>
    <p class="nota"><sup>2</sup> Llenar en caso de ser una conexión cableada.</p>

    <div class="pie-pagina">
        Carretera Internacional Oaxaca-Istmo Km 11.5<br>
        Ciudad Administrativa Benemérito de las Américas Edificio 2,<br>
        segundo nivel, Tlalixtac de Cabrera, Oaxaca. C.P. 68270
    </div>

    @if($s->nivel_filtrado == 2)
    <div class="page-break">
        <p class="subtitulo">JUSTIFICACIÓN DE ACTIVIDADES DEL USUARIO<br>PARA NIVELES DE INTERNET 2</p>

        <table class="formato justificacion">
            <tr>
                <th style="width:25%;">Dependencia:</th>
                <td colspan="3">Secretaría de Honestidad, Transparencia y Función Pública</td>
            </tr>
            <tr>
                <th>Nombre:</th>
                <td colspan="3">{{ $s->usuario_internet }}</td>
            </tr>
            <tr>
                <th>Cargo:</th>
                <td colspan="3">{{ $s->cargo }}</td>
            </tr>
        </table>

        <table class="formato justificacion">
            <tr>
                <th>Folio formato</th>
                <th>Equipo</th>
                <th>MAC</th>
                <th>Nivel</th>
            </tr>
            <tr>
                <td>{{ $s->id }}</td>
                <td>{{ $s->tipo_equipo ?? '-' }}</td>
                <td>{{ $s->tipo_conexion === 'cableada' ? ($s->mac_ethernet ?? '-') : ($s->mac_wifi ?? '-') }}</td>
                <td>2</td>
            </tr>
        </table>

        <div style="border:1px solid #333; padding:8px;">
            <p><strong>ACCESO A DISTINTAS PÁGINAS PARA:</strong></p>
            <div style="white-space: pre-line;">{{ $s->justificacion }}</div>
        </div>

        <table class="formato sin-borde" style="margin-top: 70px;">
            <tr>
                <td style="width: 50%; text-align: center; padding-top: 40px;">
                    <div class="firma-linea">{{ $s->usuario_internet }}<br>{{ $s->cargo }}</div>
                </td>
                <td style="width: 50%; text-align: center; padding-top: 40px;">
                    <div class="firma-linea">{{ $s->autoriza_nombre ?? '-' }}<br>{{ $s->autoriza_cargo ?? '-' }}</div>
                </td>
            </tr>
        </table>
    </div>
    @endif

</body>
</html>