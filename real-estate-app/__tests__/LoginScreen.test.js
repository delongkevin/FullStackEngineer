import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';

describe('LoginScreen', () => {
  const navigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    Alert.alert.mockRestore();
  });

  it('shows validation error when submitting empty form', async () => {
    const { getByText } = render(<LoginScreen navigation={navigation} />);

    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Email and password are required');
    });
  });

  it('logs in and stores auth values on success', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'test-token',
        userId: 'user-1'
      }
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={navigation} />);

    fireEvent.changeText(getByPlaceholderText('Email Address'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/api/auth/login', {
        email: 'user@example.com',
        password: 'Password123'
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'test-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userId', 'user-1');
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Logged in successfully');
    });
  });
});
