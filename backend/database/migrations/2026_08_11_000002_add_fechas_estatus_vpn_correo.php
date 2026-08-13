<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitud_vpn', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitud_vpn', 'fecha_en_proceso')) {
                $table->datetime('fecha_en_proceso')->nullable()->after('fecha_generada');
            }
            if (!Schema::hasColumn('solicitud_vpn', 'motivo_rechazo')) {
                $table->text('motivo_rechazo')->nullable();
            }
        });

        Schema::table('solicitud_correo', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitud_correo', 'fecha_en_proceso')) {
                $table->datetime('fecha_en_proceso')->nullable()->after('fecha_generada');
            }
            if (!Schema::hasColumn('solicitud_correo', 'motivo_rechazo')) {
                $table->text('motivo_rechazo')->nullable()->after('motivo_baja');
            }
        });
    }

    public function down(): void
    {
        Schema::table('solicitud_vpn', function (Blueprint $table) {
            foreach (['fecha_en_proceso', 'motivo_rechazo'] as $col) {
                if (Schema::hasColumn('solicitud_vpn', $col)) $table->dropColumn($col);
            }
        });
        Schema::table('solicitud_correo', function (Blueprint $table) {
            foreach (['fecha_en_proceso', 'motivo_rechazo'] as $col) {
                if (Schema::hasColumn('solicitud_correo', $col)) $table->dropColumn($col);
            }
        });
    }
};