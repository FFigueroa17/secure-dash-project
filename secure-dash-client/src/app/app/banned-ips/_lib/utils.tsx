import { AlertTriangle, Shield, ShieldAlert, ShieldX } from 'lucide-react';

/**
 * Returns the configuration for a threat level badge including icon and styling.
 */
export function getThreatLevelConfig(level: string) {
  switch (level.toUpperCase()) {
    case 'LOW':
      return {
        icon: <Shield className="size-3" />,
        badgeClass: 'border-green-500/20 bg-green-500/10 text-green-600',
        label: 'Bajo',
      };
    case 'MEDIUM':
      return {
        icon: <AlertTriangle className="size-3" />,
        badgeClass: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600',
        label: 'Medio',
      };
    case 'HIGH':
      return {
        icon: <ShieldAlert className="size-3" />,
        badgeClass: 'border-orange-500/20 bg-orange-500/10 text-orange-600',
        label: 'Alto',
      };
    case 'CRITICAL':
      return {
        icon: <ShieldX className="size-3" />,
        badgeClass: 'border-red-500/20 bg-red-500/10 text-red-600',
        label: 'Crítico',
      };
    default:
      return {
        icon: <Shield className="size-3" />,
        badgeClass: 'border-gray-500/20 bg-gray-500/10 text-gray-600',
        label: 'Desconocido',
      };
  }
}

/**
 * Returns the configuration for attack frequency badge including styling.
 */
export function getAttackFrequencyConfig(frequency: string) {
  switch (frequency.toLowerCase()) {
    case 'baja':
      return {
        badgeClass: 'border-green-500/20 bg-green-500/10 text-green-600',
        label: 'Baja',
      };
    case 'media':
      return {
        badgeClass: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-600',
        label: 'Media',
      };
    case 'alta':
      return {
        badgeClass: 'border-red-500/20 bg-red-500/10 text-red-600',
        label: 'Alta',
      };
    default:
      return {
        badgeClass: 'border-gray-500/20 bg-gray-500/10 text-gray-600',
        label: 'Desconocida',
      };
  }
}

/**
 * Formats the ban duration to a more readable format.
 */
export function formatBanDuration(duration: string): string {
  return duration;
}

/**
 * Formats the threat score to show as a percentage or score out of 10.
 */
export function formatThreatScore(
  score: number,
  maxScore: number = 10,
): string {
  return `${score}/${maxScore}`;
}

/**
 * Determines if an IP is a repeat offender based on previous bans count.
 */
export function isRepeatOffender(previousBansCount: number): boolean {
  return previousBansCount > 0;
}

/**
 * Gets a color class for the threat score bar based on the score.
 */
export function getThreatScoreColor(
  score: number,
  maxScore: number = 10,
): string {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) return 'bg-red-500';
  if (percentage >= 60) return 'bg-orange-500';
  if (percentage >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
}
