<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MantenimientoService;
use App\Services\NotificacionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificacionController extends Controller
{
    public function __construct(
        private NotificacionService $service,
        private MantenimientoService $mantenimientoService,
    ) {}

    /**
     * Antes de listar, revisa si hay equipos en alerta que aún no tengan
     * notificación reciente, y las genera. Así no se necesita un cron.
     */
    private function sincronizarAlertasMantenimiento(): void
    {
        $ultimo = $this->mantenimientoService->subconsultaUltimoMantenimiento();

        $equipos = DB::table('datos_equipos as d')
            ->leftJoinSub($ultimo, 'u', 'u.id_equipo', '=', 'd.id')
            ->where('d.status', 1)
            ->select('d.id', 'd.no_inventario', 'u.proxima_fecha')
            ->get();

        foreach ($equipos as $e) {
            $s = $this->mantenimientoService->calcularSemaforo($e->proxima_fecha);
            if ($s['color'] !== 'verde') {
                $this->service->crearMantenimientoSiNoExiste(
                    $e->id,
                    $e->no_inventario ?? "#{$e->id}",
                    $s['color'],
                    $s['motivo']
                );
            }
        }
    }

    public function index(Request $request)
    {
        $this->sincronizarAlertasMantenimiento();

        $user = $request->user();

        $registros = DB::table('notificaciones as n')
            ->leftJoin('notificaciones_leidas as l', function ($q) use ($user) {
                $q->on('l.id_notificacion', '=', 'n.id')
                  ->where('l.id_usuario', '=', $user->id);
            })
            ->where(function ($q) use ($user) {
                $q->where('n.rol_destino', $user->rol->nombre ?? null)
                  ->orWhere('n.id_usuario_destino', $user->id);
            })
            ->select('n.*', DB::raw('l.id_usuario IS NOT NULL as leida'))
            ->orderBy('n.created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json($registros);
    }

    public function contador(Request $request)
    {
        $user = $request->user();

        $total = DB::table('notificaciones as n')
            ->leftJoin('notificaciones_leidas as l', function ($q) use ($user) {
                $q->on('l.id_notificacion', '=', 'n.id')
                  ->where('l.id_usuario', '=', $user->id);
            })
            ->where(function ($q) use ($user) {
                $q->where('n.rol_destino', $user->rol->nombre ?? null)
                  ->orWhere('n.id_usuario_destino', $user->id);
            })
            ->whereNull('l.id_usuario')
            ->count();

        return response()->json(['total' => $total]);
    }

    public function marcarLeida(Request $request, int $id)
    {
        DB::table('notificaciones_leidas')->insertOrIgnore([
            'id_notificacion' => $id,
            'id_usuario' => $request->user()->id,
            'fecha' => now(),
        ]);

        return response()->json(['message' => 'Marcada como leída']);
    }

    public function marcarTodasLeidas(Request $request)
    {
        $user = $request->user();

        $pendientes = DB::table('notificaciones as n')
            ->leftJoin('notificaciones_leidas as l', function ($q) use ($user) {
                $q->on('l.id_notificacion', '=', 'n.id')
                  ->where('l.id_usuario', '=', $user->id);
            })
            ->where(function ($q) use ($user) {
                $q->where('n.rol_destino', $user->rol->nombre ?? null)
                  ->orWhere('n.id_usuario_destino', $user->id);
            })
            ->whereNull('l.id_usuario')
            ->pluck('n.id');

        $rows = $pendientes->map(fn ($id) => [
            'id_notificacion' => $id,
            'id_usuario' => $user->id,
            'fecha' => now(),
        ])->toArray();

        if (!empty($rows)) {
            DB::table('notificaciones_leidas')->insertOrIgnore($rows);
        }

        return response()->json(['message' => 'Todas marcadas como leídas']);
    }
}