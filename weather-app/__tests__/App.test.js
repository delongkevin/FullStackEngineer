import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

jest.mock('../services/weatherService', () => ({
  fetchCurrentWeather: jest.fn().mockResolvedValue({
    temperature: 72,
    feelsLike: 70,
    summary: 'Sunny',
    humidity: 40,
    windMph: 5,
    uv: 3,
  }),
  getCurrentLocation: jest.fn().mockResolvedValue({
    city: 'Austin',
    state: 'TX',
  }),
}));

describe('Weather App', () => {
  it('renders the bottom navigation tabs immediately', () => {
    const { getByText } = render(<App />);
    expect(getByText('Now')).toBeTruthy();
  });

  it('shows all four main navigation tabs', () => {
    const { getByText } = render(<App />);
    expect(getByText('Trend')).toBeTruthy();
    expect(getByText('Alerts')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('shows weather data after loading completes', async () => {
    const { findByText } = render(<App />);
    expect(await findByText('Austin, TX')).toBeTruthy();
  });
});
