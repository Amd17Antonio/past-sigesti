<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Solicitud VPN {{ $s->id }}</title>
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

        /* ---------- Encabezado (Página 1) ---------- */
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
            margin: 10px 0 14px 0; 
            text-transform: uppercase; 
            line-height: 1.25;
            color: #9d2349;
        }
        .seccion-titulo { 
            font-weight: 700; 
            font-size: 16.5px; 
            margin: 14px 0 6px 0; 
            text-transform: uppercase; 
            color: #9d2349;
            text-align: center;
        }

        /* ---------- Tablas Unificadas Con Borde Horizontal ---------- */
        table.formato-unificado { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0;
            border: 1px solid #555;
            border-radius: 8px; 
            margin-bottom: 10px; 
            background-color: transparent;
        }

        table.formato-unificado td { 
            border-right: none;
            border-left: none;
            border-top: none;
            border-bottom: 1px solid #555; 
            padding: 5px 8px; 
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

        /* Columna de etiquetas en negritas (Gris Oscuro) */
        table.formato-unificado .col-label { 
            font-weight: 700; 
            font-size: 15px; 
            width: 28%; 
            color: #333333; 
        }

        /* Formato especial para alineación de Link e IP */
        .link-ip-container {
            line-height: 1.25;
            padding-top: 2px;
        }
        .link-val {
            display: block;
            font-size: 15px;
        }
        .ip-val {
            display: block; 
            margin-top: 32px; 
            font-size: 15px;
        }

        .tabla-ticket {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .tabla-ticket td {
            font-size: 15px; 
            padding: 0;
            vertical-align: middle;
        }

        .box-redondeado {
            border: 1px solid #555;
            border-radius: 8px;
            padding: 6px 10px;
            background-color: transparent;
            font-size: 15px;
        }

        /* Texto en negritas (Gris Oscuro) */
        .label-negro {
            font-weight: 700;
            font-size: 15px;
            color: #333333;
        }

        .texto-normal {
            font-weight: 400;
            font-size: 15px; 
        }

        /* ---------- Firmas y Sello Redondeado ---------- */
        table.solicita-autoriza { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 55px; 
        }
        table.solicita-autoriza td { 
            border: none; 
            padding: 2px; 
            vertical-align: bottom; 
            text-align: center; 
        }
        table.solicita-autoriza .col-sello-container { 
            width: 30%; 
            text-align: center;
            vertical-align: top;
        }

        /* Cuadro exclusivo del Sello (+25% de alto: 187px) */
        .box-sello {
            border: 1px solid #555;
            border-radius: 12px;
            height: 187px;
            width: 100%;
            background-color: transparent;
        }

        .sello-label {
            font-weight: 700;
            font-size: 15px;
            color: #333333;
            margin-top: 6px;
            display: block;
        }

        table.solicita-autoriza .col-firma { 
            width: 35%; 
        }

        /* Nombres generados sobre las líneas en letra NORMAL */
        .nombre-firmante {
            font-weight: 400;
            font-size: 15px;
            color: #111111;
            display: block;
            margin-bottom: 2px;
        }

        /* Nombre y firma / Vo. Bo. en NEGRITAS */
        .firma-linea { 
            border-top: 1px solid #333; 
            margin: 0 12px; 
            padding-top: 3px; 
            font-size: 15px;
            font-weight: 700;
            color: #333333;
        }

        .vobo-texto {
            font-size: 15px;
            font-weight: 700;
            color: #333333;
            margin-bottom: 24px;
            display: block;
        }

        .page-break { 
            page-break-before: always; 
        }

        /* ---------- Políticas (Página 2) ---------- */
        .politicas-container {
            padding-top: 10px;
        }
        .politicas-titulo {
            text-align: center;
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 12px;
            line-height: 1.25;
            color: #9d2349;
        }
        .politicas-sub {
            font-weight: 700;
            font-size: 15px; 
            color: #333333;
            margin-top: 10px;
            margin-bottom: 0px; /* Reducido para pegarlo a su texto */
        }
        
        /* Clase específica para Introducción */
        .politicas-introduccion {
            text-align: justify;
            font-size: 15.8px;
            line-height: 1.32;
            margin-top: 2px;
            margin-bottom: 6px;
        }

        /* Texto general de políticas a 15.8px */
        .politicas-texto {
            text-align: justify;
            font-size: 15.8px;
            line-height: 1.25;
            margin-top: 2px;
            margin-bottom: 6px;
        }

        /* Texto específico de Alcance a 15px */
        .politicas-texto-alcance {
            text-align: justify;
            font-size: 15.5px;
            line-height: 1.25;
            margin-top: 2px;
            margin-bottom: 6px;
        }

        .politicas-lista {
            margin: 2px 0 0 0;
            padding-left: 18px;
            text-align: justify;
            font-size: 15.8px;
            line-height: 1.25;
        }
        .politicas-lista li {
            margin-bottom: 4px;
        }
    </style>
</head>
<body>

    <!-- Imagen de Fondo Centrada -->
    <div class="bg-container">
        <img src="{{ public_path('images/fondo.png') }}" alt="Fondo">
    </div>

    <!-- Pie de página al filo de la hoja con texto en gris (Ambas Hojas) -->
    <div class="pie-pagina-fixed">
        <div class="pie-texto-gris">
            Centro Administrativo del Poder Ejecutivo y Judicial "General Porfirio Díaz, Soldado de la Patria" Edificio "D"Saúl Martínez Avenida Gerardo Pandal<br>
            Graff #1, Reyes Mantecón, San Bartolo Coyotepec, C.P. 71257, Oaxaca. Teléfono: 01 951 5016900 Ext.23511
        </div>
        <img src="{{ public_path('images/pie.png') }}" alt="Pie de Página">
    </div>

    <!-- ==================== HOJA 1 ==================== -->
    <div class="membrete-header">
        <img src="{{ public_path('images/Tecnologias.png') }}" alt="Encabezado Tecnologías">
    </div>

    <p class="subtitulo" style="color: #9d2349;">
        FORMATO DE SOLICITUD DE CREACIÓN DE CUENTA DE USUARIO<br>DE ACCESO REMOTO (VPN SSL).
    </p>

    <table class="tabla-ticket">
        <tr>
                <td style="width: 5.5cm;">
                <div class="box-redondeado" style="white-space: nowrap; overflow: hidden;">
                    <span class="label-negro">Fecha:</span> <span class="texto-normal">{{ \Carbon\Carbon::parse($s->created_at)->format('d/m/Y') }}</span>
                </div>
            </td>
            <td style="width: 5.5cm;"></td>
            <td>
                <div class="box-redondeado">
                    <span class="label-negro">Núm. De Ticket:</span> <span class="texto-normal">{{ $s->num_ticket ?? '-' }}</span>
                </div>
            </td>
        </tr>
    </table>

    <p class="seccion-titulo">DATOS DEL RESGUARDANTE</p>
    <table class="formato-unificado">
        <tr>
            <td class="col-label">Nombre del Usuario:</td>
            <td colspan="5"><span class="texto-normal">{{ $s->nombre_usuario }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Puesto:</td>
            <td colspan="5"><span class="texto-normal">{{ $s->puesto ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Área de Adscripción:</td>
            <td colspan="5"><span class="texto-normal">{{ $s->area ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Dependencia o Entidad:</td>
            <td colspan="5"><span class="texto-normal">{{ $s->dependencia ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Correo Institucional:</td>
            <td><span class="texto-normal">{{ $s->correo_institucional ?? '-' }}</span></td>
            <td class="label-negro">Teléfono:</td>
            <td><span class="texto-normal">{{ $s->telefono ?? '-' }}</span></td>
            <td class="label-negro">Extensión:</td>
            <td><span class="texto-normal">{{ $s->extension ?? '-' }}</span></td>
        </tr>
    </table>

    <p class="seccion-titulo">INFORMACIÓN DEL ACCESO REMOTO</p>
    <table class="formato-unificado">
        <tr>
            <td class="col-label" style="vertical-align: top;">
                Link del sistema<br>
                <span style="font-weight:normal; font-size:7.5px; color:#555;">(Ej. https://correspondencia.oaxaca.gob.mx/)</span><br>
                o<br>
                IP Y Puerto del servidor:<br>
                <span style="font-weight:normal; font-size:7.5px; color:#555;">(ej. 192.168.1.100:8080,443)</span>
            </td>
            <td style="vertical-align: top;">
                <div class="link-ip-container">
                    <span class="link-val">{{ $s->link_sistema ?? '-' }}</span>
                    <span class="ip-val">{{ $s->ip_puerto ?? '-' }}</span>
                </div>
            </td>
        </tr>
        <tr>
            <td class="col-label" style="height: 40px; vertical-align: top;">Justificación de uso:</td>
            <td style="white-space: pre-line; vertical-align: top;"><span class="texto-normal">{{ $s->justificacion_uso ?? '-' }}</span></td>
        </tr>
        <tr>
            <td class="col-label">Periodo de uso</td>
            <td>
                <span class="label-negro">Fecha inicial:</span> <span class="texto-normal">{{ $s->fecha_inicio ? \Carbon\Carbon::parse($s->fecha_inicio)->format('d/m/Y') : '-' }}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span class="label-negro">Fecha final:</span> <span class="texto-normal">{{ $s->fecha_fin ? \Carbon\Carbon::parse($s->fecha_fin)->format('d/m/Y') : '-' }}</span>
            </td>
        </tr>
    </table>

    <table class="solicita-autoriza">
        <tr>
            <td class="col-firma">
                <span class="nombre-firmante">{{ $s->nombre_usuario }}</span>
                <div class="firma-linea">
                    Nombre y firma del usuario<br>de la VPN
                </div>
            </td>
            <td class="col-firma">
                <span class="nombre-firmante">{{ $s->autoriza_nombre ?? '' }}</span>
                <div class="firma-linea">
                    Nombre y firma del jefe<br>que autoriza*
                </div>
            </td>
            <td class="col-sello-container" rowspan="2">
                <div class="box-sello"></div>
                <span class="sello-label">Sello de la Dependencia</span>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="padding-top: 45px;">
                <span class="vobo-texto">Vo. Bo.</span>
                <span class="nombre-firmante" style="width: 65%; margin: 0 auto;">{{ $enlace->enlace ?? '' }}</span>
                <div class="firma-linea" style="width: 65%; margin: 0 auto;">
                    Nombre y firma del Enlace<br>Informático
                </div>
            </td>
        </tr>
    </table>

    <!-- ==================== HOJA 2 ==================== -->
    <div class="page-break"></div>

    <div class="politicas-container">
        <p class="politicas-titulo">
            POLÍTICAS DE USO DE LA CUENTA DE USUARIO DE<br>ACCESO REMOTO (VPN SSL).
        </p>

        <p class="politicas-sub">INTRODUCCIÓN.</p>
        <p class="politicas-introduccion">
            La política de uso de La Red Privada Virtual (VPN), ofrece a los usuarios que necesitan conexión remota a los Sistemas Internos de la Administración Pública Estatal (APE), una guía sobre las características y requerimientos mínimos que deben ser cumplidos respecto del uso del servicio VPN institucional, así también de las implicaciones del mal uso. Es importante mencionar que el uso inapropiado de los recursos dispuestos para los usuarios, expone a los Sistemas Internos de la Administración Pública Estatal (APE) a riesgos innecesarios como los virus informáticos e inte-<br>rrupción de las redes y sus servicios.
        </p>

        <p class="politicas-sub">ALCANCE.</p>
        <p class="politicas-texto-alcance">
            Las normas mencionadas en el presente documento, cubren el uso apropiado del sistema de VPN, tanto para acceso SSL; dichas normas aplican a todos los funcionarios, empleados y en general cualquier usuario que haga uso de ella. La Agencia de Tecnologías e Innovación Digital (ATID), sólo proveerá la habilitación del usuario dentro del Servidor VPN, cualquier costo que se genere para hacer uso de este servicio, será de exclusiva responsabilidad del usuario, como lo puede ser la contratación de un servicio de Internet.
        </p>

        <p class="politicas-sub">USO RECOMENDABLE DEL SISTEMA VPN.</p>
        <p class="politicas-texto">
            Sólo los usuarios previamente autorizados podrán utilizar los beneficios del acceso remoto VPN, así también, serán los responsables del correcto uso del servicio VPN.
        </p>

        <p class="politicas-sub">ADICIONALMENTE:</p>
        <ol class="politicas-lista">
            <li>Es de responsabilidad del usuario con privilegios VPN, asegurarse que ninguna otra persona<br>utilice su cuenta de acceso, entendiendo que es de uso exclusivo para quienes se les ha asig-<br>nado dichos privilegios.</li>
            <li>El uso del sistema VPN debe ser controlado utilizando una contraseña de autenticación fuerte<br>(Mayúsculas, minúsculas, números y/o signos) manteniéndola siempre en secreto.</li>
            <li>Cuando esté conectado activamente a la VPN, permitirá el tráfico de acuerdo con el perfil del<br>usuario hacia los servicios solicitados, el resto del tráfico pasará por su conexión respectiva.</li>
            <li>Las puertas de enlace VPN serán configuradas y administradas por la ATID.</li>
            <li>El equipo utilizado para realizar la conexión VPN deberá poseer software antivirus actualizado.</li>
            <li>Los usuarios externos ajenos a la ATID, deberán cumplir todas las disposiciones establecidas<br>en las políticas de uso.</li>
            <li>Mediante el uso de la tecnología VPN, los usuarios declaran conocer que sus equipos de cóm-<br>puto, ya sean institucionales o personales son una extensión de las redes institucionales de la<br>APE y como tales, están sujetos a las mismas normas y reglamentos que se aplican a los equi-<br>pos dentro de la Red Institucional de la Administración Pública Estatal.</li>
        </ol>

        <div style="margin-top: 50px; text-align: center;">
            <span class="nombre-firmante" style="width: 45%; margin: 0 auto; font-weight: 400;">{{ $s->nombre_usuario }}</span>
            <div class="firma-linea" style="width: 45%; margin: 0 auto;">
                Nombre y firma del usuario<br>de la VPN
            </div>
        </div>
    </div>

</body>
</html>