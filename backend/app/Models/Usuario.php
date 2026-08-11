<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'usuarios';
    public $timestamps = false;

    protected $fillable = [
        'usuario', 'clave', 'id_soporte', 'id_area',
        'rol_id', 'ip', 'cel', 'hrs', 'status', 'nombre',
    ];

    protected $hidden = ['clave', 'new_clave', 'pswd'];

    // Laravel busca "password" por defecto; le decimos que use "clave"
    public function getAuthPassword()
    {
        return $this->clave;
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'id_area');
    }

    public function soporte()
    {
        return $this->belongsTo(Soporte::class, 'id_soporte');
    }
}