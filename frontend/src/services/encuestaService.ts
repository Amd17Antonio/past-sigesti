import axiosClient from '../api/axiosClient';

export const getPreguntas = async () => {
  const { data } = await axiosClient.get('/encuesta/preguntas');
  return data;
};

export const yaEvaluada = async (idSolicitud: number) => {
  const { data } = await axiosClient.get(`/encuesta/${idSolicitud}/estado`);
  return data.evaluada as boolean;
};

export const enviarEvaluacion = async (
  idSolicitud: number,
  respuestas: { id_pregunta: number; tipo_respuesta: 'B' | 'R' | 'M' }[],
  observaciones?: string
) => {
  const { data } = await axiosClient.post('/encuesta', {
    id_solicitud: idSolicitud,
    respuestas,
    observaciones,
  });
  return data;
};

export interface ResumenEncuesta {
  buenas: number;
  regulares: number;
  malas: number;
  observaciones: { id_solicitud: number; solicitante: string; observaciones: string; fecha: string }[];
}

export const getResumenEncuesta = async (params: { del?: string; al?: string }) => {
  const { data } = await axiosClient.get<ResumenEncuesta>('/encuesta/resumen', { params });
  return data;
};