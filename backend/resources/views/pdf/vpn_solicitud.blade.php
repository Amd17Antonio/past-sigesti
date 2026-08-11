<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Solicitud VPN {{ $s->id }}</title>
    <style>
        @page {
            size: letter;
            margin: 28px 105px 28px 40px;
        }

        body { font-family: sans-serif; font-size: 10px; line-height: 1.25; color: #111; }

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

        .subtitulo { text-align: center; font-size: 13px; font-weight: bold; margin: 10px 0 6px 0; text-transform: uppercase; }
        .seccion-titulo { font-weight: bold; font-size: 10.5px; margin: 10px 0 4px 0; text-transform: uppercase; }

        table.formato { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        table.formato td, table.formato th { border: 1px solid #333; padding: 5px; vertical-align: top; text-align: left; }
        table.formato .label { font-weight: bold; width: 26%; background-color: #f5f5f5; }

        table.solicita-autoriza { width: 100%; border-collapse: collapse; margin-top: 34px; margin-bottom: 6px; }
        table.solicita-autoriza td { border: none; padding: 4px; vertical-align: top; text-align: center; }
        table.solicita-autoriza .col-sello { border: 1px solid #333; width: 32%; padding-top: 34px; }
        table.solicita-autoriza .col-firma { width: 34%; }
        .firma-linea { border-top: 1px solid #333; margin: 0 16px; padding-top: 4px; }

        .ticket-fecha { margin-top: 6px; margin-bottom: 4px; font-size: 9.5px; }
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

    <p class="subtitulo">Formato de solicitud de creación de cuenta de usuario<br>de acceso remoto (VPN SSL)</p>

    <p class="seccion-titulo">Datos del resguardante</p>
    <table class="formato">
        <tr>
            <td class="label">Nombre del Usuario:</td>
            <td>{{ $s->nombre_usuario }}</td>
        </tr>
        <tr>
            <td class="label">Puesto:</td>
            <td>{{ $s->puesto ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Área de Adscripción:</td>
            <td>{{ $s->area ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Dependencia o Entidad:</td>
            <td>{{ $s->dependencia ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Correo Institucional:</td>
            <td>{{ $s->correo_institucional ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Teléfono / Extensión:</td>
            <td>{{ $s->telefono ?? '-' }} {{ $s->extension ? ' / Ext. ' . $s->extension : '' }}</td>
        </tr>
    </table>

    <p class="seccion-titulo">Información del acceso remoto</p>
    <table class="formato">
        <tr>
            <td class="label">
                @if($s->tipo_acceso === 'link')
                    Link del sistema:
                @else
                    IP y Puerto del servidor:
                @endif
            </td>
            <td>{{ $s->tipo_acceso === 'link' ? ($s->link_sistema ?? '-') : ($s->ip_puerto ?? '-') }}</td>
        </tr>
        <tr>
            <td class="label">Periodo de uso:</td>
            <td>
                Fecha inicial: {{ $s->fecha_inicio ? \Carbon\Carbon::parse($s->fecha_inicio)->format('d/m/Y') : '-' }}
                &nbsp;&nbsp;&nbsp;
                Fecha final: {{ $s->fecha_fin ? \Carbon\Carbon::parse($s->fecha_fin)->format('d/m/Y') : '-' }}
            </td>
        </tr>
        <tr>
            <td class="label">Justificación de uso:</td>
            <td style="white-space: pre-line;">{{ $s->justificacion_uso ?? '-' }}</td>
        </tr>
    </table>

    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma">
                <div class="firma-linea">{{ $s->nombre_usuario }}<br>Nombre y firma del usuario<br>de la VPN</div>
            </td>
            <td class="col-firma">
                <div class="firma-linea">Nombre y firma del jefe<br>que autoriza*</div>
            </td>
            <td class="col-sello">Sello de la Dependencia</td>
        </tr>
    </table>

    <p class="ticket-fecha">
        Fecha: {{ \Carbon\Carbon::parse($s->created_at)->format('d/m/Y') }}
        &nbsp;&nbsp;&nbsp;&nbsp;
        Núm. De Ticket: {{ $s->num_ticket ?? '-' }}
    </p>

    <table class="solicita-autoriza" style="margin-top: 20px;">
        <tr>
            <td class="col-firma" style="width: 100%;">
                <div class="firma-linea" style="margin: 0 auto; display:inline-block; min-width:260px;">
                    Nombre y firma del Enlace<br>Informático<br>Vo. Bo.
                </div>
            </td>
        </tr>
    </table>

    <div class="pie-pagina">
        Centro Administrativo del Poder Ejecutivo y Judicial "General Porfirio Díaz, Soldado de la Patria" Edificio "D" Saúl Martínez
        Avenida Gerardo Pandal Graff #1, Reyes Mantecón, San Bartolo Coyotepec, C.P. 71257, Oaxaca. Teléfono: 01 951 5016900 Ext.23511
    </div>

</body>
</html>
