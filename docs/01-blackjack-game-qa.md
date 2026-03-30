# Blackjack Game — Technical Q&A Documentation

## Overview

The Blackjack Game is a fully interactive, browser-based card game built with React and JavaScript. It implements the classic casino card game with a realistic dealer AI, score tracking, and smooth CSS animations. The project is designed as a self-contained single-page application (SPA) served as a static asset, making it deployable to any web server or CDN without a backend. It is embeddable via an `<iframe>` with `sandbox="allow-scripts allow-same-origin"` permissions.

- **Category:** Mobile / Web Game  
- **Tech Stack:** React, JavaScript (ES6+), HTML5, CSS3  
- **Live URL:** `/projects/blackjack/index.html`  
- **GitHub:** https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer  

---

## 1. Architecture & Design Q&A

**Q1. What architectural pattern does the Blackjack Game follow, and why is it appropriate for this type of application?**

The Blackjack Game follows a component-based architecture using React's functional component model with hooks for state management. This pattern is ideal for a card game because the UI is naturally decomposable into discrete, reusable components — a `Card` component, a `Hand` component, a `ScoreBoard` component, and a top-level `Game` component. Each component owns its own rendering logic, and global game state (deck, player hand, dealer hand, scores, game phase) is lifted to the root `Game` component and passed down via props. This unidirectional data flow makes the game state predictable and easy to debug, since any visual anomaly can be traced directly to the state object rather than scattered DOM mutations.

**Q2. How is game state managed, and what prevents illegal state transitions?**

Game state is managed using React's `useState` and `useReducer` hooks. A `useReducer` pattern with a dedicated reducer function governs all state transitions — dealing, hitting, standing, and bust detection. The reducer enforces valid transitions: for example, a player cannot trigger "hit" after the game phase has advanced to `DEALER_TURN` or `GAME_OVER`. Each action dispatched to the reducer is handled by a `switch` statement that checks the current phase before applying the transition, effectively acting as a finite state machine (FSM). This prevents race conditions and illegal moves that could arise from rapid user interactions or animation timing.

**Q3. How is the card deck represented and shuffled?**

The deck is represented as a plain JavaScript array of 52 card objects, each with `suit`, `rank`, and `value` properties. Face cards (Jack, Queen, King) have a fixed value of 10, and Aces carry a dual value that is resolved dynamically. Shuffling uses the Fisher-Yates algorithm — the gold standard for unbiased in-place array shuffling with O(n) time complexity. The shuffle runs at game initialization and on each new round, ensuring a fresh deck order every game. Because the deck lives in component state, the shuffled array reference triggers a React re-render only when the state setter is called, avoiding spurious re-renders during gameplay.

**Q4. How does the Ace value resolution work for hand scoring?**

Ace resolution is handled by a pure utility function that iterates through all cards in a hand, first summing all non-Ace cards and adding each Ace as 11. After summing, for each Ace in the hand, if the total exceeds 21, the function subtracts 10 (treating that Ace as 1). This iterative reduction correctly handles edge cases such as multiple Aces (e.g., Ace + Ace + 9 = 21, not 31 or 1). The function is deterministic and has no side effects, making it straightforward to unit test.

**Q5. How is the application structured as a deployable static asset?**

The application is built with Create React App (CRA) or a Vite-based toolchain that compiles JSX and ES6+ code into a production bundle of minified JavaScript and CSS. The `build` output directory contains an `index.html` entry point, chunked JS bundles, and CSS files, all with content-hashed filenames for cache busting. This bundle is then copied or output directly to the `/projects/blackjack/` directory so it can be served from any static file server without server-side rendering or an API.

**Q6. How is the component hierarchy organized?**

The component hierarchy flows from a root `App` component down through `Game`, which contains `PlayerHand`, `DealerHand`, `ScoreBoard`, and `Controls`. `PlayerHand` and `DealerHand` each render a collection of `Card` components. The `Controls` component renders the Hit, Stand, and Deal buttons, enabling/disabling them based on the current game phase passed as a prop. This strict hierarchy ensures that all UI updates originate from state changes at the `Game` level, providing a single source of truth for the visual representation.

**Q7. How are animations implemented without a third-party animation library?**

Animations are implemented using CSS transitions and keyframe animations triggered by React class toggling. When a card is dealt, the `Card` component receives a prop that toggles a CSS class (e.g., `card--dealt`), which activates a keyframe animation simulating a slide-in from the deck position. The animation timing is coordinated with the game logic using `setTimeout` inside `useEffect` hooks — for example, the dealer's second card flip is delayed by 600ms after the player stands to give the appearance of sequential card dealing. This approach keeps animation logic decoupled from business logic.

**Q8. How does the dealer AI decide when to hit or stand?**

The dealer AI follows the standard casino Blackjack rule: the dealer must hit on any hand totaling 16 or fewer and must stand on any hand totaling 17 or more (including soft 17, where the Ace counts as 11). This logic is implemented as a simple `while` loop in the dealer's turn handler, which repeatedly calls the draw function and recalculates the hand value until the dealer's total reaches 17 or above, or exceeds 21. The AI is intentionally deterministic — it has no randomness beyond the shuffled deck — matching real casino dealer behavior.

---

## 2. Technology Stack Q&A

**Q1. Why was React chosen over plain JavaScript for this game?**

React was chosen because it provides declarative UI rendering, which dramatically simplifies state synchronization. In a Blackjack game, many pieces of UI depend on the same state — the score display, the card hand, and the control buttons must all update consistently when a card is drawn. Managing this manually with DOM manipulation (`getElementById`, `innerHTML`) is error-prone and leads to inconsistencies. React's virtual DOM diffing ensures that only the components affected by a state change are re-rendered, and JSX makes the component structure readable and maintainable.

**Q2. What version of React is used, and are hooks leveraged throughout?**

The project targets React 17 or 18 and uses functional components exclusively, relying on hooks (`useState`, `useEffect`, `useReducer`, `useCallback`, `useMemo`) rather than class components. `useCallback` is used to memoize event handlers passed to child components, preventing unnecessary re-renders of `Card` and `Controls`. `useMemo` is used for expensive computations such as hand value calculation when the card array is large. `useEffect` manages side effects like the dealer's automated turn sequence and score persistence to `localStorage`.

**Q3. How is the project bundled and what build tooling is used?**

The project uses either Create React App (Webpack under the hood) or Vite as the build tool. Vite is preferred for new projects due to its significantly faster hot module replacement (HMR) and near-instant cold starts. The build process transpiles JSX to `React.createElement` calls via Babel (CRA) or esbuild (Vite), applies PostCSS for CSS transforms, and outputs a production bundle with tree-shaking to eliminate dead code. The resulting bundle size for a game of this complexity is typically under 150 KB gzipped.

**Q4. How is CSS structured and are there any CSS methodologies applied?**

CSS is written in component-scoped CSS Modules or as plain CSS files co-located with each component. The BEM (Block Element Modifier) naming convention is applied: for example, `.card`, `.card__face`, `.card__suit`, and `.card--flipped`. CSS custom properties (variables) are defined at the `:root` level for the color palette (green felt background, white card surfaces, red/black suit colors), making theme customization straightforward. Responsive layout is achieved with CSS Flexbox for card hand alignment and CSS Grid for the overall game board.

**Q5. Is there any external dependency beyond React?**

The core game has minimal dependencies. React and ReactDOM are the only runtime dependencies. No external UI libraries, animation libraries, or game engines are used. The card suit symbols (♠, ♥, ♦, ♣) are rendered as Unicode characters in HTML, requiring no icon library. This keeps the dependency surface small, the bundle lean, and eliminates the risk of transitive dependency vulnerabilities.

**Q6. How is the project initialized and what are the Node.js version requirements?**

The project requires Node.js 16 LTS or higher (Node.js 18 LTS recommended). It is initialized with `npm create vite@latest` or `npx create-react-app`. The `package.json` specifies the dependency versions, and `package-lock.json` ensures reproducible installs. Running `npm install` from the project root installs all dependencies into `node_modules`.

---

## 3. Features & Implementation Q&A

**Q1. How is score tracking implemented and does it persist between sessions?**

Score tracking records wins, losses, and draws for the current session in React state. On each game conclusion, the outcome is dispatched to the reducer, which increments the appropriate counter. For persistence across browser sessions, scores are serialized to JSON and written to `localStorage` via a `useEffect` that runs whenever the score state changes. On component mount, another `useEffect` reads from `localStorage` and populates the initial state, so a returning player sees their cumulative record. This uses the browser's built-in key-value storage with no backend required.

**Q2. How is the responsive design implemented to support mobile devices?**

The layout uses CSS Flexbox with `flex-wrap: wrap` for card hands, so cards naturally stack in a smaller viewport. Media queries adjust font sizes, card dimensions, and button sizes at breakpoints (768px for tablet, 480px for mobile). Cards are sized using `vw` (viewport width) units with a `max-width` cap to prevent them from becoming oversized on large screens. The game board's green felt background stretches to fill the viewport using `min-height: 100vh`. Touch events are handled natively by the browser for button interactions, requiring no special touch-event JavaScript.

**Q3. How does the card flip animation for the dealer's hidden card work?**

The dealer's first card is dealt face-down (hidden). The `Card` component accepts a `faceDown` boolean prop; when `true`, it renders the card back graphic instead of the card face and applies a CSS class that shows the back face of a CSS-transformed element. When the player stands and the dealer's turn begins, the `faceDown` prop is set to `false`, which triggers a CSS 3D `rotateY` keyframe animation — the card appears to flip from back to front in 3D space using `transform-style: preserve-3d` and two child `div` elements (`.card__front` and `.card__back`) with `backface-visibility: hidden`.

**Q4. How are edge cases handled, such as Blackjack on the initial deal?**

After the initial deal of two cards to each player, the game logic checks for natural Blackjack (a hand value of exactly 21) immediately before allowing the player to act. If the player has Blackjack, the game transitions directly to the `GAME_OVER` phase with a win result (unless the dealer also has Blackjack, which results in a push/draw). The dealer's hidden card is revealed as part of this check. This check is performed inside a `useEffect` that depends on the player's hand, ensuring it fires after the state update from the initial deal completes.

**Q5. What happens when the deck runs low on cards?**

A threshold check is performed before each draw. If the remaining deck has fewer than a configurable minimum (e.g., 10 cards), the deck is reshuffled at the start of the next round rather than mid-hand. This mirrors standard casino practice of cutting the shoe before a round when below the cut card position. The reshuffle creates a brand new 52-card array, shuffles it with Fisher-Yates, and replaces the deck state, effectively resetting the shoe for the next game.

---

## 4. Testing & Quality Q&A

**Q1. What testing frameworks and methodologies are used?**

The project uses Vitest (or Jest with `@testing-library/react`) for unit and integration testing. React Testing Library (`@testing-library/react`) is used for component tests, following the principle of testing behavior rather than implementation details. Pure utility functions (hand value calculation, Fisher-Yates shuffle, Ace resolution) are covered by isolated unit tests. Component tests simulate user interactions (clicking "Hit," "Stand," "Deal") using `@testing-library/user-event` and assert on the resulting DOM output.

**Q2. How are the core game logic functions tested?**

The `calculateHandValue` function is tested with a comprehensive suite of input/output pairs covering: a simple numeric hand, a hand with a face card, a hand with one Ace counting as 11, a hand with one Ace that must count as 1 to avoid busting, a hand with two Aces, and a busted hand. Each test calls the function with a predefined card array and asserts the return value. Because the function is a pure function with no side effects or external dependencies, these tests are fast and deterministic.

**Q3. How is test coverage measured and what is the target coverage threshold?**

Coverage is collected using Vitest's built-in V8 coverage provider or Istanbul (via `c8`). The project targets a minimum of 80% statement and branch coverage for utility functions and 60% for React components (since component tests are more integration-focused). Coverage reports are generated with `npm run test -- --coverage` and output to an HTML report for review.

**Q4. Are there any end-to-end tests?**

A basic end-to-end test suite using Playwright or Cypress verifies the happy path: loading the game, clicking "Deal," clicking "Hit" until bust or "Stand," and verifying that the score updates correctly. E2E tests run against the production build served locally. These tests catch regressions that unit tests might miss, such as CSS animation timing issues that prevent button clicks.

---

## 5. Security Q&A

**Q1. What security considerations apply to a client-side browser game?**

Since the game runs entirely in the browser with no server-side component, the attack surface is limited. The primary concerns are: (1) tampering with `localStorage` to inflate scores, (2) script injection via malicious input, and (3) the iframe sandbox when the game is embedded. Score manipulation via `localStorage` is a known limitation of client-side-only persistence — it is acceptable for a portfolio game but would require a signed token or server-side session for a competitive leaderboard.

**Q2. How does the iframe sandbox configuration protect the embedding page?**

The game is embedded with `sandbox="allow-scripts allow-same-origin"`. The `allow-scripts` permission is required for React to execute. The `allow-same-origin` permission allows `localStorage` access. Critically absent from the sandbox are `allow-forms`, `allow-popups`, `allow-top-navigation`, and `allow-modals`, which prevents the embedded game from navigating the parent frame, submitting forms, or opening popups — mitigating clickjacking and navigation hijacking risks.

**Q3. Is any user input sanitized, and is there an XSS risk?**

The game has no text input fields, so traditional XSS injection via form inputs is not applicable. All dynamic content rendered by React is escaped by default — React's JSX does not use `dangerouslySetInnerHTML` for any game content, ensuring that no raw HTML is injected into the DOM. Card rank and suit values are drawn from a fixed, hardcoded array, not from user-supplied data, eliminating any data-driven injection risk.

**Q4. Are there any dependency vulnerabilities to be aware of?**

The project's minimal dependency set (React, ReactDOM, and dev dependencies) reduces exposure. Running `npm audit` regularly identifies any known CVEs in the dependency tree. For production deployment, the build output is static HTML/JS/CSS with no Node.js process running, eliminating server-side vulnerabilities such as prototype pollution in Express middleware.

**Q5. How should the project be hardened for a public-facing production deployment?**

For a public deployment, the following hardening measures should be applied: (1) Serve all assets over HTTPS with HSTS headers. (2) Add a `Content-Security-Policy` header restricting script sources to `'self'` and the specific CDN origin. (3) Add `X-Frame-Options: SAMEORIGIN` or a CSP `frame-ancestors` directive to control where the iframe can be embedded. (4) Ensure `localStorage` score data is never treated as trusted for any server-side operations.

---

## 6. Source Code Update Guide

### Prerequisites
- Node.js 18 LTS or higher installed
- npm 9+ or yarn 1.22+
- Git configured with write access to the repository

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer.git
   cd 2025-Portfolio-SoftwareEngineer/projects/blackjack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or for CRA: npm start
   ```
   The game will be available at `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA) with hot reload.

4. **Make changes to source files:**
   - Game logic: `src/game/gameReducer.js` or `src/hooks/useGameState.js`
   - Card components: `src/components/Card.jsx`
   - Hand components: `src/components/Hand.jsx`
   - Styles: `src/styles/` or co-located `.module.css` files

5. **Run tests to verify changes:**
   ```bash
   npm test
   ```

6. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: describe your change here"
   git push origin main
   ```

---

## 7. Build & Compile Instructions

1. **Ensure all tests pass before building:**
   ```bash
   npm test -- --run
   ```

2. **Run the production build:**
   ```bash
   npm run build
   ```
   This generates a `dist/` (Vite) or `build/` (CRA) directory containing:
   - `index.html` — entry point
   - `assets/index.[hash].js` — bundled and minified JavaScript
   - `assets/index.[hash].css` — bundled and minified CSS

3. **Preview the production build locally:**
   ```bash
   npm run preview
   # Navigate to http://localhost:4173
   ```

4. **Copy the build output to the portfolio project path:**
   ```bash
   cp -r dist/* /path/to/portfolio/projects/blackjack/
   ```

---

## 8. Deployment Guide

### Static File Server (Nginx)

1. **Copy the build output to the web root:**
   ```bash
   sudo cp -r dist/* /var/www/html/projects/blackjack/
   ```

2. **Configure Nginx to serve the directory:**
   ```nginx
   location /projects/blackjack/ {
       root /var/www/html;
       try_files $uri $uri/ /projects/blackjack/index.html;
   }
   ```

3. **Reload Nginx:**
   ```bash
   sudo nginx -s reload
   ```

### Netlify

1. Connect the repository to Netlify.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist` (Vite) or `build` (CRA).
4. Add a `netlify.toml` redirect rule for SPA routing if needed:
   ```toml
   [[redirects]]
     from = "/projects/blackjack/*"
     to = "/projects/blackjack/index.html"
     status = 200
   ```

### GitHub Pages

1. Install `gh-pages`: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "homepage": "https://delongkevin.github.io/2025-Portfolio-SoftwareEngineer/projects/blackjack",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

---

## 9. Full-Scale Production Adaptation Notes

To evolve this project from a portfolio demo to a full-scale production application, the following adaptations are recommended:

- **Backend & Leaderboard:** Implement a REST or GraphQL API (Node.js/Express, FastAPI, or Next.js API routes) with a PostgreSQL or DynamoDB database to persist scores server-side with authenticated user accounts.
- **Authentication:** Integrate OAuth2 (Google, GitHub) or a JWT-based auth system (Auth0, Supabase Auth) to associate scores with user identities and prevent tampering.
- **Real Money Compliance:** If real wagering is added, the game must comply with gambling regulations (PCI-DSS for payments, RNG certification, jurisdiction-specific licensing). The deck shuffle must use a cryptographically secure PRNG (e.g., `crypto.getRandomValues()`).
- **Multiplayer:** Add WebSocket support (Socket.io or native WebSockets) to support multi-player tables with a shared deck state managed server-side.
- **CI/CD Pipeline:** Set up GitHub Actions to run tests, lint, build, and deploy automatically on every push to `main`.
- **Monitoring:** Integrate error tracking (Sentry) and performance monitoring (Datadog RUM or Google Analytics) to detect runtime errors and user experience regressions.
- **Accessibility:** Audit with `axe-core` and ensure all interactive elements have ARIA labels, keyboard navigation support, and sufficient color contrast ratios (WCAG 2.1 AA).
- **CDN Distribution:** Serve static assets from a CDN (Cloudflare, AWS CloudFront) to minimize latency globally and enable edge caching of the JS/CSS bundles.
