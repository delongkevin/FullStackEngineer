'use client';

import { useEffect } from 'react';
import { RECENTLY_VIEWED_PROJECTS_STORAGE_KEY } from '../data/projects';

interface ProjectViewTrackerProps {
  projectId: number;
}

export default function ProjectViewTracker({ projectId }: ProjectViewTrackerProps) {
  useEffect(() => {
    const storage = window.localStorage;
    const rawValue = storage.getItem(RECENTLY_VIEWED_PROJECTS_STORAGE_KEY);

    let viewedIds: number[] = [];
    if (rawValue) {
      try {
        const parsed = JSON.parse(rawValue);
        viewedIds = Array.isArray(parsed)
          ? parsed.filter((value): value is number => typeof value === 'number')
          : [];
      } catch {
        viewedIds = [];
      }
    }

    const updatedIds = [projectId, ...viewedIds.filter((id) => id !== projectId)].slice(0, 8);
    storage.setItem(RECENTLY_VIEWED_PROJECTS_STORAGE_KEY, JSON.stringify(updatedIds));
  }, [projectId]);

  return null;
}
