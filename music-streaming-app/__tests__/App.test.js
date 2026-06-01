import React from 'react';
import { ActivityIndicator } from 'react-native';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockImplementation(async (_source, _initialStatus, onPlaybackStatusUpdate) => {
        const sound = {
          unloadAsync: jest.fn().mockResolvedValue(undefined),
          playAsync: jest.fn().mockResolvedValue(undefined),
          pauseAsync: jest.fn().mockResolvedValue(undefined),
        };

        if (typeof onPlaybackStatusUpdate === 'function') {
          onPlaybackStatusUpdate({
            isLoaded: true,
            positionMillis: 0,
            durationMillis: 241000,
            isPlaying: false,
            didJustFinish: false,
          });
        }

        return {
          sound,
          status: {
            isLoaded: true,
            positionMillis: 0,
            durationMillis: 241000,
            isPlaying: false,
          },
        };
      }),
    },
  },
}));

describe('Music Streaming App', () => {
  it('shows a loading indicator while bootstrapping', () => {
    const { UNSAFE_getAllByType, findByText } = render(<App />);
    expect(UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
    return findByText('Music Streaming');
  });

  it('shows the login screen when no session is stored', async () => {
    const { findByText } = render(<App />);
    expect(await findByText('Music Streaming')).toBeTruthy();
  });

  it('shows the login screen subtitle', async () => {
    const { findByText } = render(<App />);
    expect(await findByText('Sign in to continue listening')).toBeTruthy();
  });
});
