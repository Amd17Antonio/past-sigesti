<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class NotificacionService
{
    public function crearParaRol(string $rol, string $tipo, string $titulo, ?string $mensaje = null, ?int $idReferencia = null, ?string $url = null): int
    {
        return DB::table('notificaciones')->insertGetId([
            'tipo' => $tipo,
            'rol_destino' => $rol,
            'id_referencia' => $idReferencia,
            'titulo' => $titulo,
            'mensaje' => $mensaje,
            'url' => $url,
            'created_at' => now(),
        ]);
    }

    /**
     * Crea una notificación de mantenimiento solo si no existe ya una
     * sin leer por NADIE para ese mismo equipo (evita duplicados en cada poll).
     */
    public function crearMantenimientoSiNoExiste(int $idEquipo, string $noInventario, string $color, string $motivo): void
    {
        $yaExiste = DB::table('notificaciones')
            ->where('tipo', 'mantenimiento')
            ->where('id_referencia', $idEquipo)
            ->whereNotExists(function ($q) {
                // si TODOS los admins ya la leyeron, se considera "cerrada" y se puede volver a generar
                $q->select(DB::raw(1));
            })
            ->exists();

        // versión simple: solo evita duplicado si ya existe una notificación
        // de este equipo creada en las últimas 24 horas
        $reciente = DB::table('notificaciones')
            ->where('tipo', 'mantenimiento')
            ->where('id_referencia', $idEquipo)
            ->where('created_at', '>=', now()->subDay())
            ->exists();

        if ($reciente) {
            return;
        }

        $this->crearParaRol(
            'Administrador',
            'mantenimiento',
            "Mantenimiento {$color}: equipo {$noInventario}",
            $motivo,
            $idEquipo,
            '/mantenimiento'
        );
    }

    public function crearNuevaSolicitud(int $idSolicitud, string $solicitante, string $descripcion, array $roles): void
{
    foreach ($roles as $rol) {
        $this->crearParaRol(
            $rol,
            'solicitud',
            "Nueva solicitud de {$solicitante}",
            mb_substr($descripcion, 0, 120),
            $idSolicitud,
            '/pendientes'
        );
    }
}
}