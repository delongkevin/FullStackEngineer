# Music Streaming App

Phase 4 enhancements added on top of the completed Phase 3 baseline.

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
- Library screen with persisted recently played and saved playlists
- Player screen with queue selection and playback state
- Profile screen with sign-out workflow
- Playlist save/unsave from Home and automatic recently played tracking from Player
- Listening analytics with total plays, minutes listened, and top track insights in Profile
- Bottom tab + stack navigation for iOS/Android/Web

## Structure

- `context/AuthContext.js`: auth state and session bootstrap
- `services/musicService.js`: API and fallback data providers
- `config/constants.js`: app constants and seed data
- `screens/*`: feature screens (home/search/library/player/profile/login)
