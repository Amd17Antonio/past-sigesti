<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('usuarios_telefonia', function (Blueprint $table) {
            if (!Schema::hasColumn('usuarios_telefonia', 'justificacion_categoria')) {
                $table->text('justificacion_categoria')->nullable()->after('categoria_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('usuarios_telefonia', function (Blueprint $table) {
            if (Schema::hasColumn('usuarios_telefonia', 'justificacion_categoria')) {
                $table->dropColumn('justificacion_categoria');
            }
        });
    }
};
