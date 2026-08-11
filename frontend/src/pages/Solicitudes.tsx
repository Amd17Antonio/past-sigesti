import { useEffect, useMemo, useState } from 'react';
import { getPendientes } from '../services/solicitudService';
import CrearSolicitudModal from '../components/solicitudes/CrearSolicitudModal';
import SortIcon from '../components/common/SortIcon';

interface Solicitud {
  id: number;
  solicitante: string;
  extension: number | null;
  area: string;
  descripcion: string;
}

const COLUMNAS: { key: keyof Solicitud; label: string }[] = [
  { key: 'id', label: 'Folio' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'extension', label: 'Extensión' },
  { key: 'area', label: 'Área' },
  { key: 'descripcion', label: 'Descripción' },
];

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Solicitud | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const cargar = () => {
    getPendientes().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleSort = (key: keyof Solicitud) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const filtradas = useMemo(() => {
    const resultado = solicitudes.filter((s) =>
      JSON.stringify(s).toLowerCase().includes(busqueda.toLowerCase())
    );

    if (sortBy) {
      resultado.sort((a, b) => {
        const valA = a[sortBy] ?? '';
        const valB = b[sortBy] ?? '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDir === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDir === 'asc' ? -1 : 1;
        if (strA > strB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [solicitudes, busqueda, sortBy, sortDir]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Solicitudes</h1>
        <div className="flex gap-2">
          <input
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={() => setMostrarModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            Agregar solicitud
          </button>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {COLUMNAS.map((c) => (
              <th
                key={c.key}
                className="p-2 text-left cursor-pointer select-none"
                onClick={() => handleSort(c.key)}
              >
                <span className="inline-flex items-center">
                  {c.label}
                  <SortIcon active={sortBy === c.key} direction={sortDir} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtradas.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.id}</td>
              <td className="p-2">{s.solicitante}</td>
              <td className="p-2">{s.extension ?? '-'}</td>
              <td className="p-2">{s.area}</td>
              <td className="p-2">{s.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtradas.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

      {mostrarModal && (
        <CrearSolicitudModal onClose={() => setMostrarModal(false)} onCreado={cargar} />
      )}
    </div>
  );
}
