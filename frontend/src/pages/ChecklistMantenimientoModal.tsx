import { useEffect, useState } from 'react';
import {
  getEquipoMantenimiento,
  guardarEquipoMantenimiento,
  abrirPdfEquipoMantenimiento,
} from '../../services/equipoMantenimientoCgdService';
import type { EquipoMantenimientoCgd, EquipoMantenimientoBase } from '../../types/EquipoMantenimientoCgd';

type CheckKey = keyof EquipoMantenimientoCgd;

const CHECKS_EQUIPO: { key: CheckKey; label: string }[] = [
  { key: 'eq_valoracion', label: 'Valoración' },
  { key: 'eq_respaldo_informacion', label: 'Respaldo de información' },
  { key: 'eq_cargador_cables', label: 'Cargador y/o cables' },
  { key: 'eq_reinicio_constante', label: 'Reinicio constante' },
  { key: 'eq_activacion_ofimatica', label: 'Activación de Ofimática' },
  { key: 'eq_activacion_so', label: 'Activación de S.O.' },
  { key: 'eq_error_pantalla_azul', label: 'Error de pantalla azul' },
  { key: 'eq_actualizaciones_so', label: 'Actualizaciones del S.O.' },
  { key: 'eq_no_retiene_carga', label: 'No retiene carga' },
  { key: 'eq_no_funciona_teclado_completo', label: 'No funciona completamente el teclado' },
  { key: 'eq_no_enciende', label: 'No enciende' },
  { key: 'eq_instalacion_software_adicional', label: 'Instalación de Software adicional' },
  { key: 'eq_no_inicia_so', label: 'No inicia el S.O.' },
];

const CHECKS_MOUSE_TECLADO: { key: CheckKey; label: string }[] = [
  { key: 'mt_valoracion', label: 'Valoración' },
  { key: 'mt_no_funciona', label: 'No funciona' },
  { key: 'mt_teclas_incorrectas', label: 'No funcionan las teclas correctamente' },
  { key: 'mt_conector_mal_estado', label: 'Conector en mal estado' },
];

const CHECKS_IMPRESORAS: { key: CheckKey; label: string }[] = [
  { key: 'imp_valoracion', label: 'Valoración' },
  { key: 'imp_cable_corriente', label: 'Cable de corriente' },
  { key: 'imp_cable_datos', label: 'Cable de datos' },
  { key: 'imp_no_enciende', label: 'No enciende' },
  { key: 'imp_atasca_hojas', label: 'Atasca las hojas' },
  { key: 'imp_no_jala_hojas', label: 'No jala las hojas' },
  { key: 'imp_manchado_hojas', label: 'Manchado de hojas' },
  { key: 'imp_riego_tinta', label: 'Riego de tinta' },
  { key: 'imp_no_imprime', label: 'No imprime' },
  { key: 'imp_errores_pantalla', label: 'Errores de pantalla' },
];

const vacio = (idEquipoSolicitud: number, idArea: number): EquipoMantenimientoCgd => ({
  id_equipo_solicitud: idEquipoSolicitud,
  id_area: idArea,
  responsable: '', no_extension: '', contrasena: '',
  eq_valoracion: false, eq_respaldo_informacion: false, eq_cargador_cables: false,
  eq_reinicio_constante: false, eq_activacion_ofimatica: false, eq_activacion_so: false,
  eq_error_pantalla_azul: false, eq_actualizaciones_so: false, eq_no_retiene_carga: false,
  eq_no_funciona_teclado_completo: false, eq_no_enciende: false,
  eq_instalacion_software_adicional: false, eq_no_inicia_so: false, eq_observaciones: '',
  mt_valoracion: false, mt_no_funciona: false, mt_teclas_incorrectas: false,
  mt_conector_mal_estado: false, mt_observaciones: '',
  imp_valoracion: false, imp_cable_corriente: false, imp_cable_datos: false,
  imp_no_enciende: false, imp_atasca_hojas: false, imp_no_jala_hojas: false,
  imp_manchado_hojas: false, imp_riego_tinta: false, imp_no_imprime: false,
  imp_errores_pantalla: false, imp_observaciones: '',
  recibio_nombre: '', entrego_nombre: '',
});

export default function ChecklistMantenimientoModal({
  idEquipoSolicitud,
  onClose,
  onGuardado,
}: {
  idEquipoSolicitud: number;
  onClose: () => void;
  onGuardado?: () => void;
}) {
  const [base, setBase] = useState<EquipoMantenimientoBase | null>(null);
  const [form, setForm] = useState<EquipoMantenimientoCgd | null>(null);
  const [yaSugeridoBaja, setYaSugeridoBaja] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getEquipoMantenimiento(idEquipoSolicitud).then((r) => {
      setBase(r.base);
      setForm(r.checklist ?? vacio(idEquipoSolicitud, r.base.id_area));
      setYaSugeridoBaja(r.ya_sugerido_baja);
      setCargando(false);
    });
  }, [idEquipoSolicitud]);

  const toggle = (key: CheckKey) => setForm((f) => (f ? { ...f, [key]: !f[key] } : f));

  const guardar = async () => {
    if (!form) return;
    setGuardando(true);
    try {
      await guardarEquipoMantenimiento(form);
      onGuardado?.();
      onClose();
    } finally {
      setGuardando(false);
    }
  };

  if (cargando || !form || !base) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded p-6">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-bold mb-4">Mantenimiento de Equipo</h2>

        {yaSugeridoBaja && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            ⚠ Este equipo ya cuenta con un dictamen que sugiere baja.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div><span className="font-semibold">Equipo:</span> {base.tipo_equipo} {base.marca} {base.modelo}</div>
          <div><span className="font-semibold">No. Inventario:</span> {base.no_inventario}</div>
          <div><span className="font-semibold">Área:</span> {base.area}</div>
          <div>
            <label className="font-semibold block">Responsable</label>
            <input value={form.responsable ?? ''} onChange={(e) => setForm({ ...form, responsable: e.target.value })} className="border rounded p-1 w-full" />
          </div>
          <div>
            <label className="font-semibold block">No. Extensión</label>
            <input value={form.no_extension ?? ''} onChange={(e) => setForm({ ...form, no_extension: e.target.value })} className="border rounded p-1 w-full" />
          </div>
          <div>
            <label className="font-semibold block">Contraseña</label>
            <input value={form.contrasena ?? ''} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} className="border rounded p-1 w-full" />
          </div>
        </div>

        <Seccion titulo="Equipo de Cómputo">
          <Checks items={CHECKS_EQUIPO} form={form} toggle={toggle} />
          <Obs value={form.eq_observaciones ?? ''} onChange={(v) => setForm({ ...form, eq_observaciones: v })} />
        </Seccion>

        <Seccion titulo="Mouse y Teclado">
          <Checks items={CHECKS_MOUSE_TECLADO} form={form} toggle={toggle} />
          <Obs value={form.mt_observaciones ?? ''} onChange={(v) => setForm({ ...form, mt_observaciones: v })} />
        </Seccion>

        <Seccion titulo="Impresoras">
          <Checks items={CHECKS_IMPRESORAS} form={form} toggle={toggle} />
          <Obs value={form.imp_observaciones ?? ''} onChange={(v) => setForm({ ...form, imp_observaciones: v })} />
        </Seccion>

        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div>
            <label className="font-semibold block">Recibió</label>
            <input value={form.recibio_nombre ?? ''} onChange={(e) => setForm({ ...form, recibio_nombre: e.target.value })} className="border rounded p-1 w-full" />
          </div>
          <div>
            <label className="font-semibold block">Entregó</label>
            <input value={form.entrego_nombre ?? ''} onChange={(e) => setForm({ ...form, entrego_nombre: e.target.value })} className="border rounded p-1 w-full" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => abrirPdfEquipoMantenimiento(idEquipoSolicitud)} className="bg-gray-600 text-white px-4 py-2 rounded text-sm">🖨 Imprimir</button>
          <button onClick={onClose} className="border px-4 py-2 rounded text-sm">Cancelar</button>
          <button onClick={guardar} disabled={guardando} className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50">
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="bg-gray-800 text-white text-sm font-semibold px-2 py-1">{titulo}</div>
      <div className="border border-t-0 p-3">{children}</div>
    </div>
  );
}

function Checks({ items, form, toggle }: { items: { key: CheckKey; label: string }[]; form: EquipoMantenimientoCgd; toggle: (key: CheckKey) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {items.map((it) => (
        <label key={it.key} className="flex items-center gap-2">
          <input type="checkbox" checked={Boolean(form[it.key])} onChange={() => toggle(it.key)} />
          {it.label}
        </label>
      ))}
    </div>
  );
}

function Obs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-2">
      <label className="text-xs font-semibold block mb-1">Observaciones</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="border rounded p-1 w-full text-sm" rows={2} />
    </div>
  );
}