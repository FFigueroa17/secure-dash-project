import { Ban, Circle, Shield, XCircle } from 'lucide-react';

export function getIcon(key: string) {
  switch (key) {
    case 'logs_difference':
      return <XCircle size={20} aria-hidden="true" />;
    case 'parse_rate':
      return <Ban size={20} aria-hidden="true" />;
    case 'ban_events':
      return <Circle size={20} aria-hidden="true" />;
    case 'warn_error_logs':
      return <Shield size={20} aria-hidden="true" />;
  }
}

export function formatTitle(key: string) {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
