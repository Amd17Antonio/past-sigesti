<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitud', function (Blueprint $table) {
            $table->boolean('dada_baja')->default(false)->after('status_uie');
            $table->datetime('fecha_baja')->nullable()->after('dada_baja');
            $table->text('motivo_baja')->nullable()->after('fecha_baja');
        });
    }

    public function down(): void
    {
        Schema::table('solicitud', function (Blueprint $table) {
            $table->dropColumn(['dada_baja', 'fecha_baja', 'motivo_baja']);
        });
    }
};