# Calculator — Technical Q&A Documentation

**Category:** Web  
**Tech Stack:** HTML5, CSS3, JavaScript  
**Project Path:** `/projects/calculator`  
**Live URL:** `/projects/calculator/index.html`  
**GitHub:** https://github.com/delongkevin/FullStackEngineer  

---

## Overview

The Calculator is a polished, browser-based arithmetic tool delivered as a single self-contained `index.html` file. It supports the four standard arithmetic operations, percentage, sign toggle, a scrollable history log (last 10 calculations), and full keyboard input — all rendered with a modern glassmorphism UI using CSS backdrop-filter. Because the entire application lives in one file with no external dependencies, it can be opened directly in any modern browser or embedded in an iframe on any webpage.

---

## 1. Architecture & Design Q&A

**Q1. Why is the entire application delivered as a single HTML file?**

A single-file architecture eliminates any deployment complexity: there are no build steps, no package managers, no server-side rendering, and no external requests to fail. The file can be opened from a local file system with `file://`, served from any static host, or embedded in an iframe. This design is deliberate for a portfolio project — it demonstrates that clean, functional software does not always require a complex toolchain.

**Q2. How is the application state managed without a framework?**

State is held in a small set of JavaScript module-scoped variables: `currentInput` (string being typed), `previousInput` (operand saved before an operator is pressed), `operator` (the pending operation: `+`, `-`, `×`, `÷`), `shouldResetDisplay` (boolean flag set after `=` so the next digit starts a fresh input), and `history` (array of the last 10 calculation strings). There are no classes or frameworks; functions read and write these variables directly. This is intentionally simple for a project of this scope.

**Q3. How are mathematical expressions evaluated?**

The calculator uses an operand-operator-operand model rather than a full expression parser. When the user presses `=`, the `calculate()` function reads `previousInput`, `operator`, and `currentInput`, converts them to `parseFloat`, performs the arithmetic with a `switch` statement, and returns the result. The result is then set as `currentInput` and appended to `history`. This avoids the security risks of `eval()` while covering all standard calculator operations.

**Q4. How is floating-point precision handled?**

JavaScript `Number` arithmetic can produce results like `0.1 + 0.2 = 0.30000000000000004`. The calculator mitigates this by rounding the result to 10 significant figures using `parseFloat(result.toPrecision(10))`, which eliminates trailing floating-point noise while preserving legitimate decimal precision.

**Q5. How does the history log work?**

Each completed calculation is formatted as a string (e.g., `"8 × 7 = 56"`) and added to the front of the `history` array via `unshift`. The array is capped at 10 entries by slicing after insertion. The history `<div>` is re-rendered by joining the array into HTML string nodes and setting `innerHTML`. A CSS `overflow-y: auto` on the history container enables scrolling without any JavaScript scroll management.

**Q6. How are divide-by-zero and invalid-input errors handled?**

Before performing division, the `calculate()` function checks whether the divisor (`currentInput`) equals `"0"`. If so, it sets `currentInput` to `"Error"` and resets state, displaying `"Error"` on screen. `parseFloat` returns `NaN` for non-numeric strings; the function checks `isNaN(result)` and similarly displays `"Error"` to prevent corrupted state from propagating into the history log.

**Q7. What accessibility considerations are built in?**

All calculator buttons are `<button>` elements (not `<div>`s or `<span>`s), giving them native keyboard focusability and screen-reader semantics. `aria-label` attributes are set on operator buttons (e.g., `aria-label="multiply"`) to convey meaning beyond the `×` symbol. The display area has `role="status"` and `aria-live="polite"` so screen readers announce the current value as it changes without interrupting the user.

---

## 2. Technology Stack Q&A

**Q1. Why are no JavaScript frameworks or libraries used?**

The calculator's logic is simple enough that a framework would add more overhead (bundle size, learning curve, abstraction layers) than benefit. Vanilla HTML, CSS, and JavaScript result in a ~15 KB file that loads in milliseconds, works offline, and has zero dependency vulnerabilities. It also demonstrates fundamental web platform skills, which is a primary goal of a portfolio project.

**Q2. How is the glassmorphism UI effect achieved with CSS?**

Glassmorphism is produced with:
```css
.calculator {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```
`backdrop-filter: blur` creates the frosted-glass blur on whatever content is behind the element. The `rgba` background with low alpha provides the tinted overlay. A gradient or image in the `body` background makes the effect visually apparent.

**Q3. How is the responsive layout implemented?**

The button grid uses CSS Grid: `display: grid; grid-template-columns: repeat(4, 1fr)`. The calculator container is centered with flexbox on the `body`. A `max-width` constrains the calculator to a comfortable size on wide screens, and a `min-width` on the container prevents it from collapsing on narrow viewports. Media queries reduce font sizes and padding below 400 px screen width.

**Q4. How does keyboard input support work?**

A `keydown` event listener is attached to `document`. The handler maps keyboard keys to calculator actions:
- Keys `0`–`9` and `.` → `appendDigit(key)`
- Keys `+`, `-`, `*`, `/` → `setOperator(mappedOperator)`
- `Enter` or `=` → `calculate()`
- `Backspace` → `deleteLast()`
- `Escape` → `clearAll()`
- `%` → `percentage()`

This allows complete eyes-free calculator operation without touching the mouse.

**Q5. What HTML5 features are leveraged?**

The project uses semantic HTML5 elements (`<main>`, `<section>`, `<button>`), CSS Custom Properties (variables) for theme colors, and `data-*` attributes on buttons to store their associated values/actions. The `textContent` API is used for safe text insertion (no `innerHTML` for user-facing output), and `classList.toggle` manages active-button states for visual feedback.

**Q6. How is the project structured internally within the single file?**

The file is organized into three logical sections: (1) a `<style>` block containing all CSS (reset, layout, theme, animations), (2) a `<body>` with semantic HTML for the display, history panel, and button grid, and (3) a `<script>` block at the bottom of `<body>` containing all JavaScript state and event handlers. Inline comments delimit each section for maintainability.

---

## 3. Features & Implementation Q&A

**Q1. How does the percentage operation work?**

The `%` key converts `currentInput` to a percentage of `previousInput` if an operator is pending (e.g., `200 + 10%` computes as `200 + 20 = 220`), or simply divides `currentInput` by 100 if no operator is pending (e.g., `50%` returns `0.5`). This matches the behavior of standard iOS and Android calculators.

**Q2. How does the sign-toggle (`+/-`) work?**

The sign-toggle function multiplies `parseFloat(currentInput)` by `-1` and converts the result back to a string. If the display shows `0`, the toggle has no effect. The negated value is written back to `currentInput` and the display updates immediately.

**Q3. How is chained calculation supported?**

After pressing `=`, the result is stored in `currentInput`. If the user immediately presses an operator (without entering a new number), `previousInput` is set to `currentInput` (the result) and a new operation begins. This enables sequences like `5 + 3 = 8 × 2 = 16` without needing to re-enter intermediate results.

**Q4. How does the decimal point button guard against multiple dots?**

Before appending `.` to `currentInput`, the handler checks `currentInput.includes('.')`. If a decimal point already exists, the button press is silently ignored. This prevents invalid number strings like `"3..14"`.

**Q5. How is the history log rendered and updated?**

```javascript
function updateHistoryDisplay() {
  historyEl.innerHTML = history
    .map(entry => `<div class="history-entry">${entry}</div>`)
    .join('');
}
```
The `history` array is mapped to HTML divs and set as `innerHTML` of the history container. Because history entries are generated by the calculator's own logic (not user input), this `innerHTML` assignment is safe from XSS.

**Q6. How does the display handle long numbers?**

The display font size is reduced dynamically when `currentInput.length` exceeds a threshold (e.g., 9 characters). A CSS class `font-small` is toggled with `classList.toggle('font-small', currentInput.length > 9)`, and the `font-small` class sets a smaller `font-size`. This prevents long numbers from overflowing the display area.

**Q7. How are button press animations implemented?**

Each `<button>` element has a CSS transition on `transform` and `background`:
```css
button:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}
```
The `:active` pseudo-class triggers the scale-down on press and restores it on release, giving tactile visual feedback with no JavaScript required.

---

## 4. Testing & Quality Q&A

**Q1. How is the calculator logic unit-tested?**

The core calculation functions are extracted into testable pure functions. A test suite using Vitest or Jest imports these functions and runs parameterized tests covering all operators, edge cases (zero division, NaN, very large numbers), sign toggle, and percentage calculations. Expected outputs are compared with `toBe` matchers.

**Q2. How is keyboard input tested?**

Keyboard tests use `jsdom` (provided by Vitest's `jsdom` environment) to simulate `KeyboardEvent` dispatches on `document`. After simulating a key sequence (e.g., `'5'`, `'+'`, `'3'`, `'Enter'`), tests assert that the display element's `textContent` equals `'8'` and that the history log contains `'5 + 3 = 8'`.

**Q3. How is UI layout tested across screen sizes?**

Manual testing is performed in Chrome DevTools Device Toolbar for viewport widths from 320 px to 1440 px. Automated visual regression tests using Playwright capture screenshots at three breakpoints and compare against baseline images with a pixel-difference threshold.

**Q4. How is accessibility tested?**

Accessibility is audited using the axe-core browser extension and Lighthouse in Chrome DevTools. The application targets a Lighthouse Accessibility score of 95+. Screen reader testing is performed with NVDA (Windows) and VoiceOver (macOS) to verify that display updates and button labels are announced correctly.

**Q5. How is floating-point correctness verified?**

A test table with known problematic floating-point inputs (e.g., `0.1 + 0.2`, `1 / 3`, `100 × 1.005`) asserts that displayed results match the expected rounded output. This ensures the `toPrecision(10)` rounding strategy covers the specified cases.

---

## 5. Security Q&A

**Q1. Is `eval()` used anywhere in the calculator?**

No. The calculator deliberately avoids `eval()` and the `Function` constructor. All arithmetic is performed using explicit JavaScript operators (`+`, `-`, `*`, `/`) in a `switch` statement, eliminating any code-injection attack surface.

**Q2. Are there any XSS risks in the history display?**

History entries are composed entirely from calculator-generated strings (operator symbols and numbers). No user-provided text is ever interpolated into HTML. The `innerHTML` assignment in `updateHistoryDisplay` is safe because the content is fully controlled by the application logic and cannot contain HTML tags or script injections.

**Q3. What happens if the application is embedded in an untrusted iframe?**

The HTML file includes `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'">`. This CSP header restricts script sources to the same origin and inline scripts (required for the single-file architecture). When served from a web server, the `X-Frame-Options: SAMEORIGIN` or `Content-Security-Policy: frame-ancestors 'self'` response header prevents clickjacking by restricting which origins can embed the calculator in an iframe.

**Q4. Does the calculator store or transmit any user data?**

No. The application is entirely client-side with no network requests. History is stored only in memory (JavaScript variables) and is cleared on page refresh. No cookies, `localStorage`, or `sessionStorage` are used. There is no data collection of any kind.

---

## 6. Source Code Update Guide

### Prerequisites
- Any modern text editor (VS Code recommended)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server for testing (e.g., `npx serve` or VS Code Live Server)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/delongkevin/FullStackEngineer.git
   cd FullStackEngineer/projects/calculator
   ```

2. **Open the file**
   ```bash
   code index.html   # VS Code
   # or open with any text editor
   ```

3. **Locate the three sections**
   - `<style>` block: all CSS (glassmorphism theme, grid layout, animations)
   - `<body>`: HTML structure (display, history, button grid)
   - `<script>`: JavaScript state variables and event handlers

4. **Add a new operation (example: square root)**
   - Add a button in the HTML grid:
     ```html
     <button onclick="squareRoot()" aria-label="square root">√</button>
     ```
   - Add the function in the `<script>` block:
     ```javascript
     function squareRoot() {
       const val = parseFloat(currentInput);
       const result = Math.sqrt(val);
       history.unshift(`√${val} = ${result}`);
       if (history.length > 10) history.pop();
       currentInput = String(parseFloat(result.toPrecision(10)));
       updateDisplay();
       updateHistoryDisplay();
     }
     ```

5. **Update the color theme**
   - Modify CSS Custom Properties at the top of the `<style>` block:
     ```css
     :root {
       --bg-gradient: linear-gradient(135deg, #1a1a2e, #16213e);
       --glass-bg: rgba(255, 255, 255, 0.15);
       --btn-color: rgba(255, 255, 255, 0.2);
       --accent-color: #ff6b6b;
     }
     ```

6. **Test locally**
   ```bash
   npx serve .
   # Open http://localhost:3000/index.html in a browser
   ```

7. **Commit and push**
   ```bash
   git add index.html
   git commit -m "Add square root operation"
   git push origin main
   ```

---

## 7. Build & Compile Instructions

The calculator requires no build or compilation step. `index.html` is the complete deliverable.

**Optional: Minification for production**

```bash
npm install -g html-minifier-terser
html-minifier-terser index.html \
  --collapse-whitespace \
  --remove-comments \
  --minify-css true \
  --minify-js true \
  -o index.min.html
```

The minified output reduces file size by approximately 40% for faster initial loads.

---

## 8. Deployment Guide

### Static File Hosting

Because `index.html` is a static file, it can be deployed anywhere:

**GitHub Pages**
```bash
# Ensure the file is at the root or docs/ of the branch
git push origin main
# Enable GitHub Pages in repository Settings → Pages
```

**Netlify**
```bash
# Drag-and-drop the /projects/calculator folder in the Netlify dashboard
# Or connect the GitHub repository and set publish directory to projects/calculator
```

**Vercel**
```bash
npx vercel --cwd projects/calculator
```

**Nginx**
```nginx
server {
    listen 80;
    server_name calculator.example.com;
    root /var/www/calculator;
    index index.html;
}
```
```bash
sudo cp index.html /var/www/calculator/
sudo systemctl reload nginx
```

**Embedded in an iframe**
```html
<iframe
  src="/projects/calculator/index.html"
  width="400"
  height="600"
  style="border:none;"
  title="Calculator">
</iframe>
```

---

## 9. Full-Scale Adaptation Notes

To evolve this calculator into a full-scale production web application:

1. **Scientific mode:** Add trigonometric functions (`sin`, `cos`, `tan`), logarithms, exponentiation, and memory functions (M+, M-, MR, MC) behind a mode toggle button.

2. **Expression parser:** Replace the operand-operator-operand model with a proper expression parser (e.g., a shunting-yard algorithm) to support multi-term expressions with correct operator precedence (e.g., `2 + 3 × 4 = 14`).

3. **History persistence:** Store calculation history in `localStorage` so it survives page refreshes. Add an option to export history as a CSV file.

4. **Theming system:** Replace hardcoded CSS variables with a theme selector that persists the chosen theme (dark, light, high-contrast, neon) in `localStorage`.

5. **Internationalization:** Use `Intl.NumberFormat` to format numbers according to the user's locale (e.g., European users expect `1.234,56` rather than `1,234.56`).

6. **Progressive Web App (PWA):** Add a `manifest.json` and a Service Worker to make the calculator installable and fully offline-capable as a home-screen app.

7. **Accessibility audit:** Achieve WCAG 2.1 AA compliance. Ensure color contrast ratios meet minimums and all interactive elements have 44×44 px minimum touch targets.

8. **Automated CI:** Add a GitHub Actions workflow that runs Jest unit tests, axe accessibility checks, and Lighthouse CI on every pull request, blocking merge on regression.
