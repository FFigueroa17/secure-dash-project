import { AlertTriangle, Shield, ShieldAlert, ShieldX } from 'lucide-react';

/**
 * Returns the configuration for a threat level badge including icon and styling.
 */
export function getThreatLevelConfig(level: string) {
  switch (level.toUpperCase()) {
    case 'LOW':
      return {
        icon: <Shield className="size-3" />,
        badgeClass: 'border-primary/20 bg-primary/10 text-primary',
        label: 'Bajo',
      };
    case 'MEDIUM':
      return {
        icon: <AlertTriangle className="size-3" />,
        badgeClass: 'border-warning/20 bg-warning/10 text-warning',
        label: 'Medio',
      };
    case 'HIGH':
      return {
        icon: <ShieldAlert className="size-3" />,
        badgeClass: 'border-error/20 bg-error/10 text-error',
        label: 'Alto',
      };
    case 'CRITICAL':
      return {
        icon: <ShieldX className="size-3" />,
        badgeClass: 'border-destructive/20 bg-destructive/10 text-destructive',
        label: 'Crítico',
      };
    default:
      return {
        icon: <Shield className="size-3" />,
        badgeClass: 'border-muted/20 bg-muted/10 text-muted-foreground',
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
        badgeClass: 'border-primary/20 bg-primary/10 text-primary',
        label: 'Baja',
      };
    case 'media':
      return {
        badgeClass: 'border-warning/20 bg-warning/10 text-warning',
        label: 'Media',
      };
    case 'alta':
      return {
        badgeClass: 'border-destructive/20 bg-destructive/10 text-destructive',
        label: 'Alta',
      };
    default:
      return {
        badgeClass: 'border-muted/20 bg-muted/10 text-muted-foreground',
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

  if (percentage >= 80) return 'bg-destructive';
  if (percentage >= 60) return 'bg-error';
  if (percentage >= 40) return 'bg-warning';
  return 'bg-primary';
}
