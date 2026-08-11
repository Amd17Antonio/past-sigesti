<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mantenimiento extends Model
{
    protected $table = 'mantenimientos';

    public $timestamps = false;

    protected $fillable = [
        'id_equipo',
        'fecha_mantenimiento',
        'proxima_fecha',
        'tipo',
        'descripcion',
        'usr',
    ];

    protected $casts = [
        'fecha_mantenimiento' => 'date',
        'proxima_fecha' => 'date',
    ];
}