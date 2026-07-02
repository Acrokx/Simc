import { useState, useEffect } from 'react';
import api from '../services/api';

export interface Alerta {
  id_alerta: number;
  tipo_alerta: string;
  descripcion: string;
  fecha_alerta: string;
  prioridad: string;
  leida: boolean;
}

export function useAlertaStore() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/alertas/');
      setAlertas(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { alertas, loading, reload: load };
}
