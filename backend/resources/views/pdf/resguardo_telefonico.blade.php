<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resguardo de Equipo Telefónico {{ $s->id }}</title>
    <style>
        /* Definición de los 4 márgenes: arriba, derecha, abajo, izquierda */
        @page { size: letter; margin: 12px 100px 24px 36px; }
        
        body { font-family: sans-serif; font-size: 9.5px; line-height: 1.3; color: #111; font-weight: normal; }

        .membrete { width: 100%; margin-bottom: 8px; text-align: center; }
        .membrete img { height: 85px; }

        .subtitulo { text-align: center; font-size: 13px; font-weight: bold; margin: 6px 0 10px 0; text-transform: uppercase; }
        .intro { margin-bottom: 8px; font-size: 12px; }

        table.formato { width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 1px solid #333; }
        table.formato td, table.formato th { border: 1px solid #333; padding: 2px 4px; vertical-align: middle; text-align: left; font-weight: normal; }
        table.formato th { background-color: #fff; text-align: center; }
        .celda-x { width: 44px; text-align: center; }
        .celda-cat { width: 44px; text-align: center; }

        .seccion-titulo { text-align: center; font-size: 10px; padding: 3px 0; margin-top: 6px; text-transform: uppercase; font-weight: normal; }

        table.datos { width: 100%; border-collapse: collapse; margin-bottom: 4px; border: 1px solid #333; }
        table.datos td { border: 1px solid #333; padding: 2px 4px; font-weight: normal; }

        table.datos-equipo { width: 100%; border-collapse: collapse; margin: 0; border: 1px solid #333; }
        table.datos-equipo td { border: 1px solid #333; padding: 2px 4px; font-weight: normal; }
        table.datos-equipo.sin-separador td { border-left: none; border-right: none; }

        table.firmas { width: 100%; border-collapse: collapse; margin-top: 24px; }
        table.firmas td { border: none; text-align: center; padding: 4px; vertical-align: top; font-weight: normal; }
        .firma-linea { border-top: 1px solid #333; margin: 20px 10px 0 10px; padding-top: 3px; }
        .firma-nombre { font-size: 9px; min-height: 11px; margin-top: 0px; font-weight: bold; }

        /* Contenedor inferior para alinear notas y sello correctamente sin desbordarse */
        .contenedor-inferior { width: 100%; margin-top: 8px; font-size: 0; /* Elimina espacios inline-block */ }
        
        .nota-box { border: 1px solid #333; padding: 9px 8px; font-size: 8.3px; width: auto; display: inline-block; vertical-align: top; line-height: 1.35; font-weight: bold; text-align: justify; }
        
        /* Modificado para que el texto del sello quede abajo */
        .sello-box { border: 1px solid #333; height: 140px; width: 20%; box-sizing: border-box; display: inline-block; vertical-align: top; margin-top: -43px; float: right; position: relative; }
        
        .sello-texto { position: absolute; bottom: 4px; width: 100%; text-align: center; font-size: 8px; font-weight: bold; }

        .pie { font-size: 10px; margin-top: 10px; text-align: center; color: #333; }
        .pie-img { width: 100%; text-align: center; margin-top: 20px; }
        .pie-img img { width: 135%; height: auto; display: block; }

        .nota-final { font-size: 7.8px; margin-top: 4px; }
    </style>
</head>
<body>

    <div class="membrete">
        <img src="{{ public_path('images/centro.png') }}" alt="Logo Centro">
    </div>

    <p class="subtitulo">Resguardo de equipo telefónico</p>
    <p class="intro">Marcar con una X el nivel a elegir, tomando en cuenta que al seleccionar una categoría, tendrá además los privilegios de los niveles anteriores.</p>

    <table class="formato">
        <tr>
            <th class="celda-x"><b>X</b></th>
            <th class="celda-cat"><b>CAT</b></th>
            <th><b>MARCACIÓN</b></th>
            <th style="width:26%;"><b>NIVEL DE USUARIO</b></th>
        </tr>
        <tr><td class="celda-x"></td><td class="celda-cat">1</td><td>FAX (INTERNAS, LOCALES Y LARGA DISTANCIA)</td><td></td></tr>
        <tr><td class="celda-x"></td><td class="celda-cat">2</td><td>INTRANET (ENTRE EXTENSIONES)</td><td>HASTA NIVEL 15</td></tr>
        <tr><td class="celda-x"></td><td class="celda-cat">3</td><td>INTRANET, LOCAL</td><td>DEL NIVEL 16 HASTA EL NIVEL 17ª</td></tr>
        <tr><td class="celda-x">X</td><td class="celda-cat">4</td><td>INTRANET, LOCAL, CELULAR 044, 01 800</td><td>PREVIA JUSTIFICACIÓN</td></tr>
        <tr><td class="celda-x"></td><td class="celda-cat">5</td><td>INTRANET, LOCAL, CELULAR 044, 01 800, CELULAR 045</td><td>PREVIA JUSTIFICACIÓN</td></tr>
        <tr><td class="celda-x"></td><td class="celda-cat">6</td><td>INTRANET, LOCAL, CELULAR 044, 01 800, CELULAR 045, LDN</td><td>PREVIA JUSTIFICACIÓN</td></tr>
        <tr><td class="celda-x"></td><td class="celda-cat">7</td><td>LDI, LDM, IP FIJAS, SERVICIOS ESPECIALES DE DATOS</td><td>PREVIA JUSTIFICACIÓN</td></tr>
    </table>

    <div class="seccion-titulo"><b>INFORMACIÓN PERSONAL</b></div>
    <table class="datos">
        <tr>
            <td colspan="3"><b>NOMBRE:</b> {{ trim(($s->nombre ?? '') . ' ' . ($s->apellido_paterno ?? '') . ' ' . ($s->apellido_materno ?? '')) }}</td>
        </tr>
        <tr>
            <td style="width: 34%;"><b>RFC:</b> {{ $s->rfc ?? '-' }}</td>
            <td style="width: 33%;"><b>CURP:</b> {{ $s->curp ?? '-' }}</td>
            <td style="width: 33%;"><b>CLAVE DEL PUESTO:</b> {{ $s->clave_puesto ?? '-' }}</td>
        </tr>
        <tr>
            <td colspan="3"><b>PUESTO:</b> {{ $s->puesto ?? '-' }}</td>
        </tr>
        <tr>
            <td colspan="3"><b>DEPENDENCIA:</b> Secretaría de Honestidad, Transparencia y Función Pública</td>
        </tr>
        <tr>
            <td colspan="3"><b>ÁREA DE TRABAJO:</b> {{ $s->area ?? '-' }}</td>
        </tr>
    </table>

    <div class="seccion-titulo"><b>INFORMACIÓN DEL EQUIPO TELEFÓNICO</b></div>

    <table class="datos-equipo">
        <tr>
            <td style="width: 50%;"><b>EXTENSIÓN:</b> {{ $s->extension_asignada ?? '-' }}</td>
            <td style="width: 50%;"><b>MODELO:</b> {{ $s->modelo ?? '-' }}</td>
        </tr>
        <tr>
            <td><b>MAC:</b> {{ $s->mac ?? '-' }}</td>
            <td><b>NO. SERIE:</b> {{ $s->numero_serie ?? '-' }}</td>
        </tr>
    </table>

    <table class="datos-equipo">
        <tr>
            <td style="width: 33%;"><b>EDIFICIO:</b> {{ $s->edificio ?? '-' }}</td>
            <td style="width: 33%;"><b>NIVEL:</b> {{ $s->nivel ?? '-' }}</td>
            <td style="width: 34%;"><b>NODO:</b> {{ $s->nodo ?? '-' }}</td>
        </tr>
    </table>

    <table class="datos-equipo sin-separador">
        <tr>
            <td><b>ESTATUS ACTUAL DEL EQUIPO:</b> {{ $s->status_equipo ?? '-' }}</td>
        </tr>
    </table>

    <table class="firmas">
        <tr>
            <td style="width:32%;">
                <div style="font-weight: bold; font-size: 10px;">Solicita</div>
                <div style="font-size:8px; margin-bottom: 2px; font-weight: bold;">Resguardante del equipo***</div>
                <div class="firma-linea"></div>
                <div class="firma-nombre">{{ trim(($s->nombre ?? '') . ' ' . ($s->apellido_paterno ?? '') . ' ' . ($s->apellido_materno ?? '')) }}</div>
            </td>
            <td style="width:32%;">
                <div style="font-weight: bold; font-size: 10px;">Autoriza</div>
                <div style="font-size:8px; margin-bottom: 2px; font-weight: bold;">Jefe Superior*</div>
                <div class="firma-linea"></div>
                <div class="firma-nombre">{{ $s->autoriza_nombre ?? '' }}</div>
            </td>
            <td style="width:32%;">
                <div style="font-weight: bold; font-size: 10px;">Vo. Bo.</div>
                <div style="font-size:8px; margin-bottom: 2px; font-weight: bold;">Enlace Informático***</div>
                <div class="firma-linea"></div>
                <div class="firma-nombre">{{ $enlace->enlace ?? '' }}</div>
            </td>
        </tr>
    </table>

    <table class="firmas" style="margin-top: 15px;">
        <tr>
            <td style="width:40%; text-align: left; padding-left: 10px;">
                <div style="font-weight: bold; font-size: 10px; margin-bottom: 2px;">Enterado</div>
                <div class="firma-linea" style="margin: 20px 0 0 0; width: 80%;"></div>
                <div class="firma-nombre" style="margin-top: 0px;">{{ $s->enterado_nombre ?? '' }}</div>
            </td>
            <td style="width:60%;"></td>
        </tr>
    </table>

    <!-- Bloque inferior con notas y sello alineados de forma limpia y dentro de la hoja -->
    <div class="contenedor-inferior">
        <div class="nota-box">
            NOTA: ME COMPROMETO A DAR BUEN USO Y MANTENER EN BUEN ESTADO EL (LOS) BIEN (ES) <br>
            RECIBIDO(S), POR LO QUE NOTIFICARE DE CUALQUIER IRREGULARIDAD O MOVIMIENTO EN LA <br>
            UBICACIÓN DEL MISMO AL JEFE ADMINISTRATIVO DE MI ÁREA DE ADSCRIPCIÓN, DE CONFORMIDAD <br>
            CON LO DISPUESTO EN LOS ARTÍCULOS 16, 22, 39, 42, 42 Y 46 DEL REGLAMENTO PARA REGULAR EL <br>
            USO DE LOS BIENES MUEBLES DE LA ADMINISTRACIÓN PÚBLICA ESTATAL, EN CASO CONTRARIO <br>
            SE PROCEDERA CONFORME AL ARTÍCULO 48 DEL MISMO REGLAMENTO, ASÍ COMO LO ESTABLECIDO <br>
            EN LA LEY DE RESPONSABILIDAD DE LOS SERVIDORES PÚBLICOS DEL ESTADO DE OAXACA.
        </div>
        <div class="sello-box">
            <div class="sello-texto">Sello de la dependencia</div>
        </div>
    </div>

    <table class="formato" style="margin-top: 8px;">
        <tr>
            <td><b>Configuró:</b></td>
            <td><b>Fecha atención:</b></td>
            <td><b>No. Inventario:</b></td>
        </tr>
    </table>

    <p class="nota-final"><b>*</b> La autorización debe ser por un jefe con nivel 20 o superior según la página de transparencia gubernamental, no se puede firmar por ausencia.</p>
    <p class="nota-final"><b>**</b> Todas las llamadas serán tarificadas, enviando un reporte mensual para control interno.</p>
    <p class="nota-final"><b>***</b> No se puede firmar por ausencia.</p>
    <p class="nota-final"><b>Nota:</b> Para el cambio de Nombre de Usuario, será necesario presentar este formato actualizado debidamente requisitado, de no hacerlo, la extensión será suspendida.</p>

    <div class="pie">
        Ciudad Administrativa, Edificio 2, Segundo Nivel, Carretera Internacional Oaxaca-Istmo Km. 11.5 Tlalixtac de Cabrera Oaxaca, C.P. 68270, Tel. (951) 501-5000 Ext. 10600
    </div>

    <div class="pie-img">
        <img src="{{ public_path('images/verde.png') }}" alt="Pie Verde">
    </div>

</body>
</html>