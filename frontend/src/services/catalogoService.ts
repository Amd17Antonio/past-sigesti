import axiosClient from '../api/axiosClient';

export const getCatalogo = async (slug: string) => {
  const { data } = await axiosClient.get(`/catalogos/${slug}`);
  return data as { campos: any[]; tieneEstatus: boolean; registros: { id: number; [key: string]: any }[] };
};

export const crearItemCatalogo = async (slug: string, valor: string, campo: string) => {
  const { data } = await axiosClient.post(`/catalogos/${slug}`, { [campo]: valor });
  return data;
};

export const crearModelo = async (modelo: string, idMarca: number) => {
  const { data } = await axiosClient.post('/catalogos/modelos-con-marca', { modelo, id_marca: idMarca });
  return data;
};

export const crearRegistroCatalogo = async (slug: string, payload: Record<string, any>) => {
  const { data } = await axiosClient.post(`/catalogos/${slug}`, payload);
  return data;
};

export const actualizarRegistroCatalogo = async (slug: string, id: number, payload: Record<string, any>) => {
  const { data } = await axiosClient.put(`/catalogos/${slug}/${id}`, payload);
  return data;
};

export const eliminarRegistroCatalogo = async (slug: string, id: number) => {
  const { data } = await axiosClient.delete(`/catalogos/${slug}/${id}`);
  return data;
};

export const getCatalogoTelefonos = async () => {
  const { data } = await axiosClient.get('/catalogos-telefonos');
  return data as { registros: any[] };
};

export const actualizarTelefono = async (id: number, payload: Record<string, any>) => {
  const { data } = await axiosClient.put(`/catalogos-telefonos/${id}`, payload);
  return data;
};

export const eliminarTelefono = async (id: number) => {
  const { data } = await axiosClient.delete(`/catalogos-telefonos/${id}`);
  return data;
};