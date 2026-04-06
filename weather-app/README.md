# Weather App

Phase 2 productionized mobile project for weather insights and alerts.

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
- Bottom tab + stack navigation for iOS/Android/Web
- Clean service/config split for future API integrations

## Structure

- `services/weatherService.js`: location and weather data adapters
- `config/constants.js`: defaults and alert seed data
- `screens/*`: dashboard/forecast/alerts/settings UI
