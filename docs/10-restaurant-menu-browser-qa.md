# Restaurant Menu Browser — Technical Q&A Documentation

**Category:** Web  
**Tech Stack:** HTML5, CSS3, JavaScript  
**Project Path:** `/projects/restaurant-menu`  
**Live URL:** `/projects/restaurant-menu/index.html`  
**GitHub:** https://github.com/delongkevin/FullStackEngineer  

---

## Overview

The Restaurant Menu Browser is a feature-rich, client-side web application showcasing Bistro Bliss — a fictional upscale restaurant. The application presents 20 dishes across five menu categories, supports dietary-tag filtering (Vegetarian, Gluten-Free, Spicy), live search by name or description, an animated slide-up shopping cart with order totals, and a one-click order confirmation flow. The entire application is delivered as a single static `index.html` file with no external dependencies and no backend. It demonstrates advanced DOM manipulation, CSS animations, and responsive design using pure web standards.

---

## 1. Architecture & Design Q&A

**Q1. What is the overall architectural pattern of this application?**

The application follows a data-driven rendering pattern. Menu items are defined as a JavaScript array of objects at the top of the script section. All UI rendering — category tabs, menu cards, cart contents, and search results — is generated dynamically from this data array via DOM manipulation functions. When a filter, search term, or tab changes, the `renderMenu()` function re-computes the visible subset of items and rebuilds the menu grid. This central rendering function is the single source of truth for what is displayed, keeping the DOM consistent with the application state.

**Q2. How is the data model structured?**

Each menu item is a JavaScript object with the following shape:
```javascript
{
  id: 1,
  name: "Truffle Arancini",
  category: "starters",
  description: "Crispy risotto balls with black truffle and parmesan",
  price: 14.00,
  image: "arancini.jpg",
  tags: ["vegetarian", "gluten-free"],
  rating: 4.8
}
```
The 20 items span five categories: `starters`, `mains`, `pasta`, `seafood`, and `desserts`. Tags are arrays of strings, enabling an item to belong to multiple dietary categories simultaneously.

**Q3. How do filtering and search interact with each other?**

The `renderMenu()` function applies filters sequentially: (1) filter by active category tab (or show all if "All" is selected), (2) filter by active dietary tag buttons (intersection: an item must have ALL selected tags), (3) filter by the search input string (case-insensitive match against `name` and `description`). All three filters are applied in a single chained `.filter()` call on the items array, producing the final visible set. This ensures that category, tag, and search filters compose correctly.

**Q4. How does the slide-up cart work architecturally?**

The cart is a fixed-position `<div>` with `transform: translateY(100%)` as its default state (hidden off-screen at the bottom). A CSS transition on `transform` and the `.cart-open` class toggles it to `translateY(0)`, creating the slide-up animation. Cart state — an object mapping item ID to `{ item, quantity }` — is held in a `cart` JavaScript object. The cart `<div>` is re-rendered from this object every time an item is added, removed, or its quantity is changed.

**Q5. How is the category tab navigation implemented?**

Category tabs are `<button>` elements generated from a `categories` array. Each button has a `data-category` attribute. A click event listener on the tab container uses event delegation: a single listener on the parent reads `event.target.dataset.category`, updates the `activeCategory` state variable, toggles the `active` CSS class on tabs, and calls `renderMenu()`. Event delegation avoids attaching individual listeners to each tab button.

**Q6. How is the one-click order confirmation flow implemented?**

The cart panel contains a "Place Order" button. When clicked, `placeOrder()` validates that the cart is non-empty, generates an order summary string from the cart contents and total, clears the `cart` object, closes the cart panel, and displays a confirmation modal with the order details and an estimated delivery time. The modal has a CSS fade-in animation and closes when the user clicks "OK" or the backdrop.

**Q7. How does the application handle responsive layout for mobile and desktop?**

The menu grid uses CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`, which automatically wraps to fewer columns on narrow screens without media queries. The cart panel and search bar are flex-based and also adapt naturally. A single media query at 600 px adjusts the header layout and hides secondary text in the navigation bar.

---

## 2. Technology Stack Q&A

**Q1. Why use vanilla HTML, CSS, and JavaScript rather than a framework like React?**

For a menu browser of this scope, React's virtual DOM, component lifecycle, and JSX compilation would add unnecessary complexity. Vanilla JavaScript provides complete control over DOM updates with no abstraction overhead, and the single-file delivery model is impossible with a standard React setup without a bundler. The project intentionally demonstrates that rich, interactive UIs can be built with web fundamentals.

**Q2. What CSS features are used for the card hover animations?**

Menu cards use CSS transitions and transforms:
```css
.menu-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
}
```
The image inside the card also scales slightly on hover with `transform: scale(1.05)` and `overflow: hidden` on the image container, creating a zoom-in effect without resizing the card.

**Q3. How are dietary tag filter buttons styled to show active state?**

Tag buttons toggle a CSS class `tag-active` on click. The JavaScript handler reads the button's `data-tag` attribute, adds or removes the tag from the `activeTags` Set, and toggles the class:
```javascript
button.classList.toggle('tag-active', activeTags.has(tag));
```
The CSS `.tag-active` rule applies a filled background and white text, visually distinguishing selected from unselected tags.

**Q4. How are food images handled?**

Images are referenced via relative paths (e.g., `images/arancini.jpg`). If an image fails to load, an `onerror` handler on the `<img>` element replaces it with a placeholder SVG data URI, preventing broken-image icons:
```javascript
img.onerror = function() {
  this.src = 'data:image/svg+xml,...'; // grey placeholder
};
```

**Q5. How is the order total computed?**

The `getCartTotal()` function iterates over the `cart` object's values with `Object.values(cart).reduce((sum, { item, quantity }) => sum + item.price * quantity, 0)`. The result is formatted with `toFixed(2)` and displayed with a currency prefix. A delivery fee is conditionally added if the total is below a free-delivery threshold.

**Q6. What accessibility features are implemented?**

All interactive elements are native `<button>` elements. Dietary tag filter buttons use `aria-pressed` to convey selected state to screen readers. The cart panel uses `aria-hidden="true"` when closed and `aria-hidden="false"` when open. The search input has `aria-label="Search menu items"`. Focus is managed when the cart opens: the first focusable element inside the cart receives focus, and focus is returned to the trigger button on close.

---

## 3. Features & Implementation Q&A

**Q1. How does the live search work?**

An `input` event listener on the search `<input>` element reads `event.target.value`, trims whitespace, and stores it in `searchQuery`. `renderMenu()` is called immediately (no debounce is needed given the small dataset of 20 items). For larger datasets, a 300 ms debounce with `setTimeout`/`clearTimeout` would be added. The search matches against both `item.name` and `item.description` using `String.prototype.toLowerCase().includes()`.

**Q2. How does the "Add to Cart" flow work step by step?**

1. User clicks "Add to Cart" on a menu card.
2. The button's `data-id` attribute is read to identify the item.
3. If `cart[id]` already exists, `cart[id].quantity` is incremented.
4. If not, `cart[id] = { item: menuItems.find(i => i.id === id), quantity: 1 }`.
5. `renderCart()` is called to rebuild the cart panel contents.
6. The cart count badge on the cart icon is updated.
7. A brief "added" animation pulses the cart icon to confirm the action.

**Q3. How are quantity controls in the cart implemented?**

Each cart line item has `+` and `-` buttons. The `+` handler increments `cart[id].quantity`. The `-` handler decrements it; if the result is 0, the item is deleted from the `cart` object with `delete cart[id]`. Both handlers call `renderCart()` after mutation. There is no minimum quantity floor other than 0 (deletion).

**Q4. How does the order confirmation modal work?**

The modal is an absolutely positioned `<div>` with a semi-transparent backdrop. When `placeOrder()` is called, the modal's `display` is set to `flex` and a CSS fade-in animation runs (`opacity: 0` → `opacity: 1` over 300 ms). The modal displays a formatted receipt: item names, quantities, prices, subtotal, delivery fee, and total. Pressing "OK" or clicking the backdrop resets the modal's `display` to `none`.

**Q5. How is the star rating displayed on menu cards?**

The `rating` property (a float, e.g., 4.8) is converted to a star string by a `renderStars(rating)` helper:
```javascript
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}
```
The numeric rating value is also displayed alongside the stars for clarity.

**Q6. How is the "no results" empty state handled?**

If `renderMenu()` produces an empty filtered array, the menu grid `innerHTML` is set to an empty-state message:
```html
<div class="empty-state">
  <p>No dishes found matching your filters.</p>
  <button onclick="resetFilters()">Clear Filters</button>
</div>
```
The `resetFilters()` function resets `activeCategory`, `activeTags`, and `searchQuery`, updates the UI, and calls `renderMenu()`.

**Q7. How does the cart item count badge update?**

A `updateCartBadge()` function computes the total item count as `Object.values(cart).reduce((sum, { quantity }) => sum + quantity, 0)` and sets the badge element's `textContent` to this number. The badge is hidden (via `display: none`) when the count is 0 and shown when greater than 0.

---

## 4. Testing & Quality Q&A

**Q1. How is the filtering logic tested?**

The `filterItems(items, category, tags, query)` function is extracted and tested with Jest or Vitest. Tests cover all filter combinations: category-only, tag-only, search-only, and combined filters. Edge cases include items with multiple tags, empty search queries, and categories with no matching items.

**Q2. How is the cart logic tested?**

The `addToCart`, `removeFromCart`, `incrementQuantity`, and `getCartTotal` functions are pure-ish functions (they modify a cart object) and are tested with unit tests that assert on the cart object state after each operation. Tests verify correct behavior for first-time additions, duplicate additions (quantity increment), removal, and total calculation with delivery fee logic.

**Q3. How is rendering tested in the browser environment?**

Integration tests use Playwright to load `index.html` in a headless browser, interact with category tabs and search inputs, and assert on the count of visible `.menu-card` elements. Cart tests add items via button clicks and verify the cart total displayed on screen.

**Q4. How is mobile responsiveness tested?**

Playwright viewport resize tests run at 320 px, 768 px, and 1280 px widths, capturing screenshots and comparing against baseline images. Chrome DevTools Lighthouse is run to verify a Performance score above 90 and no layout-shift issues (CLS < 0.1).

---

## 5. Security Q&A

**Q1. Are there any XSS risks in the dynamic menu rendering?**

Menu item names and descriptions are defined in a static JavaScript array in the source file, not from user input. The `renderMenu()` function uses `textContent` for all text insertion and only uses `innerHTML` to assemble HTML from template literals with trusted data. If the data source were changed to an API, all string values would need to be sanitized with a library such as DOMPurify before insertion via `innerHTML`.

**Q2. Is the search input sanitized?**

The search query is used only with `String.prototype.includes()`, a string comparison method, and is never inserted into the DOM or evaluated as code. No sanitization is required for the current implementation. If search queries were ever reflected into HTML (e.g., "Results for: [query]"), they would need to be inserted via `textContent` or sanitized.

**Q3. What Content Security Policy is applied?**

The HTML file includes a `<meta>` CSP tag restricting scripts to `'self'` and `'unsafe-inline'` (required for the single-file inline script). Inline styles are similarly restricted. No external scripts or fonts are loaded, eliminating third-party script injection risks. For production deployment, CSP should be enforced via HTTP response headers rather than meta tags.

**Q4. How are data integrity concerns addressed for a production backend extension?**

If the menu data were served from an API, all client-side price totals would be re-validated on the server before processing any order. Order amounts computed client-side are untrusted and must never be used for billing. A server-side order service would look up item prices by ID and compute the authoritative total independently.

---

## 6. Source Code Update Guide

### Prerequisites
- Text editor (VS Code recommended)
- Modern web browser
- Local HTTP server (`npx serve` or Live Server extension)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/delongkevin/FullStackEngineer.git
   cd FullStackEngineer/projects/restaurant-menu
   ```

2. **Add a new menu item**
   In `index.html`, find the `menuItems` array in the `<script>` section and add a new object:
   ```javascript
   {
     id: 21,
     name: "Mango Sorbet",
     category: "desserts",
     description: "Refreshing tropical sorbet made with Alphonso mangoes",
     price: 9.00,
     image: "images/mango-sorbet.jpg",
     tags: ["vegetarian", "gluten-free"],
     rating: 4.6
   }
   ```
   Place the image in `images/` and the card will appear automatically.

3. **Add a new category**
   - Add the category string to the `categories` array.
   - Assign the category name to relevant menu items.
   - `renderTabs()` will auto-generate the new tab.

4. **Update the restaurant name and branding**
   Search for `"Bistro Bliss"` in the HTML and replace all occurrences. Update CSS color variables in the `:root` block to change the brand palette.

5. **Update prices**
   Modify `price` values in the `menuItems` array. No other changes are needed — totals recompute from the data.

6. **Test locally**
   ```bash
   npx serve .
   # Open http://localhost:3000 in a browser
   ```

7. **Commit and push**
   ```bash
   git add .
   git commit -m "Add mango sorbet and update pricing"
   git push origin main
   ```

---

## 7. Build & Compile Instructions

No build step is required. `index.html` is the complete deliverable.

**Optional minification:**
```bash
npm install -g html-minifier-terser
html-minifier-terser index.html \
  --collapse-whitespace --remove-comments \
  --minify-css true --minify-js true \
  -o index.min.html
```

---

## 8. Deployment Guide

**GitHub Pages**
```bash
# Enable Pages in repository Settings → Pages → Deploy from branch: main / root
# Access at: https://delongkevin.github.io/FullStackEngineer/projects/restaurant-menu/
```

**Netlify**
```bash
# Connect GitHub repository; set Publish Directory to: projects/restaurant-menu
```

**Nginx**
```nginx
server {
    listen 80;
    server_name bistro.example.com;
    root /var/www/restaurant-menu;
    index index.html;
    gzip on;
    gzip_types text/html text/css application/javascript image/svg+xml;
}
```
```bash
sudo cp -r projects/restaurant-menu /var/www/
sudo systemctl reload nginx
```

**Embedded in an iframe**
```html
<iframe
  src="/projects/restaurant-menu/index.html"
  width="100%"
  height="800"
  sandbox="allow-scripts allow-same-origin"
  title="Restaurant Menu Browser">
</iframe>
```

---

## 9. Full-Scale Adaptation Notes

To evolve this into a production restaurant ordering platform:

1. **Backend API:** Replace the static `menuItems` array with a REST API (Node.js + Express + PostgreSQL or a headless CMS like Contentful). The frontend fetches `GET /api/menu` on load, enabling real-time menu updates without redeploying the frontend.

2. **Real order processing:** Connect the "Place Order" button to `POST /api/orders` with the cart contents. The server validates prices, creates an order record, generates an order number, and optionally triggers email/SMS confirmation via SendGrid or Twilio.

3. **Payment integration:** Integrate Stripe Elements for card payment or Stripe Checkout for a hosted payment page. Never handle raw card data client-side.

4. **Authentication and order history:** Add user accounts (email/password or OAuth) so customers can view past orders and reorder with one click. Use JWTs for session management.

5. **Real-time order tracking:** Use WebSockets or Server-Sent Events to push order status updates (Preparing → Ready → Out for Delivery → Delivered) to the customer's browser.

6. **CMS integration:** Let restaurant staff update menu items, prices, and images through a CMS admin interface without touching code. Contentful, Sanity, or a custom admin dashboard are suitable choices.

7. **Internationalization (i18n):** Use a library such as `i18next` to support multiple languages and `Intl.NumberFormat` for locale-correct currency display.

8. **Analytics and A/B testing:** Track menu item views, add-to-cart rates, and order conversion rates. Use feature flags to A/B test layout changes (card size, CTA button color) without code deployments.
