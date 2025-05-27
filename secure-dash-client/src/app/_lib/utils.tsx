import {
  AlertTriangle,
  BarChart3,
  CircleAlert,
  FileText,
  Info,
  Shield,
  TrendingDown,
} from 'lucide-react';

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

// Helper function to get log level styling and icon
export const getLogLevelConfig = (level: string) => {
  switch (level) {
    case 'INFO':
      return {
        icon: <FileText className="text-info" size={14} aria-hidden="true" />,
        badgeClass: 'border-info/20 text-info',
      };
    case 'DEBUG':
      return {
        icon: <Info className="text-info" size={14} aria-hidden="true" />,
        badgeClass: 'border-info/20 text-info',
      };
    case 'NOTICE':
      return {
        icon: <Info className="text-warning" size={14} aria-hidden="true" />,
        badgeClass: 'border-warning/20 text-warning',
      };
    case 'WARNING':
      return {
        icon: (
          <AlertTriangle
            className="text-amber-500"
            size={14}
            aria-hidden="true"
          />
        ),
        badgeClass: 'border-amber-100 text-amber-700',
      };
    case 'ERROR':
      return {
        icon: (
          <CircleAlert className="text-error" size={14} aria-hidden="true" />
        ),
        badgeClass: 'border-error/20 text-error',
      };
    case 'UNKNOWN':
      return {
        icon: (
          <CircleAlert className="text-gray-500" size={14} aria-hidden="true" />
        ),
        badgeClass: 'border-gray-500/20 text-gray-500',
      };
    default:
      return {
        icon: (
          <CircleAlert className="text-info" size={14} aria-hidden="true" />
        ),
        badgeClass: 'border-info/20 text-info',
      };
  }
};
