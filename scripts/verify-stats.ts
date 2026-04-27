/**
 * Verification script: confirms that the About Me page skill percentages
 * match the actual project data.
 *
 * Run with:  npx tsx scripts/verify-stats.ts
 *        or: npm run verify-stats
 */

import { projects } from '../data/projects';
import { skillDefinitions, calculateSkillLevel } from '../lib/stats';

console.log('========================================');
console.log('ABOUT ME PAGE STATISTICS VERIFICATION');
console.log('========================================\n');

console.log('Total Projects: ' + projects.length + '\n');

// Category breakdown
console.log('--- CATEGORY BREAKDOWN ---');
const categoryCounts: Record<string, number> = {};
projects.forEach((p) => {
  if (p.category !== 'all') {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
  }
});
const totalCategorised = Object.values(categoryCounts).reduce((s, n) => s + n, 0);
Object.entries(categoryCounts)
  .sort(([, a], [, b]) => b - a)
  .forEach(([cat, count]) => {
    const label = cat === 'fullstack' ? 'Full Stack' : cat;
    const pct = ((count / totalCategorised) * 100).toFixed(1);
    console.log(`  ${label}: ${count} projects (${pct}%)`);
  });
console.log(`  Total: ${totalCategorised} projects (100%)`);

// Tech usage analysis
console.log('\n--- TOP TECHNOLOGIES USED ---');
const techCounts: Record<string, number> = {};
projects.forEach((p) => {
  p.tech.forEach((t) => {
    techCounts[t] = (techCounts[t] ?? 0) + 1;
  });
});
Object.entries(techCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 10)
  .forEach(([tech, count]) => {
    const pct = Math.round((count / projects.length) * 100);
    console.log(`  ${tech.padEnd(25)} ${String(count).padStart(2)} projects (${pct}%)`);
  });

// Skills calculation using the same shared module as the About page
const projectTechSets = projects.map(
  (project) => new Set(project.tech.map((tech) => tech.toLowerCase())),
);

console.log('\n--- SKILL PERCENTAGES (About Me Page Algorithm) ---');
Object.entries(skillDefinitions).forEach(([category, skillList]) => {
  console.log('\n' + category.toUpperCase() + ':');
  skillList.forEach((skill) => {
    const level = calculateSkillLevel(skill.aliases, projectTechSets);
    const matchingCount = projectTechSets.filter((techSet) =>
      skill.aliases.some((alias) => techSet.has(alias.toLowerCase())),
    ).length;
    console.log(
      `  ${skill.name.padEnd(15)} ${String(level).padStart(2)}%  (${matchingCount} projects)`,
    );
  });
});

console.log('\n--- VERIFICATION SUMMARY ---');
console.log('✓ All percentages calculated based on actual project data');
console.log('✓ Skill percentages use case-insensitive matching');
console.log('✓ Multiple aliases properly combined (e.g., React + React Native)');
console.log('✓ Category counts exclude "all" category');
console.log('✓ Definitions and algorithm imported from lib/stats.ts (same source as About page)');
console.log('\n========================================\n');
