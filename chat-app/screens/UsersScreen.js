import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000';

export default function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initializeScreen();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userId && token) {
        fetchUsers();
      }
    });

    return unsubscribe;
  }, [navigation, userId, token]);

  const initializeScreen = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedToken = await AsyncStorage.getItem('userToken');
      setUserId(storedUserId);
      setToken(storedToken);

      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        await fetchUsers(storedToken);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize screen');
    }
  };

  const fetchUsers = async (authToken = token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      // Filter out current user
      const otherUsers = response.data.filter(u => u.userId !== userId);
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const otherUsers = response.data.filter(u => u.userId !== userId);
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh users');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const createConversation = useCallback(async (recipientUser) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/conversations`,
        { recipientId: recipientUser.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigation.navigate('UserChat', {
        conversationId: response.data.conversationId,
        recipientId: recipientUser.userId,
        otherUserName: recipientUser.name,
        otherUserAvatar: recipientUser.avatar
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create conversation');
    }
  }, [navigation, token]);

  const renderUserItem = ({ item: user }) => (
    <TouchableOpacity
      onPress={() => createConversation(user)}
      style={styles.userItem}
    >
      <Image
        source={{ uri: user.avatar }}
        style={styles.avatar}
      />

      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: user.isOnline ? '#10b981' : '#d1d5db' }
        ]}
      />

      <Text style={styles.arrowText}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No users found' : 'No users available'}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Try a different search'
              : 'Check back later for more users'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.userId}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#f9fafb'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center'
  },
  userItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12
  },
  userInfoContainer: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4
  },
  userEmail: {
    fontSize: 13,
    color: '#9ca3af'
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12
  },
  arrowText: {
    fontSize: 18,
    color: '#d1d5db'
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6'
  }
});
