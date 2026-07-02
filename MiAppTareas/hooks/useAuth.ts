import { useEffect, useState } from 'react';
import { getItem, setItem, removeItem } from '../lib/storage';
import { StoredUser } from '../types/usuario';

export function useAuth() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await getItem('userData');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData: StoredUser) => {
    await setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await removeItem('userData');
    setUser(null);
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
}