export function formatDate(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Hace menos de 1h';
  if (diffHours < 24) return `Hace ${diffHours}h`;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-CO');
}
