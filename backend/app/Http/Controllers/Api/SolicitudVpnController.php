<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;

class SolicitudVpnController extends Controller
{
    private function baseQuery()
    {
        return DB::table('solicitud_vpn as sv')
            ->leftJoin('areas as a', 'a.id', '=', 'sv.id_area')
            ->select(
                'sv.id', 'sv.nombre_usuario', 'sv.puesto', 'sv.id_area', 'a.area', 'sv.dependencia',
                'sv.correo_institucional', 'sv.telefono', 'sv.extension',
                'sv.tipo_acceso', 'sv.link_sistema', 'sv.ip_puerto',
                'sv.justificacion_uso', 'sv.fecha_inicio', 'sv.fecha_fin',
                'sv.num_ticket', 'sv.estatus', 'sv.observaciones',
                'sv.folio_glpi', 'sv.observacion_glpi', 'sv.motivo_baja',
                'sv.fecha_creado_cgd', 'sv.fecha_atendiendo_dgti', 'sv.fecha_activo', 'sv.fecha_baja',
                'sv.created_at'
            );
    }

    public function index(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $porPagina = (int) $request->get('por_pagina', 10);
        $pagina = max(1, (int) $request->get('pagina', 1));

        $query = $this->baseQuery();

        if ($rol !== 'Administrador') {
            $query->where('sv.id_usuario_crea', $usuario->id);
        }

        if ($request->filled('estatus')) {
            $query->where('sv.estatus', $request->get('estatus'));
        }
        if ($request->filled('tipo_acceso') && $request->get('tipo_acceso') !== 'todos') {
            $query->where('sv.tipo_acceso', $request->get('tipo_acceso'));
        }
        if ($request->filled('nombre_usuario')) {
            $query->where('sv.nombre_usuario', 'like', '%' . $request->get('nombre_usuario') . '%');
        }
        if ($request->filled('area')) {
            $query->where('a.area', 'like', '%' . $request->get('area') . '%');
        }

        $query->orderBy('sv.created_at', 'desc');

        $total = (clone $query)->count();
        $registros = $query->forPage($pagina, $porPagina)->get();

        return response()->json([
            'registros' => $registros, 'total' => $total, 'pagina' => $pagina,
            'por_pagina' => $porPagina, 'total_paginas' => max(1, (int) ceil($total / $porPagina)),
        ]);
    }

    public function show($id)
    {
        $solicitud = $this->baseQuery()->where('sv.id', $id)->first();

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        return response()->json(['solicitud' => $solicitud]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre_usuario' => 'required|string|max:150',
            'puesto' => 'required|string|max:200',
            'id_area' => 'required|integer|exists:areas,id',
            'dependencia' => 'required|string|max:200',
            'correo_institucional' => 'required|email|max:150',
            'telefono' => ['required', 'regex:/^[0-9]{7,15}$/'],
            'extension' => 'required|string|max:10',
            'tipo_acceso' => 'required|in:link,ip_puerto',
            'link_sistema' => 'required_if:tipo_acceso,link|nullable|url|max:255',
            'ip_puerto' => ['required_if:tipo_acceso,ip_puerto', 'nullable', 'regex:/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?(,\d{1,5})*$/'],
            'justificacion_uso' => 'required|string|min:10',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ], [
            'telefono.regex' => 'El teléfono debe contener solo dígitos (7 a 15).',
            'link_sistema.required_if' => 'El link del sistema es obligatorio.',
            'ip_puerto.required_if' => 'La IP y puerto del servidor son obligatorios.',
            'justificacion_uso.min' => 'La justificación debe ser más detallada (mínimo 10 caracteres).',
            'fecha_fin.after_or_equal' => 'La fecha final no puede ser anterior a la fecha inicial.',
        ]);

        $data['estatus'] = 'creado_cgd';
        $data['fecha_creado_cgd'] = now();
        $data['id_usuario_crea'] = $request->user()->id ?? null;
        $data['usuario_mov'] = $request->user()->usuario ?? null;
        $data['created_at'] = now();
        $data['updated_at'] = now();

        $id = DB::table('solicitud_vpn')->insertGetId($data);

        return response()->json(['id' => $id], 201);
    }

    public function update(Request $request, $id)
    {
        $actual = DB::table('solicitud_vpn')->where('id', $id)->first();
        if (!$actual) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        if ($actual->estatus !== 'creado_cgd') {
            return response()->json([
                'message' => 'Esta solicitud ya está en atención de la Dirección General de Tecnologías e Innovación Digital y no puede editarse.',
            ], 422);
        }

        $data = $request->validate([
            'nombre_usuario' => 'required|string|max:150',
            'puesto' => 'required|string|max:200',
            'id_area' => 'required|integer|exists:areas,id',
            'dependencia' => 'required|string|max:200',
            'correo_institucional' => 'required|email|max:150',
            'telefono' => ['required', 'regex:/^[0-9]{7,15}$/'],
            'extension' => 'required|string|max:10',
            'tipo_acceso' => 'required|in:link,ip_puerto',
            'link_sistema' => 'required_if:tipo_acceso,link|nullable|url|max:255',
            'ip_puerto' => ['required_if:tipo_acceso,ip_puerto', 'nullable', 'regex:/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?(,\d{1,5})*$/'],
            'justificacion_uso' => 'required|string|min:10',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'num_ticket' => 'nullable|string|max:50',
        ]);

        $data['usuario_mov'] = $request->user()->usuario ?? null;
        $data['updated_at'] = now();

        DB::table('solicitud_vpn')->where('id', $id)->update($data);

        return response()->json(['message' => 'Actualizado correctamente']);
    }

    public function cambiarEstatus(Request $request, $id)
    {
        $usuario = $request->user();

        $solicitud = DB::table('solicitud_vpn')->where('id', $id)->first();
        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $data = $request->validate([
            'estatus' => 'required|in:creado_cgd,atendiendo_dgti,activo,baja',
            'folio_glpi' => 'nullable|string|max:50',
            'observacion_glpi' => 'nullable|string',
            'motivo_baja' => 'nullable|string',
        ]);

        $nuevo = $data['estatus'];
        $update = ['estatus' => $nuevo, 'usuario_mov' => $usuario->usuario, 'updated_at' => now()];

        if ($nuevo === 'atendiendo_dgti') {
            $request->validate(['folio_glpi' => 'required|string|max:50'], [
                'folio_glpi.required' => 'El folio GLPI es obligatorio para pasar a este estatus.',
            ]);
            $update['folio_glpi'] = $data['folio_glpi'];
            $update['observacion_glpi'] = $data['observacion_glpi'] ?? null;
            $update['fecha_atendiendo_dgti'] = now();
        }

        if ($nuevo === 'activo') {
            if ($solicitud->estatus === 'activo') {
                return response()->json(['message' => 'Esta solicitud ya se encuentra activa.'], 422);
            }
            $yaActivo = DB::table('solicitud_vpn')
                ->where('correo_institucional', $solicitud->correo_institucional)
                ->where('estatus', 'activo')
                ->where('id', '<>', $id)
                ->exists();
            if ($yaActivo) {
                return response()->json([
                    'message' => 'Este usuario ya cuenta con un acceso VPN activo. Da de baja el anterior antes de activar uno nuevo.',
                ], 422);
            }
            $update['fecha_activo'] = now();
        }

        if ($nuevo === 'baja') {
            $request->validate(['motivo_baja' => 'required|string|min:5'], [
                'motivo_baja.required' => 'El motivo de baja es obligatorio.',
            ]);
            $update['motivo_baja'] = $data['motivo_baja'];
            $update['fecha_baja'] = now();
        }

        if ($nuevo === 'creado_cgd' && !$solicitud->fecha_creado_cgd) {
            $update['fecha_creado_cgd'] = now();
        }

        DB::table('solicitud_vpn')->where('id', $id)->update($update);

        return response()->json(['message' => 'Estatus actualizado correctamente']);
    }

    // Elimina la solicitud definitivamente de la base de datos (hard delete)
    public function destroy($id)
    {
        $existe = DB::table('solicitud_vpn')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        DB::table('solicitud_vpn')->where('id', $id)->delete();

        return response()->json(['message' => 'Solicitud eliminada correctamente']);
    }

    // Genera el PDF de la solicitud de VPN
    public function imprimir($id)
    {
        $s = $this->baseQuery()->where('sv.id', $id)->first();

        if (!$s) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $pdf = Pdf::loadView('pdf.vpn_solicitud', ['s' => $s]);

        return $pdf->stream("solicitud_vpn_{$id}.pdf");
    }

    public function pdfUrl($id)
    {
        $existe = DB::table('solicitud_vpn')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $url = URL::temporarySignedRoute(
            'solicitud-vpn.pdf.firmado',
            now()->addMinutes(5),
            ['id' => $id]
        );

        return response()->json(['url' => $url]);
    }

    public function imprimirFirmado($id)
    {
        return $this->imprimir($id);
    }
}