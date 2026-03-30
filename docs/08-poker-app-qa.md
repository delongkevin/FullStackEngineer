# Poker App — Technical Q&A Documentation

**Category:** Mobile  
**Tech Stack:** React Native, JavaScript, CSS3, Android, iOS  
**Project Path:** `/projects/PokerApp/PokerApp.html`  
**Live URL:** `/projects/PokerApp/PokerApp.html`  
**GitHub:** https://github.com/delongkevin/FullStackEngineer  
**Android / iOS Download:** https://github.com/delongkevin/FullStackEngineer/releases/latest  

---

## Overview

The Poker App is an interactive mobile poker game built with React Native, targeting both Android and iOS from a single JavaScript codebase. The application implements Texas Hold'em game logic including hand evaluation, blind mechanics, and betting rounds. A polished, responsive UI delivers a professional casino feel with smooth animations. An HTML-based demo (`PokerApp.html`) is also available for quick browser-based preview. The game state is managed via React hooks or Redux, and navigation between screens is handled by React Navigation.

---

## 1. Architecture & Design Q&A

**Q1. What is the overall architectural pattern used in the Poker App?**

The application follows a unidirectional data-flow architecture typical of React Native projects. A single source of truth for game state — including the deck, community cards, player hands, chip counts, pot size, and current betting round — is held either in a top-level React context with `useReducer`, or in a Redux store if the project uses Redux. UI components are pure or memoised functional components that read state via hooks (`useSelector`, `useContext`) and dispatch actions to mutate state. This ensures predictable state transitions and makes the game logic fully testable in isolation from the UI.

**Q2. How is the game state machine structured?**

Texas Hold'em progresses through discrete phases: Pre-flop → Flop → Turn → River → Showdown. Each phase is represented as a string enum in the state (`'preflop' | 'flop' | 'turn' | 'river' | 'showdown'`). A `gameReducer` function (or Redux slice) handles actions such as `DEAL_CARDS`, `PLAYER_BET`, `PLAYER_FOLD`, `PLAYER_CALL`, `ADVANCE_ROUND`, and `EVALUATE_WINNER`. State transitions are deterministic, enabling replay and unit testing of complete game sequences.

**Q3. How is screen navigation structured?**

React Navigation is used with a Stack Navigator as the root. Screens include: `HomeScreen` (main menu), `GameScreen` (active poker table), `SettingsScreen` (chip counts, blind levels, sound), and `ReviewScreen` (hand history and rating). The navigation state is serializable, enabling deep-linking and state restoration after app backgrounding. Navigation parameters pass only IDs, not full objects, keeping the navigation stack lean.

**Q4. How is the deck managed in memory?**

At the start of each game, a 52-card deck is generated as an array of objects `{ suit: 'hearts', rank: 'A', value: 14 }`. A Fisher-Yates shuffle is applied to the array in-place. Cards are dealt by splicing from the top of the shuffled deck array. The remaining deck reference is stored in state, ensuring no card is dealt twice within a single game session.

**Q5. How does the betting round logic work?**

Each betting round tracks `currentBet` (the highest bet on the table), `pot` (accumulated chips), and a `players` array where each player object carries `chips`, `currentRoundBet`, `hasActed`, and `isFolded` flags. When a player bets or raises, `currentBet` is updated and `hasActed` is reset to `false` for all remaining active players. The round ends when all active (non-folded) players have `hasActed === true` and their `currentRoundBet` equals `currentBet`. This logic is encapsulated in a `bettingRoundComplete` selector/helper function.

**Q6. How is the HTML demo (`PokerApp.html`) related to the React Native app?**

`PokerApp.html` is a standalone browser-based prototype of the poker game implemented with vanilla HTML, CSS, and JavaScript. It demonstrates the UI layout, card rendering, and basic game flow without requiring a React Native build chain. It is used for rapid iteration and portfolio preview in an iframe. The React Native app shares the same game logic concepts but is implemented in the React Native component model and runs as a native binary on Android and iOS.

**Q7. How does the app handle AI opponents (if applicable)?**

A simple rule-based AI opponent uses the hand strength evaluation function to decide between fold, call, and raise. The AI's aggressiveness is parameterised by a `bluffFrequency` value (0–1). With probability equal to `bluffFrequency`, the AI raises regardless of hand strength, simulating a bluff. Otherwise, it folds weak hands (score below a threshold), calls medium hands, and raises strong hands. This heuristic is replaceable with a Monte Carlo simulation for a stronger AI.

**Q8. How does the review and rating system work?**

After each game session, the `ReviewScreen` presents a summary of hands played, chips won or lost, and a star rating prompt (1–5 stars). The rating is stored in `AsyncStorage` (React Native's key-value persistence) keyed by session timestamp. An aggregate rating display shows the average of all stored ratings. This data can be extended to sync with a backend analytics service via a REST API.

---

## 2. Technology Stack Q&A

**Q1. Why React Native for a poker game rather than a native Swift/Kotlin implementation?**

React Native enables a single JavaScript codebase to target both Android and iOS, halving the development effort for a portfolio or demo project. The poker game's rendering requirements (cards, chip animations, text labels) are well within React Native's capabilities. React Native's `Animated` API and community animation libraries (e.g., `react-native-reanimated`) provide the smooth transitions expected in a card game. For a production-scale game with complex 3D graphics, Unity or Unreal Engine would be considered; React Native is the appropriate trade-off here.

**Q2. How is styling handled in React Native?**

React Native uses a `StyleSheet.create` API that accepts a subset of CSS properties (flexbox layout, colors, borders, transforms). The project also references CSS3 in the tech stack for the HTML demo (`PokerApp.html`), which uses standard CSS classes for card flip animations and responsive layout. The React Native app uses a centralized `theme.js` file that exports color constants (e.g., felt green, chip gold) and typography scales, ensuring visual consistency across screens.

**Q3. What is `AsyncStorage` and how is it used?**

`AsyncStorage` is React Native's built-in asynchronous key-value store, backed by SQLite on Android and the iOS file system on iOS. In this app it persists player chip balances, settings (sound on/off, blind levels), and game history between sessions. All reads and writes are `async/await` wrapped to handle the asynchronous nature without blocking the UI thread.

**Q4. How are card images or graphics rendered?**

Cards are rendered as React Native `View` components styled to resemble playing cards, with `Text` components showing the rank and suit Unicode symbols (♠ ♥ ♦ ♣). Alternatively, SVG card assets are rendered with `react-native-svg`. This approach avoids large image asset bundles and allows dynamic card coloring (red for hearts/diamonds, black for spades/clubs) through conditional style application.

**Q5. What version of React Native is targeted?**

The project targets React Native 0.71+ (New Architecture compatible), which uses the JSI (JavaScript Interface) bridge for faster native calls. The Metro bundler is used for development and the Hermes JavaScript engine is enabled for improved startup time and reduced memory consumption on both Android and iOS.

**Q6. What dependencies are used, and what are their roles?**

| Package | Role |
|---|---|
| `react-navigation/native` | Screen navigation |
| `react-navigation/stack` | Stack navigator implementation |
| `@react-native-async-storage/async-storage` | Persistent key-value storage |
| `react-native-reanimated` | Smooth card flip animations |
| `react-native-svg` | SVG card rendering (optional) |
| `redux` + `react-redux` | Global state management (optional path) |

**Q7. How is the build toolchain set up for Android and iOS?**

Android builds use Gradle with the React Native Gradle plugin. iOS builds use Xcode with CocoaPods for native dependency resolution. The `npx react-native run-android` and `npx react-native run-ios` commands trigger the respective build systems during development. Release builds are generated with `./gradlew assembleRelease` (Android) and an Xcode archive (iOS).

---

## 3. Features & Implementation Q&A

**Q1. How is Texas Hold'em hand evaluation implemented?**

A `evaluateHand(cards)` function accepts an array of 5–7 cards and returns a hand rank object `{ rank: number, name: string, tiebreakers: number[] }`. The rank integer maps to standard hand categories (1 = High Card through 10 = Royal Flush). The function checks combinations of 5 cards from the 7 available (using a `combinations` utility), evaluates each, and returns the best. Tiebreaker arrays allow comparison between same-rank hands (e.g., comparing kicker values for two pairs).

**Q2. How does the betting UI work?**

The betting UI on `GameScreen` displays a row of action buttons: **Fold**, **Check/Call**, and **Raise**. When **Raise** is tapped, a slider or number input appears for the raise amount (clamped between the minimum raise and the player's remaining chips). Tapping a button dispatches the corresponding action to the game reducer. The pot display and player chip counts update reactively as state changes propagate through the component tree.

**Q3. How is the card dealing animation implemented?**

Using `react-native-reanimated`, each card component has a shared value for `translateX`, `translateY`, and `opacity`. When the `DEAL_CARDS` action fires, a staggered animation sequence runs: cards animate from the deck position to each player's hand position with a 150 ms delay between cards, simulating a real deal. The flip animation (face-down to face-up) uses a rotateY transform interpolated from 0° to 180°, with the card face hidden until the midpoint of the rotation.

**Q4. How does the blind and ante system work?**

Blind positions (small blind, big blind) rotate clockwise after each hand. The `dealerIndex` in state increments modulo the number of players after each hand concludes. Small blind = `BLIND_LEVEL / 2`, big blind = `BLIND_LEVEL`. Both are automatically deducted from the respective players' chip counts and added to the pot before the Pre-flop betting round begins.

**Q5. How is the showdown resolved?**

At showdown, all non-folded players reveal their hole cards. The `evaluateHand` function computes each player's best 5-card hand from their 2 hole cards and 5 community cards. Players are ranked by hand score; ties are broken by tiebreaker arrays. The winner's chip count is incremented by the pot amount. Side pots are handled for all-in situations by tracking each player's maximum contribution to each pot segment.

**Q6. How does the responsive design work on different screen sizes?**

The game table layout uses React Native Flexbox with `flex` proportions rather than fixed pixel values. The `Dimensions` API reads the screen width and height at mount time to scale card sizes, font sizes, and button dimensions proportionally. On tablets, the layout shifts to a wider table with more visible information; on phones, elements stack vertically to fit the smaller viewport.

**Q7. How is sound managed?**

Sound effects (card shuffle, chip clink, win fanfare) are played using `react-native-sound` or `expo-av`. Audio files are bundled as assets in `android/app/src/main/res/raw/` and `ios/<AppName>/Resources/`. A `SoundManager` module wraps playback with a mute toggle that reads from `AsyncStorage` settings.

---

## 4. Testing & Quality Q&A

**Q1. How is the hand evaluation function tested?**

The `evaluateHand` function is tested with Jest. Test cases cover all 10 hand categories, edge cases (ace-low straights, wheel), and tiebreaker comparisons. A parameterized test table provides 50+ card combinations with known expected outputs, ensuring correctness across the full range of poker hands.

**Q2. How are React Native components tested?**

Component tests use React Native Testing Library (`@testing-library/react-native`). Tests render components in a mocked environment, simulate user interactions (tap, swipe, input), and assert on rendered text and element presence. The game reducer is tested separately with pure unit tests covering all action types.

**Q3. How is the betting round logic verified?**

Integration tests simulate a full hand by dispatching a sequence of actions (deal, bet, call, advance) to the reducer and asserting on the final state. These tests cover edge cases: all-in scenarios, everyone folding, split pots, and blind posting. Snapshot tests capture the expected state shape after each action.

**Q4. How is the application linted and formatted?**

ESLint with the `react-native` and `prettier` presets is configured in `.eslintrc.js`. Prettier enforces consistent code formatting. A pre-commit hook (via `husky` and `lint-staged`) runs ESLint and Prettier on staged files before allowing a commit.

**Q5. How is end-to-end testing performed?**

Detox is used for end-to-end testing on real Android and iOS simulators. Tests launch the app, navigate to the game screen, play through a simulated hand using UI interactions, and verify that chip counts and pot values update correctly on screen.

---

## 5. Security Q&A

**Q1. How is the deck shuffle cryptographically fair?**

The Fisher-Yates shuffle uses `Math.random()`, which is a pseudorandom generator and not cryptographically secure. For a real-money or high-stakes game, this must be replaced with a CSPRNG (e.g., `crypto.getRandomValues` in React Native via a native module, or server-side shuffle generation with the result delivered to the client). The current implementation is appropriate for a demonstration application.

**Q2. How is cheating prevented in multiplayer mode?**

The current application is single-player with AI opponents; there is no multiplayer backend. In a production multiplayer extension, all game state must be managed on a trusted server (Node.js with Socket.IO). Clients send only actions (bet, fold); the server validates and applies them. No card values are sent to a client before they are legitimately visible to that player, preventing packet sniffing cheats.

**Q3. How is `AsyncStorage` data protected?**

`AsyncStorage` data is stored in plaintext on the device. For sensitive data (e.g., player balances in a real-money context), `react-native-encrypted-storage` should be used instead, which leverages the Android Keystore and iOS Keychain for encryption. The current demo stores only chip counts and settings, which have no monetary value.

**Q4. What input validation is applied?**

Raise amounts are validated client-side to be within `[minRaise, playerChips]`. Input is parsed as an integer with `parseInt` and clamped with `Math.min`/`Math.max`. Invalid inputs (NaN, negative numbers) are rejected and the input field is reset with an error message.

**Q5. How are dependencies audited for vulnerabilities?**

`npm audit` is run as part of the CI pipeline. Dependabot is enabled on the GitHub repository to automatically open pull requests for security-relevant dependency updates. Packages with high-severity vulnerabilities are updated before any release build is created.

---

## 6. Source Code Update Guide

### Prerequisites
- Node.js 18+ and npm 9+
- React Native CLI: `npm install -g react-native-cli`
- Android Studio with SDK Platform 33+ and an Android emulator or device
- Xcode 14+ (macOS only, for iOS builds)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/delongkevin/FullStackEngineer.git
   cd FullStackEngineer/projects/PokerApp
   ```

2. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

3. **Install iOS native dependencies (macOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Update game logic**
   - Edit `src/game/gameReducer.js` to modify state transitions.
   - Edit `src/game/handEvaluator.js` to change hand ranking logic.
   - Edit `src/game/deck.js` to change card representations.

5. **Update UI components**
   - Edit files in `src/screens/` for layout changes.
   - Edit `src/theme.js` for color and typography changes.
   - Edit `src/components/Card.js` for card rendering changes.

6. **Update the HTML demo**
   - Edit `PokerApp.html` directly; it is a self-contained file with embedded CSS and JS.

7. **Run on a development device**
   ```bash
   npx react-native start        # Start Metro bundler
   npx react-native run-android  # In a second terminal
   # or
   npx react-native run-ios
   ```

8. **Commit changes**
   ```bash
   git add .
   git commit -m "Update betting logic and card animations"
   git push origin main
   ```

---

## 7. Build & Compile Instructions

### Android

```bash
# Debug APK
npx react-native run-android

# Release APK (requires signing key)
cd android
./gradlew clean assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

**Signing setup** — create `android/keystore.properties`:
```properties
storeFile=../release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=pokerapp
keyPassword=YOUR_KEY_PASSWORD
```

Generate keystore:
```bash
keytool -genkeypair -v -keystore release.keystore \
  -alias pokerapp -keyalg RSA -keysize 2048 -validity 10000
```

### iOS

```bash
# Open Xcode and build/archive
open ios/PokerApp.xcworkspace
# Product → Archive → Distribute App
```

Or via command line:
```bash
xcodebuild -workspace ios/PokerApp.xcworkspace \
  -scheme PokerApp -configuration Release \
  -archivePath ios/PokerApp.xcarchive archive
```

### HTML Demo

No build step is required. `PokerApp.html` is a static file served directly.

---

## 8. Deployment Guide

### Android APK Distribution

1. Build the release APK (see Section 7).
2. Upload `app-release.apk` to the GitHub Releases page:
   ```bash
   gh release create v1.0.0 android/app/build/outputs/apk/release/app-release.apk \
     --title "Poker App v1.0.0" --notes "Release notes here"
   ```
3. Users download and install by enabling "Install from unknown sources" on their Android device.

### Google Play Store

1. Build an Android App Bundle (AAB):
   ```bash
   cd android && ./gradlew bundleRelease
   # Output: android/app/build/outputs/bundle/release/app-release.aab
   ```
2. Upload the AAB to Google Play Console under the selected track (internal, alpha, production).
3. Complete the store listing, screenshots, and privacy policy.
4. Submit for review.

### Apple App Store

1. Archive the app in Xcode.
2. Upload via Xcode Organizer or `xcrun altool`.
3. Submit in App Store Connect with screenshots, description, and age rating.
4. Submit for App Review.

### HTML Demo Deployment

Serve `PokerApp.html` as a static file via any HTTP server or CDN (Netlify, Vercel, GitHub Pages). No server-side processing is required.

---

## 9. Full-Scale Adaptation Notes

To take this poker app to a production-scale real-money or large-user gaming platform:

1. **Multiplayer backend:** Implement a Node.js + Socket.IO (or Go + WebSocket) server that acts as the authoritative game engine. All game state mutations happen server-side. Clients are thin renderers only.

2. **Cryptographically secure shuffle:** Replace `Math.random()` with a server-side CSPRNG shuffle, revealing card values to clients only at the moment they become visible per game rules.

3. **Payment integration:** Integrate Stripe or PayPal for chip purchase and cash-out flows. Implement KYC (Know Your Customer) verification for real-money compliance using a third-party identity provider.

4. **Regulatory compliance:** Real-money online poker requires gambling licenses in each jurisdiction. Implement responsible gambling features: deposit limits, self-exclusion, session time alerts.

5. **Scalability:** Use Redis Pub/Sub for real-time game event broadcasting across horizontally scaled server instances. Store game history in PostgreSQL with an indexed `game_id` for audit trails.

6. **Analytics:** Integrate Firebase Analytics or Amplitude to track retention, session length, and feature usage. Use A/B testing to optimize UI elements.

7. **Cheat detection:** Implement server-side anomaly detection to flag statistically improbable win rates, collusion patterns between accounts, and bot-like action timing.

8. **CI/CD:** GitHub Actions pipelines should build and sign Android AABs and iOS IPAs, run Jest + Detox tests, and deploy to Play Store/App Store internal tracks automatically on merge to `main`.
