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
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl border border-blue-100 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-slate-700 font-medium text-sm">Cargando mantenimiento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blue-100 flex flex-col">
        {/* Cabecera del modal */}
        <div className="bg-blue-600 text-white px-6 py-4 font-semibold flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <span>Mantenimiento de Equipo</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>

        <div className="p-6 space-y-6">
          {yaSugeridoBaja && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              ⚠ Este equipo ya cuenta con un dictamen que sugiere baja.
            </div>
          )}

          {/* Tarjeta de información general del equipo */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 shadow-inner">
            <div><span className="font-semibold text-slate-900">Equipo:</span> {base.tipo_equipo} {base.marca} {base.modelo}</div>
            <div><span className="font-semibold text-slate-900">No. Inventario:</span> {base.no_inventario}</div>
            <div className="sm:col-span-2"><span className="font-semibold text-slate-900">Área:</span> {base.area}</div>
          </div>

          {/* Campos de captura (Responsable, Extensión, Contraseña) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Responsable</label>
              <input 
                value={form.responsable ?? ''} 
                onChange={(e) => setForm({ ...form, responsable: e.target.value })} 
                className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                placeholder="Nombre del responsable"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">No. Extensión</label>
              <input 
                value={form.no_extension ?? ''} 
                onChange={(e) => setForm({ ...form, no_extension: e.target.value })} 
                className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                placeholder="Ej. 104"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Contraseña</label>
              <input 
                value={form.contrasena ?? ''} 
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })} 
                className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                placeholder="Contraseña de equipo"
              />
            </div>
          </div>

          {/* Secciones de checklists */}
          <div className="space-y-4">
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
          </div>

          {/* Firmas / Recibió y Entregó */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2 border-t border-slate-200">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Recibió</label>
              <input 
                value={form.recibio_nombre ?? ''} 
                onChange={(e) => setForm({ ...form, recibio_nombre: e.target.value })} 
                className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                placeholder="Nombre de quien recibe"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Entregó</label>
              <input 
                value={form.entrego_nombre ?? ''} 
                onChange={(e) => setForm({ ...form, entrego_nombre: e.target.value })} 
                className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                placeholder="Nombre de quien entrega"
              />
            </div>
          </div>
        </div>

        {/* Pie del modal / Acciones */}
        <div className="flex flex-wrap justify-between items-center gap-2 px-6 py-4 bg-slate-50 border-t border-slate-200 mt-auto">
          <button 
            onClick={() => abrirPdfEquipoMantenimiento(idEquipoSolicitud)} 
            className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            🖨 Imprimir
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onClose} 
              className="border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded text-sm transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={guardar} 
              disabled={guardando} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm disabled:opacity-50 transition-colors shadow-sm font-medium"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-blue-600/90 text-white text-sm font-semibold px-4 py-2">{titulo}</div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );
}

function Checks({ items, form, toggle }: { items: { key: CheckKey; label: string }[]; form: EquipoMantenimientoCgd; toggle: (key: CheckKey) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
      {items.map((it) => (
        <label key={it.key} className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-50 cursor-pointer transition-colors">
          <input 
            type="checkbox" 
            checked={Boolean(form[it.key])} 
            onChange={() => toggle(it.key)} 
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="select-none">{it.label}</span>
        </label>
      ))}
    </div>
  );
}

function Obs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">Observaciones</label>
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="border border-slate-300 rounded p-2 w-full text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
        rows={2} 
        placeholder="Observaciones adicionales..."
      />
    </div>
  );
}