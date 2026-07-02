export function cn(...classes: (string | boolean | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function mapTone(prioridad: string): 'success' | 'warning' | 'error' | 'info' {
  const p = prioridad.toLowerCase();
  if (p === 'alta' || p === 'critica') return 'error';
  if (p === 'media') return 'warning';
  if (p === 'baja') return 'success';
  return 'info';
}
