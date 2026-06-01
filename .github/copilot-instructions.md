# Copilot Instructions for FullStackEngineer

This repository is a multi-project portfolio workspace, but the primary user-facing app is the Next.js portfolio site in the repository root. Treat the root app as the default target unless the user explicitly asks for one of the subprojects.

## Stack and Scope
- Root app: Next.js 14, React 18, TypeScript, Tailwind CSS, App Router.
- Shared UI lives in `components/` and shared content/data lives in `data/` and `config/`.
- The repository also contains mobile, backend, and embedded subprojects. Do not change those unless the request clearly targets them.

## Working Rules
- Prefer the smallest correct change. Preserve existing behavior, visuals, and public APIs unless the task requires a larger refactor.
- Keep edits consistent with the established design system: CSS variables, `theme-*` utility classes, and responsive Tailwind layouts.
- Maintain accessibility: semantic HTML, keyboard support, visible focus states, proper `aria-*` attributes, and a working skip link.
- Use `data/projects.ts` as the source of truth for project metadata, categories, and project URLs.
- When adding or changing portfolio content, keep filters, counts, and category labels in sync with the project catalog.
- Avoid introducing new dependencies unless they materially simplify the task.

## Autonomy And Quality Bar
- Make the best local implementation choice without asking the user for confirmation when the path is clear.
- Only ask a question if the task is genuinely blocked by missing information or there are multiple materially different interpretations that cannot be resolved from the codebase.
- Aim for the highest quality practical result in the repository context, not the smallest cosmetic patch.
- Do not stop after a partial fix if a better end-to-end implementation is feasible locally.
- Before finishing, ensure all affected projects compile successfully and that there are no obvious structural flaws in the mobile or web UI.
- If validation fails, fix the root cause in the affected slice instead of leaving a workaround.

## Per-Change Deep Review Gate
- Perform a focused code review for each change batch before finalizing: identify likely regressions, route/path conflicts, data-contract mismatches, and runtime behavior changes.
- For every modified feature, validate both the direct fix and at least one adjacent workflow that could be impacted (for example: detail route + embedded route, card link + detail page, API write + analytics read).
- Treat static assets as production code: verify path correctness, filename resolution, and format validity (especially SVG XML validity) when a change touches images or embeds.
- Add or update automated tests for each regression class discovered during the change, not only for the original bug.
- Do not push if any new warnings, diagnostics, or failing checks remain in the affected scope; resolve them first or document a concrete blocker.

## Commit And Push Gate
- If all affected applications compile successfully and there is no functional or visual breakage in the web or mobile use cases, commit and push the completed work.
- If a dependency or environment issue blocks compilation, document the exact blocker and the concrete fix needed before attempting to push.
- If a blocker occurs or a likely issue is discovered before pushing, prompt the user with the blocker details and do not push until it is resolved.
- Treat successful validation as the default green light for publishing; do not ask for extra confirmation unless the repository state is ambiguous or unsafe.

## UI and Content Guidance
- Preserve the portfolio’s visual direction: layered backgrounds, restrained motion, rounded cards, and strong typography.
- If you touch layout or styling, use the existing design tokens in `app/globals.css` instead of hard-coding new colors or fonts.
- Keep responsive behavior intact for desktop and mobile navigation, cards, embeds, and forms.
- For embedded demos and downloadable artifacts, preserve existing links and platform-specific handling.

## Code Conventions
- Use TypeScript types and React function components.
- Follow the existing file structure and naming patterns.
- Favor clear, explicit code over clever abstractions.
- Keep client components client-only and avoid moving state into server components unnecessarily.

## Validation
- Run the narrowest relevant check after changes: `npm run test`, `npm run build`, `npm run lint`, or `npm run verify-stats` depending on the area touched.
- For project catalog changes, validate the related tests in `data/` and `config/` when applicable.
- For UI changes, confirm the page still renders correctly in the browser and remains responsive.
- For project image updates, verify the referenced file exists under `public/images` and, for SVG assets, validate XML correctness (for example with `xmllint`) so malformed entities like raw `&` do not break rendering.

## Weekly Deep Review And Report
- Perform a deep repository review once per week, even when no feature work is requested.
- Prioritize findings by severity: `critical`, `high`, `medium`, `low`, then include concrete file references and root-cause notes.
- Implement safe, high-impact fixes discovered during the review when confidence is high and changes are localized.
- For remaining findings, provide an actionable remediation plan with estimated risk and affected areas.
- Publish a concise weekly report covering: checks run, bugs fixed, enhancements proposed, deferred risks, and recommended follow-up tasks.
- Re-run relevant validation commands after each weekly-fix batch and include pass/fail outcomes in the report.

## Mobile Apps
- When editing Android or iOS subprojects, make sure their dependencies are installed before validating builds.
- Treat successful compilation of the affected Android and iOS apps as a required check for mobile-related changes.
- Use the repository's existing platform tooling and lockfiles where available instead of introducing ad hoc setup steps.
- If a mobile app cannot compile, identify the missing dependency or platform setup issue and fix that root cause rather than working around the failure.

## Common Places to Edit
- Home and shared pages: `app/`
- Shared components: `components/`
- Project data and helpers: `data/`
- Embeds and integration rules: `config/`
- Global styling and theme tokens: `app/globals.css`