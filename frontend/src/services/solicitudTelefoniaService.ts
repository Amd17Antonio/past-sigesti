import axiosClient from '../api/axiosClient';

export const getSolicitudesTelefonia = async () => {
  const { data } = await axiosClient.get('/solicitud-telefono');
  return data;
};

export const getCategoriasTelefonia = async () => {
  const { data } = await axiosClient.get('/telefonia/categorias');
  return data;
};

export const buscarUsuarioTelefoniaPorExtension = async (extension: string) => {
  const { data } = await axiosClient.get(`/telefonia/usuarios/buscar/${extension}`);
  return data;
};

export const registrarUsuarioTelefonia = async (payload: any) => {
  const { data } = await axiosClient.post('/telefonia/usuarios', payload);
  return data;
};

export interface CrearSolicitudTelefoniaPayload {
  usuario_id?: number;
  tipo_tramite: string;
  id_autoriza?: number;
  observaciones?: string;
  detalle?: Record<string, any>;
}

export const crearSolicitudTelefonia = async (payload: CrearSolicitudTelefoniaPayload) => {
  const { data } = await axiosClient.post('/solicitud-telefono', payload);
  return data;
};

export const eliminarSolicitudTelefonia = async (id: number) => {
  const { data } = await axiosClient.delete(`/solicitud-telefono/${id}`);
  return data;
};

export const getTiposClave = async () => {
  const { data } = await axiosClient.get('/telefonia/tipos-clave');
  return data;
};

// `detalle`: cuando se manda, reemplaza por completo lo guardado en la solicitud
// (el frontend debe mandar el objeto ya mergeado con lo que no cambió).
export const actualizarSolicitudTelefonia = async (
  id: number,
  payload: { estatus?: string; id_autoriza?: number; observaciones?: string; detalle?: Record<string, any> }
) => {
  const { data } = await axiosClient.put(`/solicitud-telefono/${id}`, payload);
  return data;
};

export const getSolicitudTelefoniaDetalle = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-telefono/${id}`);
  return data as { solicitud: any };
};

export type EstatusTelefonia = 'creado_cgd' | 'atendiendo_dgti' | 'activo' | 'baja';

export const cambiarEstatusSolicitudTelefonia = async (
  id: number,
  payload: {
    estatus: EstatusTelefonia;
    folio_glpi?: string;
    observacion_glpi?: string;
    motivo_baja?: string;
    extension_asignada?: string;
    did_asignado?: string;
    tipo_clave?: 'PIN' | 'CN';
    clave_asignada?: string;
  }
) => {
  const { data } = await axiosClient.patch(`/solicitud-telefono/${id}/estatus`, payload);
  return data;
};

// Edita solo los datos de asignación (extensión/DID/clave) mientras el servicio ya está activo,
// sin necesidad de volver a pasar por cambiarEstatus.
export const actualizarAsignacionTelefonia = async (
  id: number,
  payload: {
    extension_asignada: string;
    did_asignado?: string;
    tipo_clave?: 'PIN' | 'CN';
    clave_asignada?: string;
  }
) => {
  const { data } = await axiosClient.patch(`/solicitud-telefono/${id}/asignacion`, payload);
  return data;
};

// Helper compartido para abrir el PDF en una pestaña nueva a partir de un blob.
//
// IMPORTANTE: window.open() debe llamarse de forma SÍNCRONA (antes de cualquier
// await) para que el navegador lo asocie al click del usuario y no lo bloquee.
// Por eso cada función de impresión abre la pestaña en blanco como PRIMERA
// instrucción, y solo hasta después de tener el blob navega esa pestaña ya
// abierta hacia el PDF. Si el navegador bloqueó el popup de todas formas
// (nuevaVentana === null), se hace fallback a descarga directa.
function abrirPdfEnVentana(nuevaVentana: Window | null, blob: Blob, nombreArchivo: string) {
  const url = window.URL.createObjectURL(blob);

  if (nuevaVentana) {
    nuevaVentana.location.href = url;
  } else {
    // Fallback: el navegador bloqueó el popup, se descarga en su lugar.
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Se libera un poco después para dar tiempo a que la pestaña/descarga cargue el blob.
  setTimeout(() => window.URL.revokeObjectURL(url), 60000);
}

export const imprimirSolicitudTelefoniaPdf = async (id: number) => {
  // Se abre la pestaña vacía de inmediato, en el mismo tick del click.
  const nuevaVentana = window.open('', '_blank');

  try {
    const response = await axiosClient.get(`/solicitud-telefono/${id}/pdf`, {
      responseType: 'blob',
      timeout: 20000, // dompdf con varios joins puede tardar más que el timeout global de 5s
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    abrirPdfEnVentana(nuevaVentana, blob, `solicitud_telefonia_${id}.pdf`);
  } catch (err) {
    nuevaVentana?.close();
    throw err;
  }
};

export const imprimirResguardoTelefonia = async (id: number) => {
  const nuevaVentana = window.open('', '_blank');
  try {
    const response = await axiosClient.get(`/solicitud-telefono/${id}/pdf-resguardo`, {
      responseType: 'blob',
      timeout: 20000,
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    abrirPdfEnVentana(nuevaVentana, blob, `resguardo_telefonia_${id}.pdf`);
  } catch (err: any) {
    nuevaVentana?.close();
    // Si el error viene como blob, léelo como texto para ver el mensaje real
    if (err?.response?.data instanceof Blob) {
      const texto = await err.response.data.text();
      console.error('Error real del backend:', texto);
    }
    throw err;
  }

};