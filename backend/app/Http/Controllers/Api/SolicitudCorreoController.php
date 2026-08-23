<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;

class SolicitudCorreoController extends Controller
{
    private function baseQuery()
    {
        return DB::table('solicitud_correo as sc')
            ->leftJoin('areas as a', 'a.id', '=', 'sc.id_area')
            ->leftJoin('cat_autoriza_internet as auth', 'auth.id', '=', 'sc.id_autoriza')
            ->select(
                'sc.id', 'sc.tipo_solicitud', 'sc.nombre', 'sc.puesto',
                'sc.id_area', 'a.area', 'sc.area_interna', 'sc.correo_secundario', 'sc.telefono_contacto',
                'sc.extension',
                'sc.id_autoriza', 'auth.nombre as autoriza_nombre', 'auth.cargo as autoriza_cargo', 'auth.correo as autoriza_correo',
                'sc.correo_institucional', 'sc.usuario_generado', 'sc.motivo_baja',
                'sc.estatus', 'sc.oficio_cgd', 'sc.observaciones',
                'sc.folio_glpi', 'sc.observacion_glpi',
                'sc.fecha_creado_cgd', 'sc.fecha_atendiendo_dgti', 'sc.fecha_activo', 'sc.fecha_baja',
                'sc.created_at'
            );
    }

    /**
     * Reglas de validación del correo institucional según el tipo de solicitud:
     * - Alta: solo se valida formato (aún no existe, se está solicitando).
     * - Baja: debe existir y estar ACTIVO en el sistema (no se puede dar de baja
     *   un correo que no está registrado o que ya no está activo).
     */
    private function reglasCorreoInstitucional(string $tipoSolicitud, ?int $ignorarId = null): array
    {
        $reglas = ['required', 'email', 'max:150'];

        if ($tipoSolicitud === 'baja') {
            $reglas[] = Rule::exists('solicitud_correo', 'correo_institucional')
                ->where(function ($query) use ($ignorarId) {
                    $query->where('estatus', 'activo');
                    if ($ignorarId) {
                        $query->where('id', '<>', $ignorarId);
                    }
                });
        }

        return $reglas;
    }

    public function index(Request $request)
    {
        $usuario = $request->user();
        $rol = $usuario->rol->nombre ?? null;

        $porPagina = (int) $request->get('por_pagina', 10);
        $pagina = max(1, (int) $request->get('pagina', 1));

        $query = $this->baseQuery();

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
        $tipoSolicitud = $request->input('tipo_solicitud');

        $data = $request->validate([
            'tipo_solicitud' => 'required|in:alta,baja',
            'nombre' => 'required|string|max:150',
            'puesto' => 'required_if:tipo_solicitud,alta|nullable|string|max:200',
            'id_area' => 'required|integer|exists:areas,id',
            'id_autoriza' => 'required|integer|exists:cat_autoriza_internet,id',
            'area_interna' => 'required_if:tipo_solicitud,alta|nullable|string|max:200',
            'correo_secundario' => ['required_if:tipo_solicitud,alta', 'nullable', 'email', 'max:150'],
            'telefono_contacto' => ['required_if:tipo_solicitud,alta', 'nullable', 'regex:/^[0-9]{7,15}$/'],
            'extension' => 'required_if:tipo_solicitud,alta|nullable|string|max:10',
            'correo_institucional' => $this->reglasCorreoInstitucional($tipoSolicitud),
            'motivo_baja' => 'required_if:tipo_solicitud,baja|nullable|string|min:10',
        ], [
            'correo_institucional.required' => 'El correo institucional (solicitado o a dar de baja) es obligatorio.',
            'correo_institucional.exists' => 'Ese correo institucional no existe o no está activo en el sistema. Verifica que sea correcto.',
            'id_autoriza.required' => 'La persona que autoriza es obligatoria.',
        ]);

        $data['estatus'] = 'creado_cgd';
        $data['fecha_creado_cgd'] = now();
        $data['id_usuario_crea'] = $request->user()->id ?? null;
        $data['usuario_mov'] = $request->user()->usuario ?? null;
        $data['created_at'] = now();
        $data['updated_at'] = now();

        $id = DB::table('solicitud_correo')->insertGetId($data);

        return response()->json(['id' => $id], 201);
    }

    public function update(Request $request, $id)
    {
        $actual = DB::table('solicitud_correo')->where('id', $id)->first();
        if (!$actual) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        if ($actual->estatus !== 'creado_cgd') {
            return response()->json([
                'message' => 'Esta solicitud ya está en atención de la Dirección General de Tecnologías e Innovación Digital y no puede editarse.',
            ], 422);
        }

        $tipoSolicitud = $request->input('tipo_solicitud');

        $data = $request->validate([
            'tipo_solicitud' => 'required|in:alta,baja',
            'nombre' => 'required|string|max:150',
            'puesto' => 'required_if:tipo_solicitud,alta|nullable|string|max:200',
            'id_area' => 'required|integer|exists:areas,id',
            'id_autoriza' => 'required|integer|exists:cat_autoriza_internet,id',
            'area_interna' => 'required_if:tipo_solicitud,alta|nullable|string|max:200',
            'correo_secundario' => ['required_if:tipo_solicitud,alta', 'nullable', 'email', 'max:150'],
            'telefono_contacto' => ['required_if:tipo_solicitud,alta', 'nullable', 'regex:/^[0-9]{7,15}$/'],
            'extension' => 'required_if:tipo_solicitud,alta|nullable|string|max:10',
            'correo_institucional' => $this->reglasCorreoInstitucional($tipoSolicitud, (int) $id),
            'motivo_baja' => 'required_if:tipo_solicitud,baja|nullable|string|min:10',
        ], [
            'correo_institucional.required' => 'El correo institucional (solicitado o a dar de baja) es obligatorio.',
            'correo_institucional.exists' => 'Ese correo institucional no existe o no está activo en el sistema. Verifica que sea correcto.',
            'id_autoriza.required' => 'La persona que autoriza es obligatoria.',
        ]);

        $data['usuario_mov'] = $request->user()->usuario ?? null;
        $data['updated_at'] = now();

        DB::table('solicitud_correo')->where('id', $id)->update($data);

        return response()->json(['message' => 'Actualizado correctamente']);
    }

    public function cambiarEstatus(Request $request, $id)
    {
        $usuario = $request->user();

        $solicitud = DB::table('solicitud_correo')->where('id', $id)->first();
        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $data = $request->validate([
            'estatus' => 'required|in:creado_cgd,atendiendo_dgti,activo,baja',
            'folio_glpi' => 'nullable|string|max:50',
            'observacion_glpi' => 'nullable|string',
            'usuario_generado' => 'nullable|string|max:150',
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
                return response()->json(['message' => 'Esta cuenta ya se encuentra activa.'], 422);
            }

            if (!empty($solicitud->correo_institucional)) {
                $correoEnUso = DB::table('solicitud_correo')
                    ->where('correo_institucional', $solicitud->correo_institucional)
                    ->where('estatus', 'activo')
                    ->where('id', '<>', $id)
                    ->exists();
                if ($correoEnUso) {
                    return response()->json(['message' => 'Ese correo ya está asignado y activo en otra solicitud.'], 422);
                }
            }

            if (!empty($data['usuario_generado'])) {
                $update['usuario_generado'] = $data['usuario_generado'];
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

        DB::table('solicitud_correo')->where('id', $id)->update($update);

        return response()->json(['message' => 'Estatus actualizado correctamente']);
    }

    public function actualizarAsignacion(Request $request, $id)
    {
        $usuario = $request->user();

        $solicitud = DB::table('solicitud_correo')->where('id', $id)->first();
        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        if ($solicitud->estatus !== 'activo') {
            return response()->json([
                'message' => 'Solo se puede editar el correo asignado cuando el servicio está activo.',
            ], 422);
        }

        $data = $request->validate([
            'correo_institucional' => 'required|email|max:150',
            'usuario_generado' => 'nullable|string|max:150',
        ], [
            'correo_institucional.required' => 'El correo institucional asignado es obligatorio.',
        ]);

        $correoEnUso = DB::table('solicitud_correo')
            ->where('correo_institucional', $data['correo_institucional'])
            ->where('estatus', 'activo')
            ->where('id', '<>', $id)
            ->exists();
        if ($correoEnUso) {
            return response()->json(['message' => 'Ese correo ya está asignado y activo en otra solicitud.'], 422);
        }

        DB::table('solicitud_correo')->where('id', $id)->update([
            'correo_institucional' => $data['correo_institucional'],
            'usuario_generado' => $data['usuario_generado'] ?? $solicitud->usuario_generado,
            'usuario_mov' => $usuario->usuario,
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Asignación actualizada correctamente']);
    }

    public function destroy($id)
    {
        $existe = DB::table('solicitud_correo')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        DB::table('solicitud_correo')->where('id', $id)->delete();

        return response()->json(['message' => 'Solicitud eliminada correctamente']);
    }

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

    public function oficio($id)
    {
        $s = $this->baseQuery()->where('sc.id', $id)->first();

        if (!$s) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $enlace = DB::table('cat_enlace_informatico')
            ->where('estatus', 'activo')
            ->orderBy('id', 'desc')
            ->first();

        $pdf = Pdf::loadView('pdf.oficio_correo', ['s' => $s, 'enlace' => $enlace]);

        return $pdf->stream("oficio_correo_{$id}.pdf");
    }

    public function oficioUrl($id)
    {
        $existe = DB::table('solicitud_correo')->where('id', $id)->exists();
        if (!$existe) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $url = URL::temporarySignedRoute(
            'solicitud-correo.oficio.firmado',
            now()->addMinutes(5),
            ['id' => $id]
        );

        return response()->json(['url' => $url]);
    }

    public function oficioFirmado($id)
    {
        return $this->oficio($id);
    }
}