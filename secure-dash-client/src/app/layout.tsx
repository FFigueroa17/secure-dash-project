import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/components/providers';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Secure Dash',
  description: 'Fail2Ban Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scheme-only-dark">
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
