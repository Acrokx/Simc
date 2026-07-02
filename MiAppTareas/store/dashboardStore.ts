import { useState, useEffect } from 'react';
import api from '../services/api';

export interface DashboardStats {
  fincas: number;
  cultivos: number;
  sensores: number;
  sensoresActivos: number;
  sensoresInactivos: number;
  alertas: number;
  alertasCriticas: number;
  usuarios: number;
  mediciones: number;
  promedioHumedad: number | null;
}

export function useDashboardStore() {
  const [stats, setStats] = useState<DashboardStats>({
    fincas: 0,
    cultivos: 0,
    sensores: 0,
    sensoresActivos: 0,
    sensoresInactivos: 0,
    alertas: 0,
    alertasCriticas: 0,
    usuarios: 0,
    mediciones: 0,
    promedioHumedad: null,
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/');
      const d = res.data?.data;
      if (d) {
        setStats({
          fincas: d.num_fincas ?? 0,
          cultivos: d.num_cultivos ?? 0,
          sensores: d.num_sensores ?? 0,
          sensoresActivos: d.sensores_activos ?? 0,
          sensoresInactivos: d.sensores_inactivos ?? 0,
          alertas: d.num_alertas_activas ?? 0,
          alertasCriticas: d.num_alertas_criticas ?? 0,
          usuarios: d.num_usuarios ?? 0,
          mediciones: d.mediciones_count ?? 0,
          promedioHumedad: d.promedio_humedad ?? null,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { stats, loading, reload: load };
}
