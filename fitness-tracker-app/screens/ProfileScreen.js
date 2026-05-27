import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function ProfileScreen({ userId, onLogout }) {
  const [user, setUser] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchWeeklySummary();
    }
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      setUser(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklySummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/summary/${userId}/weekly`);
      setWeeklyStats(response.data);
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchWeeklySummary();
    setRefreshing(false);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, {
        weight: parseInt(editData.weight),
        height: parseInt(editData.height),
        goal: editData.goal,
      });
      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const calculateBMI = () => {
    if (!user) return 0;
    const heightM = user.height / 100;
    return (user.weight / (heightM * heightM)).toFixed(1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* User Header */}
      {user && (
        <>
          <View style={styles.headerCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.memberSince}>
                Member since {new Date(user.joinedDate).getFullYear()}
              </Text>
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.stats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {user.stats.totalCalories}
              </Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {user.stats.totalDistance.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>km</Text>
            </View>
          </View>

          {/* Weekly Summary */}
          {weeklyStats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>This Week</Text>
              <View style={styles.card}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Workouts Completed</Text>
                  <Text style={styles.summaryValue}>
                    {weeklyStats.workoutsCompleted}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Calories</Text>
                  <Text style={styles.summaryValue}>
                    {weeklyStats.totalCalories}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Distance</Text>
                  <Text style={styles.summaryValue}>
                    {weeklyStats.totalDistance.toFixed(1)} km
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Avg Duration</Text>
                  <Text style={styles.summaryValue}>
                    {weeklyStats.avgDuration} min
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Profile Settings */}
          {!isEditing ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Profile Settings</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Age</Text>
                  <Text style={styles.settingValue}>{user.age} years</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Height</Text>
                  <Text style={styles.settingValue}>{user.height} cm</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Weight</Text>
                  <Text style={styles.settingValue}>{user.weight} kg</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>BMI</Text>
                  <Text style={styles.settingValue}>{calculateBMI()}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Fitness Goal</Text>
                  <Text style={styles.settingValue}>
                    {user.goal === 'lose'
                      ? 'Lose Weight'
                      : user.goal === 'gain'
                      ? 'Gain Muscle'
                      : 'Maintain Weight'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Edit Profile</Text>

              <View style={styles.card}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={String(editData.age)}
                  onChangeText={(val) =>
                    setEditData({ ...editData, age: parseInt(val) })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={String(editData.height)}
                  onChangeText={(val) =>
                    setEditData({ ...editData, height: parseInt(val) })
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={String(editData.weight)}
                  onChangeText={(val) =>
                    setEditData({ ...editData, weight: parseInt(val) })
                  }
                  keyboardType="decimal-pad"
                />

                <Text style={styles.label}>Fitness Goal</Text>
                <View style={styles.goalPicker}>
                  {['lose', 'maintain', 'gain'].map((goal) => (
                    <TouchableOpacity
                      key={goal}
                      style={[
                        styles.goalOption,
                        editData.goal === goal &&
                          styles.goalOptionSelected,
                      ]}
                      onPress={() =>
                        setEditData({ ...editData, goal })
                      }
                    >
                      <Text
                        style={[
                          styles.goalOptionText,
                          editData.goal === goal &&
                            styles.goalOptionTextSelected,
                        ]}
                      >
                        {goal === 'lose'
                          ? 'Lose'
                          : goal === 'gain'
                          ? 'Gain'
                          : 'Maintain'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Logout */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#1565C0',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#e3f2fd',
    marginTop: 2,
  },
  memberSince: {
    fontSize: 12,
    color: '#bbdefb',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565C0',
  },
  editButton: {
    color: '#1565C0',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 14,
    color: '#666',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  goalPicker: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 15,
  },
  goalOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f9f9f9',
  },
  goalOptionSelected: {
    borderColor: '#1565C0',
    backgroundColor: '#e3f2fd',
  },
  goalOptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  goalOptionTextSelected: {
    color: '#1565C0',
  },
  saveButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
});
