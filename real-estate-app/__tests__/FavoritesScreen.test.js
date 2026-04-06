import React from 'react';
import { Alert } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FavoritesScreen from '../screens/FavoritesScreen';

describe('FavoritesScreen', () => {
  const navigation = {
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn())
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    Alert.alert.mockRestore();
  });

  it('shows empty state when there are no favorites', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('token-1');
    axios.get.mockResolvedValueOnce({ data: [] });

    const { findByText } = render(<FavoritesScreen navigation={navigation} />);

    expect(await findByText('No Saved Properties')).toBeTruthy();
  });

  it('shows error alert when API fails', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('token-1');
    axios.get.mockRejectedValueOnce(new Error('Network failed'));

    render(<FavoritesScreen navigation={navigation} />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to fetch favorites');
    });
  });
});
