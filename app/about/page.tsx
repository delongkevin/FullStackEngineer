import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Code2, Database, Smartphone, Cloud, GitBranch, Figma } from 'lucide-react';
import Link from 'next/link';
import { projects, formatProjectCategory } from '../../data/projects';

// Higher values reach high proficiency faster; 0.5 gives strong growth while preserving differentiation.
const SKILL_SATURATION_GROWTH_FACTOR = 0.5;
const toSaturationPercentage = (demonstratedProjectCount: number): number => {
  return Math.round((1 - Math.exp(-SKILL_SATURATION_GROWTH_FACTOR * demonstratedProjectCount)) * 100);
};

const formatCategoryList = (categoryLabels: string[]) => {
  if (categoryLabels.length === 0) {
    return 'modern software';
  }

  if (categoryLabels.length === 1) {
    return categoryLabels[0];
  }

  if (categoryLabels.length === 2) {
    return `${categoryLabels[0]} and ${categoryLabels[1]}`;
  }

  return `${categoryLabels.slice(0, -1).join(', ')}, and ${categoryLabels[categoryLabels.length - 1]}`;
};

const skillDefinitions: Record<'frontend' | 'backend' | 'tools', Array<{ name: string; aliases: string[] }>> = {
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

export default function AboutPage() {
  const projectCategorySummary = Array.from(
    projects.reduce((counts, project) => {
      counts.set(project.category, (counts.get(project.category) ?? 0) + 1);
      return counts;
    }, new Map<(typeof projects)[number]['category'], number>()),
  )
    .sort(([, countA], [, countB]) => countB - countA)
    .filter(([category]) => category !== 'all')
    .map(([category, count]) => ({
      rawCategory: category,
      label: formatProjectCategory(category),
      count,
    }));

  const categoryLabels = projectCategorySummary.map((item) => item.label.toLowerCase());
  const categoryListText = formatCategoryList(categoryLabels);
  const introSummaryText = projects.length > 0
    ? `building ${projects.length} portfolio projects across ${categoryListText}`
    : 'designing and shipping modern software solutions';

  const topTechnologies = Array.from(
    projects.reduce((counts, project) => {
      project.tech.forEach((tech) => {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      });
      return counts;
    }, new Map<string, number>()),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const projectTechSets = projects.map((project) => new Set(project.tech.map((tech) => tech.toLowerCase())));
  const calculateSkillLevel = (aliases: string[]) => {
    const normalizedAliases = aliases.map((alias) => alias.toLowerCase());
    const projectsUsingSkill = projectTechSets.filter((techSet) =>
      normalizedAliases.some((alias) => techSet.has(alias)),
    ).length;

    if (projectsUsingSkill === 0) {
      return 0;
    }

    return toSaturationPercentage(projectsUsingSkill);
  };

  const skills = Object.fromEntries(
    Object.entries(skillDefinitions).map(([category, skillList]) => [
      category,
      skillList.map((skill) => ({
        name: skill.name,
        level: calculateSkillLevel(skill.aliases),
      })),
    ]),
  ) as Record<keyof typeof skillDefinitions, Array<{ name: string; level: number }>>;

  const skillIcons = [
    { icon: Code2, label: 'Frontend', color: 'text-blue-600' },
    { icon: Database, label: 'Backend', color: 'text-green-600' },
    { icon: Smartphone, label: 'Mobile', color: 'text-purple-600' },
    { icon: Cloud, label: 'Cloud', color: 'text-orange-600' },
    { icon: GitBranch, label: 'DevOps', color: 'text-red-600' },
    { icon: Figma, label: 'Design', color: 'text-pink-600' }
  ];

  return (
    <>
      <Header />
      
      <main id="main-content" className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section aria-labelledby="about-heading" className="text-center mb-16">
            <h1 id="about-heading" className="text-4xl font-bold theme-text-primary mb-4">About Me</h1>
            <p className="text-xl theme-text-secondary max-w-3xl mx-auto">
              Passionate engineer {introSummaryText} with a focus on scalable architecture and polished user experiences.
            </p>
          </section>

          {/* About Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <section aria-labelledby="journey-heading">
              <h2 id="journey-heading" className="text-2xl font-bold theme-text-primary mb-6">My Journey</h2>
              <div className="space-y-4 theme-text-secondary">
                <p>
                 I’m Kevin Douglas Delong, a dedicated software engineer with expertise in backend (e.g., Node.js, Python) and front-end (e.g., React, Flutter) development. I build scalable web, mobile, and desktop applications, focusing on user-friendly designs and efficient code. Passionate about innovative solutions—let’s connect!
               </p>
                <p>
                  When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
                </p>
              </div>
            </section>

            <section aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="text-2xl font-bold theme-text-primary mb-6">Skills & Technologies</h2>
              
              {/* Skill Categories */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {skillIcons.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className={`surface-subtle w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${item.color}`} aria-hidden="true">
                      <item.icon size={32} aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium theme-text-secondary">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Detailed Skills */}
              <div className="space-y-6">
                {Object.entries(skills).map(([category, skillList]) => (
                  <div key={category}>
                    <h3 className="font-semibold theme-text-primary mb-3 capitalize">
                      {category} Development
                    </h3>
                    <div className="space-y-3">
                      {skillList.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between text-sm theme-text-secondary mb-1">
                            <span>{skill.name}</span>
                            <span>{skill.level}%</span>
                          </div>
                          <div 
                            className="w-full surface-subtle rounded-full h-2"
                            role="progressbar"
                            aria-valuenow={skill.level}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${skill.name} proficiency: ${skill.level}%`}
                          >
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${skill.level}%` }}
                              aria-hidden="true"
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section aria-labelledby="project-alignment-heading" className="mb-16">
            <h2 id="project-alignment-heading" className="text-2xl font-bold theme-text-primary mb-6 text-center">
              Project Portfolio Overview
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {projectCategorySummary.map((item) => (
                <div key={item.rawCategory} className="surface-card rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold theme-accent-text">{item.count}</p>
                  <p className="text-sm font-medium theme-text-secondary">{item.label} projects</p>
                </div>
              ))}
            </div>

            <div className="surface-card rounded-xl p-6">
              <h3 className="text-lg font-semibold theme-text-primary mb-4">Most-used technologies in this portfolio</h3>
              <div className="flex flex-wrap gap-2">
                {topTechnologies.map(([tech, count]) => (
                  <span key={tech} className="surface-subtle rounded-full px-3 py-1 text-sm theme-text-secondary">
                    {tech} ({count})
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section aria-labelledby="cta-heading" className="text-center rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-strong))' }}>
            <h2 id="cta-heading" className="text-2xl font-bold mb-4">Let's Work Together</h2>
            <p className="mb-6 opacity-90">
              Interested in collaborating on a project? I'm always open to discussing 
              new opportunities and ideas.
            </p>
            <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold surface-card theme-accent-text hover:opacity-90">
              Get In Touch
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
