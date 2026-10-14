import './globals.css';
import React from 'react';
import ReduxProvider from '@/components/providers/ReduxProvider';

export const metadata = {
  title: 'PulsePM | Enterprise Jira + Slack SaaS Platform',
  description: 'Full-Stack SaaS Project Management & Real-time Team Communication'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
