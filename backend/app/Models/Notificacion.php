<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    protected $table = 'notificaciones';

    public $timestamps = false;

    protected $fillable = [
        'tipo', 'rol_destino', 'id_usuario_destino',
        'id_referencia', 'titulo', 'mensaje', 'url',
    ];
}