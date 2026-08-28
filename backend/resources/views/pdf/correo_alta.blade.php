<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Solicitud de Correo {{ $s->id }}</title>
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
            padding: 8px 12px; /* Reducido de 10px a 8px (~20% menos altura vertical) */
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

        /* ---------- Firmas de Responsable y Director ---------- */
        table.solicita-autoriza { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 80px; 
            margin-bottom: 25px;
        }

        table.solicita-autoriza tr.fila-nombres td {
            vertical-align: bottom;
            text-align: center;
            padding-bottom: 2px;
        }

        table.solicita-autoriza tr.fila-textos td {
            vertical-align: top;
            text-align: center;
            padding-top: 5px;
        }

        table.solicita-autoriza .col-firma { 
            width: 50%; 
            padding: 0 15px;
        }

        .nombre-firmante {
            font-weight: 400;
            font-size: 15px;
            color: #111111;
            display: block;
        }

        .firma-linea-top { 
            border-top: 1px solid #333; 
            margin: 0 10px; 
            font-size: 14px;
            font-weight: 700;
            color: #333333;
        }

        .nota-obligatorio-rojo {
            font-size: 12px;
            font-weight: 700;
            color: #d9383a;
            margin-top: 4px;
            display: block;
            line-height: 1.25;
        }

        /* ---------- Sello de la Dependencia al Centro ---------- */
        .sello-seccion {
            text-align: center;
            margin-bottom: 25px;
        }

        .box-sello-centro {
            border: 1px solid #555;
            border-radius: 18px; 
            height: 97px; 
            width: 277px; 
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

        /* ---------- Cuadro de Notas con Borde Redondeado y Texto Aumentado ---------- */
        .notas-box {
            border: 1px solid #555;
            border-radius: 12px;
            padding: 15px 20px;
            margin-top: 10px;
            background-color: transparent;
        }

        .notas-titulo {
            font-weight: 700;
            font-size: 13px;
            color: #111111;
            margin-bottom: 10px;
        }

        .nota-item {
            font-size: 13px;
            font-weight: 400;
            line-height: 1.35;
            color: #111111;
            margin-bottom: 2px;
            text-align: justify;
        }

        .nota-item:last-child {
            margin-bottom: 0;
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
        SOLICITUD DE CUENTA DE CORREO ELECTRÓNICO OFICIAL
    </p>

    <!-- Tabla de datos -->
    <table class="formato-unificado">
        <tr>
            <td class="col-label">Nombre:</td>
            <td><span class="texto-normal">{{ $s->nombre }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Puesto:</td>
            <td><span class="texto-normal">{{ $s->puesto ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Dependencia:</td>
            <td><span class="texto-normal">{{ $s->area ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Área Interna:</td>
            <td><span class="texto-normal">{{ $s->area_interna ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Correo Secundario:</td>
            <td><span class="texto-normal">{{ $s->correo_secundario ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Teléfono de contacto:</td>
            <td><span class="texto-normal">{{ $s->telefono_contacto ?? '-' }}</span></td>
        </tr>
    </table>

    <!-- Bloque de Firmas -->
    <table class="solicita-autoriza">
        <tr class="fila-nombres">
            <td class="col-firma">
                <span class="nombre-firmante">{{ $s->nombre }}</span>
            </td>
            <td class="col-firma">
                <span class="nombre-firmante">{{ $s->autoriza_nombre ?? '' }}</span>
            </td>
        </tr>
        <tr class="fila-textos">
            <td class="col-firma">
                <div class="firma-linea-top">
                    Nombre y Firma del<br>Responsable del correo
                </div>
            </td>
            <td class="col-firma">
                <div class="firma-linea-top">
                    Nombre y Firma del Director que<br>Autoriza
                    <span class="nota-obligatorio-rojo">(Obligatorio: Debe de ser firmado por<br>personal de nivel 22 o superior)</span>
                </div>
            </td>
        </tr>
    </table>

    <!-- Sello Centrado Abajo -->
    <div class="sello-seccion">
        <div class="box-sello-centro"></div>
        <span class="sello-label">Sello de la dependencia</span>
    </div>

    <!-- Cuadro de Notas con Texto Aumentado -->
    <div class="notas-box">
        <div class="notas-titulo">NOTAS:</div>
        <div class="nota-item">• Si después de 3 meses la cuenta no es utilizada, será dada de baja automáticamente.</div>
        <div class="nota-item">• La contraseña asignada al momento de la creación del correo tiene una vigencia de 5 días, <br>  después de esos días caducará y tendrá que solicitar el reseteo de la misma.</div>
        <div class="nota-item">• El correo secundario se solicita en caso de necesitar restablecer su contraseña.</div>
    </div>

</body>
</html>