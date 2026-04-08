import { ExternalLink, Github, Star, Play } from 'lucide-react';
import { Project, formatProjectCategory, getProjectHref } from '../data/projects';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  imagePriority?: boolean;
  cardSize?: 'sm' | 'md' | 'lg';
  compactMeta?: boolean;
}

export default function ProjectCard({
  project,
  imagePriority = false,
  cardSize = 'md',
  compactMeta = false,
}: ProjectCardProps) {
  const categoryLabel = formatProjectCategory(project.category);
  const imageHeightClassName = cardSize === 'sm' ? 'h-36' : cardSize === 'lg' ? 'h-56' : 'h-48';
  const contentPaddingClassName = cardSize === 'sm' ? 'p-4' : cardSize === 'lg' ? 'p-7' : 'p-6';

  return (
    <div className="surface-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
      {/* Project Image - FIXED: Using actual image */}
      <div className={`${imageHeightClassName} relative overflow-hidden`}>
        {/* Replace the gradient div with Image component */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={imagePriority}
          loading={imagePriority ? 'eager' : 'lazy'}
          fetchPriority={imagePriority ? 'high' : 'auto'}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay with project info */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <div className="text-xl font-bold mb-2">{project.title}</div>
            <div className="text-sm opacity-90">{categoryLabel}</div>
            {project.embeddable && (
              <div className="mt-2 flex items-center justify-center gap-1 text-sm">
                <Play size={16} aria-hidden="true" />
                Live Demo
              </div>
            )}
          </div>
        </div>
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium flex items-center z-10">
            <Star size={14} className="mr-1 fill-current" aria-hidden="true" />
            Featured
          </div>
        )}
        
        {/* Interactive Badge */}
        {project.embeddable && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            Interactive
          </div>
        )}

        {/* Mobile Platform Badges */}
        {(project.androidUrl || project.iosUrl) && !project.embeddable && (
          <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            📱 Mobile App
          </div>
        )}
        {(project.androidUrl || project.iosUrl) && project.embeddable && (
          <div className="absolute bottom-4 left-4 flex gap-1 z-10">
            {project.androidUrl && project.iosUrl && project.androidUrl === project.iosUrl ? (
              <span className="bg-blue-700 text-white px-2 py-0.5 rounded-full text-xs font-medium">📱 RN Source</span>
            ) : (
              <>
                {project.androidUrl && (
                  <span className="bg-green-700 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    🤖 {project.androidUrl.includes('/releases/') ? 'APK' : 'Android'}
                  </span>
                )}
                {project.iosUrl && (
                  <span className="bg-gray-800 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    🍎 {project.iosUrl.includes('/releases/') ? 'iOS' : 'iOS Src'}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Rest of the component remains the same */}
      <div className={contentPaddingClassName}>
        <h3 className="text-xl font-bold theme-text-primary mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="theme-text-secondary mb-4 line-clamp-2">{project.description}</p>
        
        {/* Tech Stack */}
        {!compactMeta && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 4).map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1 theme-chip rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-3 py-1 surface-subtle theme-text-secondary rounded-full text-sm">
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t theme-border">
          <Link
            href={getProjectHref(project)}
            className="flex items-center gap-2 theme-accent-text hover:text-blue-700 font-medium transition-colors min-h-[44px]"
          >
            {project.embeddable ? (
              <>
                <Play size={18} aria-hidden="true" />
                View Demo
              </>
            ) : (
              'View Details'
            )}
          </Link>
          <div className="flex gap-4">
            <a
              href={project.liveUrl}
              className="flex items-center gap-2 theme-text-secondary hover:opacity-80 transition-colors p-2 min-h-[44px] min-w-[44px] justify-center"
              target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
              rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : ''}
              aria-label={`View live demo of ${project.title}`}
            >
              <ExternalLink size={18} aria-hidden="true" />
            </a>
            <a
              href={project.githubUrl}
              className="flex items-center gap-2 theme-text-secondary hover:opacity-80 transition-colors p-2 min-h-[44px] min-w-[44px] justify-center"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View source code for ${project.title} on GitHub`}
            >
              <Github size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}