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
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const API_BASE_URL = 'http://localhost:3000';

export default function ChatsScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initializeScreen();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userId && token) {
        fetchConversations();
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
        await fetchConversations(storedToken);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize screen');
    }
  };

  const fetchConversations = async (authToken = token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setConversations(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh conversations');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(prev => prev.filter(c => c.conversationId !== conversationId));
      Alert.alert('Success', 'Conversation deleted');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete conversation');
    }
  };

  const openConversation = useCallback((conv) => {
    navigation.navigate('Chat', {
      conversationId: conv.conversationId,
      recipientId: conv.otherUser.userId,
      otherUserName: conv.otherUser.name,
      otherUserAvatar: conv.otherUser.avatar
    });
  }, [navigation]);

  const renderConversationItem = ({ item: conv }) => {
    const lastMessage = conv.lastMessage;
    const timeString = lastMessage 
      ? moment(lastMessage.timestamp).format('HH:mm')
      : moment(conv.createdAt).format('HH:mm');

    const messagePreview = lastMessage
      ? (lastMessage.senderId === userId ? 'You: ' : '') + lastMessage.text.substring(0, 40)
      : 'No messages yet';

    return (
      <TouchableOpacity
        onPress={() => openConversation(conv)}
        onLongPress={() => {
          Alert.alert(
            'Delete Conversation',
            `Delete chat with ${conv.otherUser.name}?`,
            [
              { text: 'Cancel', onPress: () => {}, style: 'cancel' },
              {
                text: 'Delete',
                onPress: () => handleDeleteConversation(conv.conversationId),
                style: 'destructive'
              }
            ]
          );
        }}
        style={styles.conversationItem}
      >
        <Image
          source={{ uri: conv.otherUser.avatar }}
          style={styles.avatar}
        />

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.nameText}>{conv.otherUser.name}</Text>
            <Text style={styles.timeText}>{timeString}</Text>
          </View>

          <View style={styles.messageRow}>
            <Text
              style={[
                styles.messageText,
                conv.unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {messagePreview}
            </Text>
            {conv.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{conv.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: conv.otherUser.isOnline ? '#10b981' : '#d1d5db' }
          ]}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptyText}>
            Start a new conversation by finding users in the Users tab
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.conversationId}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center'
  },
  conversationItem: {
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
  contentContainer: {
    flex: 1
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 8
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1
  },
  unreadMessage: {
    color: '#1f2937',
    fontWeight: '500'
  },
  unreadBadge: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb'
  }
});
