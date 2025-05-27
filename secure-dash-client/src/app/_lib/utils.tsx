import { AlertTriangle, BarChart3, Shield, TrendingDown } from 'lucide-react';

export function getIcon(key: string) {
  switch (key) {
    case 'logs_difference':
      return <TrendingDown size={20} aria-hidden="true" />;
    case 'parse_rate':
      return <BarChart3 size={20} aria-hidden="true" />;
    case 'ban_events':
      return <Shield size={20} aria-hidden="true" />;
    case 'warn_error_logs':
      return <AlertTriangle size={20} aria-hidden="true" />;
  }
}

export function formatTitle(key: string) {
  switch (key) {
    case 'logs_difference':
      return 'Diferencia de Logs';
    case 'parse_rate':
      return 'Tasa de Análisis';
    case 'ban_events':
      return 'Eventos de Bloqueo';
    case 'warn_error_logs':
      return 'Logs de Advertencia y Error';
    default:
      return key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
}
