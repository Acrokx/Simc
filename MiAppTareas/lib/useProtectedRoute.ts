import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { getItem } from './storage';

export function useProtectedRoute(redirectTo = '/login') {
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userString = await getItem('userData');
                if (!userString && pathname !== '/login') {
                    router.replace(redirectTo as any);
                }
            } catch {
                if (pathname !== '/login') {
                    router.replace(redirectTo as any);
                }
            }
        };
        checkAuth();
    }, [router, redirectTo, pathname]);
}

export function useRedirectIfAuthenticated() {
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        if (pathname === '/login') {
            const checkAuth = async () => {
                try {
                    const userString = await getItem('userData');
                    if (userString) {
                        const user = JSON.parse(userString);
                        const rol = (user.rol || '').toLowerCase();
                        router.replace(rol === 'administrador' ? '/admin-dashboard' : '/agricultor');
                    }
                } catch {
                    // ignore
                }
            };
            checkAuth();
        }
    }, [router, pathname]);
}