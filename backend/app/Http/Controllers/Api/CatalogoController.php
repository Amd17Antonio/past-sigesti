<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CatalogoController extends Controller
{
    private function catalogos(): array
    {
        return [
            'areas' => ['tabla' => 'areas', 'campos' => ['area', 'siglas', 'titular'], 'estatus' => 'status', 'tipoEstatus' => 'bit'],
            'marcas' => ['tabla' => 'cat_marca', 'campos' => ['marca'], 'estatus' => null],
            'modelos' => ['tabla' => 'cat_modelo', 'campos' => ['modelo', 'id_marca'], 'estatus' => null],
            'tipo-equipo' => ['tabla' => 'cat_tipo_equipo', 'campos' => ['TipoEquipo'], 'estatus' => null],
            'servicios' => ['tabla' => 'cat_servicios', 'campos' => ['servicio'], 'estatus' => 'status', 'tipoEstatus' => 'int'],
            'so' => ['tabla' => 'cat_so', 'campos' => ['sistema'], 'estatus' => 'status', 'tipoEstatus' => 'bit'],
            'software' => ['tabla' => 'cat_software', 'campos' => ['software'], 'estatus' => 'status', 'tipoEstatus' => 'int'],
            'cargos' => ['tabla' => 'cat_cargo', 'campos' => ['cargo'], 'estatus' => 'estatus', 'tipoEstatus' => 'enum'],
            'autoriza-internet' => ['tabla' => 'cat_autoriza_internet', 'campos' => ['nombre', 'cargo', 'correo'], 'estatus' => 'estatus', 'tipoEstatus' => 'enum'],
            'categoria-telefonia' => ['tabla' => 'cat_categoria_telefonia', 'campos' => ['categoria', 'descripcion'], 'estatus' => 'estatus', 'tipoEstatus' => 'enum'],
            'enlace-informatico' => ['tabla' => 'cat_enlace_informatico', 'campos' => ['enlace', 'puesto', 'correo', 'ext'], 'estatus' => 'estatus', 'tipoEstatus' => 'enum'],
            'firma-ofi-internet' => ['tabla' => 'cat_firma_ofi_internet', 'campos' => ['nombre', 'cargo', 'correo', 'tipo'], 'estatus' => 'estatus', 'tipoEstatus' => 'enum'],
            'poa' => ['tabla' => 'cat_poa', 'campos' => ['poa'], 'estatus' => null],
            'preguntas' => ['tabla' => 'cat_preguntas', 'campos' => ['pregunta'], 'estatus' => 'estatus', 'tipoEstatus' => 'int'],
        ];
    }

    private function resolver(string $slug): array
    {
        $cats = $this->catalogos();
        if (!isset($cats[$slug])) {
            abort(404, 'Catálogo no encontrado');
        }
        return $cats[$slug];
    }

    private function activoValor(string $tipo, bool $activo)
    {
        return match ($tipo) {
            'bit', 'int' => $activo ? 1 : 0,
            'enum' => $activo ? 'activo' : 'inactivo',
            default => 1,
        };
    }

    private function esActivo($valor, string $tipo): bool
    {
        if ($tipo === 'enum') {
            return $valor === 'activo';
        }
        if (is_string($valor) && strlen($valor) === 1 && !ctype_digit($valor)) {
            return ord($valor) === 1;
        }
        return (int) $valor === 1;
    }

    public function index(string $slug)
    {
        $cat = $this->resolver($slug);

        if ($slug === 'modelos') {
            $registros = DB::table('cat_modelo as m')
                ->leftJoin('cat_marca as ma', 'ma.id', '=', 'm.id_marca')
                ->select('m.id', 'm.modelo', 'm.id_marca', 'ma.marca as marca_nombre')
                ->orderBy('m.id', 'desc')
                ->get();
        } else {
            $registros = DB::table($cat['tabla'])->orderBy('id', 'desc')->get();
        }

        if ($cat['estatus']) {
            $registros = $registros->map(function ($r) use ($cat) {
                $r->_activo = $this->esActivo($r->{$cat['estatus']}, $cat['tipoEstatus']);
                return $r;
            });
        }

        return response()->json([
            'campos' => $cat['campos'],
            'tieneEstatus' => (bool) $cat['estatus'],
            'registros' => $registros,
        ]);
    }

    public function store(Request $request, string $slug)
    {
        $cat = $this->resolver($slug);

        $reglas = [];
        foreach ($cat['campos'] as $campo) {
            $reglas[$campo] = 'nullable|string|max:255';
        }
        if ($slug === 'modelos') {
            $reglas['id_marca'] = 'required|integer';
        }
        $data = $request->validate($reglas);

        $campoPrincipal = $cat['campos'][0];
        if (!empty($data[$campoPrincipal])) {
            $existe = DB::table($cat['tabla'])
                ->whereRaw('LOWER(' . $campoPrincipal . ') = ?', [strtolower($data[$campoPrincipal])])
                ->exists();
            if ($existe) {
                return response()->json([
                    'message' => 'Ese registro ya existe en el catálogo.',
                    'errors' => [$campoPrincipal => ['Valor duplicado']],
                ], 422);
            }
        }

        if ($cat['estatus']) {
            $data[$cat['estatus']] = $this->activoValor($cat['tipoEstatus'], true);
        }

        $id = DB::table($cat['tabla'])->insertGetId($data);
        return response()->json(['id' => $id, ...$data], 201);
    }

    public function update(Request $request, string $slug, int $id)
    {
        $cat = $this->resolver($slug);

        $reglas = [];
        foreach ($cat['campos'] as $campo) {
            $reglas[$campo] = 'nullable|string|max:255';
        }
        $data = $request->validate($reglas);

        DB::table($cat['tabla'])->where('id', $id)->update($data);
        return response()->json(['id' => $id, ...$data]);
    }

    public function destroy(string $slug, int $id)
    {
        $cat = $this->resolver($slug);

        if ($cat['estatus']) {
            DB::table($cat['tabla'])->where('id', $id)->update([
                $cat['estatus'] => $this->activoValor($cat['tipoEstatus'], false),
            ]);
            return response()->json(['message' => 'Registro dado de baja']);
        }

        try {
            DB::table($cat['tabla'])->where('id', $id)->delete();
            return response()->json(['message' => 'Registro eliminado']);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'No se puede eliminar: este registro está siendo usado en otro lugar del sistema.',
            ], 422);
        }
    }

    public function storeModelo(Request $request)
    {
        $data = $request->validate([
            'modelo' => 'required|string|max:50',
            'id_marca' => 'required|integer',
        ]);

        $existe = DB::table('cat_modelo')
            ->where('id_marca', $data['id_marca'])
            ->whereRaw('LOWER(modelo) = ?', [strtolower($data['modelo'])])
            ->exists();

        if ($existe) {
            return response()->json([
                'message' => 'Ese modelo ya existe para la marca seleccionada.',
                'errors' => ['modelo' => ['Modelo duplicado']],
            ], 422);
        }

        $id = DB::table('cat_modelo')->insertGetId($data);
        return response()->json(['id' => $id, ...$data], 201);
    }

    public function telefonos()
    {
        $registros = DB::table('telefonia as t')
            ->leftJoin('usuarios_telefonia as u', DB::raw('CAST(t.extension AS CHAR)'), '=', 'u.extension')
            ->select(
                't.id', 't.extension', 't.modelo', 't.mac', 't.serie', 't.status', 't.nivel_tel',
                'u.id as id_usuario', 'u.nombre as usuario_nombre',
                'u.apellido_paterno', 'u.apellido_materno',
                'u.puesto', 'u.correo_institucional'
            )
            ->orderBy('t.id', 'desc')
            ->get()
            ->map(function ($r) {
                $r->_activo = (string) $r->status === "\x01" || (int) $r->status === 1;
                $r->vinculado = $r->id_usuario
                    ? trim("{$r->usuario_nombre} {$r->apellido_paterno} {$r->apellido_materno}")
                    : null;
                return $r;
            });

        return response()->json(['registros' => $registros]);
    }

    public function updateTelefono(Request $request, int $id)
    {
        $data = $request->validate([
            'extension' => 'required|integer',
            'modelo' => 'nullable|string|max:30',
            'mac' => 'nullable|string|max:30',
            'serie' => 'nullable|string|max:50',
            'nivel_tel' => 'nullable|string|max:5',
        ]);

        DB::table('telefonia')->where('id', $id)->update($data);
        return response()->json(['message' => 'Línea telefónica actualizada']);
    }

    public function destroyTelefono(int $id)
    {
        // Baja lógica: conserva el registro pero lo marca inactivo (igual que otros catálogos con status bit)
        DB::table('telefonia')->where('id', $id)->update(['status' => 0]);
        return response()->json(['message' => 'Línea telefónica dada de baja']);
    }
    
}