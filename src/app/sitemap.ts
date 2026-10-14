import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

// Only public pages belong here; the dashboard requires a login.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteConfig.url}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.url}/register`, lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${siteConfig.url}/login`, lastModified, changeFrequency: 'yearly', priority: 0.5 }
  ];
}
