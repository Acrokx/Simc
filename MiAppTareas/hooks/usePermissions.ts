export function usePermissions() {
  return {
    isAdmin: (rol?: string) => (rol || '').toLowerCase() === 'administrador',
    isFarmer: (rol?: string) => (rol || '').toLowerCase() === 'agricultor',
  };
}
