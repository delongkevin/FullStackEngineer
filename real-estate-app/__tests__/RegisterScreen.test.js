import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RegisterScreen from '../screens/RegisterScreen';

describe('RegisterScreen', () => {
  const navigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    Alert.alert.mockRestore();
  });

  it('shows password mismatch validation error', async () => {
    const { getByPlaceholderText, findByText, getAllByPlaceholderText, getAllByText } = render(
      <RegisterScreen navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('you@example.com'), 'test@example.com');
    const passwordInputs = getAllPasswordInputs({ getAllByPlaceholderText });
    fireEvent.changeText(passwordInputs[0], 'Password1');
    const confirmInput = passwordInputs[1];
    fireEvent.changeText(confirmInput, 'Password2');

    fireEvent.press(getAllByText('Create Account')[1]);

    expect(await findByText('Passwords do not match')).toBeTruthy();
  });

  it('submits and stores auth values on successful register', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'new-token',
        userId: 'new-user'
      }
    });

    const { getByPlaceholderText, getAllByPlaceholderText, getAllByText } = render(
      <RegisterScreen navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('you@example.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('+1 (555) 000-0000'), '+15550001111');

    const secureInputs = getAllPasswordInputs({ getAllByPlaceholderText });
    fireEvent.changeText(secureInputs[0], 'Password1');
    fireEvent.changeText(secureInputs[1], 'Password1');

    fireEvent.press(getAllByText('Create Account')[1]);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'new-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userId', 'new-user');
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Account created successfully!',
        expect.any(Array)
      );
    });
  });
});

function getAllPasswordInputs({ getAllByPlaceholderText }) {
  return getAllByPlaceholderText('••••••••');
}
