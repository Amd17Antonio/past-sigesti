<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Solicitud de Marcación de Telefonía {{ $s->id }}</title>
    <style>
        @page {
            size: letter;
            margin: 28px 105px 28px 40px;
        }

        body { font-family: sans-serif; font-size: 10.2px; line-height: 1.26; color: #111; }

        .membrete {
            width: 100%;
            border-bottom: 2px solid #7a1f6b;
            padding-bottom: 5px;
            margin-bottom: 8px;
        }
        .membrete table { width: 100%; border: none; }
        .membrete td { border: none; vertical-align: middle; padding: 0; }
        .membrete .logo-cell img { height: 78px; }

        .pie-pagina {
            text-align: right;
            font-size: 8px;
            color: #555;
            border-top: 1px solid #ccc;
            padding-top: 4px;
            padding-right: 4px;
            margin-top: 8px;
        }

        .franja-lateral {
            position: absolute;
            top: -30px;
            right: -105px;
            width: 98px;
            height: 700px;
            z-index: -1;
        }
        .franja-lateral img { width: 100%; height: 170%; }

        .subtitulo { text-align: center; font-size: 13.5px; font-weight: bold; margin: 12px 0 18px 0; text-transform: uppercase; }

        .fecha-ticket { width: 100%; margin-bottom: 14px; }
        .fecha-ticket table { width: 100%; border-collapse: collapse; }
        .fecha-ticket td { border: none; padding: 0 10px 0 0; vertical-align: middle; }
        .fecha-ticket .etiqueta { font-weight: bold; width: 90px; }
        .fecha-ticket .caja { border: 1px solid #333; padding: 5px; }

        .seccion-titulo { text-align: center; font-weight: bold; font-size: 11px; margin: 10px 0 4px 0; }

        table.formato { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        table.formato td, table.formato th {
            border: 1px solid #333; padding: 6px; vertical-align: top; text-align: left;
        }
        table.formato .label { font-weight: bold; width: 32%; background-color: #d9d9d9; }

        table.tipo-solicitud { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        table.tipo-solicitud th, table.tipo-solicitud td {
            border: 1px solid #333; padding: 6px; text-align: center; vertical-align: middle; font-size: 9.5px;
        }
        table.tipo-solicitud th { background-color: #d9d9d9; font-weight: bold; }
        table.tipo-solicitud .fila-label {
            text-align: left; font-weight: bold; background-color: #d9d9d9; width: 15%;
        }
        table.tipo-solicitud .marca { font-size: 13px; font-weight: bold; }

        .justificacion-box {
            border: 1px solid #333;
            min-height: 70px;
            padding: 8px;
            margin-bottom: 30px;
        }
        .justificacion-titulo {
            font-weight: bold;
            font-size: 9.5px;
            margin-bottom: 4px;
        }

        table.solicita-autoriza { width: 100%; border-collapse: collapse; margin-top: 30px; }
        table.solicita-autoriza td { border: none; padding: 4px; vertical-align: top; text-align: center; }
        table.solicita-autoriza .col-firma { width: 40%; padding-top: 34px; }
        table.solicita-autoriza .col-sello { border: 1px solid #333; width: 30%; padding-top: 34px; }
        .firma-linea { border-top: 1px solid #333; margin: 0 12px; padding-top: 3px; }

        .nota-roja { color: #b91c1c; font-size: 8.5px; margin-top: 10px; font-weight: bold; text-align: center; }
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

    <p class="subtitulo">Solicitud de marcación de usuario de telefonía</p>

    <div class="fecha-ticket">
        <table>
            <tr>
                <td class="etiqueta">Fecha:</td>
                <td class="caja" style="width: 140px;">{{ \Carbon\Carbon::parse($s->fecha_creado_cgd ?? $s->created_at)->format('d/m/Y') }}</td>
                <td style="width: 30px;"></td>
                <td class="etiqueta" style="width: 110px;">Núm. de Ticket:</td>
                <td class="caja">{{ $s->folio_glpi ?? '-' }}</td>
            </tr>
        </table>
    </div>

    <p class="seccion-titulo">Datos del Usuario</p>
    <table class="formato">
        <tr>
            <td class="label">Nombre Completo:</td>
            <td>{{ trim(($s->nombre ?? '') . ' ' . ($s->apellido_paterno ?? '') . ' ' . ($s->apellido_materno ?? '')) ?: '-' }}</td>
        </tr>
        <tr>
            <td class="label">Puesto o Cargo:</td>
            <td>{{ $s->puesto ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Dependencia:</td>
            <td>{{ $s->direccion ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Correo Electrónico Institucional:</td>
            <td>{{ $s->correo_institucional ?? '-' }}</td>
        </tr>
    </table>

    <p class="seccion-titulo">Datos del Equipo Telefónico</p>
    <table class="formato">
        <tr>
            <td class="label">Núm. de Extensión:</td>
            <td>{{ $s->extension ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">MAC:</td>
            <td>{{ $s->mac ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Núm. de Serie:</td>
            <td>{{ $s->numero_serie ?? '-' }}</td>
        </tr>
    </table>

    @php
        // Mapea el trámite del sistema a la columna del formato oficial
        $columnas = ['CAMBIO_USUARIO', 'CAMBIO_PIN_CN', 'CAMBIO_CATEGORIA', 'SOLICITAR_TELEFONO', 'OTRO'];
        $tramiteActual = in_array($s->tipo_tramite, ['CAMBIO_USUARIO', 'CAMBIO_PIN_CN', 'CAMBIO_CATEGORIA', 'SOLICITAR_TELEFONO'])
            ? $s->tipo_tramite
            : 'OTRO';
    @endphp

    <p class="seccion-titulo">Tipo de Solicitud</p>
    <table class="tipo-solicitud">
        <tr>
            <th>Cambio de Usuario</th>
            <th>Cambio de PIN / CN</th>
            <th>Categoría de Marcación</th>
            <th>Nueva Extensión</th>
            <th>Otro Tipo de Solicitud</th>
        </tr>
        <tr>
            <td class="marca">{{ $tramiteActual === 'CAMBIO_USUARIO' ? 'X' : '' }}</td>
            <td class="marca">{{ $tramiteActual === 'CAMBIO_PIN_CN' ? 'X' : '' }}</td>
            <td class="marca">{{ $tramiteActual === 'CAMBIO_CATEGORIA' ? 'X' : '' }}</td>
            <td class="marca">{{ $tramiteActual === 'SOLICITAR_TELEFONO' ? 'X' : '' }}</td>
            <td class="marca">
                {{ $tramiteActual === 'OTRO' ? 'X' : '' }}
                @if($tramiteActual === 'OTRO')
                    <br><span style="font-size:8px; font-weight:normal;">({{ str_replace('_', ' ', $s->tipo_tramite) }})</span>
                @endif
            </td>
        </tr>
    </table>

    <div class="justificacion-titulo">Justificación para Solicitud:</div>
    <div class="justificacion-box">{{ $s->observaciones ?? '-' }}</div>

    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma">
                <div class="firma-linea">
                    {{ trim(($s->nombre ?? '') . ' ' . ($s->apellido_paterno ?? '') . ' ' . ($s->apellido_materno ?? '')) ?: '-' }}
                    <br>Usuario — Nombre y Firma
                </div>
            </td>
            <td class="col-sello">Sello de la Dependencia</td>
            <td class="col-firma">
                <div class="firma-linea">Autoriza — Nombre y Firma</div>
            </td>
        </tr>
    </table>

    <p class="nota-roja">Nota: Es OBLIGATORIO que, el jefe que AUTORIZA debe de ser NIVEL 22 o superior.</p>

    <div class="pie-pagina">
        Carretera Internacional Oaxaca-Istmo Km 11.5<br>
        Ciudad Administrativa Benemérito de las Américas Edificio 2,<br>
        segundo nivel, Tlalixtac de Cabrera, Oaxaca. C.P. 68270
    </div>

</body>
</html>