import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import { ArrowRight, Code, Smartphone, Globe } from 'lucide-react';

export default function Home() {
  const featuredProjects = projects.filter(project => project.featured);

  return (
    <>
      <Header />
      
            {/* Hero Section */}
      <main id="main-content">
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
              Hi, I'm <span className="text-blue-600 bg-clip-text">Kevin Delong</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Full Stack Developer specializing in modern web applications, 
              mobile development, automotive integrations, and scalable solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/resume" className="btn-primary inline-flex items-center justify-center transform hover:scale-105 transition-transform">
                Hire Me <ArrowRight className="ml-2" size={20} aria-hidden="true" />
              </a>
              <a href="/contact" className="btn-secondary inline-flex items-center justify-center transform hover:scale-105 transition-transform">
                Collaborate
              </a>
              <a href="/projects" className="btn-secondary inline-flex items-center justify-center transform hover:scale-105 transition-transform">
                Explore Projects
              </a>
            </div>
          </div>
        </div>
      </section>

            {/* Skills Overview */}
      <section className="py-16 bg-white" aria-labelledby="skills-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="skills-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">What I Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 transform hover:scale-105 transition-transform">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Code className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Full Stack Development</h3>
              <p className="text-gray-600">
                Building complete web applications with modern frameworks like Next.js, 
                React, Node.js, and databases for seamless end-to-end experiences.
              </p>
            </div>
            
                        <div className="text-center p-6 transform hover:scale-105 transition-transform">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Smartphone className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Mobile & Automotive</h3>
              <p className="text-gray-600">
                Creating mobile applications with React Native and automotive integrations 
                including CAN bus protocols and real-time vehicle systems.
              </p>
            </div>
            
                        <div className="text-center p-6 transform hover:scale-105 transition-transform">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Globe className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Web Performance</h3>
              <p className="text-gray-600">
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
          <div className="flex justify-between items-center mb-12">
            <h2 id="projects-heading" className="text-3xl font-bold text-gray-900">Featured Projects</h2>
                        <a href="/projects" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Projects <ArrowRight className="inline ml-1" size={16} aria-hidden="true" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
                </div>
      </section>
      </main>

      <Footer />
    </>
  );
}