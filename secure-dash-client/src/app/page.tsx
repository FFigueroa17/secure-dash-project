import { Metadata } from 'next';
import { Suspense } from 'react';

import AuthPageSkeleton from '@/app/_components/auth-page-skeleton';

import { AuthPage } from './_components/auth-page';

// Metadata for SEO and social sharing
export const metadata: Metadata = {
  title: 'Sign In | Secure Dash',
  description: 'Access your account and continue your journey with us',
  keywords: ['login', 'signin', 'account', 'secure dash'],
  openGraph: {
    title: 'Sign In | Secure Dash',
    description: 'Access your account and continue your journey with us',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const checkHealth = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/health`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch health');
    }

    const response = await res.json();
    return response.status === 'ok' ? true : false;
  } catch (error) {
    console.error('Error fetching health:', error);
    return false;
  }
};

export default async function AuthenticationPage() {
  const isHealthy = await checkHealth();
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <AuthPage isHealthy={isHealthy} />
    </Suspense>
  );
}
