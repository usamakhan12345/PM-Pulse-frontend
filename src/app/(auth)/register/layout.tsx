import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create your account',
  description: 'Create a PulsePM account to set up workspaces, add projects and track tasks with your team.',
  alternates: { canonical: '/register' }
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
