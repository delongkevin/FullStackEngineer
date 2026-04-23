// Comprehensive verification of About Me page statistics
const projects = require('./data/projects');

console.log('========================================');
console.log('ABOUT ME PAGE STATISTICS VERIFICATION');
console.log('========================================\n');

console.log('Total Projects: ' + projects.projects.length + '\n');

// Category breakdown
console.log('--- CATEGORY BREAKDOWN ---');
const categoryCount = {};
projects.projects.forEach(p => {
  if (p.category !== 'all') {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  }
});
Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  const formatted = cat === 'fullstack' ? 'Full Stack' : cat;
  console.log('  ' + formatted + ': ' + count + ' projects');
});

// Tech usage analysis
console.log('\n--- TOP TECHNOLOGIES USED ---');
const techCount = {};
projects.projects.forEach(p => {
  p.tech.forEach(t => {
    techCount[t] = (techCount[t] || 0) + 1;
  });
});
Object.entries(techCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([tech, count]) => {
    const pct = Math.round((count / projects.projects.length) * 100);
    console.log('  ' + tech.padEnd(25) + ' ' + count.toString().padStart(2) + ' projects (' + pct + '%)');
  });

// Skills calculation (matching About page algorithm)
console.log('\n--- SKILL PERCENTAGES (About Me Page Algorithm) ---');

const skillDefinitions = {
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

const projectTechSets = projects.projects.map((project) =>
  new Set(project.tech.map((tech) => tech.toLowerCase()))
);

const calculateSkillLevel = (aliases) => {
  if (projectTechSets.length === 0) return 0;

  const normalizedAliases = aliases.map((alias) => alias.toLowerCase());
  const projectsUsingSkill = projectTechSets.filter((techSet) =>
    normalizedAliases.some((alias) => techSet.has(alias)),
  ).length;

  return Math.round((projectsUsingSkill / projectTechSets.length) * 100);
};

Object.entries(skillDefinitions).forEach(([category, skillList]) => {
  console.log('\n' + category.toUpperCase() + ':');
  skillList.forEach(skill => {
    const level = calculateSkillLevel(skill.aliases);
    const matchingProjects = projects.projects.filter((project, idx) =>
      skill.aliases.some(alias => projectTechSets[idx].has(alias.toLowerCase()))
    );
    console.log('  ' + skill.name.padEnd(15) + ' ' + level.toString().padStart(2) + '%  (' + matchingProjects.length + ' projects)');
  });
});

console.log('\n--- VERIFICATION SUMMARY ---');
console.log('✓ All percentages calculated based on actual project data');
console.log('✓ Skill percentages use case-insensitive matching');
console.log('✓ Multiple aliases properly combined (e.g., React + React Native)');
console.log('✓ Category counts exclude "all" category');
console.log('\n========================================\n');
