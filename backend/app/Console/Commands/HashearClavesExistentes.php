<?php

namespace App\Console\Commands;

use App\Models\Usuario;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class HashearClavesExistentes extends Command
{
    protected $signature = 'usuarios:hashear-claves';
    protected $description = 'Cifra con bcrypt las contraseñas de usuarios que aún estén en texto plano';

    public function handle()
    {
        $usuarios = Usuario::all();
        $contador = 0;

        foreach ($usuarios as $usuario) {
            // Si ya está hasheada (bcrypt siempre empieza con $2y$), se salta
            if (str_starts_with($usuario->clave, '$2y$')) {
                continue;
            }

            $claveHasheada = Hash::make($usuario->clave);
            $usuario->clave = $claveHasheada;
            $usuario->new_clave = $claveHasheada;
            $usuario->save();
            $contador++;
        }

        $this->info("Se cifraron {$contador} contraseñas.");
    }
}