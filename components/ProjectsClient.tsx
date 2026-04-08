'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import ProjectCard from './ProjectCard';
import {
  RECENTLY_VIEWED_PROJECTS_STORAGE_KEY,
  PROJECT_DISCOVERY_STORAGE_KEY,
  type Project,
  type ProjectCategory,
  findProjectById,
  getProjectHref,
  projects,
  formatProjectCategory,
  searchProjects,
} from '../data/projects';
import Link from 'next/link';

type ProjectFilterCategory = 'all' | ProjectCategory;
type SortOption = 'featured' | 'alphabetical' | 'newest' | 'oldest';

const projectCategories: readonly ProjectFilterCategory[] = ['all', 'mobile', 'Automotive', 'Web', 'fullstack'];

const sortProjects = (projectList: Project[], sortBy: SortOption): Project[] => {
  const cloned = [...projectList];

  switch (sortBy) {
    case 'alphabetical':
      return cloned.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest':
      return cloned.sort((a, b) => b.id - a.id);
    case 'oldest':
      return cloned.sort((a, b) => a.id - b.id);
    case 'featured':
    default:
      return cloned.sort((a, b) => Number(b.featured) - Number(a.featured) || b.id - a.id);
  }
};

export default function ProjectsClient() {
  const [filter, setFilter] = useState<ProjectFilterCategory>('all');
  const [query, setQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [announcement, setAnnouncement] = useState('');
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);

  const categoryCounts = useMemo(() => {
    return {
      all: projects.length,
      mobile: projects.filter((project) => project.category === 'mobile').length,
      Automotive: projects.filter((project) => project.category === 'Automotive').length,
      Web: projects.filter((project) => project.category === 'Web').length,
      fullstack: projects.filter((project) => project.category === 'fullstack').length,
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const byCategory = filter === 'all'
      ? projects
      : projects.filter((project) => project.category === filter);

    const byFeatured = featuredOnly
      ? byCategory.filter((project) => project.featured)
      : byCategory;

    const bySearch = searchProjects(byFeatured, query);
    return sortProjects(bySearch, sortBy);
  }, [filter, featuredOnly, query, sortBy]);

  const recentlyViewedProjects = useMemo(() => {
    return recentlyViewedIds
      .map((projectId) => findProjectById(projectId))
      .filter((project): project is Project => Boolean(project))
      .slice(0, 4);
  }, [recentlyViewedIds]);

  const recommendedProjects = useMemo(() => {
    if (recentlyViewedProjects.length === 0) {
      return [];
    }

    const preferredCategories = new Set(recentlyViewedProjects.map((project) => project.category));
    return projects
      .filter(
        (project) =>
          !recentlyViewedIds.includes(project.id) &&
          preferredCategories.has(project.category),
      )
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.id - a.id)
      .slice(0, 4);
  }, [recentlyViewedIds, recentlyViewedProjects]);

  useEffect(() => {
    const savedState = window.localStorage.getItem(PROJECT_DISCOVERY_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as {
          filter?: ProjectFilterCategory;
          query?: string;
          featuredOnly?: boolean;
          sortBy?: SortOption;
        };

        if (parsed.filter && projectCategories.includes(parsed.filter)) {
          setFilter(parsed.filter);
        }
        if (typeof parsed.query === 'string') {
          setQuery(parsed.query);
        }
        if (typeof parsed.featuredOnly === 'boolean') {
          setFeaturedOnly(parsed.featuredOnly);
        }
        if (parsed.sortBy && ['featured', 'alphabetical', 'newest', 'oldest'].includes(parsed.sortBy)) {
          setSortBy(parsed.sortBy);
        }
      } catch {
        // Ignore malformed local storage values.
      }
    }

    const recentRaw = window.localStorage.getItem(RECENTLY_VIEWED_PROJECTS_STORAGE_KEY);
    if (recentRaw) {
      try {
        const parsed = JSON.parse(recentRaw);
        if (Array.isArray(parsed)) {
          setRecentlyViewedIds(parsed.filter((item): item is number => typeof item === 'number'));
        }
      } catch {
        setRecentlyViewedIds([]);
      }
    }
  }, []);

  useEffect(() => {
    const payload = {
      filter,
      query,
      featuredOnly,
      sortBy,
    };
    window.localStorage.setItem(PROJECT_DISCOVERY_STORAGE_KEY, JSON.stringify(payload));
  }, [filter, query, featuredOnly, sortBy]);

  const handleFilterChange = (category: ProjectFilterCategory) => {
    setFilter(category);
    const categoryName = category === 'all' ? 'All categories' : formatProjectCategory(category);
    setAnnouncement(`Filtering by ${categoryName}`);
  };

  const handleFeaturedToggle = () => {
    setFeaturedOnly((prev) => {
      const next = !prev;
      setAnnouncement(next ? 'Showing featured projects only' : 'Showing all matching projects');
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilter('all');
    setQuery('');
    setFeaturedOnly(false);
    setSortBy('featured');
    setAnnouncement('Reset all filters. Showing full project catalog.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Projects</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A collection of my work spanning frontend, full-stack, automotive, and mobile development.
          Each project represents unique challenges and learning experiences.
        </p>
      </div>

      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <label className="lg:col-span-2">
            <span className="text-sm font-medium text-gray-700 mb-2 block">Search projects</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, technology, or feature"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search projects"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-gray-700 mb-2 block">Sort results</span>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Sort projects"
              >
                <option value="featured">Featured first</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleFeaturedToggle}
            aria-pressed={featuredOnly}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              featuredOnly
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <Sparkles size={16} aria-hidden="true" />
            Featured only
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Reset filters
          </button>
          <p className="text-sm text-gray-600" aria-live="polite">
            Showing {filteredProjects.length} of {categoryCounts[filter]} projects
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {projectCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            aria-pressed={filter === category}
            className={`px-6 py-3 rounded-full font-medium transition-all min-h-[44px] ${
              filter === category
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'All' : formatProjectCategory(category)}
            {category !== 'all' && (
              <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                {categoryCounts[category]}
              </span>
            )}
          </button>
        ))}
      </div>

      {recentlyViewedProjects.length > 0 && (
        <section className="mb-12" aria-label="Recently viewed projects">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyViewedProjects.map((project) => (
              <Link
                key={project.id}
                href={getProjectHref(project)}
                className="rounded-lg border border-gray-200 p-4 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <p className="font-semibold text-gray-900 line-clamp-1">{project.title}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recommendedProjects.length > 0 && (
        <section className="mb-12" aria-label="Recommended projects">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedProjects.map((project) => (
              <Link
                key={project.id}
                href={getProjectHref(project)}
                className="rounded-lg border border-gray-200 p-4 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <p className="font-semibold text-gray-900 line-clamp-1">{project.title}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} imagePriority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No projects matched your current filters.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn-secondary"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
