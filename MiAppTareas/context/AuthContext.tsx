import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getItem, setItem, removeItem } from '../lib/storage';
import { StoredUser } from '../types/usuario';

interface AuthContextValue {
  user: StoredUser | null;
  loading: boolean;
  login: (userData: StoredUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await getItem('userData');
        if (raw) setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const login = async (userData: StoredUser) => {
    await setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
