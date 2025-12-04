import { ExternalLink, Github, Star, Play } from 'lucide-react';
import { Project } from '../data/projects';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 group">
      {/* Project Image */}
      <div className="h-48 relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
          {project.title}
        </div>
        
        {/* Overlay with project info */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <div className="text-xl font-bold mb-2">{project.title}</div>
            <div className="text-sm opacity-90 capitalize">{project.category}</div>
            {project.embeddable && (
              <div className="mt-2 flex items-center justify-center gap-1 text-sm">
                <Play size={16} />
                Playable Demo
              </div>
            )}
          </div>
        </div>
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Star size={14} className="mr-1 fill-current" />
            Featured
          </div>
        )}
        
        {/* Interactive Badge */}
        {project.embeddable && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Interactive
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 4).map((tech: string) => (
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
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {project.embeddable ? (
              <>
                <Play size={18} />
                Play Demo
              </>
            ) : (
              'View Details'
            )}
          </Link>
          <div className="flex gap-4">
            <a
              href={project.liveUrl}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors"
              target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
              rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : ''}
            >
              <ExternalLink size={18} />
            </a>
            <a
              href={project.githubUrl}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
