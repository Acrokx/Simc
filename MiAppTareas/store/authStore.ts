import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem('userData');
        if (raw) setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setUser(null);
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
}
