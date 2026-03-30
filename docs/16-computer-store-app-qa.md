# Computer Store App — Technical Q&A Documentation

**Project:** Computer Store App  
**Slug:** `computer-store-app`  
**Category:** Mobile  
**Live Demo:** `/projects/ComputerStoreApp/index.html`  
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)  
**Mobile Builds:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/latest)

---

## Overview

The Computer Store App is a production-ready, full-stack cross-platform mobile e-commerce application built with Expo and React Native. It enables users to browse a catalog of computers and peripherals, manage a shopping cart with quantity controls, complete checkout via Stripe payment integration, scan product barcodes with the device camera, receive push notifications for order updates, and authenticate securely with biometric support. The server-side API is built with Node.js/Express backed by SQLite. The app is deployable as a native Android APK or iOS IPA via Expo Application Services (EAS Build), targeting real device installation without requiring Expo Go.

---

## 1. Architecture & Design Q&A

**Q1. Describe the overall application architecture and how the client, API, and database layers interact.**

The application follows a three-tier architecture: the React Native/Expo client, a Node.js/Express REST API server, and a SQLite database. The React Native client communicates with the Express API over HTTPS REST using Axios for HTTP requests, with JWT tokens stored in `expo-secure-store` for authenticated API calls. The Express API server defines RESTful routes for products (`/api/products`), cart (`/api/cart`), orders (`/api/orders`), and authentication (`/api/auth`). Business logic lives in Express middleware and service modules — payment processing delegates to the Stripe Node.js SDK, which calls Stripe's REST API. SQLite (via the `better-sqlite3` Node.js driver) stores product catalog, cart sessions, user accounts, and order records. This synchronous SQLite driver is appropriate for an embedded database used in a single-process Node.js server — it avoids the complexity of asynchronous database drivers for a lightweight deployment. For production at scale, the SQLite layer would be replaced with PostgreSQL (see Full-Scale Adaptation Notes).

**Q2. What navigation architecture is used, and how does it support both the stack and tab patterns?**

React Navigation 6 provides a nested navigator hierarchy. The root navigator is an `AuthStack` (Stack Navigator) that conditionally renders either the `AuthScreen` (login/register) or the main `AppTabs` navigator based on authentication state managed in a Zustand auth store. The `AppTabs` navigator is a `BottomTabNavigator` with four tabs: **Home** (product catalog), **Cart** (shopping cart), **Orders** (order history), and **Profile** (account settings). Each tab hosts its own Stack Navigator, enabling deep navigation within each tab without losing the tab bar. For example, the **Home** tab stack navigates: `CatalogScreen → CategoryScreen → ProductDetailScreen → ProductReviewScreen`. This nested navigator pattern preserves navigation history within each tab (pressing the back button within the Home stack does not return to the Auth stack) and allows each tab to maintain its own navigation state independently.

**Q3. How is global state managed across the cart, authentication, and notification contexts?**

Global state is managed with Zustand, chosen over Redux for its minimal boilerplate and TypeScript-first design. Three Zustand stores are defined: `useAuthStore` (user identity, JWT token, biometric auth status), `useCartStore` (cart items array, total quantity, total price — computed as derived state via Zustand's `subscribe` pattern), and `useOrderStore` (order history, current order status). The cart store persists to `AsyncStorage` via `zustand/middleware/persist` so that cart contents survive app closure without requiring a server-side cart session. The `useOrderStore` syncs with the server on mount via a `useEffect` calling `GET /api/orders` — orders are the source of truth on the server and the local store is a read cache. React Navigation's navigation state is not stored in Zustand; instead, a `useNavigationContainerRef` in `App.tsx` provides imperative navigation from outside the React tree (used by the push notification handler to navigate to the order detail screen when a notification is tapped).

**Q4. How is the Stripe payment flow architected to be secure without exposing secret keys to the client?**

The Stripe payment integration uses a client-secret pattern to prevent the Stripe secret key from ever reaching the mobile client. The flow is: (1) the client calls `POST /api/orders/create-payment-intent` with the cart total and currency; (2) the Express server uses the Stripe Node.js SDK (`stripe.paymentIntents.create()`) with the server-side secret key to create a PaymentIntent, receiving a `client_secret` in response; (3) the server returns only the `client_secret` to the client; (4) the React Native client uses `@stripe/stripe-react-native`'s `confirmPayment()` function with the `client_secret` to authorize the payment, which communicates directly with Stripe's API — the secret key is never transmitted to the client. This server-intermediary pattern is the canonical Stripe mobile integration approach, ensuring PCI DSS compliance by never transmitting raw card data through the application's own servers.

**Q5. How does the barcode scanner integrate with the product catalog, and what barcode formats are supported?**

The barcode scanner uses `expo-camera` with its built-in barcode scanning capability, enabled by setting the `barCodeScannerSettings.barCodeTypes` prop on the `<Camera>` component. Supported formats include: `BarCodeScanner.Constants.BarCodeType.qr` (QR codes), `ean13` (EAN-13, standard retail product barcodes), `ean8` (EAN-8), `upc_a` (UPC-A, North American products), `code128` (logistics and warehouse labels), and `code39` (alphanumeric SKUs). On a successful scan, the `onBarCodeScanned` callback receives the `data` (barcode value) and `type`. The handler calls `GET /api/products?barcode={scanned_value}`, which queries the SQLite `products` table's `barcode` column. If found, the app navigates directly to the `ProductDetailScreen` for that product. If not found, a `SnackBar` notifies the user that the product was not recognized. A 1.5-second cooldown prevents repeated scan triggers while the API call is in flight.

**Q6. Describe the push notification architecture for order status updates.**

Push notifications use Expo's notification infrastructure. On first launch, the app requests notification permissions and calls `expo-notifications`'s `getExpoPushTokenAsync()` — this returns an Expo push token (`ExponentPushToken[...]`) that is then sent to the server via `POST /api/users/push-token`. The Express server stores the token in SQLite's `users` table. When an order status changes (e.g., from "Processing" to "Shipped"), the Express order-status service sends a push notification via Expo's Push API (`https://exp.host/--/api/v2/push/send`) with the `to` field set to the user's stored Expo push token. The notification payload includes: `title: "Order Shipped!"`, `body: "Your order #1234 is on the way."`, and `data: { orderId: "1234" }`. On the client side, an `addNotificationResponseReceivedListener` in `App.tsx` intercepts notification taps and navigates to `OrderDetailScreen` with the `orderId` from the notification data.

**Q7. How does biometric authentication integrate with the app's login and session management?**

Biometric authentication uses `expo-local-authentication` combined with `expo-secure-store`. On initial login (username/password via the API), the server returns a JWT that is stored in `expo-secure-store` under the key `auth_token`. On subsequent app launches, the app checks for a stored token: if present, it presents a biometric prompt via `LocalAuthentication.authenticateAsync({ promptMessage: "Sign in to Computer Store" })`. On success, the stored JWT is retrieved from `expo-secure-store` (which is Keychain-backed on iOS and Keystore-backed on Android — both hardware-backed secure storage) and used to authenticate API requests without requiring the user to re-enter credentials. The JWT has a 7-day expiry — on expiry, the biometric prompt is bypassed and the full login form is shown. Biometric authentication is offered only if `LocalAuthentication.hasHardwareAsync()` returns true and `LocalAuthentication.isEnrolledAsync()` confirms at least one biometric is enrolled.

**Q8. What is the EAS Build configuration, and how does it differ from a standard Expo Go build?**

EAS Build (Expo Application Services) compiles the React Native application into a native Android APK/AAB or iOS IPA/Archive without requiring a local macOS machine for iOS builds. The `eas.json` configuration defines three build profiles: `development` (connects to Expo Dev Client for hot reload debugging), `preview` (APK/IPA for internal testing without EAS distribution), and `production` (signed APK/AAB for Play Store submission; signed IPA for App Store/TestFlight). EAS Build differs from Expo Go in that the native binary does not depend on the Expo Go runtime — all native modules (Stripe, camera, notifications, biometrics) are compiled into the native binary. The `app.json` defines the `expo.android.package` (e.g., `com.delongkevin.computerstoreapp`) and `expo.ios.bundleIdentifier` used for store submission. EAS Build handles code signing automatically: iOS provisioning profiles and certificates are managed via EAS Credentials, and Android keystore files are stored securely in EAS.

---

## 2. Technology Stack Q&A

**Q1. Why was Expo chosen over bare React Native for this project?**

Expo was chosen to maximize development velocity and simplify the native module integration process. Key Expo advantages: `expo-camera` provides a unified camera API with barcode scanning across iOS and Android without manual linking of native camera libraries; `expo-notifications` handles push token registration and notification delivery across both platforms with a single API; `expo-secure-store` abstracts Keychain (iOS) and EncryptedSharedPreferences (Android) behind a consistent interface; and EAS Build provides managed iOS code signing without requiring a local Mac or manual certificate management. The managed Expo workflow (no ejection required) allows running `eas build --platform all` from any development machine to produce both iOS and Android native binaries — a significant CI/CD simplification for a solo or small-team development context.

**Q2. How does `better-sqlite3` compare to `sqlite3` and `sequelize` for this use case?**

`better-sqlite3` is a synchronous SQLite driver — its APIs block the Node.js thread rather than using callbacks or Promises. This is appropriate for an Express API server handling modest concurrent load (the SQLite file lock limits concurrency anyway) and eliminates the boilerplate of async/await chains for simple CRUD queries. `sqlite3` (the older async driver) requires callback chains or promisification wrappers for every query. `sequelize` is a full ORM that adds 50–100 ms to startup time and introduces model synchronization complexity unnecessary for a project with a fixed schema. For this project's scope (product catalog, cart, orders), `better-sqlite3`'s `db.prepare(sql).all(params)` pattern provides the right balance of simplicity and performance — SQLite in WAL mode with `better-sqlite3` handles 300+ queries/second on commodity hardware, sufficient for a demo deployment.

**Q3. How does the Stripe React Native SDK handle card input validation and formatting?**

The `@stripe/stripe-react-native` SDK provides a `CardField` component that renders a native PCI-compliant card input UI. On iOS, `CardField` renders as a UITextField subclass managed by Stripe's native iOS SDK; on Android, it renders as a View component backed by Stripe's Android SDK. The component handles: card number formatting (spaces after every 4 digits), expiry date validation (MM/YY format with past-date rejection), CVC length validation (3 digits for Visa/MC, 4 for Amex), and real-time card brand detection (updating the card logo as digits are entered). Critically, the raw card number never passes through React Native's JavaScript thread — it is handled entirely within the native Stripe SDK components, maintaining PCI DSS SAQ A-EP compliance. The app receives only a non-sensitive `PaymentMethod` object (with last 4 digits, brand, and expiry) from `confirmPayment()` — never the full card number.

**Q4. What is the SQLite schema design, and how does it handle cart persistence and order history?**

The SQLite schema has five tables. `users`: `id INTEGER PK, email TEXT UNIQUE, password_hash TEXT, push_token TEXT, created_at DATETIME`. `products`: `id INTEGER PK, name TEXT, category TEXT, price REAL, description TEXT, image_url TEXT, barcode TEXT UNIQUE, stock INTEGER`. `cart_items`: `id INTEGER PK, user_id INTEGER FK, product_id INTEGER FK, quantity INTEGER, added_at DATETIME`. `orders`: `id INTEGER PK, user_id INTEGER FK, stripe_payment_intent_id TEXT, total REAL, status TEXT, created_at DATETIME`. `order_items`: `id INTEGER PK, order_id INTEGER FK, product_id INTEGER FK, quantity INTEGER, unit_price REAL`. The `cart_items` table provides server-side cart persistence (complementing the client-side Zustand persist) allowing cart restoration on a new device login. The `orders.stripe_payment_intent_id` links each order to its Stripe payment for refund processing. Foreign key enforcement is enabled via `PRAGMA foreign_keys = ON` at connection time.

**Q5. How are Lottie animations integrated, and what triggers the checkout success animation?**

Lottie animations are rendered by the `lottie-react-native` library, which wraps the Airbnb Lottie native runtime (iOS/Android). The checkout success animation uses a JSON Lottie file (`assets/animations/checkout-success.json` — a custom animation featuring an animated checkmark and confetti particles). The animation is rendered by an `<LottieView>` component on the `CheckoutSuccessScreen`. The screen is navigated to from `CheckoutScreen` after the `confirmPayment()` call resolves successfully and the `POST /api/orders` call returns a 201 with the new order record. The `<LottieView>` is configured with `autoPlay={true}` and `loop={false}`, playing the animation once on mount. A `useEffect` with a 3-second timeout then navigates the user to `OrderDetailScreen` to view their new order. The Lottie animation adds perceived quality to the checkout completion moment, which is a critical UX touchpoint in e-commerce conversion.

**Q6. How does the product category and search system work?**

Category filtering is implemented as a horizontal scrollable chip list at the top of the `CatalogScreen`. Categories (Laptops, Desktops, Monitors, Keyboards, Mice, Storage, Networking) are fetched from `GET /api/categories` on mount and stored in local component state. Selecting a category chip calls `GET /api/products?category={category}` — the Express route translates this to `SELECT * FROM products WHERE category = ?`. Full-text search uses a `TextInput` with a 300 ms debounce (implemented via `useRef`/`setTimeout` pattern) that calls `GET /api/products?search={query}`. The Express handler uses SQLite's LIKE operator: `SELECT * FROM products WHERE name LIKE '%?%' OR description LIKE '%?%'`. For production at scale, this would be replaced with SQLite FTS5 (Full-Text Search extension) for indexed full-text search performance, or Elasticsearch for faceted search with relevance ranking.

**Q7. How is the Node.js/Express API structured, and what middleware is applied globally?**

The Express app (`server/src/app.js`) applies middleware in order: `helmet()` (HTTP security headers: CSP, HSTS, X-Frame-Options), `cors()` with an allowlist of the mobile app's deep-link origin, `express.json()` with a 1 MB body size limit (preventing large-payload DoS), `express-rate-limit` (100 requests per 15 minutes per IP for general routes; 10 per 15 minutes for auth routes), and a custom JWT validation middleware applied to all routes except `/api/auth/*`. Route modules are organized in `server/src/routes/`: `products.js`, `cart.js`, `orders.js`, `auth.js`, `users.js`. Each route module uses Express Router and delegates business logic to service modules in `server/src/services/`. Error handling uses a centralized Express error-handling middleware (4-argument signature `(err, req, res, next)`) that maps known error types to HTTP status codes and logs unknown errors via `winston`.

**Q8. How does the app handle offline scenarios and poor connectivity?**

Offline handling uses React Query's `networkMode: 'offlineFirst'` combined with `AsyncStorage`-persisted query cache (`createAsyncStoragePersister` from `@tanstack/query-async-storage-persister`). Product catalog data is cached in the persisted query cache and served from cache when the network is unavailable — the user can browse previously loaded products offline. The cart Zustand store persists to `AsyncStorage`, allowing cart management offline. API mutations (add to cart, checkout) are queued when offline using React Query's `useMutation` with a `retryDelay` exponential back-off — mutations that fail due to network errors are retried automatically when connectivity is restored. The checkout flow explicitly requires connectivity: if `NetInfo.fetch()` indicates no internet, the checkout button shows a "No Internet Connection" banner and the payment flow is blocked (since Stripe's SDK requires network access for card tokenization).

---

## 3. Features & Implementation Q&A

**Q1. How is the product catalog rendered performantly for large product lists?**

The `CatalogScreen` uses `FlashList` from `@shopify/flash-list` instead of the standard `FlatList`. FlashList uses a recycler pattern with a fixed-size item pool, avoiding the dynamic layout measurement overhead of FlatList's `getItemLayout`-free mode. Each `ProductCard` component is memoized with `React.memo()` and receives stable prop references via `useCallback`-wrapped handlers — preventing unnecessary re-renders when the parent catalog state updates (e.g., search input changes re-render only the search bar, not all product cards). Product images use `expo-image` (replacing `Image` from React Native) which provides: progressive loading with a blur-hash placeholder, disk caching with LRU eviction, and priority-based preloading for below-the-fold images. The catalog fetches 20 products per page using React Query's `useInfiniteQuery`, loading additional pages as the user scrolls to the bottom of the list via the `onEndReached` callback.

**Q2. How does the shopping cart handle concurrent quantity updates and price consistency?**

The cart's quantity controls (increment/decrement buttons per line item) use optimistic updates in the Zustand store: pressing the increment button immediately increments the local quantity in the store (updating the displayed total instantly) while simultaneously dispatching `PATCH /api/cart/items/{id}` to the server. If the API call fails (network error, stock validation failure), the Zustand store is rolled back to the previous quantity and a toast notification informs the user of the failure reason. Stock validation is performed server-side: the Express cart update handler queries `products.stock >= new_quantity` before accepting the update, returning a 409 Conflict if the requested quantity exceeds available stock. The cart total is computed as a Zustand derived value using `subscribe` to recompute whenever `items` changes, avoiding stale price displays during rapid quantity changes.

**Q3. How is address and payment form validation implemented in the checkout flow?**

Form validation uses `react-hook-form` with `zod` as the validation schema library. The checkout form schema (`checkoutSchema`) validates: `name` (required, min 2 characters), `email` (valid email format via Zod's `.email()`), `address` (required, min 10 characters), `city` (required), `state` (required, 2-letter US state code via Zod enum), `zipCode` (5-digit US ZIP via Zod `.regex(/^\d{5}$/)`). The `<Controller>` component from `react-hook-form` wraps each `<TextInput>`, connecting the input's `onChangeText` and `onBlur` to `react-hook-form`'s field state management. Validation errors appear below each field as red text on blur (`mode: 'onBlur'` in `useForm` configuration). The "Pay Now" button is disabled until both the form validates successfully (`formState.isValid`) and the Stripe `CardField` is complete (`cardDetails.complete`). This dual-gate prevents premature payment attempts.

**Q4. How is order history displayed, and what information is shown per order?**

The `OrdersScreen` fetches `GET /api/orders` (authenticated, returns orders sorted by `created_at` DESC) and renders them as a `FlatList` of `OrderCard` components. Each `OrderCard` shows: order number (formatted as `#ORD-{id}`), order date (formatted with `date-fns` as "Dec 15, 2024"), item count, total price, and a status badge (Processing / Shipped / Delivered / Cancelled) with a color-coded pill. Tapping an order card navigates to `OrderDetailScreen`, which fetches `GET /api/orders/{id}` and shows the full item list (product name, quantity, unit price), shipping address, payment method (last 4 digits + brand from the Stripe PaymentIntent metadata), and order timeline (status change history). Order items use the `order_items` table's `unit_price` field (snapshotted at time of purchase) rather than the current product price — ensuring order history reflects what the customer actually paid.

**Q5. What does the product detail screen contain, and how is it designed for conversion?**

The `ProductDetailScreen` receives the product ID via navigation params and fetches `GET /api/products/{id}`. The screen layout (ScrollView with sticky "Add to Cart" footer button): hero image carousel (using `react-native-pager-view` for swipeable multiple images), product name and price (prominent, large typography), star rating and review count, product specifications table (key-value pairs from the product's `specs` JSONB field), description with expandable "Read More" (using `Animated.Value` for smooth height expansion), stock status ("In Stock" / "Low Stock — Only 3 left" / "Out of Stock"), quantity selector, and an "Add to Cart" button fixed at the bottom of the screen. The "Add to Cart" button dispatches to the Zustand cart store and shows a brief success animation (using `react-native-reanimated`'s `withSpring`) before enabling the button again, providing clear feedback without navigating away from the detail page.

**Q6. How does the camera barcode scanner handle permission requests and user experience?**

Camera permission is requested using `expo-camera`'s `Camera.requestCameraPermissionsAsync()`. The app follows a "request in context" pattern: the permission request is triggered only when the user taps the barcode scanner icon — not on app launch — with a pre-request explanation screen (rationale screen) explaining why camera access is needed for barcode scanning. If permission is denied, the app shows a "Camera Permission Required" screen with a "Open Settings" button that deep-links to the OS app settings (`Linking.openSettings()`) to allow the user to grant permission without re-navigating through the app. The scanner screen uses a `<Camera>` component filling the full screen with a centered targeting overlay (a rounded square with corner brackets, implemented as absolute-positioned SVG elements) to guide users in framing the barcode. A torch toggle button activates `Camera`'s `flashMode={Camera.Constants.FlashMode.torch}` for scanning in low-light environments.

**Q7. Describe the Expo application lifecycle and how the app handles foreground/background transitions.**

The app uses `expo-app-state` (via React Native's `AppState` module) to respond to foreground/background transitions. On backgrounding (`AppState === 'background'`), the app: stores the current cart state to `AsyncStorage` (via the Zustand persist middleware), cancels in-flight non-critical network requests, and arms a biometric re-authentication timer (if more than 5 minutes pass in the background, the next foreground event requires biometric re-auth before displaying PHI-equivalent data like order history). On foregrounding (`AppState === 'active'`), the app: refreshes the cart from the server (in case another device modified the cart), checks for pending push notifications via `expo-notifications`'s `getLastNotificationResponseAsync()` (handling notifications received while backgrounded), and re-validates the JWT expiry — silently refreshing if within 24 hours of expiry, or routing to the login screen if expired.

**Q8. How is the Lottie checkout animation integrated without impacting the bundle size significantly?**

Lottie JSON files can be large (200 KB – 2 MB), but the checkout success animation is a custom-designed minimal animation (confetti particles + checkmark, under 30 KB) created in Adobe After Effects and exported via the `bodymovin` plugin. The animation file is bundled statically in `assets/animations/` and loaded by `<LottieView source={require('../assets/animations/checkout-success.json')}>`. For the app bundle, Lottie's native runtime (`lottie-ios` / `lottie-android`) is linked by `lottie-react-native` — it adds approximately 1.2 MB to the native binary but this is a one-time fixed cost regardless of how many Lottie files are used. Additional animations could be loaded from remote URLs (`source={{ uri: 'https://...' }}`) to avoid bundling them — this is the recommended approach for apps with many animations, as it enables A/B testing different animations via a CDN without a full app update.

---

## 4. Testing & Quality Q&A

**Q1. What testing frameworks and tools are used, and what is the overall testing strategy?**

Testing uses Jest (test runner + assertion library), React Native Testing Library (component testing with `render` + `userEvent`), and `msw` (Mock Service Worker, adapted for React Native using `msw/native` with a custom `XMLHttpRequest` interceptor) for API mocking. The testing strategy divides tests into: unit tests for pure logic (cart calculations, form validators, barcode scan handlers); component tests for UI behavior (button presses, navigation, form submission); and integration tests that test complete user flows against mocked API handlers. Stripe's `@stripe/stripe-react-native` SDK is mocked in tests using a Jest manual mock at `__mocks__/@stripe/stripe-react-native.js` that returns a successful `confirmPayment` result, allowing checkout flow tests without real Stripe calls.

**Q2. How is the Express API tested, and how is the SQLite database handled in tests?**

Express API tests use Jest with Supertest (an HTTP assertion library for Express). Before each test suite, a fresh in-memory SQLite database is created (`const db = new Database(':memory:')`) and seeded with fixture data (10 products, 2 test users). The Express app is instantiated with this test database instance injected via a dependency injection pattern in `app.js` — the app factory accepts `db` as a parameter rather than creating it internally. This pattern allows tests to run against a clean, isolated database without file I/O and without risk of test data polluting the development database. After each test, the in-memory database is discarded automatically when the `db` object goes out of scope. Stripe API calls in integration tests are mocked using `jest.mock('stripe')` with a factory returning mock `paymentIntents.create` and `paymentIntents.retrieve` implementations.

**Q3. How is Expo module mocking handled for device-specific APIs (camera, biometrics, notifications)?**

Expo modules that access device hardware are mocked at the Jest module level using `__mocks__/expo-camera.js`, `__mocks__/expo-local-authentication.js`, etc. The camera mock provides a `Camera` component that renders a `<View>` and exposes `requestCameraPermissionsAsync` returning `{ status: 'granted' }`. The biometrics mock returns configurable values: `hasHardwareAsync()` → `true`, `isEnrolledAsync()` → `true`, `authenticateAsync()` → `{ success: true }` by default, with the option to override for failure-path tests (`jest.spyOn(LocalAuthentication, 'authenticateAsync').mockResolvedValue({ success: false })`). The `expo-notifications` mock provides a `getExpoPushTokenAsync` returning a deterministic test token and `scheduleNotificationAsync` that resolves immediately. These mocks are defined in the `jest.config.js` `moduleNameMapper` and allow the full component tree to render in Jest's JSDOM environment without crashing on `undefined` native module references.

**Q4. How is the Stripe payment integration tested without real card transactions?**

Stripe provides a comprehensive test mode: when the Stripe publishable key starts with `pk_test_`, the Stripe SDK routes all API calls to Stripe's sandbox environment. Test card numbers are hard-coded in the test fixture documentation: `4242 4242 4242 4242` (successful payment), `4000 0000 0000 0002` (declined card), `4000 0025 0000 3155` (3D Secure required). Component tests mock the `@stripe/stripe-react-native` module entirely. End-to-end Stripe flow testing uses a dedicated test environment with a Stripe test-mode API key stored in `.env.test`, running real Stripe API calls against the sandbox but with no actual financial transactions. The CI pipeline runs these Stripe integration tests with the test-mode keys sourced from environment variables — test keys are safe to use in CI since they cannot process real payments.

**Q5. What code quality tools are enforced, and what coverage thresholds are required?**

ESLint with `eslint-config-expo` and `@typescript-eslint/recommended` enforces code quality. Prettier handles formatting (enforced via `eslint-plugin-prettier`). A pre-commit hook (`husky` + `lint-staged`) runs `eslint --fix` and `prettier --write` on staged files before each commit. Jest code coverage is configured with `--coverage --coverageThreshold='{"global":{"lines":75,"functions":80,"branches":70}}'` — a pragmatic threshold for an Expo project where many branches involve native module availability checks that are difficult to test in JSDOM. Coverage reports are generated in LCOV format and uploaded to Codecov on CI. TypeScript strict mode is enabled for all source files, catching null-safety and undefined-access bugs at compile time.

**Q6. How are push notification flows tested end-to-end?**

Push notification end-to-end tests use Expo's `expo-notifications` in test mode, which supports sending test notifications via the Expo Push API using `ExponentPushToken[test]` tokens. The test flow: (1) a Jest integration test calls `POST /api/orders/{id}/update-status` to change an order from "Processing" to "Shipped"; (2) the Express service calls the Expo Push API with the test token; (3) the Expo Push API delivers the notification to the Expo notification test endpoint; (4) the test asserts the API response from Expo Push API returned `status: 'ok'`. Client-side notification handling is tested with React Native Testing Library: a `NotificationHandler` component is rendered with a mock `addNotificationResponseReceivedListener` that immediately fires a test notification response, and the test asserts that the navigation mock received a `navigate('OrderDetail', { orderId: '123' })` call — verifying the tap-to-navigate behavior.

---

## 5. Security Q&A

**Q1. How are JWT tokens secured on the client side, and what protections guard against token theft?**

JWT tokens are stored exclusively in `expo-secure-store`, which uses iOS Keychain with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` access control and Android Keystore-backed `EncryptedSharedPreferences`. Tokens are never stored in `AsyncStorage` (which is plaintext on both platforms) or logged to the console in production builds (`__DEV__` guards all logging of sensitive values). The JWT has a 7-day expiry and is a short-lived access token — no refresh token is stored, requiring re-authentication after expiry. The server-side JWT validation middleware uses `jsonwebtoken`'s `verify()` with the `algorithms: ['HS256']` restriction and rejects tokens missing the `aud` claim matching the server's configured audience. The token is transmitted only in the `Authorization: Bearer` header — never in URL query parameters (which appear in server access logs).

**Q2. How are API keys and environment secrets managed across development, staging, and production?**

Secrets are managed via Expo's `eas secret` command for EAS Build: `eas secret:create --scope project --name STRIPE_PUBLISHABLE_KEY --value pk_live_...`. EAS secrets are injected as environment variables during the native build process and read in `app.config.js` via `process.env.STRIPE_PUBLISHABLE_KEY`, baked into the native binary's configuration at build time. For the server side, secrets (Stripe secret key, JWT signing secret) are stored in a `.env` file (excluded from version control via `.gitignore`) for development and as platform environment variables (Heroku Config Vars, Railway environment, or Docker environment) for production. The `dotenv` package loads `.env` in development. A `secrets.example.env` file (with placeholder values) is committed to the repository as documentation of required environment variables. CI secrets are stored in GitHub Actions Secrets, injected as environment variables during the CI workflow.

**Q3. How does the app protect against common mobile security vulnerabilities?**

The app addresses common mobile vulnerabilities: (1) **Insecure data storage** — all sensitive data uses `expo-secure-store`; no sensitive data in `AsyncStorage` or plain files; (2) **Insufficient transport layer security** — Expo's default configuration enforces HTTPS for all API calls; no HTTP traffic is permitted in production builds; (3) **Insecure authentication** — biometric re-authentication on background resume, JWT with short expiry; (4) **Client-side injection** — all SQLite queries on the server use parameterized statements (`db.prepare('SELECT * FROM products WHERE id = ?').get(id)`) — no string concatenation into SQL; (5) **Improper session handling** — logout explicitly clears `expo-secure-store` token and resets Zustand store; (6) **Insecure communication** — Stripe's native SDK enforces certificate pinning internally for card data transmission; (7) **Binary reverse engineering** — ProGuard R8 obfuscation on Android; Swift symbol stripping on iOS release builds.

**Q4. How is the Express API protected against common web vulnerabilities?**

The Express API uses `helmet` middleware which sets: `Content-Security-Policy` (default-src 'self'), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 0` (disabled per modern guidance, relying on CSP instead), `Strict-Transport-Security` (max-age=31536000 in production), and `Referrer-Policy: no-referrer`. SQL injection is prevented entirely by `better-sqlite3`'s parameterized statement API — raw string interpolation into SQL is never used. NoSQL injection is not applicable (SQLite only). CSRF is not applicable for a JWT API (no cookie-based sessions). Rate limiting prevents brute-force attacks on the auth endpoints. Input validation uses `express-validator` to assert expected types and lengths on all request body fields before they reach any database or business logic — malformed inputs are rejected with a 400 Bad Request before processing.

**Q5. What user data privacy considerations are implemented?**

User data handling follows data minimization principles: only email, hashed password (bcrypt, cost factor 12), optional push token, and order history are stored. No behavioral analytics or advertising SDKs are included in the app. The Stripe integration never stores raw card data — only the Stripe `PaymentMethod` ID (a server-side opaque reference) and the last-4/brand metadata. Password storage uses `bcryptjs` with a cost factor of 12 (`bcrypt.hash(password, 12)`), producing computationally expensive hashes that resist brute-force attacks even if the database is breached. The `GET /api/users/me` endpoint returns only the user's own data (verified by comparing the JWT `sub` claim to the requested user ID). Account deletion (`DELETE /api/users/me`) immediately removes the user record and all associated cart items; orders are anonymized (user_id set to null) rather than deleted for accounting purposes.

**Q6. How is the app hardened against reverse engineering on Android?**

The Android APK compiled by EAS Build applies ProGuard R8 obfuscation with the `eas.json` `buildType: "apk"` or `"app-bundle"` configuration. The `proguard-rules.pro` includes React Native's default rules (`-keep class com.facebook.react.**`) and Stripe's required keep rules (`-keep class com.stripe.**`). Class and method names in the DEX bytecode are renamed to single characters, significantly raising the effort required to reverse-engineer business logic. The Stripe SDK further protects itself with its own obfuscation layer. Root detection using `expo-device`'s `isRooted` check (Android) provides a basic signal for detecting compromised devices, though it is not a hard block — the app warns the user but remains functional on rooted devices for developer ergonomics. For a banking-grade app, a dedicated root/tamper detection SDK (e.g., Guardsquare DexGuard, Promon SHIELD) would be used.

---

## 6. Source Code Update Guide

### Prerequisites

- Node.js 20 LTS + npm 10
- Expo CLI: `npm install -g expo@latest`
- EAS CLI: `npm install -g eas-cli`
- Android Studio with Android SDK 34+ (for Android emulator)
- Xcode 15+ (for iOS Simulator, macOS only)
- Stripe CLI: `brew install stripe/stripe-cli/stripe`

### Repository Structure

```
FullStackEngineer/
├── projects/ComputerStoreApp/
│   ├── index.html           # Demo page
│   └── src/                 # Demo source
├── android/computer-store/  # React Native / Expo source
│   ├── app/                 # App screens and navigation
│   │   ├── screens/         # All screen components
│   │   ├── navigation/      # Navigator definitions
│   │   ├── components/      # Reusable UI components
│   │   ├── store/           # Zustand state stores
│   │   ├── services/        # API service functions
│   │   └── utils/           # Utility functions
│   ├── server/              # Node.js/Express API
│   │   ├── src/
│   │   │   ├── routes/      # Express route handlers
│   │   │   ├── services/    # Business logic
│   │   │   └── db/          # SQLite setup and migrations
│   │   └── package.json
│   ├── assets/              # Images, animations, fonts
│   ├── app.json             # Expo config
│   ├── eas.json             # EAS Build config
│   └── package.json
```

### Adding a New Product Category

```bash
# 1. Add category to server seed data
vim server/src/db/seed.js
# Add product rows with category: "Tablets"

# 2. Update category list in client
vim app/screens/CatalogScreen.tsx
# Add "Tablets" to CATEGORIES array

# 3. Add category icon (optional)
# Place SVG in assets/icons/category-tablets.svg
# Import in CategoryChip component

# 4. Run seed
cd server && node src/db/seed.js

# 5. Test
npm run test -- --testPathPattern=CatalogScreen
```

### Updating Stripe Integration

```bash
# Update Stripe SDK versions
cd android/computer-store
npm install @stripe/stripe-react-native@latest

# iOS: update CocoaPods (if managing pods directly)
npx pod-install

# Update publishable key in EAS secrets
eas secret:push --scope project

# Test with Stripe CLI webhook forwarding
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

---

## 7. Build & Compile Instructions

### Development Server

```bash
cd android/computer-store

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Start on specific platform
npx expo start --android
npx expo start --ios

# Start backend API
cd server && npm install && npm start
# API running at http://localhost:3001
```

### EAS Build (Android APK)

```bash
cd android/computer-store

# Login to EAS
eas login

# Configure EAS (first time only)
eas build:configure

# Build Android APK (preview profile)
eas build --platform android --profile preview
# Downloads APK URL when complete

# Build Android production AAB
eas build --platform android --profile production
```

### EAS Build (iOS IPA)

```bash
# Build iOS for TestFlight (requires Apple Developer account)
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios --latest
```

### Local Android Build (without EAS)

```bash
cd android/computer-store

# Generate native Android project
npx expo prebuild --platform android

# Build debug APK
cd android && ./gradlew assembleDebug

# Install on connected device
./gradlew installDebug
```

### Server Build

```bash
cd android/computer-store/server
npm install
npm run build   # TypeScript compilation (if TS)
npm start       # Production server with pm2 or node
```

---

## 8. Deployment Guide

### Development Environment

```bash
# Terminal 1: Start backend API
cd android/computer-store/server
npm install
npm run dev   # nodemon for hot reload
# API: http://localhost:3001

# Terminal 2: Start Expo
cd android/computer-store
npm install
EXPO_PUBLIC_API_URL=http://localhost:3001 npx expo start

# Stripe webhook testing
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

### Staging Deployment

**Server (Railway or Render):**
```bash
# Deploy server to Railway
cd android/computer-store/server
railway init
railway up

# Set environment variables
railway variables set STRIPE_SECRET_KEY=sk_test_...
railway variables set JWT_SECRET=<generated-secret>
railway variables set NODE_ENV=production
```

**EAS Preview Build:**
```bash
eas build --platform all --profile preview
# Share download links with QA testers
eas build:list --platform all --status finished
```

### Production Deployment

**Server:**
```bash
# Using PM2 on a VPS
npm install -g pm2
cd android/computer-store/server
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup
```

**Android → Play Store:**
```bash
eas build --platform android --profile production
eas submit --platform android --latest \
  --track production
```

**iOS → App Store:**
```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
# Then submit for review in App Store Connect
```

**Monitoring:**
```bash
# Server health check
curl https://api.yourstore.com/api/health

# PM2 monitoring
pm2 monit

# Application logs
pm2 logs computer-store-api
```

---

## 9. Full-Scale Adaptation Notes

**Database Migration to PostgreSQL:** Replace `better-sqlite3` with `pg` (node-postgres) and add a connection pool (`pg-pool`). Migrate schema using Flyway or Knex migrations. Add PostgreSQL indexes: GIN index on `products.specs` JSONB for spec-based filtering, B-tree index on `orders.user_id` and `orders.created_at` for efficient order history queries.

**Horizontal Scaling:** Replace the single Express server with a horizontally scaled fleet behind a load balancer (NGINX or AWS ALB). Session state must be externalized to Redis (JWT is stateless, but rate limiter state and Stripe webhook idempotency keys need Redis). Use PM2 cluster mode for multi-core utilization on a single server as an intermediate step.

**Product Search at Scale:** Integrate Elasticsearch (or AWS OpenSearch) for full-text product search with faceted filtering (price range, brand, specs), typo tolerance, and relevance ranking. Sync product catalog from PostgreSQL to Elasticsearch via a Kafka CDC (Change Data Capture) pipeline using Debezium.

**Image Storage:** Replace `image_url` text fields with S3-backed product images using pre-signed URLs for secure time-limited access. Integrate AWS Rekognition or Google Cloud Vision for automated product image moderation and tagging.

**Real-Time Inventory:** Add WebSocket-based real-time stock updates using Socket.io or Supabase Realtime — when stock drops to 0, all clients viewing that product are immediately notified without polling. Implement optimistic locking on the `products.stock` column using `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?` to prevent overselling under concurrent checkout load.

**PCI DSS Full Compliance:** For storing payment methods (saved cards), integrate Stripe Customer and PaymentMethod objects (never store card data locally), implement Stripe's Advanced Fraud Detection signals (`stripeAccount` metadata), and complete a PCI DSS SAQ A-EP self-assessment.
