import { Ban, Circle, Shield, XCircle } from 'lucide-react';

export function getIcon(key: string) {
  switch (key) {
    case 'totalFailures':
      return <XCircle size={20} aria-hidden="true" />;
    case 'totalBans':
      return <Ban size={20} aria-hidden="true" />;
    case 'uniqueIPs':
      return <Circle size={20} aria-hidden="true" />;
    case 'activeBans':
      return <Shield size={20} aria-hidden="true" />;
  }
}

export function formatTitle(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (str) => str.toUpperCase());
}
