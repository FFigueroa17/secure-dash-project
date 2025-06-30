import { Metadata } from 'next';

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

export default async function AuthenticationPage() {
  return <AuthPage />;
}
