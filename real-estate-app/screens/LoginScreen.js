import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Email and password are required');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (isSignUp) {
      if (!formData.name) {
        Alert.alert('Error', 'Name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userId', response.data.userId);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      Alert.alert('Success', 'Logged in successfully');
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userId', response.data.userId);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      Alert.alert('Success', 'Account created successfully');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>RealEstate</Text>
          <Text style={styles.subtitle}>Find Your Dream Home</Text>
        </View>

        <View style={styles.formContainer}>
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              editable={!loading}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              editable={!loading}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            editable={!loading}
          />

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
              editable={!loading}
            />
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={isSignUp ? handleSignUp : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Create Account' : 'Login'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp);
              setFormData({ name: '', email: '', password: '', phone: '', confirmPassword: '' });
            }}
            disabled={loading}
          >
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'Already have an account? Login'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Why RealEstate?</Text>
          <Text style={styles.feature}>✓ 10,000+ Property Listings</Text>
          <Text style={styles.feature}>✓ Advanced Search Filters</Text>
          <Text style={styles.feature}>✓ Save Favorite Properties</Text>
          <Text style={styles.feature}>✓ Schedule Property Tours</Text>
          <Text style={styles.feature}>✓ Connect with Agents</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  button: {
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  toggleText: {
    color: '#059669',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14
  },
  featuresContainer: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#059669'
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#067857',
    marginBottom: 10
  },
  feature: {
    fontSize: 13,
    color: '#067857',
    marginBottom: 8
  }
});
