import { useEffect, useState } from 'react';
import api from '../services/api';

export function useNotifications() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/alertas/?leida=false');
        setCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  return { count };
}
