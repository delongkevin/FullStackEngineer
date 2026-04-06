# Weather App

Phase 4 enhancements added on top of the completed Phase 3 baseline.

## Run

```bash
npm install
npm run start
```

## Features

- Location-aware dashboard using Expo Location (with fallback defaults)
- Current conditions service with refresh support
- Forecast screen backed by weather service data
- Alerts screen with severity-driven rendering
- Settings screen for local preference toggles
- Persisted settings (metric/imperial + alerts preference) via AsyncStorage
- Unit-aware dashboard and forecast rendering
- Alerts screen behavior tied to user alert preferences
- Cache-aware weather service fallbacks for resilient data display
- Outdoor risk index insight on dashboard
- Bottom tab + stack navigation for iOS/Android/Web
- Clean service/config split for future API integrations

## Structure

- `services/weatherService.js`: location and weather data adapters
- `config/constants.js`: defaults and alert seed data
- `screens/*`: dashboard/forecast/alerts/settings UI
