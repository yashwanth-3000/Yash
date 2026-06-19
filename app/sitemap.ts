import type { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'
import { BLOG_POSTS } from './data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = WEBSITE_URL.replace(/\/$/, '')
  const now = new Date()

  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  // Only include posts hosted on this domain. External write-ups (e.g. Medium)
  // live on another domain and must not be in this sitemap - Google flags
  // cross-domain entries and those sites handle their own indexing.
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.filter(
    (post) => !post.link.startsWith('http'),
  ).map((post) => ({
    url: `${base}${post.link}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...baseRoutes, ...blogRoutes]
}
