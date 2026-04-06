# Real Estate Marketplace App — Technical Q&A Documentation

**Project:** Real Estate Marketplace App
**Slug:** `real-estate-marketplace`
**Category:** Mobile (React Native / Expo)
**Live Demo:** `/projects/real-estate/index.html`
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)
**Android APK:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/download/android-artifacts-latest/real-estate-app-debug.apk)
**iOS Source:** [real-estate-app/](https://github.com/delongkevin/FullStackEngineer/tree/main/real-estate-app)
**Backend Source:** `/real-estate-backend/`

---

## Overview

Real Estate Marketplace is a cross-platform property search and booking application built with React Native, Expo, and a Node.js/Express backend. Users browse property listings filtered by city, price range, and bedroom count; add listings to a favorites collection; and book property tours with date/time scheduling. The backend provides JWT authentication and REST endpoints for properties, favorites, and bookings. The portfolio demo delivers an interactive filterable listing grid with live favorites toggling and a running tour count summary bar.

---

## 1. Architecture & Design Q&A

**Q1. How does multi-criteria filtering work in the app?**

Property filtering uses a pure `filterListings(listings, criteria)` function that chains three independent predicates: text match (city, type, or title contains the search query, case-insensitive), price range (one of four bands: any / < $500k / $500k–$800k / > $800k), and minimum bedroom count. Each predicate is evaluated sequentially with short-circuit logic — a listing that fails the text match is never tested against price or bedrooms. The filter function is called on every input event for the search field and on every `change` event for the price and bedroom selects. Because filtering is non-destructive (the original `listings` array is never mutated), the grid can be re-generated from scratch on each state change without accumulating filter side-effects.

**Q2. How is the favorites state managed across the listing grid?**

In the React Native app, favorites use an optimistic update pattern: `addFavorite(listingId)` immediately updates local state (so the heart icon flips instanly), then fires `POST /api/favorites` in the background. If the request fails, the local state rolls back via the promise's `.catch()` handler. The favorites collection is stored as a `Set<string>` in component state for O(1) membership checks when rendering each card's save button. On app launch, `GET /api/favorites` pre-populates the set from the user's server-side favorite list so state survives app restarts. The demo's implementation uses a simple `home.favorite` boolean on each listing object, toggled in place and triggering a full grid re-render.

**Q3. How does the tour booking flow work end-to-end?**

The tour booking flow is a three-screen modal stack: date picker → time slot selector → confirmation form. The React Native app uses `@react-native-community/datetimepicker` for native date selection on both platforms. Available time slots are fetched from `GET /api/properties/:id/availability?date=YYYY-MM-DD`, which returns the agent's open windows. Submitting the confirmation form calls `POST /api/bookings` with `{ propertyId, userId, date, time, contactEmail }`. The backend validates slot availability (preventing double-bookings by checking the in-memory `bookings` array), stores the booking, and returns `{ confirmationCode }`. The confirmation code is shown on a receipt screen and stored in `AsyncStorage` for offline reference.

**Q4. How does the demo's event delegation pattern reduce memory usage?**

Instead of attaching individual `click` listeners to each listing card's two buttons (favorite and book tour), the demo attaches a single `click` listener to the `document`. The handler reads `event.target.getAttribute('data-act')` and `getAttribute('data-id')` — the buttons carry these `data-*` attributes in their HTML. This event delegation pattern means the DOM can be fully rebuilt on each `render()` call without creating listener-leak issues from re-attached handlers that are common when doing `button.onclick = ...` inside a rendering loop. It also mirrors React's synthetic event system, where a single root listener handles all DOM events via propagation.

**Q5. How is the backend's booking conflict prevention implemented?**

The `POST /api/bookings` handler checks for conflicts with: `bookings.find(b => b.propertyId === body.propertyId && b.date === body.date && b.time === body.time)`. If a conflict exists, it returns a `409 Conflict` response with a human-readable error message. Because the in-memory store is single-threaded (Node.js event loop), there is no race condition risk for the in-memory implementation. A production upgrade to PostgreSQL would use a `UNIQUE(propertyId, date, time)` constraint on the `bookings` table plus a `SELECT ... FOR UPDATE` row lock to prevent conflicts under concurrent load.

---

## 2. Technology Stack Q&A

**Q1. Why JWT over session-cookie authentication for a mobile app?**

Session cookies require a shared session store (Redis, a database) accessible from all server instances — adding infrastructure complexity for a portfolio demo. JWTs are stateless: the token carries the user identity, verified via signature, with no server-side session lookup. For React Native, JWT is also simpler than cookie management because `AsyncStorage` is the natural persistence layer for tokens, whereas React Native has no native cookie jar equivalent. The token is included in every API request as an `Authorization: Bearer <token>` header via an Axios interceptor in `api.js`, providing clean separation between auth and business logic.

**Q2. How does the search input avoid excessive API calls during typing?**

In the React Native app, the search input uses a 300ms `debounce` wrapper (via `lodash.debounce`) around the `fetchProperties(query)` call. This means API calls only fire 300ms after the user stops typing, not on every keystroke. The current in-flight request is tracked via an `AbortController` instance — if a new search fires before the previous one resolves, `controller.abort()` cancels the pending fetch and a new controller is created. This prevents stale results from a slow earlier query arriving and overwriting results from a faster newer query (the "race condition" pattern). The demo's client-side JavaScript filtering has no debounce need since filtering is synchronous and CPU-negligible.

**Q3. How does the property image gallery work in the React Native screens?**

Property detail view includes a horizontally scrollable image gallery using a `FlatList` with `horizontal={true}` and `pagingEnabled={true}`. Images are loaded via `expo-image` (the recommended replacement for React Native's `Image` component) which provides automatic caching, priority loading, and smooth fade-in on first load. Each image card shows a `(currentIndex + 1) / total` indicator rendered as an `Animated.View` overlay that fades in on scroll. For the portfolio demo, images are represented by placeholder colored div blocks since the demo is a lightweight HTML preview rather than the full native experience.
