<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;

class SolicitudCorreoController extends Controller
{
    private function baseQuery()
    {
        return DB::table('solicitud_correo as sc')
            ->leftJoin('areas as a', 'a.id', '=', 'sc.id_area')
            ->select(
                'sc.id', 'sc.tipo_solicitud', 'sc.nombre', 'sc.puesto',
                'sc.id_area', 'a.area', 'sc.area_interna', 'sc.correo_secundario', 'sc.telefono_contacto',
                'sc.correo_institucional', 'sc.usuario_generado', 'sc.motivo_baja',
                'sc.estatus', 'sc.oficio_cgd', 'sc.observaciones',
                'sc.fecha_generada', 'sc.fecha_autorizada', 'sc.fecha_finalizada',
                'sc.created_at'
            );
    }

    public function index(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $porPagina = (int) $request->get('por_pagina', 10);
        $pagina = max(1, (int) $request->get('pagina', 1));

        $query = $this->baseQuery();

        // Administrador ve todo; cualquier otro rol solo ve lo que él mismo creó
        if ($rol !== 'Administrador') {
            $query->where('sc.id_usuario_crea', $usuario->id);
        }

        if ($request->filled('tipo_solicitud')) {
            $query->where('sc.tipo_solicitud', $request->get('tipo_solicitud'));
        }
        if ($request->filled('estatus')) {
            $query->where('sc.estatus', $request->get('estatus'));
        }
        if ($request->filled('nombre')) {
            $query->where('sc.nombre', 'like', '%' . $request->get('nombre') . '%');
        }
        if ($request->filled('area')) {
            $query->where('a.area', 'like', '%' . $request->get('area') . '%');
        }
        if ($request->filled('correo_institucional')) {
            $query->where('sc.correo_institucional', 'like', '%' . $request->get('correo_institucional') . '%');
        }

        $query->orderBy('sc.created_at', 'desc');

        $total = (clone $query)->count();
        $registros = $query->forPage($pagina, $porPagina)->get();

        return response()->json([
            'registros' => $registros, 'total' => $total, 'pagina' => $pagina,
            'por_pagina' => $porPagina, 'total_paginas' => max(1, (int) ceil($total / $porPagina)),
        ]);
    }

    public function show($id)
    {
        $solicitud = $this->baseQuery()->where('sc.id', $id)->first();

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        return response()->json(['solicitud' => $solicitud]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo_solicitud' => 'required|in:alta,baja',
            'nombre' => 'required|string|max:150',
            'puesto' => 'required_if:tipo_solicitud,alta|nullable|string|max:200',
            'id_area' => 'required|integer|exists:areas,id',
            'area_interna' => 'required_if:tipo_solicitud,alta|nullable|string|max:200',
            'correo_secundario' => ['required_if:tipo_solicitud,alta', 'nullable', 'email', 'max:150'],
            'telefono_contacto' => ['required_if:tipo_solicitud,alta', 'nullable', 'regex:/^[0-9]{7,15}$/'],
            'correo_institucional' => ['required_if:tipo_solicitud,baja', 'nullable', 'email', 'max:150'],
            'motivo_baja' => 'required_if:tipo_solicitud,baja|nullable|string|min:10',
        ], [
            'id_area.required' => 'La dependencia/área es obligatoria.',
            'puesto.required_if' => 'El puesto es obligatorio.',
            'area_interna.required_if' => 'El área interna es obligatoria.',
            'correo_secundario.required_if' => 'El correo secundario es obligatorio.',
            'correo_secundario.email' => 'El correo secundario no tiene un formato válido.',
            'telefono_contacto.required_if' => 'El teléfono de contacto es obligatorio.',
            'telefono_contacto.regex' => 'El teléfono debe contener solo dígitos (7 a 15).',
            'correo_institucional.required_if' => 'El correo institucional a dar de baja es obligatorio.',
            'correo_institucional.email' => 'El correo institucional no tiene un formato válido.',
            'motivo_baja.required_if' => 'El motivo de baja es obligatorio.',
            'motivo_baja.min' => 'El motivo de baja debe ser más detallado (mínimo 10 caracteres).',
        ]);

        $data['estatus'] = 'generada';
        $data['fecha_generada'] = now();
        $data['id_usuario_crea'] = $request->user()->id ?? null;
        $data['usuario_mov'] = $request->user()->usuario ?? null;
        $data['created_at'] = now();
        $data['updated_at'] = now();

        $id = DB::table('solicitud_correo')->insertGetId($data);

        return response()->json(['id' => $id], 201);
    }

    public function update(Request $request, $id)
    {
        $existe = DB::table('solicitud_correo')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $data = $request->validate([
            'tipo_solicitud' => 'required|in:alta,baja',
            'nombre' => 'required|string|max:150',
            'puesto' => 'required_if:tipo_solicitud,alta|nullable|string|max:200',
            'id_area' => 'required|integer|exists:areas,id',
            'area_interna' => 'required_if:tipo_solicitud,alta|nullable|string|max:200',
            'correo_secundario' => ['required_if:tipo_solicitud,alta', 'nullable', 'email', 'max:150'],
            'telefono_contacto' => ['required_if:tipo_solicitud,alta', 'nullable', 'regex:/^[0-9]{7,15}$/'],
            'correo_institucional' => ['required_if:tipo_solicitud,baja', 'nullable', 'email', 'max:150'],
            'usuario_generado' => 'nullable|string|max:150',
            'motivo_baja' => 'required_if:tipo_solicitud,baja|nullable|string|min:10',
            'estatus' => 'sometimes|in:generada,en_proceso,autorizada,rechazada,finalizada',
            'oficio_cgd' => 'nullable|string|max:75',
            'observaciones' => 'nullable|string',
        ], [
            'id_area.required' => 'La dependencia/área es obligatoria.',
            'puesto.required_if' => 'El puesto es obligatorio.',
            'area_interna.required_if' => 'El área interna es obligatoria.',
            'correo_secundario.required_if' => 'El correo secundario es obligatorio.',
            'correo_secundario.email' => 'El correo secundario no tiene un formato válido.',
            'telefono_contacto.required_if' => 'El teléfono de contacto es obligatorio.',
            'telefono_contacto.regex' => 'El teléfono debe contener solo dígitos (7 a 15).',
            'correo_institucional.required_if' => 'El correo institucional a dar de baja es obligatorio.',
            'correo_institucional.email' => 'El correo institucional no tiene un formato válido.',
            'motivo_baja.required_if' => 'El motivo de baja es obligatorio.',
            'motivo_baja.min' => 'El motivo de baja debe ser más detallado (mínimo 10 caracteres).',
        ]);

        if (($data['estatus'] ?? null) === 'autorizada') {
            $data['fecha_autorizada'] = now();
        }
        if (($data['estatus'] ?? null) === 'finalizada') {
            $data['fecha_finalizada'] = now();
        }

        $data['usuario_mov'] = $request->user()->usuario ?? null;
        $data['updated_at'] = now();

        DB::table('solicitud_correo')->where('id', $id)->update($data);

        return response()->json(['message' => 'Actualizado correctamente']);
    }

    // Elimina la solicitud definitivamente de la base de datos (hard delete)
    public function destroy($id)
    {
        $existe = DB::table('solicitud_correo')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        DB::table('solicitud_correo')->where('id', $id)->delete();

        return response()->json(['message' => 'Solicitud eliminada correctamente']);
    }

    // Genera el PDF de la solicitud: usa la plantilla de alta o de baja según tipo_solicitud
    public function imprimir($id)
    {
        $s = $this->baseQuery()->where('sc.id', $id)->first();

        if (!$s) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $vista = $s->tipo_solicitud === 'baja' ? 'pdf.correo_baja' : 'pdf.correo_alta';

        $pdf = Pdf::loadView($vista, ['s' => $s]);

        return $pdf->stream("solicitud_correo_{$id}.pdf");
    }

    public function pdfUrl($id)
    {
        $existe = DB::table('solicitud_correo')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $url = URL::temporarySignedRoute(
            'solicitud-correo.pdf.firmado',
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
