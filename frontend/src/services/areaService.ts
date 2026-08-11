import axiosClient from '../api/axiosClient';

export interface Area {
  id: number;
  area: string;
  siglas: string | null;
  titular: string | null;
  status: boolean;
}

export const getAreas = async () => {
  const { data } = await axiosClient.get<Area[]>('/areas');
  return data;
};