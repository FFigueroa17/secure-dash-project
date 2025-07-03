'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { verifySession } from '@/lib/dal';

const JAIL = 'sshd';

/**
 * Manually bans an IP address using the Fail2ban API.
 *
 * This server action provides the ability to manually ban IP addresses through
 * the backend API. It includes:
 *
 * 1. **Authentication validation**: Ensures the user has a valid session before
 *    allowing the ban operation to proceed
 *
 * 2. **Direct API integration**: Communicates with the Fail2ban backend service
 *    to add the IP to the banned list
 *
 * 3. **Error handling**: Properly handles and reports API errors with detailed
 *    error messages from the backend
 *
 * 4. **Authorization**: Uses bearer token authentication to ensure secure
 *    communication with the API
 *
 * @param ip - The IP address to ban (IPv4 or IPv6 format)
 * @returns Promise resolving to success object or error object
 *
 * @throws {Error} When the API request fails or returns an error response
 *
 * @example
 * ```typescript
 * const result = await banIp('192.168.1.100');
 * if (result.error) {
 *   console.error('Failed to ban IP:', result.error);
 * } else {
 *   console.log('IP banned successfully');
 * }
 * ```
 */
export async function banIp(ip: string) {
  // Verify user session and authorization
  const session = await verifySession();
  if (!session) return { error: 'Unauthorized' };

  // Construct the API endpoint URL for banning the specific IP
  const url = `${process.env.NEXT_PUBLIC_API_URL}/jails/${JAIL}/ban-ip`;

  // Send POST request to ban the IP address
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ ip_address: ip }),
  });

  // Handle API errors and throw with detailed error message
  if (!res.ok) {
    const response = await res.json();
    throw new Error(`Failed to ban ip: ${response.message}`);
  }

  // Parse the response even when successful
  const response = await res.json();

  // Check if the IP is already banned
  if (response.status === 'info') {
    return {
      ok: false,
      alreadyBanned: true,
      message: response.message,
    };
  }

  revalidateTag('banned-ips');
  // Return success indicator
  return { ok: true };
}

/**
 * Manually unbans an IP address using the Fail2ban API.
 *
 * This server action provides the ability to manually unban IP addresses through
 * the backend API. It includes:
 *
 * 1. **Authentication validation**: Ensures the user has a valid session before
 *    allowing the unban operation to proceed
 *
 * 2. **Direct API integration**: Communicates with the Fail2ban backend service
 *    to remove the IP from the banned list
 *
 * 3. **Error handling**: Properly handles and reports API errors with detailed
 *    error messages from the backend
 *
 * 4. **Authorization**: Uses bearer token authentication to ensure secure
 *    communication with the API
 *
 * @param ip - The IP address to unban (IPv4 or IPv6 format)
 * @returns Promise resolving to success object or error object
 *
 * @throws {Error} When the API request fails or returns an error response
 *
 * @example
 * ```typescript
 * const result = await unbanIp('192.168.1.100');
 * if (result.error) {
 *   console.error('Failed to unban IP:', result.error);
 * } else {
 *   console.log('IP unbanned successfully');
 * }
 * ```
 */
export async function unbanIp(ip: string) {
  // Verify user session and authorization
  const session = await verifySession();
  if (!session) return { error: 'Unauthorized' };

  // Construct the API endpoint URL for unbanning the specific IP
  const url = `${process.env.NEXT_PUBLIC_API_URL}/jails/${JAIL}/unban-ip`;

  // Send POST request to unban the IP address
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ ip_address: ip }),
  });

  // Handle API errors and throw with detailed error message
  if (!res.ok) {
    const response = await res.json();
    throw new Error(
      `Failed to unban ip: ${response.error} ${response.message}`,
    );
  }

  revalidateTag('banned-ips');
  // Return success indicator
  return { ok: true };
}

/**
 * Server action to navigate to the logs page with IP filtering.
 *
 * This server action provides a reliable way to navigate to the main logs page
 * with a specific IP address filter applied. It includes:
 *
 * 1. **Authentication validation**: Ensures the user has a valid session
 * 2. **Cache revalidation**: Revalidates relevant cache tags to ensure fresh data
 * 3. **Proper URL encoding**: Ensures the IP address is correctly encoded in the URL
 * 4. **Server-side redirect**: Uses Next.js server-side redirect for reliable navigation
 *
 * @param ip - The IP address to filter by in the logs page
 * @returns Promise that redirects to the logs page with the IP filter applied
 *
 * @example
 * ```typescript
 * await navigateToIPLogs('192.168.1.100');
 * // Redirects to /app?message=192.168.1.100
 * ```
 */
export async function navigateToIPLogs(ip: string) {
  // Verify user session and authorization
  const session = await verifySession();
  if (!session) return { error: 'Unauthorized' };

  // Revalidate cache tags to ensure fresh data on the destination page
  revalidateTag('fail2ban-logs');
  revalidateTag('fail2ban-logs-overview');
  revalidateTag('banned-ips');

  // Construct the URL with proper encoding
  const params = new URLSearchParams();
  params.set('message', ip);

  // Redirect to the logs page with the IP filter applied
  redirect(`/app?${params.toString()}`);
}
