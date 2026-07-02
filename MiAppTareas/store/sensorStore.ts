import { useState, useEffect } from 'react';
import api from '../services/api';

export function useSensorStore() {
  const [sensores, setSensores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sensores/');
      setSensores(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { sensores, loading, reload: load };
}
