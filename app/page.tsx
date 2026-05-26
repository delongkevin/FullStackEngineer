import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import { ArrowRight, Code, Smartphone, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const featuredProjects = projects.filter(project => project.featured);

  return (
    <>
      <Header />
      
            {/* Hero Section */}
      <main id="main-content">
            <section className="pt-20 sm:pt-24 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
                  <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-7xl font-bold theme-text-primary mb-5 sm:mb-6 animate-fade-in leading-tight">
              Hi, I'm <span className="theme-accent-text bg-clip-text">Kevin Delong</span>
            </h1>
                  <p className="text-lg sm:text-xl md:text-2xl theme-text-secondary mb-7 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Full Stack Developer specializing in modern web applications, 
              mobile development, automotive integrations, and scalable solutions.
            </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                    <Link href="/resume" className="btn-primary w-full sm:w-auto inline-flex items-center justify-center transform sm:hover:scale-105 transition-transform">
                Hire Me <ArrowRight className="ml-2" size={20} aria-hidden="true" />
              </Link>
                    <Link href="/contact" className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center transform sm:hover:scale-105 transition-transform">
                Collaborate
              </Link>
                    <Link href="/projects" className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center transform sm:hover:scale-105 transition-transform">
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

            {/* Skills Overview */}
      <section className="py-16 surface-card" aria-labelledby="skills-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="skills-heading" className="text-3xl font-bold text-center theme-text-primary mb-12">What I Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <div className="text-center p-5 sm:p-6 transform sm:hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true" style={{ background: 'var(--accent-soft)' }}>
                <Code className="theme-accent-text" size={32} />
              </div>
              <h3 className="text-xl font-semibold theme-text-primary mb-4">Full Stack Development</h3>
              <p className="theme-text-secondary">
                Building complete web applications with modern frameworks like Next.js, 
                React, Node.js, and databases for seamless end-to-end experiences.
              </p>
            </div>
            
                        <div className="text-center p-5 sm:p-6 transform sm:hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true" style={{ background: 'var(--accent-soft)' }}>
                <Smartphone className="theme-accent-text" size={32} />
              </div>
              <h3 className="text-xl font-semibold theme-text-primary mb-4">Mobile & Automotive</h3>
              <p className="theme-text-secondary">
                Creating mobile applications with React Native and automotive integrations 
                including CAN bus protocols and real-time vehicle systems.
              </p>
            </div>
            
                        <div className="text-center p-5 sm:p-6 transform sm:hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true" style={{ background: 'var(--accent-soft)' }}>
                <Globe className="theme-accent-text" size={32} />
              </div>
              <h3 className="text-xl font-semibold theme-text-primary mb-4">Web Performance</h3>
              <p className="theme-text-secondary">
                Optimizing applications for speed, accessibility, SEO, and excellent 
                user experience across all devices and platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

            {/* Featured Projects */}
      <section className="py-16" aria-labelledby="projects-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-10 sm:mb-12">
            <h2 id="projects-heading" className="text-3xl font-bold theme-text-primary">Featured Projects</h2>
                        <Link href="/projects" className="theme-accent-text hover:opacity-80 font-medium">
              View All Projects <ArrowRight className="inline ml-1" size={16} aria-hidden="true" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} imagePriority={index < 2} />
            ))}
          </div>
                </div>
      </section>
      </main>

      <Footer />
    </>
  );
}