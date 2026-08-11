import axiosClient from '../api/axiosClient';

export const getCatalogoTelefonos = async () => {
  const { data } = await axiosClient.get('/catalogo-telefonos');
  return data;
};

export const actualizarTelefono = async (id: number, payload: Record<string, any>) => {
  const { data } = await axiosClient.put(`/catalogo-telefonos/${id}`, payload);
  return data;
};

export const eliminarTelefono = async (id: number) => {
  const { data } = await axiosClient.delete(`/catalogo-telefonos/${id}`);
  return data;
};