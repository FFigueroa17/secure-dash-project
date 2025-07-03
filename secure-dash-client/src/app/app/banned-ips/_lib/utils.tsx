import { AlertTriangle, Shield, ShieldAlert, ShieldX } from 'lucide-react';

/**
 * Configuration for threat level badges
 *
 * Maps threat levels to their corresponding icons, styling classes, and labels.
 * Used to provide visual feedback for security threat assessments.
 *
 * @param level - The threat level string (case-insensitive)
 * @returns Object containing icon component, CSS classes, and translated label
 *
 * @example
 * ```tsx
 * const { icon, badgeClass, label } = getThreatLevelConfig('HIGH');
 * // Returns: { icon: <ShieldAlert />, badgeClass: '...', label: 'Alto' }
 * ```
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
 * Configuration for attack frequency badges
 *
 * Maps attack frequency strings to their corresponding styling classes.
 * Used to indicate the rate of attacks from a particular source.
 *
 * @param frequency - The attack frequency string (case-insensitive)
 * @returns Object containing CSS classes and localized label
 *
 * @example
 * ```tsx
 * const { badgeClass, label } = getAttackFrequencyConfig('alta');
 * // Returns: { badgeClass: 'border-destructive/20...', label: 'Alta' }
 * ```
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
 * Configuration for failed attempts badges based on attempt count
 *
 * Categorizes failed login attempts into severity levels with corresponding
 * visual styling. Higher attempt counts indicate more aggressive attack patterns.
 *
 * Thresholds:
 * - ≥20 attempts: High severity (red)
 * - ≥10 attempts: Medium severity (yellow/orange)
 * - ≥5 attempts: Low severity (orange)
 * - <5 attempts: Minimal severity (gray)
 *
 * @param failedAttempts - Number of failed login attempts
 * @returns Object containing CSS classes, label, and severity level
 *
 * @example
 * ```tsx
 * const { badgeClass, label, severity } = getFailedAttemptsConfig(25);
 * // Returns: { badgeClass: '...destructive...', label: 'Alta', severity: 'high' }
 * ```
 */
export function getFailedAttemptsConfig(failedAttempts: number) {
  // Define thresholds for different severity levels
  if (failedAttempts >= 20) {
    return {
      badgeClass:
        'border-destructive/20 bg-destructive/10 text-destructive font-medium',
      label: 'Alta',
      severity: 'high' as const,
    };
  } else if (failedAttempts >= 10) {
    return {
      badgeClass: 'border-warning/20 bg-warning/10 text-warning',
      label: 'Media',
      severity: 'medium' as const,
    };
  } else if (failedAttempts >= 5) {
    return {
      badgeClass: 'border-orange-400/20 bg-orange-400/10 text-orange-400',
      label: 'Baja',
      severity: 'low' as const,
    };
  } else {
    return {
      badgeClass: 'border-muted/20 bg-muted/10 text-muted-foreground',
      label: 'Mínima',
      severity: 'minimal' as const,
    };
  }
}

/**
 * Formats failed attempts count with proper Spanish pluralization
 *
 * @param count - Number of failed attempts
 * @returns Formatted string with correct plural form
 *
 * @example
 * ```tsx
 * formatFailedAttempts(1);  // "1 intento"
 * formatFailedAttempts(5);  // "5 intentos"
 * ```
 */
export function formatFailedAttempts(count: number): string {
  if (count === 1) {
    return `${count} intento`;
  }
  return `${count} intentos`;
}

/**
 * Formats ban duration string for display
 *
 * Currently returns the duration as-is but provides a centralized
 * location for future formatting enhancements.
 *
 * @param duration - Ban duration string (e.g., "10m", "600s")
 * @returns Formatted duration string
 *
 * @example
 * ```tsx
 * formatBanDuration("10m");  // "10m"
 * ```
 */
export function formatBanDuration(duration: string): string {
  return duration;
}

/**
 * Formats threat score as a fraction
 *
 * @param score - Current threat score
 * @param maxScore - Maximum possible score (default: 10)
 * @returns Formatted score string
 *
 * @example
 * ```tsx
 * formatThreatScore(7, 10);  // "7/10"
 * formatThreatScore(8);      // "8/10" (using default maxScore)
 * ```
 */
export function formatThreatScore(
  score: number,
  maxScore: number = 10,
): string {
  return `${score}/${maxScore}`;
}

/**
 * Determines if an IP is a repeat offender
 *
 * An IP is considered a repeat offender if it has any previous ban history.
 *
 * @param previousBansCount - Number of previous bans for this IP
 * @returns True if IP has been banned before, false otherwise
 *
 * @example
 * ```tsx
 * isRepeatOffender(0);  // false
 * isRepeatOffender(3);  // true
 * ```
 */
export function isRepeatOffender(previousBansCount: number): boolean {
  return previousBansCount > 0;
}

/**
 * Gets color class for threat score visualization
 *
 * Maps threat score percentages to appropriate background colors
 * for progress bars or other visual indicators.
 *
 * @param score - Current threat score
 * @param maxScore - Maximum possible score (default: 10)
 * @returns CSS class name for background color
 *
 * @example
 * ```tsx
 * getThreatScoreColor(9, 10);  // "bg-destructive" (90% = high threat)
 * getThreatScoreColor(3, 10);  // "bg-primary" (30% = low threat)
 * ```
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

/**
 * Calculates the remaining ban time for an IP based on ban start time and duration.
 * Assumes a default ban duration of 10 minutes (600 seconds).
 * Includes a ±30 second threshold for more stable calculations.
 */
export function calculateRemainingBanTime(
  banTime: string,
  banDuration: string = '10m',
) {
  const DEFAULT_BAN_DURATION_MINUTES = 10;
  const DEFAULT_BAN_DURATION_MS = DEFAULT_BAN_DURATION_MINUTES * 60 * 1000;
  const THRESHOLD_MS = 30 * 1000; // ±30 seconds threshold

  const banStartTime = new Date(banTime).getTime();
  const currentTime = Date.now();
  const elapsedTime = currentTime - banStartTime;

  // Parse ban duration if provided, otherwise use default
  let durationMs = DEFAULT_BAN_DURATION_MS;
  // Try to parse duration string (e.g., "10m", "600s", etc.)
  const match = banDuration.match(/^(\d+)([smh]?)$/);
  if (match) {
    const value = parseInt(match[1] || '0');
    const unit = match[2] || 'm'; // default to minutes

    switch (unit) {
      case 's':
        durationMs = value * 1000;
        break;
      case 'm':
        durationMs = value * 60 * 1000;
        break;
      case 'h':
        durationMs = value * 60 * 60 * 1000;
        break;
    }
  }

  // Calculate remaining time with threshold consideration
  const rawRemainingTime = durationMs - elapsedTime;

  // Apply threshold: if within ±30s of expiration, consider it expired
  // if within ±30s of start, consider it just started
  let remainingTime: number;

  if (rawRemainingTime <= THRESHOLD_MS && rawRemainingTime >= -THRESHOLD_MS) {
    // Within threshold of expiration - consider expired
    remainingTime = 0;
  } else if (rawRemainingTime >= durationMs - THRESHOLD_MS) {
    // Within threshold of start time - consider full duration
    remainingTime = durationMs;
  } else {
    // Normal case - use calculated time but ensure it's not negative
    remainingTime = Math.max(0, rawRemainingTime);
  }

  const progressPercentage = Math.max(0, (remainingTime / durationMs) * 100);

  return {
    remainingMs: remainingTime,
    totalMs: durationMs,
    progressPercentage,
    isExpired: remainingTime === 0,
  };
}

/**
 * Formats remaining time in a human-readable format (minutes only).
 */
export function formatRemainingTime(remainingMs: number): string {
  if (remainingMs === 0) {
    return '-';
  }

  const totalMinutes = Math.ceil(remainingMs / (60 * 1000)); // Round up to next minute

  if (totalMinutes <= 0) {
    return '-';
  }

  return `${totalMinutes}m`;
}

/**
 * Gets configuration for remaining time display based on progress percentage
 *
 * Provides appropriate styling and status labels based on how much ban time remains.
 * Used for progress bars and status badges in the UI.
 *
 * Progress thresholds:
 * - 0%: Expired (gray)
 * - 1-25%: Expiring soon (red)
 * - 26-50%: Halfway through (yellow)
 * - 51-100%: Recently banned (blue)
 *
 * @param progressPercentage - Percentage of ban time remaining (0-100)
 * @returns Configuration object with styling classes, label, and status
 *
 * @example
 * ```tsx
 * const config = getRemainingTimeConfig(15);
 * // Returns: {
 * //   progressClass: 'bg-destructive',
 * //   badgeClass: 'border-destructive/20...',
 * //   label: 'Próximo a expirar',
 * //   status: 'expiring'
 * // }
 * ```
 */
export function getRemainingTimeConfig(progressPercentage: number) {
  if (progressPercentage === 0) {
    return {
      progressClass: 'bg-muted',
      badgeClass: 'border-muted/20 bg-muted/10 text-muted-foreground',
      label: 'Expirado',
      status: 'expired' as const,
    };
  } else if (progressPercentage <= 25) {
    return {
      progressClass: 'bg-destructive',
      badgeClass: 'border-destructive/20 bg-destructive/10 text-destructive',
      label: 'Próximo a expirar',
      status: 'expiring' as const,
    };
  } else if (progressPercentage <= 50) {
    return {
      progressClass: 'bg-warning',
      badgeClass: 'border-warning/20 bg-warning/10 text-warning',
      label: 'Medio tiempo',
      status: 'halfway' as const,
    };
  } else {
    return {
      progressClass: 'bg-primary',
      badgeClass: 'border-primary/20 bg-primary/10 text-primary',
      label: 'Reciente',
      status: 'recent' as const,
    };
  }
}
