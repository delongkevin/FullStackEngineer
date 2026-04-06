# Fitness Tracker App — Technical Q&A Documentation

**Project:** Fitness Tracker App
**Slug:** `fitness-tracker`
**Category:** Mobile (React Native / Expo)
**Live Demo:** `/projects/fitness-tracker/index.html`
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)
**Android APK:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/download/android-artifacts-latest/fitness-tracker-app-debug.apk)
**iOS Source:** [fitness-tracker-app/](https://github.com/delongkevin/FullStackEngineer/tree/main/fitness-tracker-app)
**Backend Source:** `/fitness-tracker-backend/`

---

## Overview

FitTrack is a cross-platform fitness tracking application built with React Native and Expo. Users log workouts across six exercise types (run, cycling, swimming, gym, yoga, walking) and monitor daily health metrics — steps, calories, heart rate, water intake, and sleep quality — via Apple HealthKit (iOS) and Google Fit (Android). The app syncs with wearable devices (Apple Watch, Wear OS, Fitbit), visualizes 7-day rolling trends with Chart.js, and supports custom goal creation and progress tracking. A Node.js/Express backend provides authenticated REST endpoints for workouts, goals, and analytics. The portfolio demo page renders an interactive vanilla-JS preview with a live progress ring, session logging, and hydration tracking.

---

## 1. Architecture & Design Q&A

**Q1. How is the app's state managed without a global store like Redux?**

FitTrack uses React's built-in `useState` and `useContext` hooks for all state management. A top-level `AppContext` wraps the navigation tree and holds the authenticated user object, the list of workouts, and the list of goals. Child screens consume context via `useContext(AppContext)` — eliminating prop-drilling across the 5-tab navigation hierarchy. Heavy computations (7-day calorie totals, goal completion percentages) are wrapped in `useMemo` to prevent re-calculation on unrelated re-renders. The pattern intentionally avoids Redux to keep the dependency surface small and the learning curve accessible, while still maintaining a single source of truth for shared state.

**Q2. How does the demo page simulate the full app's interactivity without a native runtime?**

The portfolio demo (`/projects/fitness-tracker/index.html`) is a single-file vanilla JavaScript application that mirrors the core read-modify-render loop of the React Native screens. State (steps, calories, waterOz, workouts array, streakDays) is held in JS variables. Each user action (Log Session, Add Water) calls an updater function that mutates state and synchronously re-renders affected DOM nodes. The conic-gradient progress ring is recalculated in JS: `progress * 3.6` degrees maps 0–100% to 0–360°. This approach gives an accurate live preview of the dashboard UX without requiring Expo or a native build.

**Q3. How is HealthKit/Google Fit integration structured?**

Platform health integrations use Expo's `expo-health` (HealthKit on iOS) and `react-native-google-fit` (Android). Both are abstracted behind a `HealthService` module that exposes a unified `fetchTodayMetrics(): Promise<DailyMetrics>` interface — the UI never calls platform APIs directly. On iOS, `HealthService.request()` triggers the HealthKit authorization prompt for the required read permissions (HKQuantityTypeStepCount, HKQuantityTypeActiveEnergyBurned, etc.). On Android, Google Fit uses OAuth 2.0 via `GoogleSignIn` for the same permissions. If a user declines permission or runs in an Expo Go environment, `HealthService` falls back to mock data. This abstraction means both `DashboardScreen` and `WorkoutDetailScreen` use the same `DailyMetrics` shape regardless of platform.

**Q4. How do wearable device sync indicators work?**

Device sync status is fetched from the `/api/user/:id/devices` backend endpoint, which returns an array of `{ deviceName, lastSyncAt }` objects. On the Profile screen, each device is rendered with a last-sync timestamp. "Freshness" is a client-side computation: if `lastSyncAt` is within the last 2 hours, the indicator is green; within 24 hours, yellow; otherwise red. The sync trigger is a `POST /api/user/:id/devices/:deviceId/sync` call that updates the `lastSyncAt` timestamp and returns the full updated device list. Bluetooth pairing itself is out-of-scope for the demo backend — the endpoints simulate the sync lifecycle without native BLE code.

**Q5. How are workout goals tracked and visualized?**

Goals are stored on the backend as `{ userId, type, target, current, deadline }` objects and retrieved via `GET /api/goals`. The Goals screen renders each goal with a horizontal progress bar: `(current / target) * 100` clamped to 100%. Color coding follows a threshold system: under 30% is red, 30–70% yellow, above 70% green. When a workout is logged, the backend's `POST /api/workouts` handler checks all active goals of the matching type and increments their `current` value. The response includes `{ updatedGoals: [...] }` so the client can update goal progress immediately without a second request. This optimistic read-through pattern keeps the goal list always accurate after a workout log without polling.

**Q6. How is the Chart.js visualization integrated into a React Native app?**

Chart.js runs natively in web environments, not React Native. The project uses `react-native-chart-kit` — a React Native port built on `react-native-svg`. The `LineChart` component from `react-native-chart-kit` accepts a `data` prop with `labels` (day abbreviations) and `datasets` (metric values arrays). 7-day data is fetched from the backend `GET /api/analytics/weekly` endpoint and stored in component state. Each chart has `bezier` smoothing enabled for cleaner trend curves, `withDots={false}` for performance on low-end devices, and `chartConfig.propsForDots` to style peak days differently. The chart container uses `ScrollView` with `horizontal={true}` on small screens so charts don't clip on portrait mode.

---

## 2. Technology Stack Q&A

**Q1. Why was Expo chosen over bare React Native?**

Expo was chosen because it dramatically reduces native build overhead for a portfolio project. The managed workflow provides pre-built native modules (`expo-sensors`, `expo-location`, `expo-notifications`) without requiring Android Studio or Xcode for every change. EAS Build (Expo Application Services) handles the CI/CD pipeline: a push to `main` triggers an EAS build job that produces the `.apk` and `.ipa` artifacts linked in the portfolio. The tradeoff is that some advanced native APIs (custom Bluetooth pairing, deep HealthKit write access) are not available in managed Expo — if those were required, the project would eject to a bare workflow via `expo eject`.

**Q2. Why does the backend use in-memory storage instead of a database?**

The backend at `/fitness-tracker-backend/server.js` uses JavaScript `Map` and `Array` objects for all data storage. This choice prioritizes zero-configuration deployment for portfolio evaluation: no database server, no environment variables for connection strings, no migration scripts. The tradeoff — data is lost on server restart — is acceptable for a demo. A production upgrade path would replace the in-memory stores with Prisma + PostgreSQL: the repository abstraction is already in place (all data access goes through `workoutRepository.*` and `goalRepository.*` function calls), so swapping the implementation does not require changing any route handler code.

**Q3. How is authentication handled across the React Native app and backend?**

Authentication uses JWT (JSON Web Tokens). The `POST /api/auth/login` endpoint validates credentials against the user store and returns `{ token, user }`. The token is stored on the device using `AsyncStorage` (React Native's key-value store) under the key `@fittrack_token`. All subsequent API calls include the token in the `Authorization: Bearer <token>` header via an Axios request interceptor defined in `api.js`. The backend validates the token using `jsonwebtoken.verify()` in an Express middleware applied to all `/api/*` routes except `/api/auth/**`. Token expiry is set to 7 days to reduce login friction for demo evaluators.

**Q4. What makes the React Native UI cross-platform without platform-specific branches?**

The UI uses `StyleSheet.create()` for all styles — React Native's style system automatically handles platform rendering differences for shadows (`elevation` on Android, `shadowColor`/`shadowOffset` on iOS), border rounding, and font weight. The few platform branches that do exist use `Platform.OS === 'ios'` ternaries in the `StyleSheet` definitions themselves, keeping JSX clean. Flex layout (column, row, space-between) maps directly to both iOS AutoLayout and Android ConstraintLayout under the hood. The result is a single JSX tree for each screen that renders correctly on both platforms without any `Platform.select()` blocks in component logic.

---

## 3. Interactive Demo Q&A

**Q1. How does the progress ring in the demo calculate and display goal completion?**

The ring is a `div` with `background: conic-gradient(...)` styled dynamically. The JavaScript `updateDashboard()` function computes an overall progress percentage as the average of `(steps / stepGoal) * 100` and `(calories / caloriesGoal) * 100`. This percentage is multiplied by 3.6 to convert to degrees (100% = 360°). The `conic-gradient(var(--accent) 0deg Xdeg, #314164 Xdeg 360deg)` string is set via `element.style.background`, producing a sweep-fill effect without any SVG or canvas dependency.

**Q2. How does the demo handle the hydration bar?**

Hydration state is a `waterOz` variable initialized at 48 oz. Clicking "Add 8 oz Water" increments it by 8, capped at 80 oz via `Math.min(80, waterOz + 8)`. The bar fill is `(waterOz / 80) * 100` percent, applied to the `width` style of the inner `<span>` inside the `.water` progress track div. This mirrors the React Native `ProgressBar` + state update pattern used in the actual app's `DashboardScreen.js`.
