<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class TelefoniaResguardoExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithTitle, WithStyles
{
    private const FUENTE = 'Montserrat';

    public function __construct(private ?string $del, private ?string $al) {}

    public function collection(): Collection
    {
        $query = DB::table('solicitudes_telefonia as st')
            ->leftJoin('usuarios_telefonia as ut', 'ut.id', '=', 'st.usuario_id')
            ->leftJoin('areas as a', 'a.id', '=', 'ut.area_id')
            ->leftJoin('cat_categoria_telefonia as cat', 'cat.id', '=', 'ut.categoria_id')
            ->select(
                'st.id',
                DB::raw("CONCAT(ut.nombre,' ',IFNULL(ut.apellido_paterno,''),' ',IFNULL(ut.apellido_materno,'')) as nombre"),
                'ut.puesto',
                'a.area',
                'st.extension_asignada',
                'st.did_asignado',
                'ut.correo_institucional',
                'cat.categoria',
                'st.fecha_activo'
            )
            ->where('st.estatus', 'activo')
            ->whereNotNull('st.fecha_activo');

        if ($this->del) {
            $query->where('st.fecha_activo', '>=', $this->del . ' 00:00:00');
        }
        if ($this->al) {
            $query->where('st.fecha_activo', '<=', $this->al . ' 23:59:59');
        }

        return $query->orderBy('st.fecha_activo', 'desc')->get();
    }

    public function headings(): array
    {
        return ['ID', 'Nombre', 'Puesto', 'Área', 'Extensión', 'DID', 'Correo institucional', 'Categoría', 'Fecha de activación'];
    }

    public function map($row): array
    {
        return [
            $row->id,
            mb_strtoupper(trim($row->nombre ?? '')),
            $row->puesto,
            $row->area,
            $row->extension_asignada,
            $row->did_asignado,
            $row->correo_institucional,
            $row->categoria,
            $row->fecha_activo ? date('d/m/Y', strtotime($row->fecha_activo)) : '',
        ];
    }

    public function title(): string
    {
        return 'Resguardo Telefonia';
    }

    public function styles(Worksheet $sheet): array
    {
        $ultimaColumna = $sheet->getHighestColumn();
        $ultimaFila = $sheet->getHighestRow();

        // Fuente base Montserrat para toda la hoja.
        $sheet->getParent()->getDefaultStyle()->getFont()->setName(self::FUENTE)->setSize(12);
        $sheet->getStyle("A1:{$ultimaColumna}{$ultimaFila}")->getFont()->setName(self::FUENTE)->setSize(12);

        // Encabezado: fondo azul, texto blanco, negrita, tamaño 14, centrado.
        $sheet->getStyle("A1:{$ultimaColumna}1")->applyFromArray([
            'font' => ['name' => self::FUENTE, 'bold' => true, 'size' => 14, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2563EB'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '1E40AF']],
            ],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(26);

        // Cuerpo de la tabla: fuente 12, bordes finos y alineación vertical centrada.
        if ($ultimaFila > 1) {
            $sheet->getStyle("A2:{$ultimaColumna}{$ultimaFila}")->applyFromArray([
                'font' => ['name' => self::FUENTE, 'size' => 12],
                'borders' => [
                    'allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'D1D5DB']],
                ],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
            ]);

            // Franjas alternas (zebra) para facilitar la lectura.
            for ($fila = 2; $fila <= $ultimaFila; $fila++) {
                if ($fila % 2 === 0) {
                    $sheet->getStyle("A{$fila}:{$ultimaColumna}{$fila}")->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => 'F3F4F6'],
                        ],
                    ]);
                }
            }
        }

        // Congela el encabezado para que quede visible al hacer scroll.
        $sheet->freezePane('A2');

        return [];
    }
}