import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const API_BASE_URL = 'http://localhost:3001';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [token, setToken] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);

      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        await fetchUserData();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize profile');
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user and stats
      const userResponse = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const statsResponse = await axios.get(`${API_BASE_URL}/api/properties-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => null);

      setUser(userResponse.data);
      if (statsResponse) {
        setStats(statsResponse.data);
      }
      setEditData({
        name: userResponse.data.name,
        email: userResponse.data.email,
        phone: userResponse.data.phone || ''
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userId');
              delete axios.defaults.headers.common['Authorization'];
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const saveChanges = async () => {
    try {
      setUser(prev => ({
        ...prev,
        name: editData.name,
        phone: editData.phone
      }));
      setIsEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.largeAvatar}
        />

        <Text style={styles.nameText}>{user.name}</Text>
        <Text style={styles.emailText}>{user.email}</Text>

        <View style={styles.onlineStatus}>
          <View
            style={[
              styles.onlineIndicator,
              { backgroundColor: user.userType === 'agent' ? '#059669' : '#6b7280' }
            ]}
          />
          <Text style={styles.statusText}>
            {user.userType === 'agent' ? 'Agent' : 'Buyer'}
          </Text>
        </View>
      </View>

      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalProperties}</Text>
            <Text style={styles.statLabel}>Properties</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{(stats.totalViews / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.averageRating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{user.phone || 'Not provided'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Member Since</Text>
          <Text style={styles.infoValue}>
            {moment(user.createdAt).format('MMM DD, YYYY')}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Account Type</Text>
          <Text style={styles.infoValue}>
            {user.userType === 'agent' ? 'Real Estate Agent' : 'Buyer'}
          </Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => setIsEditMode(true)}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={handleLogout}
        >
          <Text style={styles.buttonSecondaryText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>RealEstate v1.0.0</Text>
        <Text style={styles.appSubtext}>Your trusted property marketplace</Text>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={isEditMode} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsEditMode(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={saveChanges}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={editData.name}
                  onChangeText={(value) => setEditData({ ...editData, name: value })}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={[styles.formInput, { color: '#9ca3af' }]}
                  value={editData.email}
                  editable={false}
                  placeholder="Enter your email"
                />
                <Text style={styles.formHint}>Email cannot be changed</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  style={styles.formInput}
                  value={editData.phone}
                  onChangeText={(value) => setEditData({ ...editData, phone: value })}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4
  },
  emailText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6
  },
  statusText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#f9fafb'
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 6
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937'
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16
  },
  buttonPrimary: {
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  buttonSecondaryText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600'
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937'
  },
  appSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937'
  },
  cancelText: {
    color: '#ef4444',
    fontSize: 16
  },
  saveText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600'
  },
  modalForm: {
    padding: 16
  },
  formGroup: {
    marginBottom: 20
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15
  },
  formHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6
  }
});
