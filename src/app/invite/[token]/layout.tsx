import type { Metadata } from 'next';

// Invitation links are private, so they should never show up in search results
export const metadata: Metadata = {
  title: 'Join a workspace',
  robots: { index: false, follow: false }
};

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
