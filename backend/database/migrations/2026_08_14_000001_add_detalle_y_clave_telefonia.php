<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitudes_telefonia', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitudes_telefonia', 'detalle')) {
                // Guarda los datos específicos que capturó el wizard según el trámite
                // (nuevo_usuario, campos_modificados, categoria_id, nueva_extension, etc.)
                // para poder aplicarlos al usuario real cuando se active el servicio.
                $table->json('detalle')->nullable()->after('observaciones');
            }
        });

        Schema::table('usuarios_telefonia', function (Blueprint $table) {
            if (!Schema::hasColumn('usuarios_telefonia', 'tipo_clave')) {
                $table->enum('tipo_clave', ['PIN', 'CN'])->nullable()->after('categoria_id');
            }
            if (!Schema::hasColumn('usuarios_telefonia', 'clave_actual')) {
                $table->string('clave_actual', 50)->nullable()->after('tipo_clave');
            }
        });
    }

    public function down(): void
    {
        Schema::table('solicitudes_telefonia', function (Blueprint $table) {
            if (Schema::hasColumn('solicitudes_telefonia', 'detalle')) {
                $table->dropColumn('detalle');
            }
        });

        Schema::table('usuarios_telefonia', function (Blueprint $table) {
            foreach (['tipo_clave', 'clave_actual'] as $col) {
                if (Schema::hasColumn('usuarios_telefonia', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
