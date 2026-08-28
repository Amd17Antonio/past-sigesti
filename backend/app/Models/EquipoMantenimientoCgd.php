<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipoMantenimientoCgd extends Model
{
    protected $table = 'equipo_mantenimiento_cgd';

    protected $guarded = ['id'];

    protected $casts = [
        'eq_valoracion' => 'boolean',
        'eq_respaldo_informacion' => 'boolean',
        'eq_cargador_cables' => 'boolean',
        'eq_reinicio_constante' => 'boolean',
        'eq_activacion_ofimatica' => 'boolean',
        'eq_activacion_so' => 'boolean',
        'eq_error_pantalla_azul' => 'boolean',
        'eq_actualizaciones_so' => 'boolean',
        'eq_no_retiene_carga' => 'boolean',
        'eq_no_funciona_teclado_completo' => 'boolean',
        'eq_no_enciende' => 'boolean',
        'eq_instalacion_software_adicional' => 'boolean',
        'eq_no_inicia_so' => 'boolean',
        'mt_valoracion' => 'boolean',
        'mt_no_funciona' => 'boolean',
        'mt_teclas_incorrectas' => 'boolean',
        'mt_conector_mal_estado' => 'boolean',
        'imp_valoracion' => 'boolean',
        'imp_cable_corriente' => 'boolean',
        'imp_cable_datos' => 'boolean',
        'imp_no_enciende' => 'boolean',
        'imp_atasca_hojas' => 'boolean',
        'imp_no_jala_hojas' => 'boolean',
        'imp_manchado_hojas' => 'boolean',
        'imp_riego_tinta' => 'boolean',
        'imp_no_imprime' => 'boolean',
        'imp_errores_pantalla' => 'boolean',
    ];
}