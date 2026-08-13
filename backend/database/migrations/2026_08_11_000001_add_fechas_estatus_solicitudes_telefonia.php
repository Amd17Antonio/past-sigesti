<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitudes_telefonia', function (Blueprint $table) {
            $table->datetime('fecha_generada')->nullable()->after('estatus');
            $table->datetime('fecha_en_proceso')->nullable()->after('fecha_generada');
            $table->datetime('fecha_autorizada')->nullable()->after('fecha_en_proceso');
            $table->datetime('fecha_finalizada')->nullable()->after('fecha_autorizada');
            $table->text('motivo_rechazo')->nullable()->after('fecha_finalizada');
        });
    }

    public function down(): void
    {
        Schema::table('solicitudes_telefonia', function (Blueprint $table) {
            $table->dropColumn(['fecha_generada', 'fecha_en_proceso', 'fecha_autorizada', 'fecha_finalizada', 'motivo_rechazo']);
        });
    }
};