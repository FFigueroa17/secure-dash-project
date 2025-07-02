import { ShieldCheck, User as UserIcon, Users } from 'lucide-react';

/**
 * Returns the configuration for a user role badge including icon and styling.
 */
export function getRoleConfig(role: string) {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return {
        icon: <ShieldCheck className="size-3" />,
        badgeClass:
          'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400',
        label: 'Admin',
      };
    case 'USER':
      return {
        icon: <UserIcon className="size-3" />,
        badgeClass: 'border-primary/20 bg-primary/10 text-primary',
        label: 'Usuario',
      };
    default:
      return {
        icon: <Users className="size-3" />,
        badgeClass:
          'border-muted-foreground/20 bg-muted/10 text-muted-foreground',
        label: 'Desconocido',
      };
  }
}

/**
 * Returns the configuration for user status including styling.
 */
export function getUserStatusConfig(isActive: boolean) {
  if (isActive) {
    return {
      badgeClass: 'border-green-500/20 bg-green-500/10 text-green-700',
      label: 'Activo',
    };
  } else {
    return {
      badgeClass: 'border-red-500/20 bg-red-500/10 text-red-700',
      label: 'Inactivo',
    };
  }
}

/**
 * Formats user roles for display.
 */
export function formatUserRoles(roles: string[]): string {
  return roles.join(', ');
}

/**
 * Gets the primary role of a user (highest priority role).
 */
export function getPrimaryRole(roles: string[]): string {
  const roleHierarchy = ['ADMIN', 'USER'];

  for (const role of roleHierarchy) {
    if (roles.includes(role)) {
      return role;
    }
  }

  return roles[0] || 'USER';
}

/**
 * Determines if a user has admin privileges.
 */
export function isAdmin(roles: string[]): boolean {
  return roles.includes('ADMIN');
}

/**
 * Gets initials from username for avatar display.
 */
export function getUserInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

/**
 * Validates email format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
