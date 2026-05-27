import { Platform } from 'react-native';

const explicitApiUrl = process.env.EXPO_PUBLIC_FITNESS_API_URL || process.env.EXPO_PUBLIC_API_URL;

function inferHost() {
  if (Platform.OS === 'android') {
    // Android emulator cannot use localhost for host machine access.
    return '10.0.2.2';
  }

  return 'localhost';
}

export const API_URL = explicitApiUrl || `http://${inferHost()}:5000/api`;
