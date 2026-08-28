<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Checklist de Mantenimiento de Equipo</title>
    <style>
        @page {
            size: letter;
            margin: 90px 50px 70px 50px;
        }

        body { font-family: sans-serif; font-size: 10px; color: #111; line-height: 1.35; }

        /* ---------- Membrete Superior Fijo ---------- */
        .membrete-fixed {
            position: fixed;
            top: -70px;
            left: 0;
            right: 0;
            padding: 0 10px;
        }
        .membrete-fixed table { width: 100%; border: none; }
        .membrete-fixed td { border: none; vertical-align: middle; padding: 0; }
        .membrete-fixed .logo-cell img { height: 55px; }
        .membrete-fixed .titulo-cell {
            text-align: right;
            font-weight: bold;
            font-size: 13px;
            color: #333;
        }

        /* ---------- Pie de página institucional ---------- */
        .pie-pagina {
            position: fixed;
            left: 0;
            right: 0;
            bottom: -55px;
            width: 100%;
        }
        .pie-pagina table { width: 100%; border-collapse: collapse; }
        .pie-pagina td { border: none; padding: 0; vertical-align: middle; }
        .pie-pagina .logo-cell { width: 1%; white-space: nowrap; padding-right: 6px; }
        .pie-pagina .logo-cell img { height: 60px; width: auto; display: block; }
        .pie-pagina .texto-cell { font-size: 8px; color: #555; line-height: 1.15; }
        .pie-pagina .texto-cell span { display: block; margin-bottom: 1px; }

        /* ---------- Encabezado del documento ---------- */
        .titulo-doc {
            text-align: center;
            font-weight: bold;
            font-size: 13px;
            margin: 0 0 12px 0;
            text-transform: uppercase;
        }

        /* ---------- Datos generales (tabla con bordes) ---------- */
        table.datos-generales { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9.5px; }
        table.datos-generales td { border: 1px solid #000; padding: 4px 6px; }
        table.datos-generales td.label { font-weight: bold; width: 18%; background: #f2f2f2; }
        table.datos-generales td.valor { width: 32%; }

        /* ---------- Encabezados de sección (barra oscura, como el formato impreso) ---------- */
        .seccion-titulo {
            background: #333;
            color: #fff;
            font-weight: bold;
            font-size: 10px;
            padding: 3px 6px;
            margin-top: 10px;
            text-transform: uppercase;
        }
        .seccion-titulo-mini {
            background: #333;
            color: #fff;
            font-weight: bold;
            font-size: 10px;
            padding: 3px 6px;
            text-align: center;
            text-transform: uppercase;
        }

        /* ---------- Checklist SIN bordes de celda, solo el cuadro del checkbox ---------- */
        table.checklist { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
        table.checklist td { border: none; padding: 2px 4px 2px 0; font-size: 9.5px; vertical-align: middle; }
        table.checklist td.check { width: 16px; text-align: center; }
        table.checklist td.item { padding-right: 14px; }

        .chk {
            display: inline-block;
            width: 9px;
            height: 9px;
            border: 1px solid #000;
            text-align: center;
            vertical-align: middle;
            font-size: 8px;
            line-height: 9px;
            font-weight: bold;
        }

        /* ---------- Contenedor de dos secciones lado a lado (Mouse/Teclado + Impresoras) ---------- */
        table.dos-secciones { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.dos-secciones td { border: none; vertical-align: top; padding: 0; }
        table.dos-secciones td.col-izq { width: 48%; padding-right: 4%; }
        table.dos-secciones td.col-der { width: 48%; }

        .observaciones-box {
            border: 1px solid #000;
            padding: 5px 6px;
            font-size: 9.5px;
            min-height: 20px;
            margin-top: 2px;
        }
        .observaciones-box-mini {
            border: 1px solid #000;
            padding: 5px 6px;
            font-size: 9px;
            min-height: 18px;
            margin-top: 2px;
        }
        .observaciones-titulo { font-weight: bold; }

        .firmas { width: 100%; margin-top: 40px; border-collapse: collapse; }
        .firmas td { width: 50%; text-align: center; font-size: 10px; vertical-align: top; padding-top: 30px; border: none; }
        .firmas .linea { border-top: 1px solid #000; width: 80%; margin: 0 auto 4px auto; }

        .tecnico-info { font-size: 8px; margin-top: 20px; color: #444; }
        .tecnico-info p { margin: 0; }
    </style>
</head>
<body>

    {{-- ================= MEMBRETE SUPERIOR ================= --}}
    <div class="membrete-fixed">
        <table>
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('images/Honestidad.png') }}" alt="Secretaría de Honestidad">
                </td>
                
            </tr>
        </table>
    </div>

    {{-- ================= PIE DE PÁGINA INSTITUCIONAL ================= --}}
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
                    <span>www.oaxaca.gob.mx/honestidad</span>
                </td>
            </tr>
        </table>
    </div>

    {{-- ================= CONTENIDO ================= --}}
    <p class="titulo-doc">Checklist de Mantenimiento de Equipo</p>

    {{-- Datos generales --}}
    <table class="datos-generales">
        <tr>
            <td class="label">Área</td>
            <td class="valor">{{ $area }}</td>
            <td class="label">Responsable</td>
            <td class="valor">{{ $checklist->responsable }}</td>
        </tr>
        <tr>
            <td class="label">Tipo de equipo</td>
            <td class="valor">{{ $equipo->tipo_equipo }}</td>
            <td class="label">Marca / Modelo</td>
            <td class="valor">{{ $equipo->marca }} {{ $equipo->modelo }}</td>
        </tr>
        <tr>
            <td class="label">No. Inventario</td>
            <td class="valor">{{ $equipo->no_inventario }}</td>
            <td class="label">No. Extensión</td>
            <td class="valor">{{ $checklist->no_extension }}</td>
        </tr>
        <tr>
            <td class="label">Contraseña</td>
            <td class="valor" colspan="3">{{ $checklist->contrasena }}</td>
        </tr>
    </table>

    @php
        // Etiquetas inferidas a partir del nombre de columna; ajustar texto si es necesario.
        $itemsEquipo = [
            'eq_valoracion' => 'Valoración general',
            'eq_respaldo_informacion' => 'Respaldo de información',
            'eq_cargador_cables' => 'Cargador / cables',
            'eq_reinicio_constante' => 'Reinicio constante',
            'eq_activacion_ofimatica' => 'Activación de paquete ofimático',
            'eq_activacion_so' => 'Activación del sistema operativo',
            'eq_error_pantalla_azul' => 'Error de pantalla azul',
            'eq_actualizaciones_so' => 'Actualizaciones del sistema operativo',
            'eq_no_retiene_carga' => 'No retiene carga (batería)',
            'eq_no_funciona_teclado_completo' => 'No funciona el teclado completo',
            'eq_no_enciende' => 'No enciende',
            'eq_instalacion_software_adicional' => 'Instalación de software adicional',
            'eq_no_inicia_so' => 'No inicia el sistema operativo',
        ];

        $itemsMonitorTeclado = [
            'mt_valoracion' => 'Valoración general',
            'mt_no_funciona' => 'No funciona',
            'mt_teclas_incorrectas' => 'Teclas incorrectas',
            'mt_conector_mal_estado' => 'Conector en mal estado',
        ];

        $itemsImpresora = [
            'imp_valoracion' => 'Valoración general',
            'imp_cable_corriente' => 'Cable de corriente',
            'imp_cable_datos' => 'Cable de datos',
            'imp_no_enciende' => 'No enciende',
            'imp_atasca_hojas' => 'Atasca hojas',
            'imp_no_jala_hojas' => 'No jala hojas',
            'imp_manchado_hojas' => 'Manchado de hojas',
            'imp_riego_tinta' => 'Riego de tinta',
            'imp_no_imprime' => 'No imprime',
            'imp_errores_pantalla' => 'Errores en pantalla',
        ];

        // Partimos "Equipo de Cómputo" en dos columnas para no desperdiciar espacio horizontal
        $mitad = (int) ceil(count($itemsEquipo) / 2);
        $eqCol1 = array_slice($itemsEquipo, 0, $mitad, true);
        $eqCol2 = array_slice($itemsEquipo, $mitad, null, true);
        $eqCol1Campos = array_keys($eqCol1);
        $eqCol1Labels = array_values($eqCol1);
        $eqCol2Campos = array_keys($eqCol2);
        $eqCol2Labels = array_values($eqCol2);
        $filasEquipo = max(count($eqCol1), count($eqCol2));
    @endphp

    {{-- Sección Equipo de Cómputo: dos columnas en la misma fila --}}
    <div class="seccion-titulo">Equipo de Cómputo</div>
    <table class="checklist">
        @for ($i = 0; $i < $filasEquipo; $i++)
            <tr>
                @if (isset($eqCol1Campos[$i]))
                    <td class="check"><span class="chk">{{ $checklist->{$eqCol1Campos[$i]} ? 'X' : '' }}</span></td>
                    <td class="item">{{ $eqCol1Labels[$i] }}</td>
                @else
                    <td class="check"></td>
                    <td class="item"></td>
                @endif
                @if (isset($eqCol2Campos[$i]))
                    <td class="check"><span class="chk">{{ $checklist->{$eqCol2Campos[$i]} ? 'X' : '' }}</span></td>
                    <td class="item">{{ $eqCol2Labels[$i] }}</td>
                @else
                    <td class="check"></td>
                    <td class="item"></td>
                @endif
            </tr>
        @endfor
    </table>
    <div class="observaciones-box">
        <span class="observaciones-titulo">Observaciones:</span> {{ $checklist->eq_observaciones }}
    </div>

    {{-- Sección Mouse/Teclado + Impresoras: una junto a la otra --}}
    <table class="dos-secciones">
        <tr>
            <td class="col-izq"><div class="seccion-titulo-mini">Mouse y Teclado</div></td>
            <td class="col-der"><div class="seccion-titulo-mini">Impresoras</div></td>
        </tr>
        <tr>
            <td class="col-izq">
                <table class="checklist">
                    @foreach($itemsMonitorTeclado as $campo => $label)
                        <tr>
                            <td class="check"><span class="chk">{{ $checklist->$campo ? 'X' : '' }}</span></td>
                            <td class="item">{{ $label }}</td>
                        </tr>
                    @endforeach
                </table>
                <div class="observaciones-box-mini">
                    <span class="observaciones-titulo">Observaciones:</span> {{ $checklist->mt_observaciones }}
                </div>
            </td>
            <td class="col-der">
                <table class="checklist">
                    @foreach($itemsImpresora as $campo => $label)
                        <tr>
                            <td class="check"><span class="chk">{{ $checklist->$campo ? 'X' : '' }}</span></td>
                            <td class="item">{{ $label }}</td>
                        </tr>
                    @endforeach
                </table>
                <div class="observaciones-box-mini">
                    <span class="observaciones-titulo">Observaciones:</span> {{ $checklist->imp_observaciones }}
                </div>
            </td>
        </tr>
    </table>

    {{-- Firmas --}}
    <table class="firmas">
        <tr>
            <td>
                <div class="linea"></div>
                {{ $checklist->entrego_nombre }}<br>
                Entrega
            </td>
            <td>
                <div class="linea"></div>
                {{ $checklist->recibio_nombre }}<br>
                Recibe
            </td>
        </tr>
    </table>

</body>
</html>
