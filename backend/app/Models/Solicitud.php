<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    protected $table = 'solicitud';
    public $timestamps = false;
    protected $fillable = [
        'solicitante', 'puesto', 'extension', 'id_area', 'descripcion',
        'tipo_documento', 'num_documento', 'prioridad', 'id_situacion',
        'id_soporte', 'observaciones', 'edificio', 'nivel', 'id_poa',
        'ip', 'usr_crea',
    ];
}