import { useEffect, useMemo, useState } from 'react';
import {
  getSolicitudesInternet,
  eliminarSolicitudInternet,
  descargarPdfSolicitudInternet,
  cambiarEstatusSolicitudInternet,
  getSolicitudInternetDetalle,
} from '../services/solicitudInternetService';
import { ESTATUS_INTERNET_LABEL, type SolicitudInternetRow } from '../types/SolicitudInternet';

import NuevaSolicitudInternetModal from '../components/internet/NuevaSolicitudInternetModal';
import EditarSolicitudInternetModal from '../components/internet/EditarSolicitudInternetModal';
import SortIcon from '../components/common/SortIcon';
import SenalEstatus from '../components/common/SenalEstatus';
import CambiarEstatusModal from '../components/common/CambiarEstatusModal';
import { useAuth } from '../context/AuthContext';

const COLUMNAS: { key: keyof SolicitudInternetRow; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'tipo_solicitud', label: 'Tipo' },
  { key: 'usuario_internet', label: 'Usuario' },
  { key: 'area', label: 'Área' },
  { key: 'no_inventario', label: 'No. Inventario' },
  { key: 'tipo_conexion', label: 'Tipo de Conexión' },
  { key: 'tel_ext', label: 'Extensión' },
  { key: 'correo', label: 'Correo' },
];

export default function SolicitudInternet() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState<SolicitudInternetRow[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<SolicitudInternetRow | null>(null);
  const [verEstatus, setVerEstatus] = useState<SolicitudInternetRow | null>(null);

  const [sortKey, setSortKey] = useState<keyof SolicitudInternetRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof SolicitudInternetRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const cargar = () => {
    getSolicitudesInternet().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async (id: number) => {
    if (!window.confirm(`¿Eliminar la solicitud #${id}?`)) return;
    await eliminarSolicitudInternet(id);
    cargar();
  };

  const handleFiltroColumna = (key: string, value: string) => {
    setFiltros({ ...filtros, [key]: value });
    setPagina(1);
  };

  const filtradas = useMemo(() => {
    return solicitudes.filter((s) => {
      const pasaColumnas = COLUMNAS.every(({ key }) => {
        const filtro = filtros[key];
        if (!filtro) return true;
        return String(s[key] ?? '').toLowerCase().includes(filtro.toLowerCase());
      });
      const pasaEstatus = filtroEstatus === 'todos' || s.estatus === filtroEstatus;
      return pasaColumnas && pasaEstatus;
    });
  }, [solicitudes, filtros, filtroEstatus]);

  const ordenadas = useMemo(() => {
    if (!sortKey) return filtradas;
    return [...filtradas].sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtradas, sortKey, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * porPagina;
  const paginadas = ordenadas.slice(inicio, inicio + porPagina);

  return (
    <div className="p-6">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t font-semibold">
        SOLICITUDES DE INTERNET
      </div>

      <div className="border border-t-0 rounded-b p-4">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            + Nueva Solicitud
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span>Mostrar</span>
            <select
              value={porPagina}
              onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
              className="border rounded p-1"
            >
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>registros</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                {COLUMNAS.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => handleSort(c.key)}
                    className="p-2 text-left cursor-pointer select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      <SortIcon active={sortKey === c.key} direction={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="p-2 text-left">Estatus</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>

              <tr className="bg-gray-50">
                {COLUMNAS.map((c) => (
                  <th key={c.key} className="p-1">
                    <input
                      value={filtros[c.key] ?? ''}
                      onChange={(e) => handleFiltroColumna(c.key, e.target.value)}
                      className="border p-1 w-full text-xs font-normal"
                    />
                  </th>
                ))}
                <th className="p-1">
                  <select
                    value={filtroEstatus}
                    onChange={(e) => { setFiltroEstatus(e.target.value); setPagina(1); }}
                    className="border p-1 w-full text-xs font-normal"
                  >
                    <option value="todos">Todos</option>
                    {Object.entries(ESTATUS_INTERNET_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {paginadas.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">
                    {user?.rol?.nombre === 'Administrador' ? (
                      <button
                        onClick={() => setVerEstatus(s)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {s.id}
                      </button>
                    ) : (
                      s.id
                    )}
                  </td>
                  <td className="p-2">{s.tipo_solicitud.toUpperCase()}</td>
                  <td className="p-2">{s.usuario_internet}</td>
                  <td className="p-2">{s.area}</td>
                  <td className="p-2">{s.no_inventario}</td>
                  <td className="p-2">{s.tipo_conexion}</td>
                  <td className="p-2">{s.tel_ext}</td>
                  <td className="p-2">{s.correo}</td>
                  <td className="p-2 flex items-center gap-2">
                    <SenalEstatus tipo="internet" estatus={s.estatus} />
                    {ESTATUS_INTERNET_LABEL[s.estatus] ?? s.estatus}
                  </td>
                  <td className="p-2 flex gap-3 whitespace-nowrap">
                    <button onClick={() => descargarPdfSolicitudInternet(s.id)} title="Imprimir / Descargar PDF">📄</button>
                    {s.estatus === 'generado_uie' ? (
                      <button onClick={() => setEditando(s)} title="Editar">✏️</button>
                    ) : (
                      <span className="opacity-30 cursor-not-allowed" title="No editable: ya está en atención de DGTID">✏️</span>
                    )}
                    <button onClick={() => handleEliminar(s.id)} title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginadas.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Mostrando registros del {ordenadas.length === 0 ? 0 : inicio + 1} al{' '}
            {Math.min(inicio + porPagina, ordenadas.length)} de un total de {ordenadas.length} registros
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaSegura === 1}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="px-3 py-1 bg-purple-800 text-white rounded">{paginaSegura}</span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaSegura === totalPaginas}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <NuevaSolicitudInternetModal onClose={() => setMostrarModal(false)} onCreado={cargar} />
      )}

      {editando && (
        <EditarSolicitudInternetModal
          solicitud={editando}
          onClose={() => setEditando(null)}
          onActualizado={cargar}
        />
      )}

      {verEstatus && (
        <CambiarEstatusModal
          folio={verEstatus.id}
          estatusActual={verEstatus.estatus}
          opciones={[
            { value: 'generado_uie', label: 'GENERADO POR UIE' },
            { value: 'atendiendo_dt', label: 'ATENDIENDO POR DIRECCIÓN GENERAL DE TECNOLOGÍAS E INNOVACIÓN DIGITAL' },
            { value: 'activo', label: 'SERVICIO ACTIVO' },
            { value: 'baja', label: 'BAJA DEL SERVICIO' },
          ]}
          estatusQueRequiereFolio="atendiendo_dt"
          estatusActivo="activo"
          estatusBaja="baja"
          onGuardar={(payload) => cambiarEstatusSolicitudInternet(verEstatus.id, payload as any)}
          onClose={() => setVerEstatus(null)}
          onActualizado={cargar}
          cargarInfoGeneral={async () => {
            const { solicitud } = await getSolicitudInternetDetalle(verEstatus.id);
            return [
              { label: 'Folio (ID)', value: solicitud.id },
              { label: 'Tipo Solicitud', value: solicitud.tipo_solicitud?.toUpperCase() },
              { label: 'Usuario', value: solicitud.usuario_internet },
              { label: 'Correo', value: solicitud.correo },
              { label: 'Cargo', value: solicitud.cargo },
              { label: 'Área de Adscripción', value: solicitud.area },
              { label: 'Extensión', value: solicitud.tel_ext },
              { label: 'Tipo Conexión', value: solicitud.tipo_conexion?.toUpperCase() },
              { label: 'Puerto', value: `ED:${solicitud.edificio} N:${solicitud.nivel} PTO:${solicitud.puerto ?? '-'}` },
              {
                label: 'Equipo',
                value: `TIPO: ${solicitud.tipo_equipo ?? '-'}\nMARCA: ${solicitud.marca ?? '-'}\nNo. INVENTARIO: ${solicitud.no_inventario ?? '-'}\nMAC ETHERNET: ${solicitud.mac_ethernet ?? '-'}\nMAC WIFI: ${solicitud.mac_wifi ?? '-'}`,
              },
              {
                label: 'Estatus',
                value: [
                  solicitud.fecha_generado_uie && `GENERADO POR UIE: ${solicitud.fecha_generado_uie}`,
                  solicitud.fecha_atendiendo_dt && `ATENDIENDO POR DGTID: ${solicitud.fecha_atendiendo_dt}${solicitud.folio_glpi ? `\nFOLIO GLPI: ${solicitud.folio_glpi}` : ''}`,
                  solicitud.fecha_activo && `SERVICIO ACTIVO: ${solicitud.fecha_activo}`,
                  solicitud.fecha_baja && `BAJA: ${solicitud.fecha_baja}${solicitud.motivo_baja ? `\nMOTIVO: ${solicitud.motivo_baja}` : ''}`,
                ].filter(Boolean).join('\n\n'),
              },
            ];
          }}
        />
      )}
    </div>
  );
}
