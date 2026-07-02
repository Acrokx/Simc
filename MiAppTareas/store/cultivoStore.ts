import { useState, useEffect } from 'react';
import api from '../services/api';

export function useCultivoStore() {
  const [cultivos, setCultivos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cultivos/');
      setCultivos(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { cultivos, loading, reload: load };
}
