import { ExternalLink, Github, Star } from 'lucide-react';
import { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        {/* Placeholder for project image */}
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-lg font-semibold">{project.title}</span>
        </div>
        {project.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Star size={14} className="mr-1 fill-current" />
            Featured
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 4).map((tech) => (
            <span 
              key={tech} 
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <a 
            href={project.liveUrl} 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={18} />
            Live Demo
          </a>
          <a 
            href={project.githubUrl} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={18} />
            Code
          </a>
        </div>
      </div>
    </div>
  );
}