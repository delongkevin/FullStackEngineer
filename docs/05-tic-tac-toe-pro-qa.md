# Tic Tac Toe Pro — Technical Q&A Documentation

## Overview

Tic Tac Toe Pro is a polished, professional-grade implementation of the classic Tic Tac Toe game built with React and JavaScript. It features a two-player local multiplayer mode, a comprehensive score tracking system, winning move animations, and a clean, professional interface that demonstrates React component design and state management best practices. The game is built as a self-contained React SPA, compiled to a static bundle suitable for embedding in an iframe or hosting on any static web server.

- **Category:** Mobile / Web Game  
- **Tech Stack:** React 17/18, JavaScript (ES6+), HTML5, CSS3  
- **Live URL:** `/projects/tic-tac-toe/index.html`  
- **GitHub:** https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer  

---

## 1. Architecture & Design Q&A

**Q1. What software design patterns are applied in the Tic Tac Toe Pro implementation?**

The game uses React's functional component architecture combined with a custom hook pattern (`useGameState`) that encapsulates all game logic separately from the rendering layer. This follows the separation of concerns principle: the `useGameState` hook is responsible for board state, turn tracking, win detection, and score management, while the presentational components (`Board`, `Square`, `ScoreBoard`, `StatusBar`) are responsible only for rendering and forwarding user events back to the hook. This pattern makes the game logic independently testable — unit tests can import and exercise `useGameState` without mounting any React component.

**Q2. How is the game board represented in state?**

The game board is represented as a flat array of nine elements (indices 0–8), where each element is either `null` (empty), `'X'`, or `'O'`. A flat array is chosen over a 2D array (3×3 matrix) for simplicity: the winning line check patterns (rows, columns, diagonals) are defined as eight hardcoded index triplets `[[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]`, making the detection algorithm a straightforward loop over these patterns. The flat array also serializes trivially to JSON for `localStorage` persistence.

**Q3. How is win detection implemented?**

Win detection is a pure function `calculateWinner(squares)` that accepts the board array and returns `{ winner: 'X'|'O'|null, line: [i,j,k]|null }`. The function iterates over the eight winning line patterns and checks if all three squares in each pattern are equal and non-null. The first matching pattern's player and index triplet are returned. If no pattern matches and all nine squares are filled (no `null` values), the function returns `{ winner: 'draw', line: null }`. The returned `line` array is used to identify which squares to highlight with the winning animation.

**Q4. How does the game handle the "game over" state and prevent further moves?**

The game uses a `gameOver` boolean derived from the win detection result — it is `true` if `winner !== null`. The `handleSquareClick(index)` function has an early return guard: `if (gameOver || squares[index] !== null) return;`. This prevents both overwriting occupied squares and making moves after the game ends. The guard is checked in the event handler rather than in the component's `onClick` prop, centralizing the validity logic in the hook. The square components visually communicate non-interactivity by applying a `disabled` CSS class when `gameOver` is true, changing the cursor to `not-allowed`.

**Q5. How is the score tracking system designed?**

Score tracking records `{ X: number, O: number, draws: number }` in the `useGameState` hook's state. After each game conclusion, the `updateScores(winner)` function increments the appropriate counter. Scores persist across game resets within a session (the Reset button resets the board but not the scores). An additional "New Match" action resets both board and scores. Scores are also persisted to `localStorage` as a JSON string so that returning players see their cumulative session history. The persistence uses `useEffect` watching the score state and `JSON.parse/JSON.stringify` for serialization.

**Q6. How are winning animations triggered and implemented?**

When `calculateWinner` returns a non-null result, the three winning square indices are stored in the `winningLine` state. The `Square` component receives a `isWinning` boolean prop computed as `winningLine?.includes(index) ?? false`. When `isWinning` is `true`, the component renders with an additional CSS class (`.square--winning`) that activates a keyframe animation: the square background pulses with a color highlight and a subtle scale transform. The animation is declared in CSS (`@keyframes winPulse`) and runs with `animation-iteration-count: 3`, creating a brief celebratory effect before settling into a steady highlighted state.

**Q7. How is game state persistence implemented for the "game state persistence" feature?**

On every state change, a `useEffect` serializes the current `{ squares, currentPlayer, scores }` to `localStorage`. On component mount, a separate `useEffect` runs once (empty dependency array) to read from `localStorage` and restore the initial state. This allows a player who accidentally closes the browser tab to return to their game in progress. The serialized state is validated before restoration — if `JSON.parse` throws or the parsed object is malformed (missing required keys), the error is caught and the game starts fresh. This prevents corrupted `localStorage` data from breaking the application.

**Q8. Why was React chosen for Tic Tac Toe rather than vanilla JavaScript?**

React is chosen to demonstrate professional React component design and hook patterns in a context simple enough to make the architecture fully transparent. Tic Tac Toe's UI has exactly the kind of state-driven rendering that React excels at: nine squares that re-render based on a single array, a score board derived from accumulated results, and a status message derived from `currentPlayer` and `gameOver`. The complexity of the game is low enough that the architecture is not obscured by business logic, making it an ideal portfolio demonstration of clean React usage.

---

## 2. Technology Stack Q&A

**Q1. What React hooks are used and what is each hook responsible for?**

- `useState`: Manages `squares` (board array), `currentPlayer` ('X' or 'O'), `scores` ({X, O, draws}), and `winningLine` (the three winning square indices).
- `useEffect`: Two instances — one for persisting state to `localStorage` on change, one for restoring state from `localStorage` on mount.
- `useCallback`: Memoizes `handleSquareClick` and `resetGame` to prevent unnecessary re-renders of child components that receive these as props.
- `useMemo`: Memoizes the result of `calculateWinner(squares)` since win detection is called on every render and should not be recomputed unless `squares` changes.
- No external state management library (Redux, Zustand) is needed given the application's simplicity.

**Q2. How is the build tooling configured?**

The project uses Vite with the `@vitejs/plugin-react` plugin for JSX transformation. Vite's default configuration handles: JSX → JavaScript compilation via esbuild, CSS bundling with PostCSS, ES6+ transpilation for the target browser set (last 2 Chrome, Firefox, Safari versions), and production minification. The `vite.config.js` specifies the `base` option matching the deployment path (`/projects/tic-tac-toe/`) to ensure asset URLs in the bundle reference the correct path when the build is served from a subdirectory.

**Q3. How are React components structured for reusability?**

The `Square` component is a pure presentational component that accepts `value` (null/'X'/'O'), `onClick` (callback), `isWinning` (boolean), and `disabled` (boolean) props. It renders a `<button>` element — not a `<div>` — for correct semantic markup and native keyboard accessibility. The `Board` component renders nine `Square` instances in a CSS Grid layout. These components are generic enough that they could be reused in a different grid-based game with minimal modification.

**Q4. What CSS methodology is used, and how is the "professional UI/UX" achieved?**

CSS Modules are used for component-level style isolation, preventing class name collisions across components. The visual design employs a dark, professional color scheme (deep navy background, white grid lines, accent colors for X and O). The `X` marker renders in a vibrant blue, and the `O` marker renders in a warm red, drawing from established color psychology for competitive interfaces. Micro-interactions include subtle hover states on empty squares (background brightens slightly), a cursor change on occupied or game-over squares, and the winning animation described above. Typography uses a system font stack for maximum cross-platform rendering consistency.

**Q5. How is the project tested and what is the development workflow?**

The development workflow uses: `npm run dev` for hot-reloading development, `npm test` for running Vitest unit tests in watch mode, `npm run build` for creating a production bundle, and `npm run preview` for local verification of the production build. The `vitest.config.ts` configures jsdom as the test environment, enabling React component mounting in the test runner without a browser.

---

## 3. Features & Implementation Q&A

**Q1. How does the score tracking display update without a full component re-render?**

The `ScoreBoard` component is wrapped in `React.memo`, which prevents re-renders unless its props change. Since the `scores` object is only replaced (not mutated) when scores are updated, `React.memo`'s shallow prop comparison correctly identifies when a re-render is needed. The `useCallback`-memoized event handlers ensure that `Board` and `Square` components also skip unnecessary re-renders during score updates (since score changes do not affect the board state).

**Q2. How does the "Reset" vs. "New Match" distinction work?**

The `resetGame()` function preserves the `scores` state and resets only `squares` (to a 9-element null array), `currentPlayer` (to 'X'), and `winningLine` (to null). The `startNewMatch()` function calls `resetGame()` and additionally resets `scores` to `{ X: 0, O: 0, draws: 0 }`. This is a common UX pattern in multiplayer games — a "rematch" continues the scoreboard while a "new match" wipes the slate clean. Both functions are defined in `useGameState` and exposed in the returned API object.

**Q3. How is the game turn indicator implemented?**

The current player's turn is displayed in a `StatusBar` component that receives the `currentPlayer` and `gameOver` props. If `gameOver` is false, it displays `"Player {currentPlayer}'s turn"`. If `winner` is `'X'` or `'O'`, it displays `"Player {winner} wins!"`. If `winner` is `'draw'`, it displays `"It's a draw!"`. The status text is accompanied by a subtle CSS animation (fade-in) each time it changes, triggered by a React key change: the `StatusBar`'s `key` prop is set to `currentPlayer + winner`, causing React to unmount and remount the element (and therefore replay the CSS entry animation) each time the turn or result changes.

**Q4. How is keyboard navigation supported for accessibility?**

Since squares are rendered as `<button>` elements, they are natively focusable and activated by pressing `Enter` or `Space`. The nine buttons are arranged in a CSS Grid, and focus order follows DOM order (left to right, top to bottom across the grid), which is the logical reading order for the board. The `StatusBar` component uses an ARIA live region (`aria-live="polite"`) so that screen readers announce turn changes and game results automatically without the user needing to navigate to the status element.

**Q5. How does game state persistence interact with the React component lifecycle?**

The `localStorage` read `useEffect` runs after the first render (with an empty dependency array). This means the component initially renders with default state (empty board, scores at 0), then immediately re-renders with the restored state if `localStorage` data is present. This two-render initialization sequence is handled gracefully because React batches rapid state updates — the second render with restored state happens synchronously before the browser paints, so the user never sees the default state flash. A loading indicator could be added if the `localStorage` read were asynchronous (e.g., from IndexedDB), but synchronous `localStorage` does not require one.

---

## 4. Testing & Quality Q&A

**Q1. What is the testing strategy for Tic Tac Toe Pro?**

Testing is divided into three layers: (1) Pure function unit tests for `calculateWinner` covering all win patterns, the draw condition, and incomplete boards. (2) Hook tests using `renderHook` from `@testing-library/react` to exercise `useGameState` in isolation — simulating click sequences and asserting on the returned state values. (3) Component integration tests using `render` and `@testing-library/user-event` to click squares, assert on ARIA-accessible text ("Player X's turn", "Player O wins!"), and verify score board updates.

**Q2. What are the most important unit test cases for `calculateWinner`?**

Critical test cases include: (1) an empty board returns `{ winner: null, line: null }`; (2) X wins on the top row (`squares = ['X','X','X', null, null, null, null, null, null]`) returns `{ winner: 'X', line: [0,1,2] }`; (3) O wins on the main diagonal; (4) a full board with no winner returns `{ winner: 'draw', line: null }`; (5) a near-win board (two X, one O in a row) returns null; and (6) all eight winning patterns are covered for both X and O. These 16+ test cases provide complete branch coverage of the win detection logic.

**Q3. How are async `useEffect` side effects tested?**

The `localStorage` persistence effects are tested by mocking `localStorage` with a simple in-memory mock object (`vi.spyOn(window, 'localStorage', 'get')`). After calling `handleSquareClick` in a hook test, the test asserts that `localStorage.setItem` was called with the expected key and a JSON string containing the updated squares. The restoration effect is tested by pre-populating the `localStorage` mock with a saved game state and asserting that `renderHook` returns the restored state in its initial render.

**Q4. How is test coverage reported and maintained?**

Coverage is generated with `npm run test -- --coverage`. The target thresholds are: 95% statement coverage for the `calculateWinner` utility, 85% branch coverage for `useGameState`, and 70% line coverage for presentational components. Coverage is checked in CI (GitHub Actions) using Vitest's `--coverage.thresholds` option, causing the CI pipeline to fail if coverage drops below these thresholds.

---

## 5. Security Q&A

**Q1. What security risks are present in a two-player local browser game?**

The attack surface is minimal. The primary concern is `localStorage` score tampering — a user can open DevTools and manually edit the score values. This is acceptable for a local two-player game where both players are present at the same device. If the game were adapted for networked multiplayer, server-side score validation and authenticated sessions would be required.

**Q2. How does React's default behavior protect against XSS?**

React escapes all values inserted into JSX by default. Player markers ('X', 'O') are drawn from controlled state values — never from external user-supplied input — so there is no XSS risk. The game has no text input fields for player names or chat in its current implementation, eliminating the most common XSS entry point.

**Q3. How does the iframe embedding configuration protect the host page?**

The recommended embedding:
```html
<iframe src="/projects/tic-tac-toe/index.html"
  sandbox="allow-scripts allow-same-origin">
</iframe>
```
The `allow-same-origin` permission is required for `localStorage` access (score persistence). Without `allow-scripts`, the React bundle cannot execute. The absence of `allow-top-navigation`, `allow-forms`, and `allow-popups` prevents the game frame from affecting the parent page in any way.

**Q4. How should the application be hardened for a production public deployment?**

Apply the following HTTP security headers on the serving web server:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```
`unsafe-inline` for styles is required only if the build tool injects inline style elements; switching to extracted CSS files eliminates this requirement and allows a stricter CSP.

**Q5. Are there any risks from the `localStorage` state restoration feature?**

The `localStorage` restoration code includes a `try/catch` around `JSON.parse` to handle corrupted data gracefully. It also validates that the parsed object has the expected structure (nine-element array for `squares`, string values for `currentPlayer` and `winner`, numeric values for scores) before accepting it. Malformed or unexpected data types are discarded and the game starts fresh. This prevents a scenario where an attacker (or a browser extension) writes malformed JSON to `localStorage` to crash or manipulate the application.

---

## 6. Source Code Update Guide

### Prerequisites
- Node.js 18 LTS or higher
- npm 9+
- Git with write access to the repository

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer.git
   cd 2025-Portfolio-SoftwareEngineer/projects/tic-tac-toe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # Game available at http://localhost:5173
   ```

4. **Key files for common changes:**
   - Game logic: `src/hooks/useGameState.js`
   - Win detection: `src/utils/calculateWinner.js`
   - Board component: `src/components/Board.jsx`
   - Square component: `src/components/Square.jsx`
   - Score board: `src/components/ScoreBoard.jsx`
   - Styles: `src/components/*.module.css`

5. **Adding an AI opponent:**
   - Create `src/utils/aiPlayer.js` with a `getBestMove(squares, aiMark)` function implementing minimax
   - Import and call `getBestMove` in `useGameState.js` inside a `useEffect` that fires when `currentPlayer === 'O'` and `gameOver === false`
   - Add a single-player toggle to the game controls UI

6. **Run tests:**
   ```bash
   npm test
   ```

7. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: describe your change here"
   git push origin main
   ```

---

## 7. Build & Compile Instructions

1. **Verify all tests pass:**
   ```bash
   npm run test -- --run
   ```

2. **Run the production build:**
   ```bash
   npm run build
   ```
   Output is generated in the `dist/` directory:
   - `dist/index.html` — HTML entry point
   - `dist/assets/index.[hash].js` — minified JavaScript bundle
   - `dist/assets/index.[hash].css` — minified CSS bundle

3. **Confirm the `base` option in `vite.config.js` matches the deployment path:**
   ```js
   export default defineConfig({
     base: '/projects/tic-tac-toe/',
     plugins: [react()],
   })
   ```

4. **Preview the production build locally:**
   ```bash
   npm run preview
   # Available at http://localhost:4173/projects/tic-tac-toe/
   ```

5. **Copy build output to portfolio:**
   ```bash
   cp -r dist/* /path/to/portfolio/projects/tic-tac-toe/
   ```

---

## 8. Deployment Guide

### Netlify

1. Connect the repository to Netlify.
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable if needed (none required for static deployment).
5. Add redirect rule in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/projects/tic-tac-toe/*"
     to = "/projects/tic-tac-toe/index.html"
     status = 200
   ```

### Nginx

```nginx
location /projects/tic-tac-toe/ {
    root /var/www/html;
    try_files $uri $uri/ /projects/tic-tac-toe/index.html;
    gzip on;
    gzip_types application/javascript text/css;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
}
```

### GitHub Pages

```bash
# In package.json, add:
"homepage": "https://delongkevin.github.io/2025-Portfolio-SoftwareEngineer/projects/tic-tac-toe"

# Deploy:
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

---

## 9. Full-Scale Production Adaptation Notes

To transform Tic Tac Toe Pro from a portfolio demonstration into a full-scale production product:

- **AI Opponent with Minimax:** Implement the minimax algorithm with alpha-beta pruning for an unbeatable AI opponent at the highest difficulty. Expose three difficulty levels (Easy: random moves; Medium: partial lookahead; Hard: full minimax). This is a finite, solved game, so the minimax tree is small enough to compute client-side in under 1ms.
- **Online Multiplayer:** Add WebSocket-based real-time multiplayer using Socket.io or native WebSockets, allowing two players to compete over the network. The server manages game rooms, validates moves, and broadcasts state updates. Use a Node.js + Socket.io backend deployed on Railway, Fly.io, or a containerized AWS ECS service.
- **User Authentication & Profiles:** Integrate Supabase or Firebase Authentication for persistent user accounts. Track win/loss records globally, enable a global leaderboard, and display historical match statistics per user.
- **Larger Grid Variants:** Extend the game engine to support 4×4 or 5×5 grids with a configurable winning line length (Connect-4 style), offering significantly deeper strategy and longer sessions.
- **Tournament Mode:** Implement a bracket-style tournament mode for 4, 8, or 16 players, with automated bracket generation, match scheduling, and result tracking — backed by a relational database (PostgreSQL via Prisma ORM).
- **Monetization:** Offer cosmetic enhancements (custom X/O symbols, board themes, sound packs) as in-app purchases via Stripe, providing a revenue stream without pay-to-win mechanics.
- **PWA Support:** Add a service worker and web app manifest to enable offline play, home screen installation, and background sync for move notifications in async multiplayer games.
- **Internationalization:** Extract all strings to locale files and support multiple languages using `react-i18next`, broadening the global addressable market.
