<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resguardo de Equipo Telefónico {{ $s->id }}</title>
    <style>
        @page { size: letter; margin: 24px 36px; }
        body { font-family: sans-serif; font-size: 9.5px; line-height: 1.3; color: #111; }

        .membrete { width: 100%; margin-bottom: 8px; }
        .membrete table { width: 100%; border: none; }
        .membrete td { border: none; vertical-align: middle; padding: 0; }
        .membrete .logo-cell img { height: 60px; }

        .subtitulo { text-align: center; font-size: 13px; font-weight: bold; margin: 6px 0 10px 0; text-transform: uppercase; }
        .intro { margin-bottom: 8px; }

        table.formato { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        table.formato td, table.formato th { border: 1px solid #333; padding: 4px 6px; vertical-align: middle; text-align: left; }
        table.formato th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
        .celda-x { width: 22px; text-align: center; font-weight: bold; }

        .seccion-titulo { text-align: center; font-weight: bold; font-size: 10px; background-color: #e5e5e5; padding: 3px; margin-top: 6px; }

        table.datos { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
        table.datos td { border: 1px solid #333; padding: 4px 6px; }
        table.datos .label { font-weight: bold; width: 32%; }

        table.firmas { width: 100%; border-collapse: collapse; margin-top: 34px; }
        table.firmas td { border: none; text-align: center; padding: 4px; vertical-align: top; }
        .firma-linea { border-top: 1px solid #333; margin: 0 10px; padding-top: 3px; }
        .firma-titulo { font-weight: bold; }

        .nota-box { border: 1px solid #333; padding: 6px; margin-top: 14px; font-size: 8.3px; }
        .sello-box { border: 1px solid #333; height: 60px; text-align: center; padding-top: 4px; font-size: 8.5px; }

        .pie { font-size: 8px; margin-top: 10px; text-align: center; color: #333; }
        .nota-final { font-size: 7.8px; margin-top: 4px; }
    </style>
</head>
<body>

    <div class="membrete">
        <table>
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('images/logo-atid.jpg') }}" alt="Logo">
                </td>
            </tr>
        </table>
    </div>

    <p class="subtitulo">Resguardo de equipo telefónico</p>
    <p class="intro">Marcar con una X el nivel a elegir, tomando en cuenta que al seleccionar una categoría, tendrá además los privilegios de los niveles anteriores.</p>

    <table class="formato">
        <tr>
            <th class="celda-x">X</th>
            <th style="width:24px;">CAT</th>
            <th>MARCACIÓN</th>
            <th style="width:26%;">NIVEL DE USUARIO</th>
        </tr>
        <tr><td class="celda-x"></td><td style="text-align:center;">1</td><td>FAX (INTERNAS, LOCALES Y LARGA DISTANCIA)</td><td></td></tr>
        <tr><td class="celda-x"></td><td style="text-align:center;">2</td><td>INTRANET (ENTRE EXTENSIONES)</td><td>HASTA NIVEL 15</td></tr>
        <tr><td class="celda-x"></td><td style="text-align:center;">3</td><td>INTRANET, LOCAL</td><td>DEL NIVEL 16 HASTA EL NIVEL 17ª</td></tr>
        <tr><td class="celda-x"></td><td style="text-align:center;">4</td><td>INTRANET, LOCAL, CELULAR 044, 01 800</td><td>PREVIA JUSTIFICACIÓN</td></tr>
        <tr><td class="celda-x"></td><td style="text-align:center;">5</td><td>INTRANET, LOCAL, CELULAR 044, 01 800, CELULAR 045</td><td>PREVIA JUSTIFICACIÓN</td></tr>
        <tr><td class="celda-x"></td><td style="text-align:center;">6</td><td>INTRANET, LOCAL, CELULAR 044, 01 800, CELULAR 045, LDN</td><td>PREVIA JUSTIFICACIÓN</td></tr>
        <tr><td class="celda-x"></td><td style="text-align:center;">7</td><td>LDI, LDM, IP FIJAS, SERVICIOS ESPECIALES DE DATOS</td><td>PREVIA JUSTIFICACIÓN</td></tr>
    </table>
    <p class="nota-final">Categoría asignada según el sistema: <strong>{{ $s->categoria ?? 'No especificada' }}</strong> (marcar manualmente la fila correspondiente en la tabla anterior).</p>

    <p class="seccion-titulo">Información personal</p>
    <table class="datos">
        <tr><td class="label">Nombre:</td><td>{{ trim(($s->nombre ?? '') . ' ' . ($s->apellido_paterno ?? '') . ' ' . ($s->apellido_materno ?? '')) }}</td></tr>
        <tr>
            <td class="label">RFC:</td><td style="width:34%;">{{ $s->rfc ?? '-' }}</td>
        </tr>
        <tr><td class="label">CURP:</td><td>{{ $s->curp ?? '-' }}</td></tr>
        <tr><td class="label">Clave del puesto:</td><td>{{ $s->clave_puesto ?? '-' }}</td></tr>
        <tr><td class="label">Puesto:</td><td>{{ $s->puesto ?? '-' }}</td></tr>
        <tr><td class="label">Dependencia:</td><td>Secretaría de Honestidad, Transparencia y Función Pública</td></tr>
        <tr><td class="label">Área de trabajo:</td><td>{{ $s->area ?? '-' }}</td></tr>
    </table>

    <p class="seccion-titulo">Información del equipo telefónico</p>
    <table class="datos">
        <tr>
            <td class="label">Extensión:</td><td>{{ $s->extension_asignada ?? '-' }}</td>
            <td class="label">Modelo:</td><td>{{ $s->modelo ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">MAC:</td><td>{{ $s->mac ?? '-' }}</td>
            <td class="label">No. Serie:</td><td>{{ $s->numero_serie ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Edificio:</td><td>{{ $s->edificio ?? '-' }}</td>
            <td class="label">Nivel:</td><td>{{ $s->nivel ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Nodo:</td><td>{{ $s->nodo ?? '-' }}</td>
            <td class="label">Estatus actual del equipo:</td><td>{{ $s->status_equipo ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">DID asignado:</td><td>{{ $s->did_asignado ?? '-' }}</td>
            <td class="label">Clave asignada:</td>
            <td>{{ $s->clave_asignada ? ($s->tipo_clave . ': ' . $s->clave_asignada) : '-' }}</td>
        </tr>
    </table>

    <table class="firmas">
        <tr>
            <td style="width:32%;">
                <div class="firma-linea firma-titulo">Solicita</div>
                <div style="font-size:8px;">Resguardante del equipo***</div>
            </td>
            <td style="width:32%;">
                <div class="firma-linea firma-titulo">Autoriza</div>
                <div style="font-size:8px;">Jefe Superior*</div>
            </td>
            <td style="width:32%;">
                <div class="firma-linea firma-titulo">Vo. Bo.</div>
                <div style="font-size:8px;">Enlace Informático***</div>
            </td>
        </tr>
    </table>

    <table class="firmas" style="margin-top: 30px;">
        <tr>
            <td style="width:100%;">
                <div class="firma-linea">Enterado</div>
            </td>
        </tr>
    </table>

    <div style="display:flex; margin-top: 14px;">
        <div class="nota-box" style="flex: 1; margin-right: 8px;">
            NOTA: ME COMPROMETO A DAR BUEN USO Y MANTENER EN BUEN ESTADO EL (LOS) BIEN(ES) RECIBIDO(S), POR LO QUE
            NOTIFICARÉ DE CUALQUIER IRREGULARIDAD O MOVIMIENTO EN LA UBICACIÓN DEL MISMO AL JEFE ADMINISTRATIVO DE MI
            ÁREA DE ADSCRIPCIÓN, DE CONFORMIDAD CON LO DISPUESTO EN LOS ARTÍCULOS 16, 22, 39, 42 Y 46 DEL REGLAMENTO
            PARA REGULAR EL USO DE LOS BIENES MUEBLES DE LA ADMINISTRACIÓN PÚBLICA ESTATAL, EN CASO CONTRARIO SE
            PROCEDERÁ CONFORME AL ARTÍCULO 48 DEL MISMO REGLAMENTO, ASÍ COMO LO ESTABLECIDO EN LA LEY DE
            RESPONSABILIDAD DE LOS SERVIDORES PÚBLICOS DEL ESTADO DE OAXACA.
        </div>
        <div class="sello-box" style="width: 140px;">Sello de la dependencia</div>
    </div>

    <table class="formato" style="margin-top: 10px;">
        <tr>
            <td>Configuró: _______________</td>
            <td>Fecha atención: _______________</td>
            <td>No. Inventario: _______________</td>
        </tr>
    </table>

    <p class="nota-final">* La autorización debe ser por un jefe con nivel 20 o superior según la página de transparencia gubernamental, no se puede firmar por ausencia.</p>
    <p class="nota-final">** Todas las llamadas serán tarificadas, enviando un reporte mensual para control interno.</p>
    <p class="nota-final">*** No se puede firmar por ausencia.</p>
    <p class="nota-final">Nota: Para el cambio de Nombre de Usuario, será necesario presentar este formato actualizado debidamente requisitado, de no hacerlo, la extensión será suspendida.</p>

    <div class="pie">
        Ciudad Administrativa, Edificio 2, Segundo Nivel, Carretera Internacional Oaxaca-Istmo Km. 11.5 Tlalixtac de Cabrera Oaxaca, C.P. 68270, Tel. (951) 501-5000 Ext. 10600
    </div>

</body>
</html>
