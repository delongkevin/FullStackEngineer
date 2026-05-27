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
import { API_URL } from '../config/api';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('5000');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/auth/login`, { email });
        onLogin(response.data.id);
      } else {
        if (!name || !email || !salary) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        const response = await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          salary: parseInt(salary),
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
        <Text style={styles.title}>💰 Finance Tracker</Text>
        <Text style={styles.subtitle}>Manage your money wisely</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {isLogin ? 'Welcome Back!' : 'Create Your Account'}
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

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Monthly Salary"
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        )}

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
        <Text style={styles.featureTitle}>Why Finance Tracker?</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>✓ Real-time expense tracking</Text>
          <Text style={styles.featureItem}>✓ Smart budget planning</Text>
          <Text style={styles.featureItem}>✓ Financial goal setting</Text>
          <Text style={styles.featureItem}>✓ Spending insights & reports</Text>
          <Text style={styles.featureItem}>✓ Fraud detection</Text>
          <Text style={styles.featureItem}>✓ Savings rate tracking</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#10B981',
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
    color: '#d1fae5',
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
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 15,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#10B981',
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
    color: '#10B981',
    textAlign: 'center',
    fontSize: 14,
  },
  features: {
    backgroundColor: '#ecfdf5',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 15,
  },
  featureList: {},
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
});
