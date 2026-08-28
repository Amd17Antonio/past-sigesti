<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Oficio de correo institucional {{ $s->id }}</title>
    <style>

        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        
        @page { 
            size: letter; 
            margin: 140px 120px 90px 100px; 
        }
        
        body { font-family: sans-serif; font-size: 14px; line-height: 1.35; color: #111; }

        /* ---------- Membrete Superior ---------- */
        .membrete-superior {
            position: fixed;
            top: -95px;
            left: 0;
            right: 0;
            height: 75px;
            text-align: left;
        }
        .membrete-superior img {
            height: 45px; 
            width: auto;
        }
        .leyenda-anual {
            text-align: center;
            font-size: 12.5px; 
            font-weight: normal; 
            font-style: italic; 
            color: #777; 
            margin-top: 4px;
            letter-spacing: 0.2px;
        }

        /* ---------- Franja lateral decorativa ---------- */
        .franja-lateral {
            position: fixed;
            top: -140px;
            right: -94px; 
            width: 128px;
            height: 1090px;
            z-index: -1;
        }
        .franja-lateral img { width: 80%; height: 100%; }

        /* ---------- Pie de Página ---------- */
        .pie-pagina {
            position: fixed;
            bottom: 5px;
            left: 0;
            right: 0;
            height: 60px;
            border: none !important;
            border-top: none !important;
            padding-top: 0;
        }
        .pie-pagina table { 
            width: 100%; 
            border-collapse: collapse; 
            border: none !important;
        }
        .pie-pagina td { border: none !important; padding: 0; vertical-align: middle; }
        
        .pie-pagina .logo-cell { 
            width: 1%; 
            white-space: nowrap; 
            text-align: left; 
            padding-right: 6px; 
        }
        .pie-pagina .logo-cell img { 
            height: 75px; 
            width: auto; 
            display: block; 
        }
        
        .pie-pagina .texto-cell { 
            width: auto; 
            font-size: 11px; 
            color: #444; 
            line-height: 1.15; 
            padding-left: 0; 
        }
        .pie-pagina .texto-cell span { display: block; margin-bottom: 2px; }

        /* ---------- Contenido del Encabezado (0px de separación) ---------- */
        .bloque-encabezado {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        .bloque-encabezado p {
            margin: 0; /* 0px de separación entre renglones */
        }
        .fecha { text-align: left; font-weight: normal; }
        .oficio-num { }
        .asunto { }

        .destinatario { margin-bottom: 15px; }
        .destinatario .nombre { font-weight: bold; }
        .destinatario .cargo { font-weight: normal; }
        .destinatario .presente { font-weight: bold; }

        .cuerpo { text-align: justify; margin-bottom: 6px; }
        .cuerpo p { margin: 0 0 8px 0; text-indent: 48px; } /* Doble sangría (48px) */

        /* Párrafo de despedida con la misma sangría que el cuerpo */
        .despedida { 
            text-align: justify; 
            margin: 0 0 10px 0; 
            text-indent: 48px; 
        }

        /* ---------- Tabla sin color de fondo (margen inferior reducido un 50%) ---------- */
        table.alta { width: 100%; border-collapse: collapse; margin: 10px 0 7px 0; }
        table.alta th, table.alta td { border: 1px solid #333; padding: 4px 5px; font-size: 11px; text-align: center; vertical-align: middle; }
        table.alta th { background-color: transparent; font-weight: bold; }
        table.alta .cabecera-tipo { background-color: transparent; font-weight: bold; text-transform: uppercase; }

        table.firmas { width: 100%; border-collapse: collapse; margin-top: 25px; page-break-inside: avoid; }
        table.firmas td { border: none; text-align: center; vertical-align: top; padding: 0 10px; }
        .firma-titulo { font-weight: bold; margin-bottom: 35px; } 
        .firma-linea { border-top: 1px solid #333; margin: 0 10px; padding-top: 4px; font-weight: bold; }
        .firma-cargo { font-size: 14px; margin-top: 2px; font-weight: bold; } /* Tamaño 14px igual que el nombre y en negrita */

        /* ---------- Secciones finales a 8px con 0px de separación interna ---------- */
        .ccp { margin-top: 20px; font-size: 8px; color: #333; line-height: 1.25; page-break-inside: avoid; margin-bottom: 0px; }
        .iniciales { margin-top: 0px; font-size: 8px; font-weight: normal; color: #555; }
    </style>
</head>
<body>

    <!-- Membrete Superior -->
    <div class="membrete-superior">
        <img src="{{ public_path('images/Honestidad.png') }}" alt="Secretaría de Honestidad">
        <div class="leyenda-anual">2026, Año del Bicentenario del Natalicio de Margarita Maza Parada, <br> ejemplo de dignidad, lealtad y servicio a la nación</div>
    </div>

    <!-- Franja Lateral Decorativa -->
    <div class="franja-lateral">
        <img src="{{ public_path('images/Lateral.png') }}" alt="">
    </div>

    <!-- Pie de Página -->
    <div class="pie-pagina">
        <table>
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('images/utc.png') }}" alt="UTC">
                </td>
                <td class="texto-cell">
                    <span>Ciudad Administrativa Edificio 4 "Rodolfo Morales", Nivel 3</span>
                    <span>Carretera Internacional Oaxaca-Istmo, km. 11.5</span>
                    <span>Tlalixtac de Cabrera, Oaxaca C.P. 68270</span>
                    <span>Tel. 951 501 50 00, Ext. 11924</span>
                    <span>romualdo.guzman@oaxaca.gob.mx</span>
                    <span><strong>www.oaxaca.gob.mx/honestidad</strong></span>
                </td>
            </tr>
        </table>
    </div>

    <!-- Bloque de Encabezado (Con 0px de separación) -->
    <div class="bloque-encabezado">
        <p class="fecha">Tlalixtac de Cabrera, Oaxaca, {{ \Carbon\Carbon::parse($s->created_at)->locale('es')->translatedFormat('d \d\e F \d\e Y') }}</p>
        <p class="oficio-num">Oficio N°: <strong>{{ $s->oficio_cgd ?? 'SHTFP/CGD/___/2026' }}</strong></p>
        <p class="asunto">Asunto: <strong>{{ $s->tipo_solicitud === 'baja' ? 'Solicitud de baja de correo institucional y entrega de formato.' : 'Solicitud de creación de correo institucional y entrega de formato.' }}</strong></p>
    </div>

    <br>

    <div class="destinatario">
        <div class="nombre">M.T.I. Moisés Juárez Rodríguez</div>
        <div class="cargo">Director General de la Agencia de Tecnologías e Innovación Digital.</div>
        <div class="presente">PRESENTE</div>
    </div>

    <br>

    <div class="cuerpo">
        @if($s->tipo_solicitud === 'baja')
            <p>Por este conducto me permito solicitar la <strong>baja de 1 cuenta de correo institucional</strong>, correspondiente a la dependencia {{ $s->area ?? '-' }}.</p>
            <p>Se anexa el <strong>formato de baja de correo institucional</strong> debidamente requisitado para su incorporación al expediente correspondiente, con el propósito de dar cumplimiento a los lineamientos establecidos para la baja de cuentas institucionales.</p>
        @else
            <p>Por este conducto me permito solicitar la <strong>creación de 1 cuenta de correo institucional</strong>, para el <strong>{{ $s->area ?? 'la dependencia correspondiente' }}</strong>.</p>
            <p>Se anexa el <strong>formato de solicitud de cuenta de correo electrónico oficial</strong> debidamente requisitado para su incorporación al expediente de la Secretaría de Honestidad, Transparencia y Función Pública; con el propósito de dar cumplimiento a los lineamientos establecidos para la creación y uso de cuentas institucionales.</p>
        @endif
    </div>

    <table class="alta">
        <tr>
            <th colspan="{{ $s->tipo_solicitud === 'baja' ? 3 : 6 }}" class="cabecera-tipo">
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

    <br>

    <!-- Despedida con sangría idéntica a los párrafos del cuerpo -->
    <p class="despedida">Sin más por el momento, reciba un cordial saludo.</p>

    <table class="firmas">
        <tr>
            <td style="width:50%;">
                <div class="firma-titulo">Atentamente</div> <br> <br>
                <div class="firma-linea">{{ $enlace->enlace ?? 'L.I. Romualdo Alejandro Guzmán García' }}</div>
                <div class="firma-cargo">Coordinador de Gestión Digital y Enlace Informático</div>
            </td>
            <td style="width:50%;">
                <div class="firma-titulo">Vo. Bo.</div> <br> <br>
                <div class="firma-linea">{{ $s->autoriza_nombre ?? '' }}</div>
                <div class="firma-cargo">{{ $s->autoriza_cargo ?? 'Titular de la dependencia solicitante' }}</div>
            </td>
        </tr>
    </table>

    <br>

    <!-- Bloques finales a 0px de separación entre ellos -->
    <div class="ccp">
        Lic. Leticia Elsa Reyes López. – Titular de la Secretaría de Honestidad, Transparencia y Función Pública. - Para su conocimiento.<br>
        Ccp. Archivo
    </div>
    
    <div class="iniciales">
        RAGG/ghoa
    </div>

</body>
</html>