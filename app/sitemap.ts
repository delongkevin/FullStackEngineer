import type { MetadataRoute } from 'next';
import { getProjectRouteKey, projects } from '../data/projects';
import { blogPosts } from '../data/blog';

const siteUrl = 'https://delongkevin.github.io/FullStackEngineer';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/resume/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/projects/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/contact/`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${getProjectRouteKey(project)}/`,
    changeFrequency: 'monthly',
    priority: project.featured ? 0.9 : 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/blog/`, changeFrequency: 'weekly', priority: 0.8 },
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}/`,
      lastModified: post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.8 : 0.7,
    })),
  ];

  return [...staticPages, ...projectPages, ...blogPages];
}