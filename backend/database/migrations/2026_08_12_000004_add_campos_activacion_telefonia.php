<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitudes_telefonia', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitudes_telefonia', 'extension_asignada')) {
                $table->string('extension_asignada', 10)->nullable()->after('fecha_activo');
            }
            if (!Schema::hasColumn('solicitudes_telefonia', 'did_asignado')) {
                $table->string('did_asignado', 20)->nullable()->after('extension_asignada');
            }
            if (!Schema::hasColumn('solicitudes_telefonia', 'tipo_clave')) {
                $table->enum('tipo_clave', ['PIN', 'CN'])->nullable()->after('did_asignado');
            }
            if (!Schema::hasColumn('solicitudes_telefonia', 'clave_asignada')) {
                $table->string('clave_asignada', 50)->nullable()->after('tipo_clave');
            }
        });
    }

    public function down(): void
    {
        Schema::table('solicitudes_telefonia', function (Blueprint $table) {
            foreach (['extension_asignada', 'did_asignado', 'tipo_clave', 'clave_asignada'] as $col) {
                if (Schema::hasColumn('solicitudes_telefonia', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
