import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { projects } from './projects';

const repoRoot = process.cwd();

function asPublicPath(urlPath: string): string {
  return path.join(repoRoot, 'public', urlPath.replace(/^\/+/, ''));
}

function isLocalSitePath(value: string): boolean {
  return value.startsWith('/');
}

function isGithubRepoUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(url);
}

function isGithubTreeUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/tree\/[^/]+\/.+/.test(url);
}

function isGithubReleaseTagUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/tag\/.+/.test(url);
}

function isGithubReleaseDownloadUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/releases\/download\/.+\/.+\.apk$/i.test(url);
}

function isGithubWorkflowUrl(url: string): boolean {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/workflows\/.+\.yml$/i.test(url);
}

function getLocalPathFromRepoTreeUrl(url: string): string | null {
  const match = url.match(
    /^https:\/\/github\.com\/delongkevin\/FullStackEngineer\/tree\/main\/(.+)$/
  );

  if (!match) {
    return null;
  }

  return path.join(repoRoot, match[1]);
}

describe('link integrity', () => {
  it.each(projects)('project "$title" has a valid githubUrl shape', (project) => {
    expect(project.githubUrl).toBeTruthy();
    expect(isGithubRepoUrl(project.githubUrl) || isGithubTreeUrl(project.githubUrl)).toBe(true);
  });

  it.each(projects.filter((p) => p.embeddable))(
    'embeddable project "$title" points to an existing HTML file',
    (project) => {
      expect(project.liveUrl).toMatch(/^\/projects\/.+\.html$/i);
      expect(existsSync(asPublicPath(project.liveUrl))).toBe(true);
    }
  );

  it.each(projects.filter((p) => isLocalSitePath(p.liveUrl)))(
    'project "$title" liveUrl local target exists',
    (project) => {
      expect(existsSync(asPublicPath(project.liveUrl))).toBe(true);
    }
  );

  it.each(projects.filter((p) => p.projectPath && isLocalSitePath(p.projectPath)))(
    'project "$title" projectPath local target exists',
    (project) => {
      expect(project.projectPath).toBeTruthy();
      expect(existsSync(asPublicPath(project.projectPath as string))).toBe(true);
    }
  );

  it.each(projects.filter((p) => p.androidUrl || p.iosUrl))(
    'mobile links for "$title" have valid format and existing local target for repo tree links',
    (project) => {
      const mobileUrls = [project.androidUrl, project.iosUrl].filter(Boolean) as string[];

      mobileUrls.forEach((url) => {
        const validShape =
          isGithubTreeUrl(url) ||
          isGithubReleaseTagUrl(url) ||
          isGithubReleaseDownloadUrl(url) ||
          isGithubWorkflowUrl(url) ||
          isGithubRepoUrl(url);
        expect(validShape).toBe(true);

        const localPath = getLocalPathFromRepoTreeUrl(url);
        if (localPath) {
          expect(existsSync(localPath)).toBe(true);
        }
      });
    }
  );
});
