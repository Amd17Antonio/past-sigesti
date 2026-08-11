<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosEquipo extends Model
{
    protected $table = 'datos_equipos';
    public $timestamps = false;
    protected $fillable = [
        'id_tipo', 'id_marca', 'id_modelo', 'id_so',
        'no_serie', 'no_inventario', 'mac_ethernet', 'mac_wifi',
        'observacion', 'status', 'usr',
    ];
}