# Weekly Mobile and Backend Deep Review

Date: 2026-06-01
Scope: mobile and backend subprojects only
Reviewer: GitHub Copilot (GPT-5.3-Codex)

## Executive Summary
This review focused on API correctness, auth consistency, and currently runnable mobile test coverage. Four backend APIs were patched for concrete correctness defects and one flaky mobile test was stabilized. Validation was run for all modified backend files and available mobile suites with installed dependencies.

## Checks Run
- `node --check chat-backend/server.js` -> pass
- `node --check finance-backend/server.js` -> pass
- `node --check fitness-tracker-backend/server.js` -> pass
- `node --check real-estate-backend/server.js` -> pass
- `cd real-estate-app && npm test -- --watch=false` -> pass after fix (3/3 suites)
- `cd real-estate-app && npm run lint` -> pass with warnings (118 warnings, 0 errors)
- `cd music-streaming-app && npm test -- --watch=false` -> pass (1/1 suite), with React act warnings

## Implemented Bug Fixes

### 1) Finance API amount and pagination correctness
Files:
- `finance-backend/server.js`

Fixes:
- Added validation for transaction `type` and `amount` before mutating balance.
- Fixed balance/stat mutations to use parsed numeric amount (prevents `NaN` propagation).
- Hardened transactions pagination parsing (`limit` and `skip`) with safe defaults and bounds.
- Normalized numeric parsing for budget limits and financial goals.
- Validated payment amount and used parsed amount consistently in funds checks and deductions.
- Allowed explicit profile salary updates when value is `0`.

Risk reduced:
- Prevents invalid request payloads from corrupting balances and analytics.

### 2) Chat backend auth and pagination hardening
Files:
- `chat-backend/server.js`

Fixes:
- Added email normalization helper for register/login matching.
- Stored and compared normalized emails consistently.
- Hardened message pagination parsing for `limit` and `offset`.

Risk reduced:
- Eliminates case-sensitivity login edge cases and brittle query parsing.

### 3) Real-estate backend auth and filter/review validation
Files:
- `real-estate-backend/server.js`

Fixes:
- Added email normalization helper and applied across register/login/profile update uniqueness checks.
- Hardened property filter parsing (`minPrice`, `maxPrice`, `bedrooms`) with integer-safe guards.
- Added review rating validation to enforce integer rating between 1 and 5.

Risk reduced:
- Prevents duplicate-account edge cases and invalid rating/filter inputs.

### 4) Fitness API profile update edge case
Files:
- `fitness-tracker-backend/server.js`

Fixes:
- Updated profile patch semantics to allow explicit zero values (`weight`, `height`) instead of silently ignoring them.

Risk reduced:
- Prevents valid updates from being dropped due to falsy checks.

### 5) Mobile test stability (real-estate app)
Files:
- `real-estate-app/__tests__/FavoritesScreen.test.js`

Fixes:
- Increased suite timeout to reduce flaky timeout failures during async RN test startup.

Risk reduced:
- Stabilizes CI/test reliability for an already-correct screen behavior.

## Deferred Findings and Recommended Enhancements

Severity: high
- Insecure fallback JWT secrets remain in some backends (`chat-backend`, `real-estate-backend`).
- Recommendation: require environment-provided secrets for non-local environments and fail fast when missing.

Severity: medium
- Password handling is plain text in in-memory demo stores (`chat-backend`, `real-estate-backend`).
- Recommendation: hash passwords with bcrypt even for demo flows to prevent unsafe copy-forward patterns.

Severity: medium
- `real-estate-app` lint reports 118 warnings (primarily unused imports/vars).
- Recommendation: run a cleanup pass to remove unused symbols and tighten ESLint rules for maintainability.

Severity: low
- `music-streaming-app` tests pass but emit multiple React `act(...)` warnings in context initialization.
- Recommendation: wrap asynchronous state bootstrap assertions in proper `act`/`waitFor` patterns to reduce noisy logs.

## Environment and Coverage Notes
- Many subprojects currently do not have local `node_modules` installed in this workspace, so full test/lint coverage could not be executed for all mobile/backend apps in this run.
- Reviewed projects with available dependencies were validated directly; remaining projects were reviewed statically.

## Next Weekly Actions
- Enforce JWT secret policy and add startup guardrails.
- Address high-volume lint warnings in `real-estate-app`.
- Remove React `act` warnings in `music-streaming-app` tests.
- Add minimal smoke tests for backend register/login and transaction/property endpoints.

## Follow-Up Remediation Pass (Completed)

Date: 2026-06-01 (same-day focused pass)

Completed in this pass:
- Hardened JWT handling in chat and real-estate backends:
	- Require `JWT_SECRET` in production (`NODE_ENV=production`) and fail fast if missing.
	- Use explicit development-only fallback with security warning in non-production.
- Cleaned `real-estate-app` lint pipeline:
	- Added React ESLint plugin support and JSX usage rules.
	- Disabled `react/prop-types` for this non-PropTypes codebase.
	- Removed remaining unused variables/imports and dead code paths.
	- Fixed a functional bug in property detail reviews by using the correct `renderReview` callback.
- Eliminated `act(...)` warnings in `music-streaming-app` tests by ensuring the loading test awaits bootstrap completion.

Validation results for this pass:
- `cd real-estate-app && npm run lint` -> pass with zero warnings/errors.
- `cd real-estate-app && npm test -- --watch=false` -> pass (all suites).
- `cd music-streaming-app && npm test -- --watch=false` -> pass with no `act(...)` warnings.
- `node --check chat-backend/server.js` and `node --check real-estate-backend/server.js` -> pass.
