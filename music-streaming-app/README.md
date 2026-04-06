# Music Streaming App

Phase 2 productionized mobile project for a cross-platform music experience.

## Run

```bash
npm install
npm run start
```

## Features

- Authentication flow with persisted session using AsyncStorage
- Service layer with API fallback and mock-friendly behavior
- Home screen with featured playlists from service calls
- Search screen with live filtering of track catalog
- Library screen with recently played and saved playlists
- Player screen with queue selection and playback state
- Profile screen with sign-out workflow
- Bottom tab + stack navigation for iOS/Android/Web

## Structure

- `context/AuthContext.js`: auth state and session bootstrap
- `services/musicService.js`: API and fallback data providers
- `config/constants.js`: app constants and seed data
- `screens/*`: feature screens (home/search/library/player/profile/login)
