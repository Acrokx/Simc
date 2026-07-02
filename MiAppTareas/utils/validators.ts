export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function hasRole(userRole: string | undefined, allowedRoles: readonly string[]): boolean {
  return !!userRole && allowedRoles.includes(userRole.toLowerCase());
}
