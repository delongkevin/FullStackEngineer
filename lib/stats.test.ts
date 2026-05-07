import { describe, it, expect } from 'vitest';
import {
  calculateSkillLevel,
  calculateProjectComplexity,
  calculateSkillWithProjects,
  type ProjectInfo,
} from './stats';

describe('stats functions', () => {
  describe('calculateSkillLevel', () => {
    it('should return 0 when no projects exist', () => {
      const result = calculateSkillLevel(['React'], []);
      expect(result).toBe(0);
    });

    it('should calculate percentage based on project usage', () => {
      const projectTechSets = [
        new Set(['react', 'javascript']),
        new Set(['python', 'django']),
        new Set(['react', 'typescript']),
        new Set(['javascript', 'node.js']),
      ];

      const reactLevel = calculateSkillLevel(['React'], projectTechSets);
      expect(reactLevel).toBe(50); // 2 out of 4 projects = 50%

      const jsLevel = calculateSkillLevel(['JavaScript'], projectTechSets);
      expect(jsLevel).toBe(50); // 2 out of 4 projects = 50%

      const pythonLevel = calculateSkillLevel(['Python'], projectTechSets);
      expect(pythonLevel).toBe(25); // 1 out of 4 projects = 25%
    });

    it('should handle multiple aliases', () => {
      const projectTechSets = [
        new Set(['react native']),
        new Set(['react']),
      ];

      const result = calculateSkillLevel(['React', 'React Native'], projectTechSets);
      expect(result).toBe(100); // Both projects match
    });

    it('should be case-insensitive', () => {
      const projectTechSets = [
        new Set(['react']),
        new Set(['react']),
        new Set(['react']),
      ];

      const result = calculateSkillLevel(['React'], projectTechSets);
      expect(result).toBe(100);
    });
  });

  describe('calculateProjectComplexity', () => {
    it('should return 0 when project has no tech or features', () => {
      const emptyProject: ProjectInfo = {
        id: 1,
        title: 'Empty Project',
        tech: [],
        features: [],
      };

      const complexity = calculateProjectComplexity(emptyProject);
      expect(complexity).toBe(0);
    });

    it('should calculate complexity based on tech and features', () => {
      const simpleProject: ProjectInfo = {
        id: 1,
        title: 'Simple App',
        tech: ['HTML', 'CSS'],
        features: ['Feature 1', 'Feature 2'],
      };

      const complexity = calculateProjectComplexity(simpleProject);
      expect(complexity).toBeGreaterThan(0);
      expect(complexity).toBeLessThanOrEqual(100);
    });

    it('should give higher complexity to projects with more tech and features', () => {
      const simpleProject: ProjectInfo = {
        id: 1,
        title: 'Simple',
        tech: ['HTML', 'CSS'],
        features: ['Feature 1'],
      };

      const complexProject: ProjectInfo = {
        id: 2,
        title: 'Complex',
        tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'GraphQL'],
        features: ['Auth', 'Real-time', 'Analytics', 'Payment', 'API', 'Admin', 'Search', 'Export'],
      };

      const simpleComplexity = calculateProjectComplexity(simpleProject);
      const complexComplexity = calculateProjectComplexity(complexProject);

      expect(complexComplexity).toBeGreaterThan(simpleComplexity);
    });

    it('should cap complexity at 100', () => {
      const megaProject: ProjectInfo = {
        id: 1,
        title: 'Mega Project',
        tech: Array.from({ length: 50 }, (_, i) => `Tech${i}`),
        features: Array.from({ length: 50 }, (_, i) => `Feature${i}`),
      };

      const complexity = calculateProjectComplexity(megaProject);
      expect(complexity).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateSkillWithProjects', () => {
    const mockProjects: ProjectInfo[] = [
      {
        id: 1,
        title: 'React App',
        tech: ['React', 'JavaScript', 'CSS3'],
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
      },
      {
        id: 2,
        title: 'Python Backend',
        tech: ['Python', 'Django', 'PostgreSQL'],
        features: ['API', 'Auth', 'Database'],
      },
      {
        id: 3,
        title: 'Full Stack App',
        tech: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker'],
        features: ['Auth', 'API', 'Real-time', 'Analytics', 'Deployment'],
      },
      {
        id: 4,
        title: 'React Native App',
        tech: ['React Native', 'JavaScript', 'Firebase'],
        features: ['Mobile', 'Push Notifications'],
      },
    ];

    it('should return zero stats when no projects exist', () => {
      const result = calculateSkillWithProjects(['React'], []);
      expect(result.level).toBe(0);
      expect(result.projectCount).toBe(0);
      expect(result.projects).toHaveLength(0);
    });

    it('should find all projects using a skill', () => {
      const result = calculateSkillWithProjects(['React', 'React Native'], mockProjects);

      expect(result.projectCount).toBe(3); // React App, Full Stack App, React Native App
      expect(result.projects).toHaveLength(3);
      expect(result.level).toBeGreaterThan(0);
    });

    it('should sort projects by complexity descending', () => {
      const result = calculateSkillWithProjects(['React', 'React Native'], mockProjects);

      // Full Stack App should be first (most complex with 5 tech and 5 features)
      expect(result.projects[0].title).toBe('Full Stack App');

      // Verify complexities are in descending order
      for (let i = 0; i < result.projects.length - 1; i++) {
        expect(result.projects[i].complexity).toBeGreaterThanOrEqual(result.projects[i + 1].complexity);
      }
    });

    it('should calculate complexity-weighted skill level', () => {
      const reactResult = calculateSkillWithProjects(['React', 'React Native'], mockProjects);
      const pythonResult = calculateSkillWithProjects(['Python'], mockProjects);

      // React is used in 3 projects (75% frequency) with varying complexity
      // Python is used in 1 project (25% frequency)
      expect(reactResult.level).toBeGreaterThan(pythonResult.level);
    });

    it('should include complexity score in result', () => {
      const result = calculateSkillWithProjects(['React', 'React Native'], mockProjects);

      expect(result.complexityScore).toBeGreaterThan(0);
      expect(result.complexityScore).toBeLessThanOrEqual(100);
    });

    it('should filter projects with matching tech (case-insensitive)', () => {
      const result = calculateSkillWithProjects(['javascript'], mockProjects);

      // Should match React App and React Native App
      expect(result.projectCount).toBe(2);
      expect(result.projects.some(p => p.title === 'React App')).toBe(true);
      expect(result.projects.some(p => p.title === 'React Native App')).toBe(true);
    });

    it('should return skill name from first alias', () => {
      const result = calculateSkillWithProjects(['React', 'React Native'], mockProjects);
      expect(result.name).toBe('React');
    });

    it('should handle skills not used in any project', () => {
      const result = calculateSkillWithProjects(['Rust'], mockProjects);

      expect(result.projectCount).toBe(0);
      expect(result.projects).toHaveLength(0);
      expect(result.level).toBe(0);
    });
  });
});
