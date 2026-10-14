// Where to send someone after they sign in. It comes from ?next=/some/path, for example when
// they open an invitation link while signed out. Only paths on this site are accepted, so the
// parameter cannot be used to send people to another website.
export const getNextPath = (): string => {
  if (typeof window === 'undefined') return '';
  const next = new URLSearchParams(window.location.search).get('next') || '';
  return next.startsWith('/') && !next.startsWith('//') ? next : '';
};

export const withNext = (path: string, next: string): string =>
  next ? `${path}?next=${encodeURIComponent(next)}` : path;
