import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProjectDemoEmbed from '../../../components/ProjectDemoEmbed';
import ProjectVideoSection from '../../../components/ProjectVideoSection';
import ProjectViewTracker from '../../../components/ProjectViewTracker';
import {
  findProjectByRouteParam,
  formatProjectCategory,
  getProjectMetaDescription,
  getProjectRouteKey,
  projects,
} from '../../../data/projects';
import { ExternalLink, Github, ArrowLeft, Smartphone, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

const siteUrl = 'https://delongkevin.github.io/FullStackEngineer';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetail({ params }: PageProps) {
  const project = findProjectByRouteParam(params.id);

  if (!project) {
    return (
      <>
        <Header />
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold theme-text-primary mb-4">Project Not Found</h1>
            <Link href="/projects" className="theme-accent-text hover:opacity-80">
              ← Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    applicationCategory: project.category,
    operatingSystem: 'Web, Android, iOS',
    description: project.description,
    image: `${siteUrl}${project.image}`,
    url: `${siteUrl}/projects/${getProjectRouteKey(project)}/`,
    codeRepository: project.githubUrl,
    author: {
      '@type': 'Person',
      name: 'Kevin Douglas Delong',
    },
  };

  const currentProjectIndex = projects.findIndex((entry) => entry.id === project.id);
  const previousProject = currentProjectIndex > 0 ? projects[currentProjectIndex - 1] : undefined;
  const nextProject = currentProjectIndex < projects.length - 1 ? projects[currentProjectIndex + 1] : undefined;
  const relatedProjects = projects
    .filter((candidate) => candidate.id !== project.id && candidate.category === project.category)
    .slice(0, 3);

  return (
    <>
      <Header />
      <ProjectViewTracker projectId={project.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      
      <main id="main-content" className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sticky top-20 z-30 mb-6 surface-card rounded-xl shadow-md px-4 py-3 flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold theme-text-secondary">Quick Actions</p>
            <a
              href={project.liveUrl}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
              rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : ''}
            >
              <ExternalLink size={16} aria-hidden="true" />
              Open Demo
            </a>
            <a
              href={project.githubUrl}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border theme-border theme-text-secondary text-sm font-semibold hover:opacity-90 surface-subtle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} aria-hidden="true" />
              Source Code
            </a>
          </div>

          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 theme-accent-text hover:opacity-80 mb-6"
            aria-label="Back to all projects"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Back to Projects
          </Link>

          {/* Project Header */}
          <div className="surface-card rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Project Image */}
              <div className="lg:w-1/3">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </div>
              
              {/* Project Info */}
              <div className="lg:w-2/3">
                <h1 className="text-3xl font-bold theme-text-primary mb-4">{project.title}</h1>
                <p className="text-xl theme-text-secondary mb-6">{project.fullDescription}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {project.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-4 py-2 theme-chip rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <a
                    href={project.liveUrl}
                    className="btn-primary inline-flex items-center gap-2"
                    target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
                    rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : ''}
                    aria-label={project.embeddable ? `Open interactive demo of ${project.title}` : `View live demo of ${project.title}`}
                  >
                    <ExternalLink size={20} aria-hidden="true" />
                    {project.embeddable ? 'View Demo' : 'View Live'}
                  </a>
                  <a
                    href={project.githubUrl}
                    className="btn-secondary inline-flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View source code for ${project.title} on GitHub`}
                  >
                    <Github size={20} aria-hidden="true" />
                    View Code
                  </a>
                </div>

                {/* App Store Download Buttons */}
                {(project.androidUrl || project.iosUrl) && (
                  <div className="mt-4 pt-4 border-t theme-border">
                    <p className="text-sm font-semibold theme-text-secondary mb-3 flex items-center gap-2">
                      <Smartphone size={16} aria-hidden="true" />
                      {project.androidUrl?.includes('/releases/') || project.iosUrl?.includes('/releases/')
                        ? 'Download the App'
                        : 'Mobile Source Code'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {project.androidUrl && (
                        <a
                          href={project.androidUrl}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
                          style={{ background: 'var(--surface-3)', color: 'var(--text-1)', border: '1px solid var(--border-soft)' }}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.androidUrl.includes('/releases/') ? 'Download' : 'View Android source for'} ${project.title}`}
                        >
                          {project.androidUrl.includes('/releases/') ? (
                            <Download size={16} aria-hidden="true" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                          )}
                          <span>🤖 {project.androidUrl.includes('/releases/') ? 'Android APK' : 'Android Source'}</span>
                        </a>
                      )}
                      {project.iosUrl && project.iosUrl !== project.androidUrl && (
                        <a
                          href={project.iosUrl}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
                          style={{ background: 'var(--surface-3)', color: 'var(--text-1)', border: '1px solid var(--border-soft)' }}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.iosUrl.includes('/releases/') ? 'Download' : 'View iOS source for'} ${project.title}`}
                        >
                          {project.iosUrl.includes('/releases/') ? (
                            <Download size={16} aria-hidden="true" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                          )}
                          <span>🍎 {project.iosUrl.includes('/releases/') ? 'iOS App' : 'iOS Source'}</span>
                        </a>
                      )}
                      {project.iosUrl && project.iosUrl === project.androidUrl && (
                        <a
                          href={project.iosUrl}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
                          style={{ background: 'var(--surface-3)', color: 'var(--text-1)', border: '1px solid var(--border-soft)' }}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View React Native source for ${project.title}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                          <span>📱 React Native Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Embed or Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
          {project.embeddable ? (
            <div className="surface-card rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold theme-text-primary mb-6">Interactive Demo</h2>
              <ProjectDemoEmbed
                liveUrl={project.liveUrl}
                title={project.title}
                category={project.category}
              />
            </div>
          ) : (
              <div className="surface-card rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold theme-text-primary mb-4">Project Details</h2>
                <p className="theme-text-secondary mb-6">{project.fullDescription}</p>
                  
                  <h3 className="text-xl font-semibold theme-text-primary mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {project.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-3 mt-1">•</span>
                        <span className="theme-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info Card */}
              <details open className="surface-card rounded-xl shadow-lg p-6">
                <summary className="text-lg font-semibold theme-text-primary mb-4 cursor-pointer">Project Information</summary>
                <div className="space-y-3 mt-4">
                  <div>
                    <span className="text-sm theme-text-tertiary">Category:</span>
                    <div className="font-medium theme-text-primary">{formatProjectCategory(project.category)}</div>
                  </div>
                  <div>
                    <span className="text-sm theme-text-tertiary">Status:</span>
                    <div className="font-medium text-green-600">Completed</div>
                  </div>
                  <div>
                    <span className="text-sm theme-text-tertiary">Type:</span>
                    <div className="font-medium theme-text-primary">
                      {project.embeddable ? 'Interactive Demo' : 'Web Application'}
                    </div>
                  </div>
                  {(project.androidUrl || project.iosUrl) && (
                    <div>
                      <span className="text-sm theme-text-tertiary">Platforms:</span>
                      <div className="font-medium theme-text-primary flex gap-2 mt-1">
                        {project.androidUrl && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">🤖 Android</span>}
                        {project.iosUrl && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">🍎 iOS</span>}
                      </div>
                    </div>
                  )}
                </div>
              </details>
              
              {/* Technology Stack */}
              <details open className="surface-card rounded-xl shadow-lg p-6">
                <summary className="text-lg font-semibold theme-text-primary mb-4 cursor-pointer">Technology Stack</summary>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 surface-subtle theme-text-secondary rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* Technical Overview Video */}
          <ProjectVideoSection videoUrl={project.videoUrl} projectTitle={project.title} />

          <section className="mt-10 space-y-6" aria-label="Project navigation and related work">
            <div className="surface-card rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold theme-text-primary mb-4">Continue Exploring</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previousProject ? (
                  <Link
                    href={`/projects/${getProjectRouteKey(previousProject)}`}
                    className="block rounded-lg surface-subtle p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <p className="text-sm theme-text-tertiary">Previous project</p>
                    <p className="font-semibold theme-text-primary">{previousProject.title}</p>
                  </Link>
                ) : (
                  <div className="rounded-lg border border-dashed theme-border p-4 text-sm theme-text-tertiary">
                    You are viewing the first project.
                  </div>
                )}

                {nextProject ? (
                  <Link
                    href={`/projects/${getProjectRouteKey(nextProject)}`}
                    className="block rounded-lg surface-subtle p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <p className="text-sm theme-text-tertiary">Next project</p>
                    <p className="font-semibold theme-text-primary">{nextProject.title}</p>
                  </Link>
                ) : (
                  <div className="rounded-lg border border-dashed theme-border p-4 text-sm theme-text-tertiary">
                    You are viewing the last project.
                  </div>
                )}
              </div>
            </div>

            {relatedProjects.length > 0 && (
              <div className="surface-card rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold theme-text-primary mb-4">Related Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedProjects.map((relatedProject) => (
                    <Link
                      key={relatedProject.id}
                      href={`/projects/${getProjectRouteKey(relatedProject)}`}
                      className="rounded-lg surface-subtle p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <p className="font-semibold theme-text-primary">{relatedProject.title}</p>
                      <p className="text-sm theme-text-secondary mt-1 line-clamp-2">{relatedProject.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

// Generate static pages for each project
export async function generateStaticParams() {
  return projects.map((project) => ({ id: project.id.toString() }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = findProjectByRouteParam(params.id);
  
  if (!project) {
    return {
      title: 'Project Not Found - Kevin Delong',
    };
  }

  const canonicalUrl = `${siteUrl}/projects/${getProjectRouteKey(project)}/`;
  const imageUrl = `${siteUrl}${project.image}`;
  
  const metadata: Metadata = {
    title: `${project.title} - Kevin Delong`,
    description: getProjectMetaDescription(project),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${project.title} - Kevin Delong`,
      description: getProjectMetaDescription(project),
      url: canonicalUrl,
      type: 'article',
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - Kevin Delong`,
      description: getProjectMetaDescription(project),
      images: [imageUrl],
    },
  };

  return metadata;
}
