<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MantenimientoService
{
    // Días antes del vencimiento en que se enciende el amarillo (avisar al propietario)
    private const DIAS_ALERTA_AMARILLA = 15;

    // Meses sugeridos por default si no se especifica próxima fecha al registrar
    private const MESES_SUGERIDOS_DEFAULT = 6;

    public function sugerirProximaFecha(?string $fechaMantenimiento = null): string
    {
        $base = $fechaMantenimiento ? Carbon::parse($fechaMantenimiento) : now();
        return $base->addMonths(self::MESES_SUGERIDOS_DEFAULT)->toDateString();
    }

    public function calcularSemaforo(?string $proximaFecha): array
    {
        if (!$proximaFecha) {
            return [
                'color' => 'rojo',
                'motivo' => 'Sin mantenimiento registrado',
                'dias_restantes' => null,
            ];
        }

        $hoy = Carbon::today();
        $proxima = Carbon::parse($proximaFecha)->startOfDay();
        $diasRestantes = $hoy->diffInDays($proxima, false);

        if ($diasRestantes < 0) {
            return [
                'color' => 'rojo',
                'motivo' => 'Mantenimiento vencido hace ' . abs($diasRestantes) . ' día(s)',
                'dias_restantes' => $diasRestantes,
            ];
        }

        if ($diasRestantes <= self::DIAS_ALERTA_AMARILLA) {
            return [
                'color' => 'amarillo',
                'motivo' => 'Vence en ' . $diasRestantes . ' día(s) — contactar al propietario',
                'dias_restantes' => $diasRestantes,
            ];
        }

        return [
            'color' => 'verde',
            'motivo' => 'Al corriente',
            'dias_restantes' => $diasRestantes,
        ];
    }

    /**
     * Último mantenimiento registrado por equipo (el más reciente por fecha_mantenimiento)
     */
    public function subconsultaUltimoMantenimiento()
    {
        return DB::table('mantenimientos as m1')
            ->select('m1.id_equipo', 'm1.proxima_fecha', 'm1.fecha_mantenimiento', 'm1.tipo')
            ->whereRaw('m1.id = (
                select m2.id from mantenimientos m2
                where m2.id_equipo = m1.id_equipo
                order by m2.fecha_mantenimiento desc, m2.id desc
                limit 1
            )');
    }
}