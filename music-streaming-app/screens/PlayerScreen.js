import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import { TRACKS } from '../config/constants';
import { useLibrary } from '../context/LibraryContext';

const INITIAL_STATUS = 'Paused';

function formatTime(ms = 0) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function PlayerScreen() {
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [error, setError] = useState('');
  const { markTrackPlayed } = useLibrary();
  const soundRef = useRef(null);
  const indexRef = useRef(0);
  const current = TRACKS[index];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  async function loadTrack(targetIndex, shouldPlay = false) {
    const nextTrack = TRACKS[targetIndex];

    setIsLoading(true);
    setError('');

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound, status: playbackStatus } = await Audio.Sound.createAsync(
        { uri: nextTrack.streamUrl },
        { shouldPlay },
        onPlaybackStatusUpdate(targetIndex),
      );

      soundRef.current = sound;
      indexRef.current = targetIndex;
      setIndex(targetIndex);
      setDurationMillis(playbackStatus.durationMillis || 0);
      setPositionMillis(playbackStatus.positionMillis || 0);
      setStatus(playbackStatus.isPlaying ? 'Playing' : INITIAL_STATUS);

      if (shouldPlay) {
        markTrackPlayed(nextTrack);
      }
    } catch (err) {
      setError(err?.message || 'Unable to load audio for this track.');
      setStatus(INITIAL_STATUS);
    } finally {
      setIsLoading(false);
    }
  }

  function onPlaybackStatusUpdate(sourceIndex) {
    return async (playbackStatus) => {
      if (!playbackStatus.isLoaded) {
        return;
      }

      setPositionMillis(playbackStatus.positionMillis || 0);
      setDurationMillis(playbackStatus.durationMillis || 0);
      setStatus(playbackStatus.isPlaying ? 'Playing' : INITIAL_STATUS);

      if (playbackStatus.didJustFinish) {
        const nextIndex = (sourceIndex + 1) % TRACKS.length;
        await loadTrack(nextIndex, true);
      }
    };
  }

  useEffect(() => {
    loadTrack(0, false);

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  async function playCurrentTrack() {
    if (soundRef.current) {
      try {
        await soundRef.current.playAsync();
        setStatus('Playing');
        markTrackPlayed(current);
      } catch (err) {
        setError(err?.message || 'Unable to resume playback.');
      }
      return;
    }

    await loadTrack(indexRef.current, true);
  }

  async function pauseTrack() {
    if (!soundRef.current) {
      setStatus(INITIAL_STATUS);
      return;
    }

    try {
      await soundRef.current.pauseAsync();
      setStatus(INITIAL_STATUS);
    } catch (err) {
      setError(err?.message || 'Unable to pause playback.');
    }
  }

  async function playTrackAtIndex(targetIndex) {
    setIndex(targetIndex);
    const nextTrack = TRACKS[targetIndex];

    try {
      setIsLoading(true);
      setError('');

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound, status: playbackStatus } = await Audio.Sound.createAsync(
        { uri: nextTrack.streamUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      );

      soundRef.current = sound;
      setDurationMillis(playbackStatus.durationMillis || 0);
      setPositionMillis(playbackStatus.positionMillis || 0);
      setStatus(playbackStatus.isPlaying ? 'Playing' : INITIAL_STATUS);
      markTrackPlayed(nextTrack);
    } catch (err) {
      setError(err?.message || 'Unable to start playback.');
      setStatus(INITIAL_STATUS);
    } finally {
      setIsLoading(false);
    }
  }

  async function nextTrack() {
    await loadTrack((indexRef.current + 1) % TRACKS.length, true);
  }

  async function prevTrack() {
    await loadTrack((indexRef.current - 1 + TRACKS.length) % TRACKS.length, true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.song}>{current.title}</Text>
      <Text style={styles.artist}>{current.artist}</Text>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.progress}>
        {formatTime(positionMillis)} / {formatTime(durationMillis)}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={prevTrack} disabled={isLoading}>
          <Text style={styles.btnText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={playCurrentTrack}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#08210f" /> : <Text style={styles.btnText}>Play</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={pauseTrack} disabled={isLoading}>
          <Text style={styles.btnText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={nextTrack} disabled={isLoading}>
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.queueTitle}>Queue</Text>
      <FlatList
        data={TRACKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index: itemIndex }) => (
          <TouchableOpacity
            style={[styles.queueRow, itemIndex === index && styles.queueRowActive]}
            onPress={() => {
              loadTrack(itemIndex, true);
            }}
          >
            <Text style={styles.queueText}>{item.title} · {item.artist}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111f', padding: 16, justifyContent: 'center' },
  song: { color: '#fff', fontSize: 30, fontWeight: '700', textAlign: 'center' },
  artist: { color: '#9bb0d0', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  status: { color: '#86efac', textAlign: 'center', marginBottom: 14, fontWeight: '600' },
  progress: { color: '#c5d5ee', textAlign: 'center', marginBottom: 10 },
  error: { color: '#fca5a5', textAlign: 'center', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  btn: { backgroundColor: '#22c55e', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#08210f', fontWeight: '700' },
  queueTitle: { color: '#86efac', fontWeight: '700', marginTop: 18, marginBottom: 8 },
  queueRow: {
    backgroundColor: '#17213b',
    borderColor: '#2b3d66',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
    padding: 10
  },
  queueRowActive: {
    borderColor: '#86efac'
  },
  queueText: {
    color: '#c5d5ee'
  }
});
