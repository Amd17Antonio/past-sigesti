<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Oficio de correo institucional {{ $s->id }}</title>
    <style>
        @page { size: letter; margin: 30px 42px; }
        body { font-family: sans-serif; font-size: 10.2px; line-height: 1.4; color: #111; }

        .fecha { margin-bottom: 12px; }
        .oficio-num { margin-bottom: 4px; }
        .asunto { margin-bottom: 20px; }
        .asunto strong { text-decoration: none; }

        .destinatario { margin-bottom: 20px; }
        .destinatario .nombre { font-weight: bold; }
        .destinatario .cargo { font-weight: bold; }

        .cuerpo { text-align: justify; margin-bottom: 16px; }
        .cuerpo p { margin: 0 0 10px 0; text-indent: 24px; }

        table.alta { width: 100%; border-collapse: collapse; margin: 14px 0 20px 0; }
        table.alta th, table.alta td { border: 1px solid #333; padding: 5px 6px; font-size: 9.5px; text-align: center; }
        table.alta th { background-color: #f0f0f0; font-weight: bold; }
        table.alta .cabecera-tipo { background-color: #e5e5e5; font-weight: bold; text-transform: uppercase; }

        .despedida { margin-top: 20px; margin-bottom: 44px; }

        table.firmas { width: 100%; border-collapse: collapse; }
        table.firmas td { border: none; text-align: center; vertical-align: top; padding: 0 10px; }
        .firma-linea { border-top: 1px solid #333; margin: 0 10px; padding-top: 4px; font-weight: bold; }
        .firma-cargo { font-size: 9px; }

        .ccp { margin-top: 40px; font-size: 8px; color: #333; }
    </style>
</head>
<body>

    <p class="fecha">Tlalixtac de Cabrera, Oaxaca, {{ \Carbon\Carbon::parse($s->created_at)->locale('es')->translatedFormat('d \d\e F \d\e Y') }}</p>
    <p class="oficio-num">Oficio N°: <strong>{{ $s->oficio_cgd ?? '_______________' }}</strong></p>
    <p class="asunto">Asunto: <strong>{{ $s->tipo_solicitud === 'baja' ? 'Solicitud de baja de correo institucional y entrega de formato.' : 'Solicitud de creación de correo institucional y entrega de formato.' }}</strong></p>

    <div class="destinatario">
        <div class="nombre">M.T.I. Moisés Juárez Rodríguez</div>
        <div class="cargo">Director General de la Agencia de Tecnologías e Innovación Digital.</div>
        <div><strong>PRESENTE</strong></div>
    </div>

    <div class="cuerpo">
        @if($s->tipo_solicitud === 'baja')
            <p>Por este conducto me permito solicitar la <strong>baja de 1 cuenta de correo institucional</strong>, correspondiente a la dependencia {{ $s->area ?? '-' }}.</p>
            <p>Se anexa el <strong>formato de baja de correo institucional</strong> debidamente requisitado para su incorporación al expediente correspondiente, con el propósito de dar cumplimiento a los lineamientos establecidos para la baja de cuentas institucionales.</p>
        @else
            <p>Por este conducto me permito solicitar la <strong>creación de 1 cuenta de correo institucional</strong>, para {{ $s->area ?? 'la dependencia correspondiente' }}.</p>
            <p>Se anexa el <strong>formato de solicitud de cuenta de correo electrónico oficial</strong> debidamente requisitado para su incorporación al expediente correspondiente, con el propósito de dar cumplimiento a los lineamientos establecidos para la creación y uso de cuentas institucionales.</p>
        @endif
    </div>

    <table class="alta">
        <tr>
            <th colspan="{{ $s->tipo_solicitud === 'baja' ? 3 : 5 }}" class="cabecera-tipo">
                {{ $s->tipo_solicitud === 'baja' ? 'Baja' : 'Alta' }}
            </th>
        </tr>
        @if($s->tipo_solicitud === 'baja')
        <tr>
            <th>No.</th>
            <th>Nombre</th>
            <th>Correo a dar de baja</th>
        </tr>
        <tr>
            <td>1</td>
            <td>{{ $s->nombre }}</td>
            <td>{{ $s->correo_institucional ?? '-' }}</td>
        </tr>
        @else
        <tr>
            <th>No.</th>
            <th>Nombre</th>
            <th>Puesto</th>
            <th>Extensión</th>
            <th>Usuario</th>
            <th>Correo Alterno</th>
        </tr>
        <tr>
            <td>1</td>
            <td>{{ $s->nombre }}</td>
            <td>{{ $s->puesto ?? '-' }}</td>
            <td>{{ $s->extension ?? '---' }}</td>
            <td>{{ $s->usuario_generado ?? $s->correo_institucional ?? '-' }}</td>
            <td>{{ $s->correo_secundario ?? '-' }}</td>
        </tr>
        @endif
    </table>

    <p>Sin más por el momento, reciba un cordial saludo.</p>

    <table class="firmas" style="margin-top: 40px;">
        <tr>
            <td style="width:50%;">
                <div class="firma-linea">Atentamente</div>
            </td>
            <td style="width:50%;">
                <div class="firma-linea">Vo. Bo.</div>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 40px;">
                <div class="firma-linea">L.I. Romualdo Alejandro Guzmán García</div>
                <div class="firma-cargo">Coordinador de Gestión Digital y Enlace Informático</div>
            </td>
            <td style="padding-top: 40px;">
                <div class="firma-linea">&nbsp;</div>
                <div class="firma-cargo">Titular de la dependencia solicitante</div>
            </td>
        </tr>
    </table>

    <div class="ccp">
        Titular de la Secretaría / Dependencia correspondiente. – Para su conocimiento.<br>
        Ccp. Archivo
    </div>

</body>
</html>
