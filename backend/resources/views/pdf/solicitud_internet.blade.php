<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Solicitud de internet {{ $s->id }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

        @page {
            size: letter;
            margin: 22px 105px 22px 70px;
        }

        body { font-family: 'Montserrat', sans-serif; font-size: 10.2px; line-height: 1.25; color: #111; }

        /* ---------- Membrete ---------- */
        .membrete {
            width: 100%;
            padding-bottom: 0px;
            margin-bottom: 4px;
        }
        .membrete table { width: 100%; border: none; }
        .membrete td { border: none; vertical-align: middle; padding: 0; }
        .membrete .logo-cell img { 
            display: block; 
            height: 80px; 
            width: auto; 
            margin: 0 !important; 
            padding: 0 !important;
        }

        .texto-instrucciones {
            font-size: 13.8px;
            line-height: 1.3;
            margin: 8px 0;
            width: 100%;
            text-align: justify;
        }

        /* ---------- Pie de página ---------- */
        .pie-pagina {
            text-align: right;
            font-size: 8px;
            color: #555;
            padding-top: 4px;
            padding-right: 4px;
            margin-top: 10px;
        }

        /* ---------- Franja lateral decorativa ---------- */
        .franja-lateral {
            position: absolute;
            top: -22px;
            right: -84px; 
            width: 128px;
            bottom: 0;
            height: auto;
            z-index: -1;
        }
        .franja-lateral img { width: 100%; height: 105%; }

        /* ---------- Títulos conmemorativos ---------- */
        .titulo-linea1 { 
            text-align: left;
            font-size: 10.7px; 
            font-weight: bold; 
            line-height: 1.1;
            margin-top: -4px !important;
            margin-bottom: 0 !important; 
            padding-top: 0 !important;
        }

        .titulo-linea2 { 
            text-align: center;
            font-size: 10.7px; 
            font-weight: bold; 
            line-height: 1.1; 
            margin-top: 0 !important; 
            margin-bottom: 12px;
            padding-top: 0 !important;
        }

        .subtitulo { 
            text-align: center; 
            font-size: 13px; 
            font-weight: bold; 
            line-height: 1.2;
            margin-top: 12px;
            margin-bottom: 22px; 
        }

        table.formato { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        table.formato td { 
            border: 1px solid #333; 
            padding: 4px 5px; 
            vertical-align: top;
            text-align: justify;
        }
        table.formato th { border: 1px solid #333; padding: 4px; vertical-align: top; }
        .celda-x { width: 24px; text-align: center; font-weight: bold; }
        .celda-nivel { width: 34px; text-align: center; font-weight: bold; }
        .nota-roja { color: #b91c1c; font-size: 8px; margin-top: 4px; margin-bottom: 2px; font-weight: bold; }
        .nota { font-size: 8px; margin-top: 1px; margin-bottom: 1px; }

        /* ---------- Sección Solicita / Autoriza / Sello ---------- */
        table.solicita-autoriza { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        table.solicita-autoriza td, table.solicita-autoriza th { 
            border: none; 
            padding: 2px 4px; 
            vertical-align: top; 
            text-align: center; 
            font-size: 10.5px;
            line-height: 1.2;
        }
        table.solicita-autoriza .col-sello { 
            border: 1px solid #333; 
            width: 34%; 
            font-size: 10px;
            font-weight: bold;
            vertical-align: bottom !important;
            padding-bottom: 6px;
        }
        table.solicita-autoriza .col-firma { width: 33%; }

        /* Formato de nombre sobre la línea */
        .nombre-sobre-linea {
            border-bottom: 1px solid #333;
            margin: 0 10px;
            padding-bottom: 2px;
            font-weight: normal;
        }
        .etiqueta-firma {
            padding-top: 2px;
            font-size: 10px;
        }

        /* ---------- Tabla de Datos Técnicos ---------- */
        table.tabla-datos {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            table-layout: fixed;
        }

        table.tabla-datos th, 
        table.tabla-datos td {
            border: 1px solid #333;
            padding: 4px 2px;
            text-align: center;
            vertical-align: middle;
            font-size: 13px;
            background-color: #ffffff;
        }

        table.tabla-datos th {
            font-size: 13px;
            line-height: 1.15;
            background-color: #ffffff;
            font-weight: bold;
        }

        .col-eq-etiqueta { width: 16%; text-align: right !important; padding-right: 2px !important; font-size: 10px !important; }
        .col-eq-casilla  { width: 4%; font-weight: bold; text-align: center !important; font-size: 9px !important; }
        .col-mac         { width: 20%; text-align: center !important; font-size: 12px !important; }

        .page-break { page-break-before: always; }
        .sin-borde, .sin-borde td { border: none !important; }

        /* ---------- Estilos Tabla Unificada Hoja 2 ---------- */
        table.justificacion-unificada {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        table.justificacion-unificada th { 
            background-color: #D9D9D9; 
            text-align: center;
            font-weight: bold;
            font-size: 15px;
            padding: 6px;
            border: 1px solid #333;
        }
        table.justificacion-unificada td { 
            text-align: left; 
            font-size: 15px;
            padding: 6px;
            border: 1px solid #333;
        }

        .fila-vacia td {
            padding: 6px !important;
            font-size: 15px !important;
            line-height: 1.25;
        }

        /* Ajustes reducidos sólo para esta sección */
        .celda-contenido-justificacion {
            font-family: 'Montserrat', sans-serif !important;
            padding: 16px 14px 20px 14px !important;
            vertical-align: top;
            font-size: 15px; /* Un número más chico */
            line-height: 1.35;
            color: #000;
        }
        .celda-contenido-justificacion p {
            margin: 0 0 12px 0;
            font-weight: 400;
        }
        .celda-contenido-justificacion ul {
            margin: 0;
            padding-left: 35px; /* Se redujo el espacio entre borde y viñeta */
            list-style-type: disc;
        }
        .celda-contenido-justificacion li {
            margin-bottom: 4px; /* Se quitó la separación excesiva entre viñetas */
            padding-left: 0;
            text-align: left;
            font-weight: 400;
        }

        .celda-privilegios {
            font-size: 13px;
            line-height: 1.25;
        }

        .texto-mini {
            font-size: 8px;
            font-weight: normal;
        }
    </style>
</head>
<body>

    <div class="franja-lateral">
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

    <p class="titulo-linea1">
        <strong>"2026, AÑO DEL BICENTENARIO DEL NATALICIO DE MARGARITA MAZA PARADA, EJEMPLO DE DIGNIDAD, LEALTAD</strong>
    </p>
    <p class="titulo-linea2">
        <strong>Y SERVICIO A LA NACIÓN"</strong>
    </p>

    <p class="subtitulo">
        FORMATO PARA SELECCIONAR LA CATEGORÍA DE FILTRADO DE CONTENIDO DE<br/> ACCESO A INTERNET
    </p>

    <p class="texto-instrucciones">
        Marcar con una X el nivel a elegir (donde el nivel 1 es el más bajo y el nivel 2 es el más alto) tomando en cuenta que, al seleccionar un nivel, tendrá además los privilegios del nivel anterior.
    </p>

    <table class="formato">
        <tr>
            <th class="celda-x">X</th>
            <th class="celda-nivel">NIVEL</th>
            <th>PRIVILEGIOS</th>
        </tr>
        <tr>
            <td class="celda-x">{{ $s->nivel_filtrado == 1 ? 'X' : '' }}</td>
            <td class="celda-nivel">1</td>
            <td class="celda-privilegios">
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
            <td class="celda-privilegios">
                Alojamiento Web, Servidores de Contenido, Entretenimiento, Uso Compartido de Archivos y almacenamiento,
                Telefonía por Internet, Televisión por internet, Streaming Media y Redes Sociales.
            </td>
        </tr>
    </table>

    <p class="texto-instrucciones">Para asignar los privilegios seleccionados requisite la siguiente información:</p>

    <table class="tabla-datos">
        <tr>
            <th colspan="6">Conexión</th>
            <th class="col-mac">Dirección MAC <br> Nueva:</th>
            <th class="col-mac">Dirección MAC <br> anterior 1:</th>
        </tr>
        <tr>
            <td colspan="2" class="col-eq-etiqueta">Cableado:</td>
            <td class="col-eq-casilla">{{ $s->tipo_conexion === 'cableada' ? 'X' : '' }}</td>
            <td colspan="2" class="col-eq-etiqueta">Inalámbrico:</td>
            <td class="col-eq-casilla">{{ $s->tipo_conexion === 'inalambrica' ? 'X' : '' }}</td>
            <td class="col-mac">{{ $s->tipo_conexion === 'cableada' ? ($s->mac_ethernet ?? '-') : ($s->mac_wifi ?? '-') }}</td>
            <td class="col-mac">{{ $s->tipo_solicitud === 'cambio' ? ($s->motivo_actualizacion ?? '-') : '' }}</td>
        </tr>
        <tr>
            <th colspan="6">Tipo de Equipo</th>
            <th class="col-mac">Fecha de solicitud:</th>
            <th class="col-mac">No. de nodo de <br> red 2:</th>
        </tr>
        <tr>
            <td class="col-eq-etiqueta">Escritorio:</td>
            <td class="col-eq-casilla">{{ str_contains(strtoupper($s->tipo_equipo ?? ''), 'ESCRITORIO') ? 'X' : '' }}</td>
            
            <td class="col-eq-etiqueta">Laptop:</td>
            <td class="col-eq-casilla">{{ str_contains(strtoupper($s->tipo_equipo ?? ''), 'LAPTOP') ? 'X' : '' }}</td>
            
            <td class="col-eq-etiqueta">Otro<span class="texto-mini">(especifique)</span>:</td>
            <td class="col-eq-casilla">{{ (!str_contains(strtoupper($s->tipo_equipo ?? ''), 'ESCRITORIO') && !str_contains(strtoupper($s->tipo_equipo ?? ''), 'LAPTOP') && !empty($s->tipo_equipo)) ? 'X' : '' }}</td>
            
            <td class="col-mac">{{ \Carbon\Carbon::parse($s->created_at)->format('d/m/Y') }}</td>
            <td class="col-mac">{{ $s->tipo_conexion === 'cableada' ? ($s->puerto ?? '-') : '' }}</td>
        </tr>
    </table>

    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma"><strong>Solicita</strong><br>Resguardante del equipo**</td>
            <td class="col-firma"><strong>Autoriza</strong><br>Jefe superior*</td>
            <td class="col-sello" rowspan="3">Sello de la dependencia</td>
        </tr>
        <tr>
            <td class="col-firma" style="padding-top:24px;">
                <div class="nombre-sobre-linea">{{ $s->usuario_internet }}</div>
                <div class="etiqueta-firma">Nombre y Firma</div>
            </td>
            <td class="col-firma" style="padding-top:24px;">
                <div class="nombre-sobre-linea">{{ $s->autoriza_nombre ?? '-' }}</div>
                <div class="etiqueta-firma">Nombre y Firma</div>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="padding-top:12px; text-align:center;">
                <strong>Vo.Bo.</strong><br>
                Enlace informático
                <div style="margin-top:18px;">
                    <div class="nombre-sobre-linea" style="display:inline-block; min-width:240px;">
                        {{ $enlace->enlace ?? 'L.I. Romualdo Alejandro Guzmán García' }}
                    </div>
                    <div class="etiqueta-firma">Nombre y Firma</div>
                </div>
            </td>
        </tr>
    </table>

    <p style="font-weight:bold; margin-top:4px; margin-bottom:2px; font-size: 10px;">Información interna (no rellenar)</p>
    <table class="formato">
        <tr>
            <td style="font-size: 9.5px; padding: 3px 5px;">
                Configuró: _______________ &nbsp;&nbsp;&nbsp; Fecha de atención: _______________ &nbsp;&nbsp;&nbsp; IP: _______________
            </td>
        </tr>
    </table>

    <p class="nota-roja">
        Todo tráfico en la red de las instalaciones del Gobierno del Estado es auditada y registrada por cuestiones de seguridad y transparencia,
        la información podrá ser entregada si es solicitada por una autoridad competente.
    </p>
    <p class="nota">*La autorización debe ser por un Director con nivel 20 o superior según la página de transparencia gubernamental, no se puede firmar por ausencia.</p>
    <p class="nota">** No se puede firmar por ausencia.</p>
    <p class="nota">Nota: Para el nivel 2 se requiere una justificación detallada de las actividades de la persona que solicita el servicio.</p>
    <p class="nota">1 Llenar en caso de que sea cambio de MAC</p>
    <p class="nota">2 Llenar en caso de ser una conexión cableada.</p>

    <div class="pie-pagina">
        Carretera Internacional Oaxaca-Istmo Km 11.5<br>
        Ciudad Administrativa Benemérito de las Américas Edificio 2,<br>
        segundo nivel, Tlalixtac de Cabrera, Oaxaca. C.P. 68270
    </div>

    @if($s->nivel_filtrado == 2)
    <div class="page-break">
        <p class="subtitulo" style="margin-top: 10px;">JUSTIFICACIÓN DE ACTIVIDADES DEL USUARIO<br>PARA NIVELES DE INTERNET 2</p>

        <table class="justificacion-unificada">
            <tr>
                <th style="width: 25%;">Dependencia:</th>
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
            <tr>
                <th style="width: 25%;">Folio formato</th>
                <th style="width: 25%;">Equipo</th>
                <th style="width: 35%;">MAC</th>
                <th style="width: 15%;">Nivel</th>
            </tr>
            <tr>
                <td style="text-align: center;">{{ $s->id }}</td>
                <td style="text-align: center;">{{ $s->tipo_equipo ?? '-' }}</td>
                <td style="text-align: center;">{{ $s->tipo_conexion === 'cableada' ? ($s->mac_ethernet ?? '-') : ($s->mac_wifi ?? '-') }}</td>
                <td style="text-align: center;">2</td>
            </tr>
            
            <tr class="fila-vacia">
                <td colspan="4">&nbsp;</td>
            </tr>

            <tr>
                <td colspan="4" class="celda-contenido-justificacion">
                    <p>ACCESO A DISTINTAS PÁGINAS PARA:</p>
                    <ul>
                        <li>COMPARTIR INFORMACIÓN RESPECTO A MIS ACTIVIDADES, SE REQUIERE<br>ACCESO A DROPBOX, GOOGLE DRIVE, ICLOUD, ONEDRIVE.</li>
                        <li>ACCESO A PÁGINAS DE LEYES, PERIÓDICOS, REVISTAS O ARTÍCULOS, PARA<br>MONITOREO INFORMATIVO A</li>
                        <li>TEMAS ADMINISTRATIVOS Y DE AUDITORÍAS DE FISCALIZACIÓN ENTRE<br>OTROS.</li>
                        <li>CONSULTAR CURSOS EN VIDEO.</li>
                        <li>ACCESO A PLATAFORMAS PARA VIDEOCONFERENCIAS.</li>
                        <li>ACCESO A REDES SOCIALES.</li>
                        <li>Y DEMÁS ACCIONES QUE SE REALICEN EN LA DIRECCIÓN.</li>
                    </ul>
                </td>
            </tr>
        </table>

        <table class="formato sin-borde" style="margin-top: 60px;">
            <tr>
                <td style="width: 50%; text-align: center; padding-top: 30px;">
                    <div class="nombre-sobre-linea">{{ $s->usuario_internet }}</div>
                    <div class="etiqueta-firma">{{ $s->cargo }}</div>
                </td>
                <td style="width: 50%; text-align: center; padding-top: 30px;">
                    <div class="nombre-sobre-linea">{{ $s->autoriza_nombre ?? '-' }}</div>
                    <div class="etiqueta-firma">{{ $s->autoriza_cargo ?? '-' }}</div>
                </td>
            </tr>
        </table>
    </div>
    @endif

</body>
</html>