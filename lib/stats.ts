/**
 * Shared statistics and skill calculation logic for the About Me page
 * and verification scripts.
 */

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
