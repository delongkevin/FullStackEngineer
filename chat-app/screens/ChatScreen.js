import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3000';

export default function ChatScreen({ route, navigation }) {
  const { conversationId, recipientId, otherUserName, otherUserAvatar } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [socket, setSocket] = useState(null);

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: otherUserName
    });

    initializeScreen();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [navigation, otherUserName]);

  const initializeScreen = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedToken = await AsyncStorage.getItem('userToken');

      setUserId(storedUserId);
      setToken(storedToken);

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      // Fetch initial messages
      await fetchMessages(storedToken);

      // Initialize Socket.IO connection
      const newSocket = io(API_BASE_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      newSocket.on('connect', () => {
        newSocket.emit('user:join', {
          userId: storedUserId,
          token: storedToken
        });
      });

      newSocket.on(`message:${conversationId}`, (message) => {
        setMessages(prev => [...prev, message]);
        flatListRef.current?.scrollToEnd({ animated: true });
      });

      newSocket.on(`typing:${conversationId}`, (data) => {
        if (data.userId !== storedUserId) {
          setOtherUserTyping(data.isTyping);
        }
      });

      setSocket(newSocket);
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize chat');
    }
  };

  const fetchMessages = async (authToken) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/messages/${conversationId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessages(response.data.messages);
      flatListRef.current?.scrollToEnd({ animated: false });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (text) => {
    setNewMessage(text);

    if (socket && !isTyping) {
      setIsTyping(true);
      socket.emit('message:typing', {
        conversationId,
        userId,
        isTyping: true
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit('message:typing', {
          conversationId,
          userId,
          isTyping: false
        });
      }
      setIsTyping(false);
    }, 1000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages`,
        {
          conversationId,
          text: messageText,
          type: 'text'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Socket.IO will broadcast this to other users
      if (socket) {
        socket.emit('message:send', {
          conversationId,
          text: messageText,
          senderId: userId,
          attachmentUrl: null
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
      setNewMessage(messageText); // Restore message on error
    }
  };

  const renderMessageBubble = ({ item: message }) => {
    const isOwnMessage = message.senderId === userId;
    const timestamp = moment(message.timestamp).format('HH:mm');

    return (
      <View
        style={[
          styles.messageBubbleContainer,
          isOwnMessage && styles.ownMessageContainer
        ]}
      >
        {!isOwnMessage && (
          <Image
            source={{ uri: otherUserAvatar }}
            style={styles.messageBubbleAvatar}
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isOwnMessage && styles.ownMessageBubble
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage && styles.ownMessageText
            ]}
          >
            {message.text}
          </Text>

          <Text
            style={[
              styles.timestamp,
              isOwnMessage && styles.ownTimestamp
            ]}
          >
            {timestamp}
          </Text>

          {message.reactions && message.reactions.length > 0 && (
            <View style={styles.reactionsContainer}>
              {message.reactions.map((reaction, idx) => (
                <View key={idx} style={styles.reactionItem}>
                  <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {isOwnMessage && (
          <View style={styles.readStatus}>
            {message.isRead && (
              <Text style={styles.readText}>✓✓</Text>
            )}
          </View>
        )}
      </View>
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>Start a conversation with {otherUserName}</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageBubble}
            keyExtractor={(item) => item.messageId}
            contentContainerStyle={styles.messagesList}
            onEndReached={() => {
              if (messages.length > 50) {
                // Could implement pagination here
              }
            }}
          />
        )}

        {otherUserTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>
              {otherUserName} is typing
            </Text>
            <View style={styles.typingDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={handleTyping}
            multiline
            maxHeight={100}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    alignItems: 'center'
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280'
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'flex-end'
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end'
  },
  ownMessageContainer: {
    justifyContent: 'flex-end'
  },
  messageBubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
    borderColor: '#e5e7eb',
    borderWidth: 1
  },
  ownMessageBubble: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    marginRight: 8
  },
  messageText: {
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 2
  },
  ownMessageText: {
    color: '#fff'
  },
  timestamp: {
    fontSize: 11,
    color: '#9ca3af'
  },
  ownTimestamp: {
    color: '#dbeafe'
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap'
  },
  reactionItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 4,
    marginTop: 4
  },
  reactionEmoji: {
    fontSize: 14
  },
  readStatus: {
    marginLeft: 4
  },
  readText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600'
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 12,
    marginBottom: 4,
    borderRadius: 12
  },
  typingText: {
    fontSize: 13,
    color: '#6b7280',
    marginRight: 6
  },
  typingDots: {
    flexDirection: 'row'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
    marginHorizontal: 2
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 15,
    maxHeight: 100
  },
  sendButton: {
    backgroundColor: '#2563eb',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  sendButtonDisabled: {
    opacity: 0.5
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14
  }
});
