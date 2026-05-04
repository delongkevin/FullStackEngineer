import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

describe('Chat App', () => {
  it('shows a loading indicator while bootstrapping', () => {
    const { UNSAFE_getAllByType } = render(<App />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it('shows the login screen when no token is stored', async () => {
    const { findByText } = render(<App />);
    expect(await findByText('ChatApp')).toBeTruthy();
  });

  it('shows the login subtitle on the login screen', async () => {
    const { findByText } = render(<App />);
    expect(await findByText('Real-time messaging')).toBeTruthy();
  });
});
