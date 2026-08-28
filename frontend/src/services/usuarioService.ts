import axiosClient from '../api/axiosClient';

export interface RolOption {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface UsuarioRow {
  id: number;
  usuario: string;
  nombre: string;
  rol_id: number;
  rol: string | null;
  id_area: number | null;
  area: string | null;
  id_soporte: number | null;
  extension: number | null;
  status: boolean;
}

export const getRoles = async () => {
  const { data } = await axiosClient.get<RolOption[]>('/roles');
  return data;
};

export const getUsuarios = async () => {
  const { data } = await axiosClient.get<UsuarioRow[]>('/usuarios');
  return data;
};

export const crearUsuario = async (payload: {
  usuario: string;
  clave: string;
  nombre: string;
  rol_id: number;
  id_area?: number | null;
  extension?: number | null;
}) => {
  const { data } = await axiosClient.post('/usuarios', payload);
  return data;
};

export const actualizarUsuario = async (
  id: number,
  payload: {
    usuario?: string;
    clave?: string;
    nombre?: string;
    rol_id?: number;
    id_area?: number | null;
    extension?: number | null;
    status?: boolean;
  }
) => {
  const { data } = await axiosClient.put(`/usuarios/${id}`, payload);
  return data;
};

export const eliminarUsuario = async (id: number) => {
  const { data } = await axiosClient.delete(`/usuarios/${id}`);
  return data;
};