export const PERMISSIONS = {
  ADMIN_ONLY: ['administrador'],
  FARMER_ONLY: ['agricultor'],
  ALL: ['administrador', 'agricultor'],
} as const;

export function hasRole(userRole: string | undefined, allowedRoles: readonly string[]) {
  return userRole && allowedRoles.includes(userRole.toLowerCase());
}