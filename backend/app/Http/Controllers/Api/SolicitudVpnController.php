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
                'sv.fecha_generada', 'sv.fecha_autorizada', 'sv.fecha_finalizada',
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
            'puesto.required' => 'El puesto es obligatorio.',
            'telefono.regex' => 'El teléfono debe contener solo dígitos (7 a 15).',
            'link_sistema.required_if' => 'El link del sistema es obligatorio.',
            'link_sistema.url' => 'El link del sistema debe ser una URL válida (https://...).',
            'ip_puerto.required_if' => 'La IP y puerto del servidor son obligatorios.',
            'ip_puerto.regex' => 'Formato inválido. Ejemplo: 192.168.1.100:8080,443',
            'justificacion_uso.min' => 'La justificación debe ser más detallada (mínimo 10 caracteres).',
            'fecha_fin.after_or_equal' => 'La fecha final no puede ser anterior a la fecha inicial.',
        ]);

        $data['estatus'] = 'generada';
        $data['fecha_generada'] = now();
        $data['id_usuario_crea'] = $request->user()->id ?? null;
        $data['usuario_mov'] = $request->user()->usuario ?? null;
        $data['created_at'] = now();
        $data['updated_at'] = now();

        $id = DB::table('solicitud_vpn')->insertGetId($data);

        return response()->json(['id' => $id], 201);
    }

    public function update(Request $request, $id)
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
            'num_ticket' => 'nullable|string|max:50',
            'estatus' => 'required|in:generada,en_proceso,autorizada,rechazada,finalizada',
            'observaciones' => 'nullable|string',
        ], [
            'puesto.required' => 'El puesto es obligatorio.',
            'telefono.regex' => 'El teléfono debe contener solo dígitos (7 a 15).',
            'link_sistema.required_if' => 'El link del sistema es obligatorio.',
            'link_sistema.url' => 'El link del sistema debe ser una URL válida (https://...).',
            'ip_puerto.required_if' => 'La IP y puerto del servidor son obligatorios.',
            'ip_puerto.regex' => 'Formato inválido. Ejemplo: 192.168.1.100:8080,443',
            'justificacion_uso.min' => 'La justificación debe ser más detallada (mínimo 10 caracteres).',
            'fecha_fin.after_or_equal' => 'La fecha final no puede ser anterior a la fecha inicial.',
        ]);

        if ($data['estatus'] === 'autorizada') {
            $data['fecha_autorizada'] = now();
        }
        if ($data['estatus'] === 'finalizada') {
            $data['fecha_finalizada'] = now();
        }

        $existe = DB::table('solicitud_vpn')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $data['usuario_mov'] = $request->user()->usuario ?? null;
        $data['updated_at'] = now();

        DB::table('solicitud_vpn')->where('id', $id)->update($data);

        return response()->json(['message' => 'Actualizado correctamente']);
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