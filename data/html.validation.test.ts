import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const publicProjectsDir = path.join(repoRoot, 'public', 'projects');
const publicDemosDir = path.join(repoRoot, 'public', 'demos');

/**
 * Validates that HTML files in public/projects and public/demos do not contain
 * improperly escaped quotes in HTML attributes.
 *
 * Common issue: onclick="func('value\')" should be onclick="func('value')" or onclick="func(&apos;value&apos;)"
 *
 * This test prevents embedded apps from breaking due to escape character issues.
 */

describe('HTML files validation', () => {
  const projectDirs = existsSync(publicProjectsDir)
    ? readdirSync(publicProjectsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({ name: dirent.name, dir: publicProjectsDir }))
    : [];

  const demoDirs = existsSync(publicDemosDir)
    ? readdirSync(publicDemosDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({ name: dirent.name, dir: publicDemosDir }))
    : [];

  const allDirs = [...projectDirs, ...demoDirs];

  if (allDirs.length === 0) {
    it.skip('No project or demo directories found', () => {});
    return;
  }

  allDirs.forEach(({ name, dir }) => {
    const indexPath = path.join(dir, name, 'index.html');

    if (!existsSync(indexPath)) {
      it.skip(`${name}/index.html not found`, () => {});
      return;
    }

    describe(`${path.relative(repoRoot, dir)}/${name}/index.html`, () => {
      const content = readFileSync(indexPath, 'utf-8');

      it('should not contain escaped single quotes in HTML attributes', () => {
        // Pattern to detect: attribute=" ... \' ... "
        // This regex looks for HTML attributes with double quotes that contain backslash-escaped single quotes
        const problematicPattern = /\s+\w+="[^"]*\\'[^"]*"/g;
        const matches = content.match(problematicPattern);

        if (matches) {
          // Filter out false positives: JavaScript template literals inside script tags
          const scriptTagRegex = /<script\b[^>]*>([\s\S]*?)<\/script\b[^>]*>/gi;
          const scriptContents: string[] = [];
          let scriptMatch;

          while ((scriptMatch = scriptTagRegex.exec(content)) !== null) {
            scriptContents.push(scriptMatch[1]);
          }

          // Check if the matches are actually in HTML attributes (not in script tags)
          const realIssues = matches.filter(match => {
            return !scriptContents.some(script => script.includes(match));
          });

          if (realIssues.length > 0) {
            const lines: number[] = [];
            let fromIndex = 0;
            realIssues.forEach(issue => {
              const issueIndex = content.indexOf(issue, fromIndex);
              const beforeIssue = content.substring(0, issueIndex);
              const lineNumber = beforeIssue.split('\n').length;
              lines.push(lineNumber);
              fromIndex = issueIndex + issue.length;
            });

            expect.fail(
              `Found ${realIssues.length} escaped single quote(s) in HTML attributes at lines: ${lines.join(', ')}\n` +
              `These should use HTML entities (&apos; or &#39;) or double quotes instead.\n` +
              `Examples found:\n${realIssues.slice(0, 3).map(m => `  - ${m.trim().substring(0, 80)}...`).join('\n')}`
            );
          }
        }

        // If we get here, no issues found
        expect(true).toBe(true);
      });

      it('should not contain onclick attributes with JavaScript escape sequences for quotes', () => {
        // More specific check for onclick/onXXX attributes with \' patterns
        const onclickPattern = /\s+on\w+="[^"]*\\'[^"]*"/gi;
        const matches = content.match(onclickPattern);

        if (matches && matches.length > 0) {
          const lines: number[] = [];
          matches.forEach(match => {
            const beforeMatch = content.substring(0, content.indexOf(match));
            const lineNumber = beforeMatch.split('\n').length;
            lines.push(lineNumber);
          });

          expect.fail(
            `Found ${matches.length} onclick/on* attribute(s) with escaped quotes at lines: ${lines.join(', ')}\n` +
            `Use HTML entities (&apos;) or double quotes (&quot;) instead of JavaScript escape sequences.\n` +
            `Examples:\n${matches.slice(0, 3).map(m => `  - ${m.trim()}`).join('\n')}`
          );
        }

        expect(true).toBe(true);
      });
    });
  });
});
