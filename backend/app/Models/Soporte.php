<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Soporte extends Model
{
    protected $table = 'soporte';
    public $timestamps = false;
    protected $fillable = ['nombre', 'extension', 'siglas', 'expediente', 'status'];
}