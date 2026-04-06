import { describe, it, expect } from 'vitest';
import { projects } from './projects';

describe('projects data', () => {
  describe('structure validation', () => {
    it('should export a non-empty array of projects', () => {
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should have unique ids for all projects', () => {
      const ids = projects.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique titles for all projects', () => {
      const titles = projects.map((p) => p.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });
  });

  describe('required fields validation', () => {
    it.each(projects)('project "$title" should have all required fields', (project) => {
      expect(project.id).toBeDefined();
      expect(typeof project.id).toBe('number');
      expect(project.title).toBeDefined();
      expect(typeof project.title).toBe('string');
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.description).toBeDefined();
      expect(project.fullDescription).toBeDefined();
      expect(project.image).toBeDefined();
      expect(Array.isArray(project.tech)).toBe(true);
      expect(project.liveUrl).toBeDefined();
      expect(project.githubUrl).toBeDefined();
      expect(typeof project.featured).toBe('boolean');
      expect(project.category).toBeDefined();
      expect(Array.isArray(project.features)).toBe(true);
    });
  });

  describe('category validation', () => {
    const validCategories = ['Web', 'fullstack', 'mobile', 'Automotive', 'all'];

    it.each(projects)('project "$title" should have a valid category', (project) => {
      expect(validCategories).toContain(project.category);
    });
  });

  describe('image paths validation', () => {
    it.each(projects)('project "$title" should have valid image path format', (project) => {
      expect(project.image).toMatch(/^\/images\/[\w-]+\.(jpg|png|gif|webp|svg)$/i);
    });
  });

  describe('URL validation', () => {
    it.each(projects)('project "$title" should have valid GitHub URL', (project) => {
      expect(project.githubUrl).toMatch(/^https:\/\/github\.com\//);
    });

    it.each(projects)('project "$title" should have valid live URL', (project) => {
      expect(project.liveUrl).toBeDefined();
      expect(project.liveUrl.length).toBeGreaterThan(0);
    });
  });

  describe('tech stack validation', () => {
    it.each(projects)('project "$title" should have at least one technology', (project) => {
      expect(project.tech.length).toBeGreaterThan(0);
    });

    it.each(projects)('project "$title" should have non-empty tech strings', (project) => {
      project.tech.forEach((tech) => {
        expect(typeof tech).toBe('string');
        expect(tech.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('features validation', () => {
    it.each(projects)('project "$title" should have at least one feature', (project) => {
      expect(project.features.length).toBeGreaterThan(0);
    });

    it.each(projects)('project "$title" should have non-empty feature strings', (project) => {
      project.features.forEach((feature) => {
        expect(typeof feature).toBe('string');
        expect(feature.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('embeddable projects', () => {
    it('should have embeddable projects with projectPath defined', () => {
      const embeddableProjects = projects.filter((p) => p.embeddable);
      embeddableProjects.forEach((project) => {
        expect(project.projectPath).toBeDefined();
        expect(typeof project.projectPath).toBe('string');
        expect(project.projectPath!.length).toBeGreaterThan(0);
      });
    });

    it('should have embeddable projects with liveUrl pointing directly to an HTML file', () => {
      const embeddableProjects = projects.filter((p) => p.embeddable);
      embeddableProjects.forEach((project) => {
        expect(project.liveUrl).toMatch(/\.html$/i);
      });
    });
  });

  describe('featured projects', () => {
    it('should have at least one featured project', () => {
      const featuredProjects = projects.filter((p) => p.featured);
      expect(featuredProjects.length).toBeGreaterThan(0);
    });
  });
});
