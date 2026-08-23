<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Solicitud de Marcación de Telefonía {{ $s->id }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&display=swap');

        @page {
            size: letter;
            margin: 22px 105px 22px 70px;
        }

        body { 
            font-family: 'Montserrat', sans-serif; 
            font-size: 13px; 
            line-height: 1.25; 
            color: #111; 
        }

        /* ---------- Franja lateral decorativa ---------- */
        .franja-lateral {
            position: absolute;
            top: -55px;
            right: -105px; 
            width: 128px;
            bottom: 0;
            height: auto;
            z-index: -1;
        }
        .franja-lateral img { width: 100%; height: 100%; }

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
            height: 74px; 
            width: auto; 
            margin: 0 !important; 
            padding: 0 !important;
        }

        /* Leyenda debajo del logo */
        .leyenda-logo {
            font-size: 11px;
            font-weight: bold;
            text-align: center;
            margin-top: 0px;
            margin-bottom: 6px;
        }

        .subtitulo { 
            text-align: center; 
            font-size: 16px; 
            font-weight: bold; 
            margin: 10px 0 14px 0; 
            text-transform: uppercase; 
        }

        /* Ajustes para Fecha y Ticket alineados al 100% con las tablas */
        .fecha-ticket { 
            width: 100%; 
            margin-bottom: 12px; 
            box-sizing: border-box;
        }
        .fecha-ticket table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .fecha-ticket td { border: none; padding: 0; vertical-align: middle; }
        .fecha-ticket .etiqueta { font-weight: bold; white-space: nowrap; }
        .fecha-ticket .caja { border: 1px solid #333; padding: 4px; text-align: center; }

        /* ---------- Títulos de sección centrados ---------- */
        .seccion-titulo-centrado { 
            text-align: center; 
            font-weight: bold; 
            font-size: 14px; 
            margin: 12px 0 6px 0;
        }

        /* ---------- Estructura de tablas ---------- */
        .tabla-datos {
            border-collapse: collapse;
            width: 100%;
            border: 1px solid #333;
            margin-bottom: 15px;
            table-layout: fixed;
        }

        .tabla-datos td {
            padding: 8px 8px; 
            vertical-align: middle;
            word-wrap: break-word;
        }

        .tabla-datos td.etiqueta {
            background-color: #e0e0e0;
            font-weight: bold;
            width: 32%;
            border-right: 1px solid #333;
            border-bottom: 1px solid #333;
        }

        .subtexto-etiqueta {
            font-size: 11px; 
            font-weight: normal;
            font-style: italic;
            display: block;
            margin-top: 3px;
        }

        .tabla-datos td.valor {
            border-bottom: 1px solid #333;
            width: 68%;
        }

        .tabla-datos td.valor-matriz {
            padding: 0 !important;
            border-bottom: 1px solid #333;
            vertical-align: top;
        }

        .tabla-datos td.sin-borde-inferior {
            border-bottom: none !important;
        }

        .tabla-datos tr:last-child td.etiqueta,
        .tabla-datos tr:last-child td.valor,
        .tabla-datos tr:last-child td.valor-matriz {
            border-bottom: none;
        }

        /* ---------- Matriz Tipo de Solicitud ---------- */
        .subtabla-solicitud {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin: 0;
        }
        .subtabla-solicitud td {
            border-right: 1px solid #333;
            border-bottom: 1px solid #333;
            text-align: center;
            padding: 4px 2px !important;
            vertical-align: middle;
            word-wrap: break-word;
        }
        .subtabla-solicitud tr:first-child td {
            border-top: none;
            height: 35px;
        }
        .subtabla-solicitud tr:last-child td {
            border-bottom: none;
            background-color: #e0e0e0;
            font-weight: bold;
            font-style: italic;
            font-size: 10.5px; 
            height: 32px;
        }

        .subtabla-solicitud td:last-child {
            border-right: none;
        }

        .subtabla-solicitud .col-1 { width: 19%; }
        .subtabla-solicitud .col-2 { width: 17%; }
        .subtabla-solicitud .col-3 { width: 22%; }
        .subtabla-solicitud .col-4 { width: 18%; }
        .subtabla-solicitud .col-5 { width: 24%; }

        /* ---------- Firmas y Sello ---------- */
        table.solicita-autoriza { width: 100%; border-collapse: collapse; margin-top: 0px; }
        table.solicita-autoriza td { border: none; padding: 4px; vertical-align: bottom; text-align: center; }
        table.solicita-autoriza .col-firma { width: 36%; }
        table.solicita-autoriza .col-sello { width: 28%; font-weight: bold; text-align: center; vertical-align: bottom; }
        
        .firma-linea { border-top: 1px solid #333; margin: 0 10px; padding-top: 5px; }

        .nota-roja { font-size: 12.5px; margin-top: 20px; font-weight: bold; text-align: left; }
    </style>
</head>
<body>

    <!-- Franja lateral -->
    <div class="franja-lateral">
        <img src="{{ public_path('images/Lateral.png') }}" alt="Lateral">
    </div>

    <!-- Membrete con Logo -->
    <div class="membrete">
        <table>
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('images/logo-atid.jpg') }}" alt="Logo">
                </td>
            </tr>
        </table>
    </div>

    <!-- Leyenda a 0px del logo -->
    <p class="leyenda-logo">"2025, Bicentenario de la Primera Constitución Política del Estado Libre y Soberano de Oaxaca"</p>

    <br>

    <p class="subtitulo">Solicitud de marcación de usuario de telefonía</p>

    <br>

    <!-- Fecha y Ticket con el ticket perfectamente limitado al borde de las tablas -->
    <div class="fecha-ticket">
        <table>
            <tr>
                <td class="etiqueta" style="width: 50px; padding-left: 50px;">Fecha:</td>
                <td class="caja" style="width: 80px;">{{ \Carbon\Carbon::parse($s->fecha_creado_cgd ?? $s->created_at)->format('d/m/Y') }}</td>
                
                <td></td>
                
                <td class="etiqueta" style="width: 110px; text-align: right; padding-right: 8px;">Núm. De Ticket:</td>
                <td class="caja" style="width: 80px;">{{ $s->folio_glpi ?? '-' }}</td>
            </tr>
        </table>
    </div>

    <!-- TABLA 1: Datos del Usuario -->
    <p class="seccion-titulo-centrado">Datos del Usuario.</p>
    <table class="tabla-datos">
        <tr>
            <td class="etiqueta">Nombre Completo:</td>
            <td class="valor">{{ trim(($s->nombre ?? '') . ' ' . ($s->apellido_paterno ?? '') . ' ' . ($s->apellido_materno ?? '')) ?: '-' }}</td>
        </tr>
        <tr>
            <td class="etiqueta sin-borde-inferior">Puesto o Cargo:</td>
            <td class="valor">{{ $s->puesto ?? '-' }}</td>
        </tr>
        <tr>
            <td class="etiqueta">Área de Adscripción:</td>
            <td class="valor">{{ $s->area_adscripcion ?? '-' }}</td>
        </tr>
        <tr>
            <td class="etiqueta">Dependencia:</td>
            <td class="valor">{{ $s->direccion ?? '-' }}</td>
        </tr>
        <tr>
            <td class="etiqueta">Correo Electrónico Institucional:</td>
            <td class="valor">{{ $s->correo_institucional ?? '-' }}</td>
        </tr>
    </table>

    <!-- TABLA 2: Datos del Equipo Telefónico y Solicitud -->
    <p class="seccion-titulo-centrado">Datos del Equipo Telefónico.</p>
    <table class="tabla-datos">
        <tr>
            <td class="etiqueta">Núm. de Extensión:</td>
            <td class="valor">{{ $s->extension ?? '-' }}</td>
        </tr>
        <tr>
            <td class="etiqueta">
                MAC:
                <span class="subtexto-etiqueta">Ubicar en la etiqueta, atrás del Teléfono.</span>
            </td>
            <td class="valor">{{ $s->mac ?? '-' }}</td>
        </tr>
        <tr>
            <td class="etiqueta">
                Núm. De HAC:
                <span class="subtexto-etiqueta">Ubicar en la etiqueta, atrás del Teléfono.</span>
            </td>
            <td class="valor">{{ $s->numero_hac ?? $s->numero_serie ?? '-' }}</td>
        </tr>

        @php
            $tramiteActual = in_array($s->tipo_tramite, ['CAMBIO_USUARIO', 'CAMBIO_PIN_CN', 'CAMBIO_CATEGORIA', 'SOLICITAR_TELEFONO'])
                ? $s->tipo_tramite
                : 'OTRO';
        @endphp

        <tr>
            <td class="etiqueta">
                Tipo de Solicitud:
                <span class="subtexto-etiqueta">Seleccione con una "X" el tipo de solicitud.</span>
            </td>
            <td class="valor-matriz">
                <table class="subtabla-solicitud">
                    <tr>
                        <td class="col-1">{{ $tramiteActual === 'CAMBIO_USUARIO' ? 'X' : '' }}</td>
                        <td class="col-2">{{ $tramiteActual === 'CAMBIO_PIN_CN' ? 'X' : '' }}</td>
                        <td class="col-3">{{ $tramiteActual === 'CAMBIO_CATEGORIA' ? 'X' : '' }}</td>
                        <td class="col-4">{{ $tramiteActual === 'SOLICITAR_TELEFONO' ? 'X' : '' }}</td>
                        <td class="col-5">
                            {{ $tramiteActual === 'OTRO' ? 'X' : '' }}
                            @if($tramiteActual === 'OTRO')
                                <br><span style="font-size:10px; font-weight:normal;">({{ str_replace('_', ' ', $s->tipo_tramite) }})</span>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="col-1">Cambio de Usuario</td>
                        <td class="col-2">Cambio de PIN</td>
                        <td class="col-3">Categoría de Marcación</td>
                        <td class="col-4">Nueva Extensión</td>
                        <td class="col-5">Otro Tipo de Solicitud</td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td class="etiqueta">
                Justificación para Solicitud:
                <span class="subtexto-etiqueta">Porque requiere la solicitud, con base a sus actividades laborales.</span>
            </td>
            <td class="valor" style="min-height: 40px; vertical-align: top;">{{ $s->observaciones ?? '-' }}</td>
        </tr>
    </table>

    <br>
    <br>

    <!-- Área de Firmas y Sello -->
    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma">
                <div style="font-weight: bold;">Usuario</div>
                <br><br><br><br>
                <div style="margin-bottom: 4px; font-weight: bold;">
                    {{ trim(($s->nombre ?? '') . ' ' . ($s->apellido_paterno ?? '') . ' ' . ($s->apellido_materno ?? '')) ?: '-' }}
                </div>
                <div class="firma-linea">
                    Nombre y Firma
                </div>
            </td>
            <td class="col-sello">
                Sello de la Dependencia
            </td>
            <td class="col-firma">
                <div style="font-weight: bold;">Autoriza</div>
                <br><br><br><br>
                <div style="margin-bottom: 4px; font-weight: bold;">
                    {{ $s->autoriza_nombre ?? '-' }}<br>
                    <span style="font-weight:normal; font-size:11px;">{{ $s->autoriza_cargo ?? '' }}</span>
                </div>
                <div class="firma-linea">
                    Nombre y Firma
                </div>
            </td>
        </tr>
    </table>

    <p class="nota-roja">
        <strong>Nota: Es OBLIGATORIO que, el jefe que AUTORIZA debe de ser NIVEL 22 o superior.</strong>
    </p>

</body>
</html>