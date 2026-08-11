<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Alta de Correo {{ $s->id }}</title>
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

        .subtitulo { text-align: center; font-size: 14px; font-weight: bold; margin: 14px 0 24px 0; text-transform: uppercase; }

        table.formato { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
        table.formato td, table.formato th {
            border: 1px solid #333; padding: 8px; vertical-align: top; text-align: left;
        }
        table.formato .label { font-weight: bold; width: 28%; background-color: #f5f5f5; }

        .firma-box { text-align: center; padding-top: 40px; }
        .firma-linea { border-top: 1px solid #333; margin: 0 20px; padding-top: 4px; }

        table.solicita-autoriza { width: 100%; border-collapse: collapse; margin-top: 40px; margin-bottom: 10px; }
        table.solicita-autoriza td { border: none; padding: 4px; vertical-align: top; text-align: center; }
        table.solicita-autoriza .col-sello { border: 1px solid #333; width: 32%; text-align: center; padding-top: 40px; }
        table.solicita-autoriza .col-firma { width: 34%; }

        .nota { font-size: 8.5px; margin-top: 3px; }
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

    <p class="subtitulo">Solicitud de cuenta de correo electrónico oficial</p>

    <table class="formato">
        <tr>
            <td class="label">Nombre:</td>
            <td>{{ $s->nombre }}</td>
        </tr>
        <tr>
            <td class="label">Puesto:</td>
            <td>{{ $s->puesto ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Dependencia:</td>
            <td>{{ $s->area ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Área Interna:</td>
            <td>{{ $s->area_interna ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Correo Secundario:</td>
            <td>{{ $s->correo_secundario ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Teléfono de contacto:</td>
            <td>{{ $s->telefono_contacto ?? '-' }}</td>
        </tr>
    </table>

    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma">
                <div class="firma-linea">Nombre y Firma del<br>Responsable del correo</div>
            </td>
            <td class="col-firma">
                <div class="firma-linea">Nombre y Firma del Director que<br>Autoriza</div>
            </td>
            <td class="col-sello">Sello de la dependencia</td>
        </tr>
    </table>

    <p style="font-weight:bold; margin-top: 20px;">NOTAS:</p>
    <p class="nota">• Si después de 3 meses la cuenta no es utilizada, será dada de baja automáticamente.</p>
    <p class="nota">• La contraseña asignada al momento de la creación del correo tiene una vigencia de 5 días, después de esos días caducará y tendrá que solicitar el reseteo de la misma.</p>
    <p class="nota">• El correo secundario se solicita en caso de necesitar restablecer su contraseña.</p>
    <p class="nota" style="margin-top:10px;">(Obligatorio: Debe de ser firmado por personal de nivel 22 o superior)</p>

    <div class="pie-pagina">
        Centro Administrativo del Poder Ejecutivo y Judicial "General Porfirio Díaz, Soldado de la Patria" Edificio "D" Saúl
        Martínez Avenida Gerardo Pandal Graff #1, Reyes Mantecón, San Bartolo Coyotepec, C.P. 71257, Oaxaca. Teléfono: 01
        951 5016900
    </div>

</body>
</html>
