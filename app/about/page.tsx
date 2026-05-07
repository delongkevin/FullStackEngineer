import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Code2, Database, Smartphone, Cloud, GitBranch, Figma } from 'lucide-react';
import Link from 'next/link';
import { projects, formatProjectCategory, getProjectHref } from '../../data/projects';
import { skillDefinitions, calculateSkillWithProjects, type ProjectInfo } from '../../lib/stats';

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

  // Convert projects to ProjectInfo format for skill calculation
  const projectInfos: ProjectInfo[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    tech: p.tech,
    features: p.features,
  }));
  const projectHrefById = new Map(projects.map((project) => [project.id, getProjectHref(project)]));

  // Calculate skills with project references and complexity
  const skills = Object.fromEntries(
    Object.entries(skillDefinitions).map(([category, skillList]) => [
      category,
      skillList
        .map((skill) => ({
          ...calculateSkillWithProjects(skill.aliases, projectInfos),
          name: skill.name,
        }))
        .filter((skill) => skill.projectCount > 0), // Only show skills used in projects
    ]),
  ) as Record<keyof typeof skillDefinitions, ReturnType<typeof calculateSkillWithProjects>[]>;

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
                  skillList.length > 0 && (
                    <div key={category}>
                      <h3 className="font-semibold theme-text-primary mb-3 capitalize">
                        {category} Development
                      </h3>
                      <div className="space-y-4">
                        {skillList.map((skill) => (
                          <div key={skill.name}>
                            <div className="flex justify-between text-sm theme-text-secondary mb-1">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-xs">
                                {skill.level}% • {skill.projectCount} project{skill.projectCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div
                              className="w-full surface-subtle rounded-full h-2 mb-2"
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
                            {/* Project References */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.projects.slice(0, 3).map((project) => {
                                const projectHref = projectHrefById.get(project.id);

                                if (!projectHref) {
                                  return (
                                    <span
                                      key={project.id}
                                      className="text-xs surface-subtle rounded px-2 py-0.5 theme-text-secondary"
                                      title={`${project.title} (Complexity: ${project.complexity})`}
                                    >
                                      {project.title}
                                    </span>
                                  );
                                }

                                return (
                                  <Link
                                    key={project.id}
                                    href={projectHref}
                                    className="text-xs surface-subtle hover:surface-card rounded px-2 py-0.5 theme-text-secondary hover:theme-accent-text transition-colors"
                                    title={`${project.title} (Complexity: ${project.complexity})`}
                                  >
                                    {project.title}
                                  </Link>
                                );
                              })}
                              {skill.projects.length > 3 && (
                                <span className="text-xs theme-text-secondary px-2 py-0.5">
                                  +{skill.projects.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
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
