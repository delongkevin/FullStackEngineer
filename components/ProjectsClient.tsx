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
type ViewMode = 'grid' | 'list' | 'masonry';
type CardSize = 'sm' | 'md' | 'lg';

const projectCategories: readonly ProjectFilterCategory[] = ['all', 'mobile', 'Automotive', 'Web', 'fullstack'];
const PROJECT_LAYOUT_STORAGE_KEY = 'portfolio-project-layout-v1';

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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [cardSize, setCardSize] = useState<CardSize>('md');
  const [showMeta, setShowMeta] = useState(true);
  const [showRecently, setShowRecently] = useState(true);
  const [showRecommended, setShowRecommended] = useState(true);
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

    const layoutState = window.localStorage.getItem(PROJECT_LAYOUT_STORAGE_KEY);
    if (layoutState) {
      try {
        const parsed = JSON.parse(layoutState) as {
          viewMode?: ViewMode;
          cardSize?: CardSize;
          showMeta?: boolean;
          showRecently?: boolean;
          showRecommended?: boolean;
        };

        if (parsed.viewMode && ['grid', 'list', 'masonry'].includes(parsed.viewMode)) {
          setViewMode(parsed.viewMode);
        }
        if (parsed.cardSize && ['sm', 'md', 'lg'].includes(parsed.cardSize)) {
          setCardSize(parsed.cardSize);
        }
        if (typeof parsed.showMeta === 'boolean') {
          setShowMeta(parsed.showMeta);
        }
        if (typeof parsed.showRecently === 'boolean') {
          setShowRecently(parsed.showRecently);
        }
        if (typeof parsed.showRecommended === 'boolean') {
          setShowRecommended(parsed.showRecommended);
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

  useEffect(() => {
    const payload = {
      viewMode,
      cardSize,
      showMeta,
      showRecently,
      showRecommended,
    };

    window.localStorage.setItem(PROJECT_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
  }, [viewMode, cardSize, showMeta, showRecently, showRecommended]);

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

  const handleResetLayout = () => {
    setViewMode('grid');
    setCardSize('md');
    setShowMeta(true);
    setShowRecently(true);
    setShowRecommended(true);
    setAnnouncement('Layout preferences reset to default.');
  };

  const cardsContainerClassName =
    viewMode === 'masonry'
      ? 'columns-1 md:columns-2 lg:columns-3 gap-6'
      : viewMode === 'list'
        ? 'grid grid-cols-1 gap-6'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold theme-text-primary mb-4">My Projects</h1>
        <p className="text-base sm:text-xl theme-text-secondary max-w-2xl mx-auto">
          A collection of my work spanning frontend, full-stack, automotive, and mobile development.
          Each project represents unique challenges and learning experiences.
        </p>
      </div>

      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="surface-card rounded-2xl shadow-md p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <label className="lg:col-span-2">
            <span className="text-sm font-medium theme-text-secondary mb-2 block">Search projects</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-tertiary" size={18} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, technology, or feature"
                className="w-full theme-input rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search projects"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium theme-text-secondary mb-2 block">Sort results</span>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-tertiary" size={18} aria-hidden="true" />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="w-full theme-input rounded-lg pl-10 pr-10 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                : 'surface-subtle theme-text-secondary theme-border hover:opacity-90'
            }`}
          >
            <Sparkles size={16} aria-hidden="true" />
            Featured only
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-full border theme-border text-sm font-medium theme-text-secondary hover:opacity-90 transition-colors surface-subtle"
          >
            Reset filters
          </button>
          <p className="text-sm theme-text-secondary" aria-live="polite">
            Showing {filteredProjects.length} of {categoryCounts[filter]} projects
          </p>
        </div>

        <div className="mt-4 border-t theme-border pt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold theme-text-secondary">Layout</span>
            {(['grid', 'list', 'masonry'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-full border text-xs font-semibold transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'surface-subtle theme-text-secondary theme-border hover:opacity-90'
                }`}
              >
                {mode[0].toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold theme-text-secondary">Card size</span>
            {(['sm', 'md', 'lg'] as CardSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setCardSize(size)}
                className={`px-3 py-2 rounded-full border text-xs font-semibold transition-colors ${
                  cardSize === size
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'surface-subtle theme-text-secondary theme-border hover:opacity-90'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMeta((current) => !current)}
              className={`px-3 py-2 rounded-full border text-xs font-semibold transition-colors ${
                showMeta ? 'bg-blue-600 text-white border-blue-600' : 'surface-subtle theme-text-secondary theme-border'
              }`}
            >
              {showMeta ? 'Metadata On' : 'Metadata Off'}
            </button>
            <button
              type="button"
              onClick={() => setShowRecently((current) => !current)}
              className={`px-3 py-2 rounded-full border text-xs font-semibold transition-colors ${
                showRecently ? 'bg-blue-600 text-white border-blue-600' : 'surface-subtle theme-text-secondary theme-border'
              }`}
            >
              {showRecently ? 'Recently Viewed On' : 'Recently Viewed Off'}
            </button>
            <button
              type="button"
              onClick={() => setShowRecommended((current) => !current)}
              className={`px-3 py-2 rounded-full border text-xs font-semibold transition-colors ${
                showRecommended ? 'bg-blue-600 text-white border-blue-600' : 'surface-subtle theme-text-secondary theme-border'
              }`}
            >
              {showRecommended ? 'Recommended On' : 'Recommended Off'}
            </button>
            <button
              type="button"
              onClick={handleResetLayout}
              className="px-3 py-2 rounded-full border theme-border text-xs font-semibold theme-text-secondary hover:opacity-90 surface-subtle"
            >
              Reset Layout
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
        {projectCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleFilterChange(category)}
            aria-pressed={filter === category}
            className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all min-h-[44px] ${
              filter === category
                ? 'bg-blue-600 text-white shadow-lg'
                : 'surface-subtle theme-text-secondary hover:opacity-90'
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

      {showRecently && recentlyViewedProjects.length > 0 && (
        <section className="mb-12" aria-label="Recently viewed projects">
          <h2 className="text-2xl font-bold theme-text-primary mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyViewedProjects.map((project) => (
              <Link
                key={project.id}
                href={getProjectHref(project)}
                className="rounded-lg surface-card p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <p className="font-semibold theme-text-primary line-clamp-1">{project.title}</p>
                <p className="text-sm theme-text-secondary mt-1 line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showRecommended && recommendedProjects.length > 0 && (
        <section className="mb-12" aria-label="Recommended projects">
          <h2 className="text-2xl font-bold theme-text-primary mb-4">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedProjects.map((project) => (
              <Link
                key={project.id}
                href={getProjectHref(project)}
                className="rounded-lg surface-card p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <p className="font-semibold theme-text-primary line-clamp-1">{project.title}</p>
                <p className="text-sm theme-text-secondary mt-1 line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredProjects.length > 0 ? (
        <div className={cardsContainerClassName}>
          {filteredProjects.map((project, index) => (
            <div key={project.id} className={viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''}>
              <ProjectCard
                project={project}
                imagePriority={index < 3}
                cardSize={cardSize}
                compactMeta={!showMeta}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="theme-text-secondary text-lg mb-4">No projects matched your current filters.</p>
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
