<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Baja de Correo {{ $s->id }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

        @page {
            size: letter;
            margin: 25px 65px 50px 65px;
        }

        body { 
            font-family: 'Montserrat', sans-serif; 
            font-size: 15px; 
            line-height: 1.25; 
            color: #111; 
            margin: 0;
            padding: 0;
        }

        /* ---------- Imagen de Fondo Centrada ---------- */
        .bg-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 480px; 
            height: 480px;
            z-index: -1000;
        }
        .bg-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* ---------- Encabezado ---------- */
        .membrete-header {
            width: 100%;
            text-align: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
        }
        .membrete-header img {
            height: 75px;
            width: auto;
            margin: 0 auto;
            display: block;
        }

        /* ---------- Pie de Página ---------- */
        .pie-pagina-fixed {
            position: fixed;
            bottom: -50px;
            left: -65px;
            right: -65px;
            height: auto;
            text-align: center;
            z-index: 1000;
        }

        .pie-texto-gris {
            color: #666666;
            font-size: 11px;
            text-align: center;
            line-height: 1.15;
            margin-bottom: 4px;
            padding: 0 20px;
        }

        .pie-pagina-fixed img {
            width: 100%;
            display: block;
        }

        /* ---------- Títulos en Guinda Exacto (#9d2349) ---------- */
        .subtitulo { 
            text-align: center; 
            font-size: 18px; 
            font-weight: 700; 
            margin: 10px 0 20px 0; 
            text-transform: uppercase; 
            line-height: 1.25;
            color: #9d2349;
        }

        /* ---------- Tabla Unificada Con Borde Horizontal ---------- */
        table.formato-unificado { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0;
            border: 1px solid #555;
            border-radius: 8px; 
            margin-bottom: 25px; 
            background-color: transparent;
        }

        table.formato-unificado td { 
            border-right: none;
            border-left: none;
            border-top: none;
            border-bottom: 1px solid #555; 
            padding: 11.5px 12px; 
            vertical-align: middle; 
            font-size: 15px; 
        }

        table.formato-unificado tr:last-child td {
            border-bottom: none;
        }

        /* Esquinas redondeadas del contenedor */
        table.formato-unificado tr:first-child td:first-child { border-top-left-radius: 7px; }
        table.formato-unificado tr:first-child td:last-child { border-top-right-radius: 7px; }
        table.formato-unificado tr:last-child td:first-child { border-bottom-left-radius: 7px; }
        table.formato-unificado tr:last-child td:last-child { border-bottom-right-radius: 7px; }

        /* Columna de etiquetas en negritas (Gris Oscuro) ---------- */
        table.formato-unificado .col-label { 
            font-weight: 700; 
            font-size: 15px; 
            width: 32%; 
            color: #333333; 
        }

        .texto-normal {
            font-weight: 400;
            font-size: 15px; 
        }

        /* ---------- Cuadro Motivo de Baja ---------- */
        .motivo-box-container {
            border: 1px solid #555;
            border-radius: 0;
            margin-bottom: 25px;
            background-color: transparent;
        }

        .motivo-titulo {
            background-color: #c4c4c4;
            text-align: center;
            font-weight: 700;
            font-size: 15px;
            color: #111111;
            padding: 10px;
            border-bottom: 1px solid #555;
            text-transform: uppercase;
        }

        .motivo-contenido {
            min-height: 100px;
            padding: 15px;
            font-size: 15px;
            font-weight: 400;
            color: #111111;
            line-height: 1.35;
            background-color: transparent;
        }

        /* ---------- Firmas y Sello (Subido 5 renglones: de 280px a 180px) ---------- */
        table.solicita-autoriza { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 180px; /* Reducido para subir la sección */
            margin-bottom: 25px;
        }

        table.solicita-autoriza td {
            vertical-align: bottom; 
            padding: 0 10px;
        }

        table.solicita-autoriza .col-firma { 
            width: 50%; 
            text-align: center;
        }

        table.solicita-autoriza .col-sello { 
            width: 50%; 
            text-align: center;
        }

        .nombre-firmante {
            font-weight: 400;
            font-size: 15px;
            color: #111111;
            display: block;
            margin-bottom: 2px;
        }

        .firma-linea-top { 
            border-top: 1px solid #333; 
            margin: 0 10px; 
            font-size: 14px;
            font-weight: 700;
            color: #333333;
            padding-top: 5px;
        }

        .nota-obligatorio-rojo {
            font-size: 12px;
            font-weight: 700;
            color: #d9383a;
            margin-top: 4px;
            display: block;
            line-height: 1.25;
        }

        /* Box del sello */
        .box-sello-centro {
            border: 1px solid #555;
            border-radius: 0;
            height: 155px; 
            width: 240px; 
            margin: 0 auto;
            background-color: transparent;
        }

        .sello-label {
            font-weight: 700;
            font-size: 14px;
            color: #333333;
            margin-top: 6px;
            display: block;
        }
    </style>
</head>
<body>

    <!-- Imagen de Fondo Centrada -->
    <div class="bg-container">
        <img src="{{ public_path('images/fondo.png') }}" alt="Fondo">
    </div>

    <!-- Pie de página al filo de la hoja con texto en gris -->
    <div class="pie-pagina-fixed">
        <div class="pie-texto-gris">
            Centro Administrativo del Poder Ejecutivo y Judicial "General Porfirio Díaz, Soldado de la Patria" Edificio "D"Saúl <br> Martínez Avenida Gerardo Pandal
            Graff #1, Reyes Mantecón, San Bartolo Coyotepec, C.P. 71257, Oaxaca. Teléfono: 01 <br> 951 5016900 Ext.23511
        </div>
        <img src="{{ public_path('images/pie.png') }}" alt="Pie de Página">
    </div>

    <!-- Encabezado -->
    <div class="membrete-header">
        <img src="{{ public_path('images/Tecnologias.png') }}" alt="Encabezado Tecnologías">
    </div>

    <p class="subtitulo">
        FORMATO DE BAJA DE CORREO INSTITUCIONAL
    </p>

    <!-- Tabla de datos -->
    <table class="formato-unificado">
        <tr>
            <td class="col-label">Nombre:</td>
            <td><span class="texto-normal">{{ $s->nombre }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Dependencia:</td>
            <td><span class="texto-normal">{{ $s->area ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Correo institucional:</td>
            <td><span class="texto-normal">{{ $s->correo_institucional ?? '-' }}</span></td>
        </tr>
    </table>

    <!-- Motivo de Baja -->
    <div class="motivo-box-container">
        <div class="motivo-titulo">MOTIVO DE BAJA</div>
        <div class="motivo-contenido">
            {{ $s->motivo_baja ?? '' }}
        </div>
    </div>

    <!-- Bloque de Firma y Sello alineados horizontalmente -->
    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma">
                <span class="nombre-firmante">{{ $s->autoriza_nombre ?? '' }}</span>
                <div class="firma-linea-top">
                    Nombre y Firma del Director que<br>Autoriza
                    <span class="nota-obligatorio-rojo">(Obligatorio: Debe ser firmado por<br>personal de nivel 22 o superior)</span>
                </div>
            </td>
            <td class="col-sello">
                <div class="box-sello-centro"></div>
                <span class="sello-label">Sello de la dependencia</span>
            </td>
        </tr>
    </table>

</body>
</html>