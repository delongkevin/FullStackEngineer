/**
 * Shared statistics and skill calculation logic for the About Me page
 * and verification scripts.
 */

export interface ProjectInfo {
  id: number;
  title: string;
  tech: string[];
  features: string[];
}

export interface SkillWithProjects {
  name: string;
  level: number;
  projectCount: number;
  projects: Array<{ id: number; title: string; complexity: number }>;
  complexityScore: number;
}

export const skillDefinitions: Record<
  'frontend' | 'backend' | 'tools',
  Array<{ name: string; aliases: string[] }>
> = {
  frontend: [
    { name: 'React', aliases: ['React', 'React Native'] },
    { name: 'TypeScript', aliases: ['TypeScript'] },
    { name: 'Next.js', aliases: ['Next.js'] },
    { name: 'JavaScript', aliases: ['JavaScript'] },
    { name: 'HTML/CSS', aliases: ['HTML5', 'CSS3', 'HTML/CSS'] },
  ],
  backend: [
    { name: 'Node.js', aliases: ['Node.js'] },
    { name: 'Python', aliases: ['Python'] },
    { name: 'MongoDB', aliases: ['MongoDB'] },
    { name: 'PostgreSQL', aliases: ['PostgreSQL'] },
    { name: 'Firebase', aliases: ['Firebase'] },
  ],
  tools: [
    { name: 'Git', aliases: ['Git', 'GitHub'] },
    { name: 'Docker', aliases: ['Docker'] },
    { name: 'AWS', aliases: ['AWS'] },
    { name: 'Figma', aliases: ['Figma'] },
    { name: 'Jest', aliases: ['Jest'] },
  ],
};

/**
 * Calculate the skill level (percentage) for a given skill based on how many
 * projects use that skill.
 *
 * @param aliases - Array of skill aliases to match (case-insensitive)
 * @param projectTechSets - Array of Sets containing lowercase technology names for each project
 * @returns Percentage (0-100) representing how many projects use this skill
 */
export function calculateSkillLevel(aliases: string[], projectTechSets: Set<string>[]): number {
  if (projectTechSets.length === 0) {
    return 0;
  }

  const normalizedAliases = aliases.map((alias) => alias.toLowerCase());
  const projectsUsingSkill = projectTechSets.filter((techSet) =>
    normalizedAliases.some((alias) => techSet.has(alias)),
  ).length;

  return Math.round((projectsUsingSkill / projectTechSets.length) * 100);
}

/**
 * Calculate project complexity score based on multiple factors
 *
 * @param project - Project with tech stack and features
 * @returns Complexity score (0-100)
 */
export function calculateProjectComplexity(project: ProjectInfo): number {
  const techCount = project.tech.length;
  const featureCount = project.features.length;

  // Base complexity on tech stack size (40% weight) and feature count (60% weight)
  const techScore = Math.min(techCount / 15, 1) * 40; // Normalize to 15+ techs = max
  const featureScore = Math.min(featureCount / 10, 1) * 60; // Normalize to 10+ features = max

  return Math.round(techScore + featureScore);
}

/**
 * Calculate enhanced skill level with project references and complexity weighting
 *
 * @param aliases - Array of skill aliases to match (case-insensitive)
 * @param projects - Array of all projects with their info
 * @returns SkillWithProjects object containing level, project references, and complexity
 */
export function calculateSkillWithProjects(
  aliases: string[],
  projects: ProjectInfo[]
): SkillWithProjects {
  if (projects.length === 0) {
    return {
      name: aliases[0] || 'Unknown',
      level: 0,
      projectCount: 0,
      projects: [],
      complexityScore: 0,
    };
  }

  const normalizedAliases = aliases.map((alias) => alias.toLowerCase());

  // Find projects using this skill
  const matchingProjects = projects
    .filter((project) =>
      project.tech.some((tech) =>
        normalizedAliases.includes(tech.toLowerCase())
      )
    )
    .map((project) => ({
      id: project.id,
      title: project.title,
      complexity: calculateProjectComplexity(project),
    }))
    .sort((a, b) => b.complexity - a.complexity); // Sort by complexity descending

  // Calculate complexity-weighted skill level
  const totalComplexity = matchingProjects.reduce((sum, p) => sum + p.complexity, 0);
  const avgComplexity = matchingProjects.length > 0 ? totalComplexity / matchingProjects.length : 0;

  // Skill level based on:
  // - 40% from project usage frequency
  // - 60% from average complexity of projects using the skill
  const frequencyScore = (matchingProjects.length / projects.length) * 40;
  const complexityScore = avgComplexity * 0.6;
  const level = Math.min(Math.round(frequencyScore + complexityScore), 100);

  return {
    name: aliases[0] || 'Unknown',
    level,
    projectCount: matchingProjects.length,
    projects: matchingProjects,
    complexityScore: Math.round(avgComplexity),
  };
}
