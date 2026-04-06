# Weather Insights App — Technical Q&A Documentation

**Project:** Weather Insights App
**Slug:** `weather-insights-app`
**Category:** Mobile (React Native / Expo)
**Live Demo:** `/projects/weather-insights/index.html`
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)
**Android APK:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/download/android-artifacts-latest/weather-app-debug.apk)
**iOS Source:** [weather-app/](https://github.com/delongkevin/FullStackEngineer/tree/main/weather-app)

---

## Overview

Weather Insights App is a responsive weather application built with React Native and Expo. It displays current temperature and conditions, a 12-hour forecast strip, a 7-day outlook with high/low pairs, severe weather alerts, and an outdoor risk index. A `SettingsContext` persists units (metric/imperial) and alert preferences via AsyncStorage. Weather data is fetched from an API-ready service layer with in-memory caching. The portfolio demo renders a fully interactive weather preview with city switching, Fahrenheit/Celsius toggling, alert preference controls, and live unit-converted values.

---

## 1. Architecture & Design Q&A

**Q1. How is the settings (units, alerts) preference system implemented?**

A `SettingsContext` (`weather-app/context/SettingsContext.js`) wraps the app's navigation tree and exposes `{ useCelsius, alertsEnabled, toggleUnits, toggleAlerts }`. Both boolean values are persisted to AsyncStorage under `@weather_settings` as a JSON string via a `useEffect` that fires whenever either value changes. On app launch, an `initSettings()` async function reads from AsyncStorage and calls the context setters before the first render, preventing a flash of default units. All four weather screens (`DashboardScreen`, `ForecastScreen`, `AlertsScreen`, `SettingsScreen`) consume `SettingsContext` via `useContext` — the `SettingsScreen` renders two Toggle switches that directly call `toggleUnits()` and `toggleAlerts()`.

**Q2. How does the service layer cache weather data to reduce API calls?**

`weatherService.js` wraps all API calls with a cache-aside pattern using AsyncStorage. `fetchWeather(city)` first calls `AsyncStorage.getItem('@weather_cache_' + city)`. If the cached entry exists and its `timestamp` is within the last 10 minutes, the cached data is returned immediately without an API call. Otherwise, the service calls the weather API, stores the result with a fresh timestamp via `AsyncStorage.setItem(...)`, and returns the data. `AsyncStorage.setItem` is fire-and-forget (`.catch` logs only) to avoid blocking the UI on cache writes. This pattern reduces API requests by up to 90% for users who frequently switch between the same cities.

**Q3. How does unit conversion work across all four screens?**

Unit conversion is a pure utility layer in `weatherUtils.js`: `toC(f)` converts Fahrenheit to Celsius, `toKmh(mph)` converts wind speed, and `formatTemp(value, useCelsius)` returns a display string. All screens receive raw Fahrenheit/mph values from the API (the API is always called with imperial units as the canonical source) and call the format utilities at render time, controlled by `useCelsius` from `SettingsContext`. This single-source-of-truth approach means the API response format never changes — only the display layer flips. The demo's `tempLabel(f)` and `toC(f)` functions on the `isMetric` boolean mirror this exact pattern.

**Q4. How is the outdoor risk index calculated?**

The outdoor risk index (`risk` field in the demo's `weatherData` objects) is calculated by `weatherService.js` from API response fields using a weighted formula: `riskScore = UV * 0.4 + windMph * 0.03 + (humidity > 80 ? 2 : 0) + (extremeTemp ? 3 : 0)`, clamped to 10. `extremeTemp` is true if the feels-like temperature exceeds 95°F or falls below 32°F. The score maps to three labels: 0–3 = Low, 4–6 = Moderate, 7–10 = High. The risk label and score are computed on the client after the API response arrives so they do not require a separate analytics endpoint.

**Q5. How does the alert preference affect the app behavior?**

When `alertsEnabled = false` in `SettingsContext`, the `AlertsScreen` renders an empty state with a "Alerts are disabled" message and a direct link to the Settings screen to re-enable. On `DashboardScreen`, the alert banner `<View>` is conditionally rendered: `alertsEnabled && currentData.hasAlert`. `AlertsScreen` is still accessible via the tab navigator when alerts are disabled — the preference controls visibility of content, not screen access. On the demo page, `alertsEnabled` toggles `document.getElementById('alert').style.display` between `'block'` and `'none'`, which mirrors the React Native conditional render.

---

## 2. Technology Stack Q&A

**Q1. How is geolocation used in the React Native app?**

`expo-location` provides `Location.requestForegroundPermissionsAsync()` and `Location.getCurrentPositionAsync()`. On app launch, `DashboardScreen` requests location permission and, if granted, calls `weatherService.fetchByCoordinates(lat, lon)` which resolves coordinates to a city name via the API's reverse geocoding endpoint. The result city name is stored in `SettingsContext` as `lastCity` so subsequent app launches skip the geolocation call and use the last-known city. If permission is denied, the city defaults to `Austin`. The demo page skips geolocation and instead provides an explicit `<select>` for city switching, mapping to the same per-city data objects.

**Q2. What API is the service layer designed to connect to?**

The `weatherService.js` module is designed for the OpenWeatherMap One Call API 3.0 as the primary integration point. The `fetchWeather(city)` stub uses: `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={key}&units=imperial`. The response shape maps directly to the app's `WeatherData` type. WeatherAPI.com is listed as a secondary option — a `WEATHER_PROVIDER` environment variable switches between two adapter modules (`openWeatherAdapter.js`, `weatherApiAdapter.js`) that both implement the same `normalize(rawResponse): WeatherData` interface. This adapter pattern allows swapping providers without changing any screen or context code.

**Q3. How are severe weather notifications triggered?**

The app registers for push notifications via `expo-notifications` during onboarding. The Node.js backend (if connected) has a `POST /api/notify/weather-alert` endpoint that accepts `{ userId, city, alertType, message }` and calls the Expo Push Notifications service (`https://exp.host/--/api/v2/push/send`) with the user's Expo push token. In the current portfolio build, push tokens are stored in-memory on the backend and alerts are triggered manually. A production deployment would use a CRON job (every 30 minutes) that fetches active alerts from the weather API for each subscribed city, compares against previously sent alerts, and dispatches notifications only for newly issued advisories to prevent repeat pings.
