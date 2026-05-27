// Chat Application Backend - Real-time Messaging Server
// Supports user authentication, real-time messaging, presence tracking, and typing indicators

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// In-memory data storage (upgradable to MongoDB/Firebase)
const users = new Map();
const conversations = new Map();
const messages = new Map();
const userSessions = new Map();

function createAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

function serializeUser(user) {
  return user ? { ...user, password: undefined } : null;
}

function createUser({ userId, name, email, password, avatar, isOnline = false, lastSeen = new Date() }) {
  const user = {
    userId,
    name,
    email,
    password,
    avatar: avatar || createAvatar(name),
    createdAt: new Date(),
    isOnline,
    lastSeen,
  };

  users.set(userId, user);
  return user;
}

function seedConversation(participantA, participantB, seedMessages = []) {
  const conversationId = [participantA, participantB].sort().join('_');

  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, {
      conversationId,
      participants: [participantA, participantB],
      createdAt: new Date(),
      type: 'direct'
    });
    messages.set(conversationId, []);
  }

  const conversationMessages = messages.get(conversationId);
  seedMessages.forEach((message, index) => {
    conversationMessages.push({
      messageId: message.messageId || `msg_seed_${conversationMessages.length + index + 1}`,
      conversationId,
      senderId: message.senderId,
      senderName: users.get(message.senderId)?.name,
      recipientId: message.recipientId,
      text: message.text,
      type: 'text',
      attachmentUrl: null,
      timestamp: message.timestamp || new Date(),
      isRead: Boolean(message.isRead),
      reactions: message.reactions || []
    });
  });

  return conversationId;
}

function getConversationRecipient(conversationId, senderId) {
  const conversation = conversations.get(conversationId);
  if (!conversation) {
    return null;
  }

  return conversation.participants.find((participantId) => participantId !== senderId) || null;
}

function markUserOnline(userId, isOnline) {
  const user = users.get(userId);
  if (!user) {
    return null;
  }

  user.isOnline = isOnline;
  user.lastSeen = new Date();
  users.set(userId, user);
  return user;
}

function broadcastPresence(userId, isOnline) {
  io.emit('presence:updated', {
    userId,
    isOnline,
    lastSeen: new Date()
  });
}

function broadcastConversationMessage(message) {
  io.to(message.conversationId).emit(`message:${message.conversationId}`, message);
}

function broadcastReaction(message) {
  io.to(message.conversationId).emit(`reaction:${message.messageId}`, message);
}

function ensureSeedData() {
  if (users.size > 0) {
    return;
  }

  const alice = createUser({
    userId: 'user_alice',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123'
  });

  const ben = createUser({
    userId: 'user_ben',
    name: 'Ben Carter',
    email: 'ben@example.com',
    password: 'password123'
  });

  const chloe = createUser({
    userId: 'user_chloe',
    name: 'Chloe Rivera',
    email: 'chloe@example.com',
    password: 'password123'
  });

  const dylan = createUser({
    userId: 'user_dylan',
    name: 'Dylan Patel',
    email: 'dylan@example.com',
    password: 'password123'
  });

  seedConversation(alice.userId, ben.userId, [
    {
      senderId: ben.userId,
      recipientId: alice.userId,
      text: 'Did you see the latest build? The message flow is looking good.',
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 35)
    },
    {
      senderId: alice.userId,
      recipientId: ben.userId,
      text: 'Yes. I am wiring the realtime path now.',
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  ]);

  seedConversation(alice.userId, chloe.userId, [
    {
      senderId: chloe.userId,
      recipientId: alice.userId,
      text: 'Need a quick review on the profile screen before release.',
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 12)
    }
  ]);

  seedConversation(ben.userId, dylan.userId, [
    {
      senderId: dylan.userId,
      recipientId: ben.userId,
      text: 'Presence tracking and typing indicators should be covered in the next pass.',
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 8)
    }
  ]);
}

ensureSeedData();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============= AUTH ROUTES =============

// Register user
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, avatar } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (Array.from(users.values()).some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const userId = `user_${Date.now()}`;
  const user = createUser({ userId, name, email, password, avatar });

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({
    userId,
    name,
    email,
    token,
    user: serializeUser(user)
  });
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = Array.from(users.values()).find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '30d' });
  res.json({
    userId: user.userId,
    name: user.name,
    email: user.email,
    token,
    user: serializeUser(user)
  });
});

// ============= USER ROUTES =============

// Get current user
app.get('/api/users/me', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(serializeUser(user));
});

// Get all users (for user discovery)
app.get('/api/users', verifyToken, (req, res) => {
  const allUsers = Array.from(users.values()).map((u) => serializeUser(u));
  res.json(allUsers);
});

// Update user status
app.post('/api/users/status', verifyToken, (req, res) => {
  const { isOnline } = req.body;
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  markUserOnline(req.userId, isOnline);
  
  res.json({ success: true, user: serializeUser(users.get(req.userId)) });
});

// Get user presence
app.get('/api/users/:userId/presence', (req, res) => {
  const user = users.get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  res.json({
    userId: user.userId,
    name: user.name,
    isOnline: user.isOnline,
    lastSeen: user.lastSeen
  });
});

// ============= CONVERSATION ROUTES =============

// Create or get direct conversation between two users
app.post('/api/conversations', verifyToken, (req, res) => {
  const { recipientId } = req.body;
  
  if (!recipientId) {
    return res.status(400).json({ error: 'Recipient ID required' });
  }

  if (!users.has(recipientId)) {
    return res.status(404).json({ error: 'Recipient not found' });
  }

  // Create conversation ID (sorted for consistency)
  const conversationId = [req.userId, recipientId].sort().join('_');

  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, {
      conversationId,
      participants: [req.userId, recipientId],
      createdAt: new Date(),
      type: 'direct'
    });
    messages.set(conversationId, []);
  }

  const conv = conversations.get(conversationId);
  res.json(conv);
});

// Get user's conversations
app.get('/api/conversations', verifyToken, (req, res) => {
  const userConversations = Array.from(conversations.values())
    .filter(conv => conv.participants.includes(req.userId))
    .map(conv => {
      const otherUserId = conv.participants.find(id => id !== req.userId);
      const otherUser = users.get(otherUserId);
      const conversationMessages = messages.get(conv.conversationId) || [];
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      
      return {
        ...conv,
        otherUser: { ...otherUser, password: undefined },
        lastMessage,
        unreadCount: conversationMessages.filter(m => 
          m.recipientId === req.userId && !m.isRead
        ).length
      };
    })
    .sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || a.createdAt;
      const bTime = b.lastMessage?.timestamp || b.createdAt;
      return new Date(bTime) - new Date(aTime);
    });

  res.json(userConversations);
});

// Delete conversation
app.delete('/api/conversations/:conversationId', verifyToken, (req, res) => {
  const conversation = conversations.get(req.params.conversationId);
  
  if (!conversation || !conversation.participants.includes(req.userId)) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  conversations.delete(req.params.conversationId);
  messages.delete(req.params.conversationId);
  
  res.json({ success: true });
});

// ============= MESSAGE ROUTES =============

// Get messages for a conversation (with pagination)
app.get('/api/messages/:conversationId', verifyToken, (req, res) => {
  const conversation = conversations.get(req.params.conversationId);
  
  if (!conversation || !conversation.participants.includes(req.userId)) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  const convMessages = messages.get(req.params.conversationId) || [];
  const endIndex = offset > 0 ? Math.max(convMessages.length - offset, 0) : convMessages.length;
  const startIndex = Math.max(endIndex - limit, 0);
  const messageList = convMessages.slice(startIndex, endIndex);

  res.json({
    conversationId: req.params.conversationId,
    messages: messageList,
    total: convMessages.length,
    limit,
    offset
  });
});

// Send message
app.post('/api/messages', verifyToken, (req, res) => {
  const { conversationId, text, type = 'text', attachmentUrl } = req.body;

  if (!conversationId || !text) {
    return res.status(400).json({ error: 'Conversation ID and message text required' });
  }

  const conversation = conversations.get(conversationId);
  if (!conversation || !conversation.participants.includes(req.userId)) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const messageId = `msg_${Date.now()}`;
  const message = {
    messageId,
    conversationId,
    senderId: req.userId,
    senderName: users.get(req.userId).name,
    recipientId: getConversationRecipient(conversationId, req.userId),
    text,
    type,
    attachmentUrl,
    timestamp: new Date(),
    isRead: false,
    reactions: []
  };

  if (!messages.has(conversationId)) {
    messages.set(conversationId, []);
  }

  messages.get(conversationId).push(message);

  // Broadcast to Socket.IO
  broadcastConversationMessage(message);

  res.status(201).json(message);
});

// Mark message as read
app.put('/api/messages/:messageId/read', verifyToken, (req, res) => {
  const { conversationId } = req.body;
  
  const convMessages = messages.get(conversationId);
  if (!convMessages) return res.status(404).json({ error: 'Conversation not found' });

  const message = convMessages.find(m => m.messageId === req.params.messageId);
  if (!message) return res.status(404).json({ error: 'Message not found' });

  message.isRead = true;
  broadcastConversationMessage(message);
  res.json(message);
});

// Add reaction to message
app.post('/api/messages/:messageId/reaction', verifyToken, (req, res) => {
  const { conversationId, emoji } = req.body;
  
  const convMessages = messages.get(conversationId);
  if (!convMessages) return res.status(404).json({ error: 'Conversation not found' });

  const message = convMessages.find(m => m.messageId === req.params.messageId);
  if (!message) return res.status(404).json({ error: 'Message not found' });

  if (!message.reactions) message.reactions = [];
  
  const existingReaction = message.reactions.find(r => r.userId === req.userId);
  if (existingReaction) {
    existingReaction.emoji = emoji;
  } else {
    message.reactions.push({ userId: req.userId, emoji, userName: users.get(req.userId).name });
  }

  broadcastReaction(message);
  res.json(message);
});

// ============= SOCKET.IO REAL-TIME EVENTS =============

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins (authentication)
  socket.on('user:join', (data) => {
    const { userId, token } = data;
    
    try {
      jwt.verify(token, JWT_SECRET);
      userSessions.set(userId, socket.id);
      
      markUserOnline(userId, true);

      conversations.forEach((conversation) => {
        if (conversation.participants.includes(userId)) {
          socket.join(conversation.conversationId);
        }
      });
      
      // Notify all users of presence change
      broadcastPresence(userId, true);
      
      socket.emit('user:joined', { success: true, userId });
    } catch (error) {
      socket.emit('error', { message: 'Authentication failed' });
    }
  });

  // Typing indicator
  socket.on('message:typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    socket.to(conversationId).emit(`typing:${conversationId}`, {
      userId,
      userName: users.get(userId)?.name,
      isTyping
    });
  });

  socket.on('conversation:join', (data) => {
    const { conversationId, userId } = data;
    const conversation = conversations.get(conversationId);

    if (!conversation || !conversation.participants.includes(userId)) {
      return;
    }

    socket.join(conversationId);
  });

  // Real-time message received
  socket.on('message:send', (data) => {
    const { conversationId, text, senderId, attachmentUrl } = data;
    const recipientId = getConversationRecipient(conversationId, senderId);
    const message = {
      messageId: `msg_${Date.now()}`,
      conversationId,
      senderId,
      senderName: users.get(senderId)?.name,
      recipientId,
      text,
      attachmentUrl,
      timestamp: new Date(),
      isRead: false,
      reactions: []
    };

    if (!messages.has(conversationId)) {
      messages.set(conversationId, []);
    }
    messages.get(conversationId).push(message);

    broadcastConversationMessage(message);
  });

  // User leaves
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    for (const [userId, socketId] of userSessions.entries()) {
      if (socketId === socket.id) {
        markUserOnline(userId, false);
        
        userSessions.delete(userId);
        broadcastPresence(userId, false);
        break;
      }
    }
  });
});

// ============= ANALYTICS & STATS =============

// Get conversation statistics
app.get('/api/stats/conversation/:conversationId', verifyToken, (req, res) => {
  const conversation = conversations.get(req.params.conversationId);
  
  if (!conversation || !conversation.participants.includes(req.userId)) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const convMessages = messages.get(req.params.conversationId) || [];
  const stats = {
    totalMessages: convMessages.length,
    myMessages: convMessages.filter(m => m.senderId === req.userId).length,
    unreadCount: convMessages.filter(m => m.recipientId === req.userId && !m.isRead).length,
    lastMessageTime: convMessages.length > 0 ? convMessages[convMessages.length - 1].timestamp : null
  };

  res.json(stats);
});

// Get user statistics
app.get('/api/stats/user', verifyToken, (req, res) => {
  const convList = Array.from(conversations.values())
    .filter(conv => conv.participants.includes(req.userId));
  
  let totalMessages = 0;
  convList.forEach(conv => {
    const convMessages = messages.get(conv.conversationId) || [];
    totalMessages += convMessages.filter(m => m.senderId === req.userId).length;
  });

  const stats = {
    conversations: convList.length,
    totalMessages,
    activeConversations: convList.length,
    lastActiveTime: new Date()
  };

  res.json(stats);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Chat server healthy', timestamp: new Date() });
});

// Start server
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`WebSocket listening for real-time events`);
});
