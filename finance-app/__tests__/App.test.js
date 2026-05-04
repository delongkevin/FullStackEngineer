import React from 'react';
import { ActivityIndicator } from 'react-native';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

describe('Finance Tracker App', () => {
  it('shows a loading indicator while bootstrapping', () => {
    const { UNSAFE_getAllByType } = render(<App />);
    expect(UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it('shows the login screen when no session is stored', async () => {
    const { findByText } = render(<App />);
    expect(await findByText('💰 Finance Tracker')).toBeTruthy();
  });

  it('shows the login form subtitle on the login screen', async () => {
    const { findByText } = render(<App />);
    expect(await findByText('Welcome Back!')).toBeTruthy();
  });
});
