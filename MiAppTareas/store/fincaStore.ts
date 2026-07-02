import { useState, useEffect } from 'react';
import api from '../services/api';

export function useFincaStore() {
  const [fincas, setFincas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/fincas/');
      setFincas(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { fincas, loading, reload: load };
}
