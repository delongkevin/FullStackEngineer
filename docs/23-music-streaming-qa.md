# Music Streaming App — Technical Q&A Documentation

**Project:** Music Streaming App
**Slug:** `music-streaming-app`
**Category:** Mobile (React Native / Expo)
**Live Demo:** `/projects/music-streaming/index.html`
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)
**Android APK:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/download/android-artifacts-latest/music-streaming-app-debug.apk)
**iOS Source:** [music-streaming-app/](https://github.com/delongkevin/FullStackEngineer/tree/main/music-streaming-app)

---

## Overview

Music Streaming App is a mobile-first music discovery and playback interface built with React Native and Expo. The app presents curated playlists, artist cards, a queue management system, and polished now-playing transport controls. A `LibraryContext` tracks saved tracks, play counts, and recently played analytics. The portfolio demo renders a fully interactive preview with catalog search, mood filtering, real-time progress bar simulation, queue preview, and save/unsave toggling — all without requiring a native runtime or audio API.

---

## 1. Architecture & Design Q&A

**Q1. How is playback state managed globally in the React Native app?**

Playback state is managed by a `PlayerContext` (React Context + `useReducer`) that wraps the entire navigation tree. The context exposes `{ currentTrack, queue, isPlaying, position, duration }` as state and `{ play, pause, next, prev, seek, enqueue }` as dispatch-backed actions. All screens that display playback state (now playing bar, queue screen, track list items) consume `PlayerContext` via `useContext`. The `expo-av` Audio API is called exclusively inside the context reducer's `play` action — no screen component ever calls `Audio.Sound` directly. This centralization means the persistent mini-player at the bottom of every tab screen always reflects the true playback state without prop threading.

**Q2. How does the demo's progress bar simulate real playback timing?**

The demo uses `setInterval` with a 120ms tick (or 1200ms when the user's device has `prefers-reduced-motion: reduce` enabled) to increment a `position` variable from 0 to `track.length` (in seconds). On each tick, `progressBar.style.width` is set to `(position / track.length) * 100` percent and the time display is updated with a `toMMSS(position)` formatter. The interval is stored in a `timerId` variable and cleared via `clearInterval` on pause, next, and select actions, preventing multiple overlapping intervals. When `position >= track.length`, `next()` is called automatically to advance the queue — mirroring the `onPlaybackStatusUpdate` callback behavior of `expo-av`.

**Q3. How is the library (saved tracks) and analytics system implemented?**

The `LibraryContext` in `music-streaming-app/context/LibraryContext.js` maintains `{ savedTracks: Set<trackId>, playHistory: { trackId, playedAt }[], playCounts: { [trackId]: number } }` in React state backed by `AsyncStorage` for persistence. The `markTrackPlayed(trackId)` function: (1) adds an entry to `playHistory` with a timestamp; (2) increments `playCounts[trackId]`; (3) persists both to AsyncStorage. The `ProfileScreen.js` reads `playCounts` to display "top tracks" ranked by play count. The demo represents this as a `plays` field on each track object and a `saved` boolean, toggled by the Save/Unsave button.

**Q4. How does mood-based filtering work in the catalog?**

Tracks carry a `mood` field (one of: `focus`, `uplift`, `calm`). The catalog `filteredTracks()` function applies two predicates in sequence: (1) mood match — if a specific mood is selected, only tracks with `track.mood === selectedMood` pass; (2) text match — the search query is tested against `track.title.toLowerCase()` and `track.artist.toLowerCase()` using `String.includes()`. Both predicates must pass. The filter runs on every `input` event on the search field and every `change` event on the mood select, with no debounce — since the track catalog is small (< 100 entries), synchronous filtering has no perceptible latency. In the full React Native app, the same filter logic lives in a `useMemo` hook keyed to `[searchQuery, selectedMood, tracks]`.

**Q5. How does queue-aware playback determine the "Up Next" list?**

The queue is not a separate data structure — it is derived from the `tracks` array starting at position `(current + 1) % tracks.length`. The `renderQueue()` function in the demo iterates `i = 1, 2, 3` and computes `(current + i) % tracks.length` for circular wrap-around. The "Next" button calls `next()` which increments `current`, resets `position` to 0, and calls `renderNowPlaying()` — the queue automatically updates because it is re-derived from the new `current` index. In the React Native app, the queue can be reordered via drag-and-drop using `react-native-draggable-flatlist`, which stores an explicit ordered array managed by the `PlayerContext`.

---

## 2. Technology Stack Q&A

**Q1. What audio API is used for actual playback in the React Native app?**

Actual audio playback uses `expo-av`'s `Audio.Sound` class. A `Sound` instance is created via `Audio.Sound.createAsync({ uri: track.streamUrl })` and stored in a ref to prevent garbage collection. `sound.playAsync()`, `sound.pauseAsync()`, `sound.setPositionAsync(ms)`, and `sound.unloadAsync()` correspond to the player controls. The `onPlaybackStatusUpdate` callback (passed to `createAsync`) fires on every status update and drives the progress bar and time display — the demo's `setInterval` simulates this callback for a web preview. On iOS, `Audio.setAudioModeAsync({ staysActiveInBackground: true })` enables background audio so music continues when the app is backgrounded, as required by App Store guidelines.

**Q2. Why is the demo built in vanilla HTML/JS instead of React or a web-build of the Expo app?**

The portfolio's project demo pages are intentionally lightweight HTML files served as static assets from `/public/projects/`. A React web build would require a Webpack/Metro bundle step and add kilobytes of framework code. The vanilla JS demo loads in under 5 KB, renders instantly in the portfolio iframe, and has zero build-step dependency. The `expo export --platform web` command can produce a full web build, but it was not used for the portfolio iframe because the iframe sandbox (`sandbox="allow-scripts allow-same-origin"`) blocks some Expo web dependencies. The vanilla demo prioritizes fast demonstration of the UX model over technical fidelity to the native stack.

**Q3. How are streaming API integration points designed for future connection?**

The app source includes a `streamingService.js` module with documented stubs: `getRecommendations(userId)` (Spotify Recommendations API or a custom ML endpoint), `getTrackStream(trackId)` (returns a presigned URL from S3 or a CDN), and `searchCatalog(query, filters)` (calls a search microservice). These stubs currently return static JSON from a `mockData.js` file. To activate real streaming, a developer would replace the mock return values with `fetch()` calls and add the API key to an `.env` file. The `streamingService` is imported only by the `PlayerContext`, so no UI component needs changes when real API integration is added.
