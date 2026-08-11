import axiosClient from '../api/axiosClient';

export const login = async (usuario: string, clave: string) => {
  const { data } = await axiosClient.post('/login', { usuario, clave });
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data.usuario;
};

export const logout = async () => {
  await axiosClient.post('/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};