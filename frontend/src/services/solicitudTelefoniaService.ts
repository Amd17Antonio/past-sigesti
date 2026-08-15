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
  payload: { estatus?: string; observaciones?: string; detalle?: Record<string, any> }
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

export const imprimirSolicitudTelefoniaPdf = async (id: number) => {
  const response = await axiosClient.get(`/solicitud-telefono/${id}/pdf`, { responseType: 'blob' });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  window.open(url, '_blank');
};

export const imprimirResguardoTelefonia = async (id: number) => {
  const response = await axiosClient.get(`/solicitud-telefono/${id}/pdf-resguardo`, { responseType: 'blob' });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  window.open(url, '_blank');
};