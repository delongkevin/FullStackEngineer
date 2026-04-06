# Personal Finance Tracker — Technical Q&A Documentation

**Project:** Personal Finance Tracker
**Slug:** `finance-tracker`
**Category:** Mobile (React Native / Expo)
**Live Demo:** `/projects/finance-dashboard/index.html`
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)
**Android APK:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/download/android-artifacts-latest/finance-app-debug.apk)
**iOS Source:** [finance-app/](https://github.com/delongkevin/FullStackEngineer/tree/main/finance-app)
**Backend Source:** `/finance-backend/`

---

## Overview

Finance Tracker is a cross-platform personal finance management application built with React Native, Expo, and a Node.js/Express backend. Users log income and expenses across eight spending categories, create monthly budgets with real-time health indicators (healthy / warning / exceeded), set savings goals with deadline tracking, and receive fraud alerts for unusual spending patterns. The dashboard recalculates balance, savings rate, top category, and goal progress after every transaction. The portfolio demo page renders an interactive preview with live transaction logging, budget progress bar, and dynamic KPI cards.

---

## 1. Architecture & Design Q&A

**Q1. How does the app separate concern between the dashboard view and financial calculations?**

All financial computation is extracted into a `financeUtils.js` module that the UI never calls directly — screens only invoke repository functions. `calcBalance(transactions)`, `calcBudgetPct(expenses, monthlyBudget)`, `calcSavingsRate(income, expenses)`, and `detectFraudAlerts(transactions, income)` are pure functions — they take data arrays as arguments and return result objects with no side effects. This makes them trivially testable with Jest and prevents logic from leaking into `render()`. The `DashboardScreen.js` simply maps `useSelector` output to the display format. The same utility functions power the Node.js analytics endpoint `GET /api/analytics/summary`, keeping client and server calculations identical.

**Q2. How is the fraud detection rule implemented?**

Fraud detection uses a threshold rule: any single expense transaction whose `amount` exceeds 50% of total income for the period is flagged. In `financeUtils.js`: `transactions.filter(t => t.type === 'expense' && t.amount > income * 0.5)`. The resulting count is shown on the Fraud Alerts card. In the React Native app, flagged transactions are additionally highlighted with a red border in the transaction list and trigger a local notification via `expo-notifications`. The 50% threshold is configurable via the user Settings screen and persisted in AsyncStorage.

**Q3. How does the budget progress bar determine its health status?**

Budget health is a three-state indicator computed by `calcBudgetPct()`. The function returns `{ pct, status }` where `status` is `'healthy'` (< 70% of monthly budget used), `'warning'` (70–99%), or `'exceeded'` (≥ 100%). In the React Native UI, the status maps to a Chip component with a green, amber, or red background. The `Bar` component (or the HTML demo's `.bar > span`) width is set to `Math.min(100, pct)` percent so it never overflows its track. The color of the filled portion also shifts from green to amber to red using the same threshold values applied as a CSS variable swap in the demo or a `backgroundColor` style swap in the native app.

**Q4. How are financial goals tracked across sessions?**

Goals are persisted via the backend API `POST /api/goals` and retrieved at app launch via `GET /api/goals`. Each goal has `{ id, name, targetAmount, deadline, current }`. The `current` field is recalculated server-side on every `GET /api/goals` call: it sums all `income` transactions that occurred after the goal's `createdAt` date, minus all `expense` transactions in the same window. This server-driven calculation prevents client-side drift and ensures goals reflect all transactions regardless of which device entered them. The React Native app displays goals as cards with a `ProgressBar` from `react-native-paper` and a countdown in days to the deadline.

**Q5. How does real-time balance recalculation work in the demo?**

The demo's `recalc()` function is called after every DOM mutation from the `addBtn` handler. It iterates the in-memory `transactions` array, partitions by `type`, sums each partition, and updates eight different DOM elements (balance, budget bar width, budget status chip text and class, savings rate, top category, fraud count, goal progress). Because all data is in JavaScript memory and the DOM updates are synchronous, there is no observable latency. The `aria-live="polite"` attribute on the balance and fraud count elements ensures screen readers announce updates after the user's current interaction completes.

---

## 2. Technology Stack Q&A

**Q1. What is the role of Stripe in the tech stack?**

Stripe is listed in the tech stack as an integration-ready point for the checkout and goal deposit features. The `finance-backend` includes a `POST /api/payments/intent` stub that would wrap `stripe.paymentIntents.create()`. The React Native app has a `PaymentScreen.js` that conditionally renders a Stripe payment sheet via `@stripe/stripe-react-native` when the user wants to transfer money to a savings goal. In the current portfolio demo, the endpoint returns a mock `{ clientSecret: 'demo_secret' }` and the payment sheet shows in sandbox mode. A real Stripe publishable key in the environment variable `STRIPE_PUBLISHABLE_KEY` would activate live payments.

**Q2. Why use Expo EAS Build for the distribution pipeline?**

EAS Build runs on Expo's managed CI infrastructure, eliminating the need for a macOS machine to produce iOS `.ipa` files in a Linux/Windows development environment. The `eas.json` at the repo root defines three profiles: `development` (debug APK/IPA for local testing), `preview` (release-signed artifacts for portfolio download), and `production` (App Store and Google Play submission config). Each `git push` to `main` triggers a GitHub Actions workflow that calls `eas build --platform all --profile preview --non-interactive`, producing the artifacts linked from the portfolio project card.

**Q3. How does multi-currency support work?**

Currency handling uses the JavaScript `Intl.NumberFormat` API with a user-configurable `locale` and `currency` setting stored in AsyncStorage. `formatCurrency(amount, currency)` wraps `new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)`. All monetary values are stored as raw numbers (USD cents as integers to avoid floating-point precision issues), and formatting is applied only at render time. The Settings screen exposes a currency picker with 15 supported ISO 4217 codes. The backend stores all amounts in a canonical `amountCents` integer field and the frontend converts to/from cents on all API calls.
