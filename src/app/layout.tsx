import './globals.css';
import React from 'react';
import type { Metadata, Viewport } from 'next';
import ReduxProvider from '@/components/providers/ReduxProvider';
import PwaRegister from '@/components/pwa/PwaRegister';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: '/',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description
  },
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, title: 'PulsePM', statusBarStyle: 'default' },
  formatDetection: { telephone: false, email: false, address: false }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <PwaRegister />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
