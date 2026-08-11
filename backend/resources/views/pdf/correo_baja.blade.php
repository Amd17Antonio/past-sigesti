<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Baja de Correo {{ $s->id }}</title>
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

        .motivo-box {
            border: 1px solid #333;
            min-height: 140px;
            padding: 8px;
            margin-bottom: 30px;
        }
        .motivo-titulo {
            background-color: #d9d9d9;
            text-align: center;
            font-weight: bold;
            padding: 4px;
            border: 1px solid #333;
            border-bottom: none;
        }

        table.solicita-autoriza { width: 100%; border-collapse: collapse; margin-top: 50px; margin-bottom: 10px; }
        table.solicita-autoriza td { border: none; padding: 4px; vertical-align: top; text-align: center; }
        table.solicita-autoriza .col-sello { border: 1px solid #333; width: 40%; text-align: center; padding-top: 40px; }
        table.solicita-autoriza .col-firma { width: 45%; }
        .firma-linea { border-top: 1px solid #333; margin: 0 30px; padding-top: 4px; }

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

    <p class="subtitulo">Formato de baja de correo institucional</p>

    <table class="formato">
        <tr>
            <td class="label">Nombre:</td>
            <td>{{ $s->nombre }}</td>
        </tr>
        <tr>
            <td class="label">Dependencia:</td>
            <td>{{ $s->area ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Correo institucional:</td>
            <td>{{ $s->correo_institucional ?? '-' }}</td>
        </tr>
    </table>

    <div class="motivo-titulo">MOTIVO DE BAJA</div>
    <div class="motivo-box">{{ $s->motivo_baja ?? '' }}</div>

    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma">
                <div class="firma-linea">Nombre y Firma del Director que<br>Autoriza<br>
                    <span style="font-weight:bold; color:#b91c1c; font-size:8px;">
                        (Obligatorio: Debe ser firmado por personal de nivel 22 o superior)
                    </span>
                </div>
            </td>
            <td class="col-sello">Sello de la dependencia</td>
        </tr>
    </table>

    <div class="pie-pagina">
        Centro Administrativo del Poder Ejecutivo y Judicial "General Porfirio Díaz, Soldado de la Patria" Edificio "D" Saúl
        Martínez Avenida Gerardo Pandal Graff #1, Reyes Mantecón, San Bartolo Coyotepec, C.P. 71257, Oaxaca. Teléfono: 01
        951 5016900
    </div>

</body>
</html>
