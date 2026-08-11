import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Action {
  label: string;
  onClick: () => void;
  hidden?: boolean;
  danger?: boolean;
}

const COLORES = {
  rojo: 'bg-red-600 hover:bg-red-700',
  ambar: 'bg-amber-500 hover:bg-amber-600',
  verde: 'bg-green-600 hover:bg-green-700',
};

export default function ActionsDropdown({
  actions,
  color = 'verde',
}: {
  actions: Action[];
  color?: 'rojo' | 'ambar' | 'verde';
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const visibles = actions.filter((a) => !a.hidden);

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        title={
          color === 'verde' ? 'Dictamen autorizado' :
          color === 'ambar' ? 'Servicio cerrado, pendiente de dictamen' :
          'Pendiente de cerrar'
        }
        className={`${COLORES[color]} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}
      >
        ☰ ▾
      </button>
      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: coords.top, left: coords.left }}
          className="bg-white text-gray-800 shadow-lg rounded border min-w-[200px] z-[9999]"
        >
          {visibles.map((a) => (
            <button
              key={a.label}
              onClick={() => { setOpen(false); a.onClick(); }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${a.danger ? 'text-red-600' : ''}`}
            >
              {a.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}