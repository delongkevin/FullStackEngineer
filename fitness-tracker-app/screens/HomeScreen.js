import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function HomeScreen({ onLogin, userId }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await axios.post(`${API_URL}/auth/login`, { email });
        onLogin(response.data.id);
      } else {
        // Register
        if (!name || !email) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        const response = await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          age: 25,
          weight: 70,
          height: 175,
        });
        onLogin(response.data.id);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💪 Fitness Tracker</Text>
        <Text style={styles.subtitle}>Track your health journey</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#999"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuthSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <Text style={styles.featureTitle}>Features</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>✓ Track workouts & calories</Text>
          <Text style={styles.featureItem}>✓ Health metrics integration</Text>
          <Text style={styles.featureItem}>✓ Apple HealthKit & Google Fit</Text>
          <Text style={styles.featureItem}>✓ Wearable device sync</Text>
          <Text style={styles.featureItem}>✓ Goal tracking</Text>
          <Text style={styles.featureItem}>✓ Weekly progress summaries</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1565C0',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
  },
  form: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 15,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#1565C0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    color: '#1565C0',
    textAlign: 'center',
    fontSize: 14,
  },
  features: {
    backgroundColor: '#e3f2fd',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 15,
  },
  featureList: {},
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
});
