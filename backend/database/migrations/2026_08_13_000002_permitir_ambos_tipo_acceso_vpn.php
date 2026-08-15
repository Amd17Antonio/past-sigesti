<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE `solicitud_vpn` MODIFY `tipo_acceso` ENUM('link','ip_puerto','ambos') NOT NULL DEFAULT 'ambos'");
    }

    public function down(): void
    {
        // No se revierten registros existentes con 'ambos'; solo se restringe el enum para nuevas inserciones.
        DB::statement("ALTER TABLE `solicitud_vpn` MODIFY `tipo_acceso` ENUM('link','ip_puerto') NOT NULL DEFAULT 'link'");
    }
};
