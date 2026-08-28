<?php

use App\Http\Controllers\Api\CatalogoTelefoniaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SolicitudController;
use App\Http\Controllers\Api\CatalogoController;
use App\Http\Controllers\Api\DictamenController;
use App\Http\Controllers\Api\EncuestaController;
use App\Http\Controllers\Api\EquipoController;
use App\Http\Controllers\Api\SolicitudInternetController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MantenimientoController;
use App\Http\Controllers\Api\SolicitudTelefoniaController;
use App\Http\Controllers\Api\NotificacionController;
use App\Http\Controllers\Api\ReporteController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\SolicitudUieController;
use App\Http\Controllers\Api\EquipoBajaController;
use App\Http\Controllers\Api\SolicitudCorreoController;
use App\Http\Controllers\Api\SolicitudVpnController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquipoMantenimientoCgdController;


Route::post('/login', [AuthController::class, 'login']);

// --------------------------------------------------------------
// Rutas firmadas para descarga de PDF sin necesitar el token en
// headers (window.open no manda Authorization). Protegidas por
// firma temporal de 5 minutos generada desde /pdf-url de cada módulo.
// --------------------------------------------------------------
Route::get('/solicitud-vpn/{id}/pdf-firmado', [SolicitudVpnController::class, 'imprimirFirmado'])
    ->name('solicitud-vpn.pdf.firmado')
    ->middleware('signed');

    Route::get('/equipo-mantenimiento-cgd/{id}/pdf-firmado', [EquipoMantenimientoCgdController::class, 'imprimirFirmado'])
    ->name('equipo-mantenimiento-cgd.pdf.firmado')
    ->middleware('signed');

Route::get('/solicitud-correo/{id}/pdf-firmado', [SolicitudCorreoController::class, 'imprimirFirmado'])
    ->name('solicitud-correo.pdf.firmado')
    ->middleware('signed');

Route::get('/solicitud-internet/{id}/pdf-firmado', [SolicitudInternetController::class, 'imprimirFirmado'])
    ->name('solicitud-internet.pdf.firmado')
    ->middleware('signed');

    Route::get('/dictamenes/{id}/pdf-firmado', [DictamenController::class, 'imprimirFirmado'])
    ->name('dictamen.pdf.firmado')
    ->middleware('signed');


Route::get('/solicitud-telefono/{id}/pdf-resguardo', [SolicitudTelefoniaController::class, 'imprimirResguardo']);
Route::get('/solicitud-correo/{id}/oficio-url', [SolicitudCorreoController::class, 'oficioUrl']);
Route::get('/solicitud-correo/{id}/oficio-firmado', [SolicitudCorreoController::class, 'oficioFirmado'])
    ->name('solicitud-correo.oficio.firmado');


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/areas', [AreaController::class, 'index']);

    Route::get('/mantenimientos', [MantenimientoController::class, 'index']);
    Route::get('/mantenimientos/alertas', [MantenimientoController::class, 'alertas']);
    Route::get('/equipos/{id}/mantenimientos', [MantenimientoController::class, 'historial'])->whereNumber('id');
    Route::post('/equipos/{id}/mantenimientos', [MantenimientoController::class, 'store'])->whereNumber('id');
    Route::delete('/mantenimientos/{id}', [MantenimientoController::class, 'destroy'])->whereNumber('id');

    Route::get('/reportes/poa', [ReporteController::class, 'poa']);
    Route::get('/reportes/actividades', [ReporteController::class, 'actividades']);
    Route::get('/reportes/resguardos', [ReporteController::class, 'resguardos']);

    Route::get('/dictamenes', [DictamenController::class, 'index']);
    Route::get('/dictamenes/solicitudes-disponibles', [DictamenController::class, 'solicitudesDisponibles']);
    Route::get('/dictamenes/solicitud/{idSolicitud}/equipos', [DictamenController::class, 'equiposDeSolicitud']);
    Route::get('/dictamenes/siguiente-folio', [DictamenController::class, 'siguienteFolio']);
    Route::post('/dictamenes', [DictamenController::class, 'store']);
    Route::get('/dictamenes/{id}', [DictamenController::class, 'show'])->whereNumber('id');
    Route::put('/dictamenes/{id}', [DictamenController::class, 'update'])->whereNumber('id');

    Route::get('/notificaciones', [NotificacionController::class, 'index']);
    Route::get('/notificaciones/contador', [NotificacionController::class, 'contador']);
    Route::put('/notificaciones/{id}/leida', [NotificacionController::class, 'marcarLeida'])->whereNumber('id');
    Route::put('/notificaciones/marcar-todas', [NotificacionController::class, 'marcarTodasLeidas']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/roles', [UserController::class, 'roles']);
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::post('/usuarios', [UserController::class, 'store']);
    Route::get('/usuarios/{id}', [UserController::class, 'show']);
    Route::put('/usuarios/{id}', [UserController::class, 'update']);
    Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);

    Route::get('/equipos', [EquipoController::class, 'index']);
    Route::get('/equipos/{id}', [EquipoController::class, 'show'])->whereNumber('id');
    Route::post('/equipos', [EquipoController::class, 'store']);
    Route::put('/equipos/{id}', [EquipoController::class, 'update'])->whereNumber('id');
    Route::delete('/equipos/{id}', [EquipoController::class, 'destroy'])->whereNumber('id');
    Route::get('/equipos/buscar/{noInventario}', [EquipoController::class, 'buscar']);
    Route::get('/equipos/verificar-serie/{noSerie}', [EquipoController::class, 'verificarSerie']);

    Route::get('/equipos/{id}/software', [EquipoController::class, 'software'])->whereNumber('id');
    Route::post('/equipos/{id}/software', [EquipoController::class, 'agregarSoftware'])->whereNumber('id');
    Route::delete('/software-equipo/{idRegistro}', [EquipoController::class, 'eliminarSoftware']);

    Route::get('/equipos/{id}/extras', [EquipoController::class, 'extras'])->whereNumber('id');
    Route::put('/equipos/{id}/extras', [EquipoController::class, 'guardarExtras'])->whereNumber('id');

    Route::get('/equipos/{id}/dictamenes', [EquipoController::class, 'dictamenes'])->whereNumber('id');

    Route::get('/solicitudes/poa', [SolicitudController::class, 'poa']);
    Route::get('/solicitudes/{id}/seguimiento', [SolicitudController::class, 'verSeguimiento']);
    Route::post('/solicitudes/{id}/seguimiento', [SolicitudController::class, 'seguimiento']);
    Route::post('/solicitudes/{id}/cerrar', [SolicitudController::class, 'cerrar']);
    Route::get('/solicitudes/pendientes', [SolicitudController::class, 'pendientes']);
    Route::get('/solicitudes/asignadas', [SolicitudController::class, 'asignadas']);
    Route::get('/solicitudes/mis-asignadas', [SolicitudController::class, 'misAsignadas']);
    Route::get('/solicitudes/historial', [SolicitudController::class, 'historial']);
    Route::post('/solicitudes', [SolicitudController::class, 'store']);
    Route::get('/solicitudes/asignables', [SolicitudController::class, 'asignables']);
    Route::post('/solicitudes/{id}/asignar', [SolicitudController::class, 'asignar']);

    Route::get('/dictamenes/{id}/pdf', [DictamenController::class, 'pdf'])->whereNumber('id');
Route::get('/dictamenes/{id}/pdf-url', [DictamenController::class, 'pdfUrl'])->whereNumber('id');
Route::get('/dictamenes/solicitud/{idSolicitud}/ultimo', [DictamenController::class, 'ultimoPorSolicitud'])->whereNumber('idSolicitud');

    Route::get('/catalogos/{slug}', [CatalogoController::class, 'index']);
    Route::post('/catalogos/{slug}', [CatalogoController::class, 'store']);
    Route::put('/catalogos/{slug}/{id}', [CatalogoController::class, 'update']);
    Route::delete('/catalogos/{slug}/{id}', [CatalogoController::class, 'destroy']);
    Route::post('/catalogos/modelos-con-marca', [CatalogoController::class, 'storeModelo']);

    Route::get('/encuesta/preguntas', [EncuestaController::class, 'preguntas']);
    Route::get('/encuesta/{idSolicitud}/estado', [EncuestaController::class, 'yaEvaluada']);
    Route::post('/encuesta', [EncuestaController::class, 'store']);
    Route::get('/encuesta/resumen', [EncuestaController::class, 'resumen']);

    Route::get('/telefonia/categorias', [SolicitudTelefoniaController::class, 'categorias']);
    Route::get('/telefonia/usuarios/buscar/{extension}', [SolicitudTelefoniaController::class, 'buscarUsuarioPorExtension']);
    Route::post('/telefonia/usuarios', [SolicitudTelefoniaController::class, 'storeUsuario']);
    Route::get('/telefonia/tipos-clave', [SolicitudTelefoniaController::class, 'tiposClave']);

    Route::get('/solicitud-telefono', [SolicitudTelefoniaController::class, 'index']);
    Route::post('/solicitud-telefono', [SolicitudTelefoniaController::class, 'store']);
    Route::put('/solicitud-telefono/{id}', [SolicitudTelefoniaController::class, 'update']);
    Route::delete('/solicitud-telefono/{id}', [SolicitudTelefoniaController::class, 'destroy']);
    Route::get('/solicitud-telefono/{id}', [SolicitudTelefoniaController::class, 'show']);
Route::patch('/solicitud-telefono/{id}/estatus', [SolicitudTelefoniaController::class, 'cambiarEstatus']);
Route::get('/solicitud-telefono/{id}/pdf', [SolicitudTelefoniaController::class, 'imprimir']);
Route::patch('/solicitud-telefono/{id}/asignacion', [SolicitudTelefoniaController::class, 'actualizarAsignacion']);
// ... arriba de las rutas con {id} de cada módulo:
Route::get('/solicitud-telefono/exportar/resguardo', [SolicitudTelefoniaController::class, 'exportarResguardo']);

Route::get('/equipo-mantenimiento-cgd/{idEquipoSolicitud}', [EquipoMantenimientoCgdController::class, 'show'])->whereNumber('idEquipoSolicitud');
Route::post('/equipo-mantenimiento-cgd', [EquipoMantenimientoCgdController::class, 'store']);
Route::get('/equipo-mantenimiento-cgd/{idEquipoSolicitud}/pdf-url', [EquipoMantenimientoCgdController::class, 'pdfUrl'])->whereNumber('idEquipoSolicitud');

    Route::get('/catalogo-telefonos', [CatalogoTelefoniaController::class, 'index']);
    Route::put('/catalogo-telefonos/{id}', [CatalogoTelefoniaController::class, 'update']);
    Route::delete('/catalogo-telefonos/{id}', [CatalogoTelefoniaController::class, 'destroy']);

    Route::get('/catalogos-telefonos', [CatalogoController::class, 'telefonos']);
    Route::put('/catalogos-telefonos/{id}', [CatalogoController::class, 'updateTelefono']);
    Route::delete('/catalogos-telefonos/{id}', [CatalogoController::class, 'destroyTelefono']);

    Route::get('/solicitud-internet', [SolicitudInternetController::class, 'index']);
    Route::post('/solicitud-internet', [SolicitudInternetController::class, 'store']);
    Route::put('/solicitud-internet/{id}', [SolicitudInternetController::class, 'update']);
    Route::delete('/solicitud-internet/{id}', [SolicitudInternetController::class, 'destroy']);
    Route::get('/solicitud-internet/{id}/pdf', [SolicitudInternetController::class, 'pdf']);
    Route::get('/solicitud-internet/{id}/pdf-url', [SolicitudInternetController::class, 'pdfUrl']);
    Route::get('/solicitud-internet/{id}', [SolicitudInternetController::class, 'show']);
Route::patch('/solicitud-internet/{id}/estatus', [SolicitudInternetController::class, 'cambiarEstatus']);

    Route::get('/solicitud-correo', [SolicitudCorreoController::class, 'index']);
    Route::get('/solicitud-correo/{id}', [SolicitudCorreoController::class, 'show']);
    Route::post('/solicitud-correo', [SolicitudCorreoController::class, 'store']);
    Route::put('/solicitud-correo/{id}', [SolicitudCorreoController::class, 'update']);
    Route::delete('/solicitud-correo/{id}', [SolicitudCorreoController::class, 'destroy']);
    Route::get('/solicitud-correo/{id}/pdf', [SolicitudCorreoController::class, 'imprimir']);
    Route::get('/solicitud-correo/{id}/pdf-url', [SolicitudCorreoController::class, 'pdfUrl']);
   // Route::get('/solicitud-correo/{id}', [SolicitudCorreoController::class, 'showDetalle']);
Route::patch('/solicitud-correo/{id}/estatus', [SolicitudCorreoController::class, 'cambiarEstatus']);
Route::patch('/solicitud-correo/{id}/asignacion', [SolicitudCorreoController::class, 'actualizarAsignacion']);

Route::get('/solicitud-correo/exportar/resguardo', [SolicitudCorreoController::class, 'exportarResguardo']);

    Route::get('/solicitud-vpn', [SolicitudVpnController::class, 'index']);
    Route::get('/solicitud-vpn/{id}', [SolicitudVpnController::class, 'show']);
    Route::post('/solicitud-vpn', [SolicitudVpnController::class, 'store']);
    Route::put('/solicitud-vpn/{id}', [SolicitudVpnController::class, 'update']);
    Route::delete('/solicitud-vpn/{id}', [SolicitudVpnController::class, 'destroy']);
    Route::get('/solicitud-vpn/{id}/pdf', [SolicitudVpnController::class, 'imprimir']);
    Route::get('/solicitud-vpn/{id}/pdf-url', [SolicitudVpnController::class, 'pdfUrl']);
    //Route::get('/solicitud-vpn/{id}', [SolicitudVpnController::class, 'show']);
Route::patch('/solicitud-vpn/{id}/estatus', [SolicitudVpnController::class, 'cambiarEstatus']);
Route::patch('/solicitud-vpn/{id}/asignacion', [SolicitudVpnController::class, 'actualizarAsignacion']);
Route::get('/solicitud-vpn/exportar/resguardo', [SolicitudVpnController::class, 'exportarResguardo']);

    Route::get('/equipos-baja', [EquipoBajaController::class, 'index']);
    Route::get('/equipos-baja/exportar', [EquipoBajaController::class, 'exportar']);

    Route::get('/dashboard/tickets', [DashboardController::class, 'tickets']);
Route::get('/dashboard/dictamenes', [DashboardController::class, 'dictamenes']);
Route::get('/dashboard/actividades', [DashboardController::class, 'actividadesMesAnterior']);

    Route::prefix('solicitudes-uie')->group(function () {
        Route::get('/', [SolicitudUieController::class, 'index']);
        Route::get('/{id}', [SolicitudUieController::class, 'show']);
        Route::get('/{id}/archivos', [SolicitudUieController::class, 'archivos']);
        Route::post('/{id}/equipo', [SolicitudUieController::class, 'agregarEquipo']);
        Route::post('/{id}/autorizar-dictamen', [SolicitudUieController::class, 'autorizarDictamen']);
        Route::post('/{id}/cerrar-dictamen', [SolicitudUieController::class, 'cerrarDictamen']);
        Route::post('/{id}/desautorizar-dictamen', [SolicitudUieController::class, 'desautorizarDictamen']);
        Route::post('/{id}/duplicar', [SolicitudUieController::class, 'duplicar']);
        Route::put('/{id}', [SolicitudUieController::class, 'update']);
        Route::post('/{id}/baja', [SolicitudUieController::class, 'baja']);
    });
});