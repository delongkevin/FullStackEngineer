import axios from 'axios';
import { API_BASE_URL, PLAYLISTS, TRACKS } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000
});

export async function login(email, password) {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (_) {
    // Fallback local mock in case backend is not running.
    if (email && password && password.length >= 6) {
      return {
        token: 'music-demo-token',
        profile: { name: 'Demo Listener', email }
      };
    }
    throw new Error('Invalid credentials');
  }
}

export async function fetchFeaturedPlaylists() {
  try {
    const response = await api.get('/api/music/playlists/featured');
    return response.data;
  } catch (_) {
    return PLAYLISTS;
  }
}

export async function searchTracks(query) {
  if (!query) return TRACKS;
  const q = query.toLowerCase();
  return TRACKS.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
}

export async function fetchLibrary() {
  return {
    recentlyPlayed: TRACKS,
    savedPlaylists: PLAYLISTS.slice(0, 3)
  };
}
