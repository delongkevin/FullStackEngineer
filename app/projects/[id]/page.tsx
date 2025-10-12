import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { projects } from '../../../data/projects';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetail({ params }: PageProps) {
  const projectId = parseInt(params.id);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <>
        <Header />
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <Link href="/projects" className="text-blue-600 hover:text-blue-700">
              ← Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>

          {/* Project Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Project Image */}
              <div className="lg:w-1/3">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {project.title}
                  </div>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="lg:w-2/3">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{project.fullDescription}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {project.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
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
                  >
                    <ExternalLink size={20} />
                    {project.embeddable ? 'Play Game' : 'View Live'}
                  </a>
                  <a
                    href={project.githubUrl}
                    className="btn-secondary inline-flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={20} />
                    View Code
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Project Embed or Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
          {project.embeddable ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Play the Game</h2>
              <div className="bg-gray-100 rounded-lg p-6 min-h-[600px] flex items-center justify-center">
                <iframe
                  src={project.liveUrl}
                  className="w-full h-[600px] border-0 rounded-lg"
                  title={project.title}
                />
              </div>
            </div>
          ) : (
               <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Details</h2>
                  <p className="text-gray-700 mb-6">{project.fullDescription}</p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {project.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <div className="font-medium text-gray-900 capitalize">{project.category}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <div className="font-medium text-green-600">Completed</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Type:</span>
                    <div className="font-medium text-gray-900">
                      {project.embeddable ? 'Interactive Game' : 'Web Application'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Technology Stack */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// Generate static pages for each project
export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return {
      title: 'Project Not Found - Kevin Delong',
    };
  }
  
  return {
    title: `${project.title} - Kevin Delong`,
    description: project.description,
  };
}
