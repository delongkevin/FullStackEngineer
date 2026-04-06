export const API_BASE_URL = 'http://localhost:3001';

export const STORAGE_KEYS = {
  TOKEN: 'music_user_token',
  PROFILE: 'music_user_profile',
  SAVED_PLAYLISTS: 'music_saved_playlists',
  RECENTLY_PLAYED: 'music_recently_played',
  LISTENING_ANALYTICS: 'music_listening_analytics'
};

export const PLAYLISTS = [
  { id: 'p1', name: 'Code Focus', tracks: 42, mood: 'Instrumental' },
  { id: 'p2', name: 'Morning Boost', tracks: 31, mood: 'Pop' },
  { id: 'p3', name: 'Night Drive', tracks: 28, mood: 'Synthwave' },
  { id: 'p4', name: 'Deep Work', tracks: 55, mood: 'Lo-Fi' }
];

export const TRACKS = [
  { id: 't1', title: 'Refactor Dreams', artist: 'Loop Theory', duration: '4:11' },
  { id: 't2', title: 'Night Deploy', artist: 'Merge Request', duration: '2:58' },
  { id: 't3', title: 'Pixel Skyline', artist: 'Neon Drift', duration: '3:42' },
  { id: 't4', title: 'Sapphire Terminal', artist: 'Cloud Echo', duration: '3:27' }
];
