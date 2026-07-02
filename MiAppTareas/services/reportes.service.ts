import api from './api';

export const reportesService = {
  reporteAlertas: () => api.post('/configuracion/reporte-alertas/'),
  reporteRiego: () => api.post('/configuracion/reporte-riego/'),
  reporteMediciones: () => api.post('/mediciones/'),
  backup: () => api.post('/configuracion/backup/'),
  logs: () => api.get('/configuracion/logs/'),
};

export const climaService = {
  getForecast: (latitude: number, longitude: number) => 
    api.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`),
};