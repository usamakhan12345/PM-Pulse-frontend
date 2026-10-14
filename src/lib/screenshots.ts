import fs from 'fs';
import path from 'path';

// Finds a screenshot in public/screenshots by name, whatever its extension.
// Returns null when the file has not been added, so callers can fall back to something else.
export const findScreenshot = (name: string): string | null => {
  const dir = path.join(process.cwd(), 'public', 'screenshots');
  for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'avif']) {
    if (fs.existsSync(path.join(dir, `${name}.${ext}`))) return `/screenshots/${name}.${ext}`;
  }
  return null;
};
