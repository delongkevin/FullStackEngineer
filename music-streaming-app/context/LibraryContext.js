import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLAYLISTS, STORAGE_KEYS, TRACKS } from '../config/constants';

const LibraryContext = createContext(null);

function uniqueTracksById(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    if (!item?.id || seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    result.push(item);
  }

  return result;
}

export function LibraryProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [savedPlaylists, setSavedPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [analytics, setAnalytics] = useState({ totalPlays: 0, totalMinutes: 0, playByTrackId: {} });

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEYS.SAVED_PLAYLISTS, JSON.stringify(savedPlaylists));
  }, [loading, savedPlaylists]);

  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed));
  }, [loading, recentlyPlayed]);

  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEYS.LISTENING_ANALYTICS, JSON.stringify(analytics));
  }, [loading, analytics]);

  async function bootstrap() {
    try {
      const savedRaw = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_PLAYLISTS);
      const recentRaw = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
      const analyticsRaw = await AsyncStorage.getItem(STORAGE_KEYS.LISTENING_ANALYTICS);

      setSavedPlaylists(savedRaw ? JSON.parse(savedRaw) : PLAYLISTS.slice(0, 2));
      setRecentlyPlayed(recentRaw ? JSON.parse(recentRaw) : TRACKS.slice(0, 2));
      setAnalytics(analyticsRaw ? JSON.parse(analyticsRaw) : { totalPlays: 0, totalMinutes: 0, playByTrackId: {} });
    } catch (_) {
      setSavedPlaylists(PLAYLISTS.slice(0, 2));
      setRecentlyPlayed(TRACKS.slice(0, 2));
      setAnalytics({ totalPlays: 0, totalMinutes: 0, playByTrackId: {} });
    } finally {
      setLoading(false);
    }
  }

  function isPlaylistSaved(playlistId) {
    return savedPlaylists.some((item) => item.id === playlistId);
  }

  function toggleSavedPlaylist(playlist) {
    setSavedPlaylists((prev) => {
      const exists = prev.some((item) => item.id === playlist.id);
      if (exists) {
        return prev.filter((item) => item.id !== playlist.id);
      }
      return [playlist, ...prev];
    });
  }

  function markTrackPlayed(track) {
    setRecentlyPlayed((prev) => uniqueTracksById([track, ...prev]).slice(0, 20));
    const [min, sec] = String(track.duration || '0:00').split(':').map((v) => parseInt(v, 10) || 0);
    const durationMinutes = min + sec / 60;

    setAnalytics((prev) => ({
      totalPlays: prev.totalPlays + 1,
      totalMinutes: Number((prev.totalMinutes + durationMinutes).toFixed(1)),
      playByTrackId: {
        ...prev.playByTrackId,
        [track.id]: (prev.playByTrackId[track.id] || 0) + 1
      }
    }));
  }

  const value = useMemo(
    () => ({
      loading,
      savedPlaylists,
      recentlyPlayed,
      analytics,
      isPlaylistSaved,
      toggleSavedPlaylist,
      markTrackPlayed
    }),
    [loading, savedPlaylists, recentlyPlayed, analytics]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  return useContext(LibraryContext);
}
