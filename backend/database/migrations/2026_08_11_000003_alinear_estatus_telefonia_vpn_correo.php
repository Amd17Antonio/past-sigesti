<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['solicitudes_telefonia', 'solicitud_vpn', 'solicitud_correo'] as $tabla) {
            // Limpia columnas de intentos anteriores (5 estados) si existen
            Schema::table($tabla, function (Blueprint $table) use ($tabla) {
                foreach (['fecha_generada', 'fecha_en_proceso', 'fecha_autorizada', 'fecha_finalizada', 'motivo_rechazo'] as $col) {
                    if (Schema::hasColumn($tabla, $col)) {
                        $table->dropColumn($col);
                    }
                }
            });

            // Estatus a solo 4 valores
            DB::statement("ALTER TABLE `$tabla` MODIFY `estatus` ENUM('creado_cgd','atendiendo_dgti','activo','baja') NOT NULL DEFAULT 'creado_cgd'");

            Schema::table($tabla, function (Blueprint $table) use ($tabla) {
                if (!Schema::hasColumn($tabla, 'fecha_creado_cgd')) $table->datetime('fecha_creado_cgd')->nullable()->after('estatus');
                if (!Schema::hasColumn($tabla, 'fecha_atendiendo_dgti')) $table->datetime('fecha_atendiendo_dgti')->nullable()->after('fecha_creado_cgd');
                if (!Schema::hasColumn($tabla, 'folio_glpi')) $table->string('folio_glpi', 50)->nullable()->after('fecha_atendiendo_dgti');
                if (!Schema::hasColumn($tabla, 'observacion_glpi')) $table->text('observacion_glpi')->nullable()->after('folio_glpi');
                if (!Schema::hasColumn($tabla, 'fecha_activo')) $table->datetime('fecha_activo')->nullable()->after('observacion_glpi');
                if (!Schema::hasColumn($tabla, 'fecha_baja')) $table->datetime('fecha_baja')->nullable()->after('fecha_activo');
                if (!Schema::hasColumn($tabla, 'motivo_baja')) $table->text('motivo_baja')->nullable()->after('fecha_baja');
            });
        }
    }

    public function down(): void
    {
        foreach (['solicitudes_telefonia', 'solicitud_vpn', 'solicitud_correo'] as $tabla) {
            Schema::table($tabla, function (Blueprint $table) use ($tabla) {
                foreach (['fecha_creado_cgd', 'fecha_atendiendo_dgti', 'folio_glpi', 'observacion_glpi', 'fecha_activo', 'fecha_baja'] as $col) {
                    if (Schema::hasColumn($tabla, $col)) $table->dropColumn($col);
                }
            });
        }
    }
};