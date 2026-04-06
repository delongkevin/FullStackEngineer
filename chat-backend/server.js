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
  const user = {
    userId,
    name,
    email,
    password,
    avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    createdAt: new Date(),
    isOnline: false,
    lastSeen: new Date()
  };

  users.set(userId, user);

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({
    userId,
    name,
    email,
    token,
    user: { ...user, password: undefined }
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
    user: { ...user, password: undefined }
  });
});

// ============= USER ROUTES =============

// Get current user
app.get('/api/users/me', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ ...user, password: undefined });
});

// Get all users (for user discovery)
app.get('/api/users', verifyToken, (req, res) => {
  const allUsers = Array.from(users.values()).map(u => ({
    ...u,
    password: undefined
  }));
  res.json(allUsers);
});

// Update user status
app.post('/api/users/status', verifyToken, (req, res) => {
  const { isOnline } = req.body;
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.isOnline = isOnline;
  user.lastSeen = new Date();
  users.set(req.userId, user);
  
  res.json({ success: true, user: { ...user, password: undefined } });
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
  const messageList = convMessages.slice(-limit - offset, -offset || undefined).reverse();

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
  io.emit(`message:${conversationId}`, message);

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

  io.emit(`reaction:${req.params.messageId}`, message);
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
      
      const user = users.get(userId);
      if (user) {
        user.isOnline = true;
        user.lastSeen = new Date();
        users.set(userId, user);
      }
      
      // Notify all users of presence change
      io.emit('presence:updated', {
        userId,
        isOnline: true,
        lastSeen: new Date()
      });
      
      socket.emit('user:joined', { success: true, userId });
    } catch (error) {
      socket.emit('error', { message: 'Authentication failed' });
    }
  });

  // Typing indicator
  socket.on('message:typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    socket.broadcast.emit(`typing:${conversationId}`, {
      userId,
      userName: users.get(userId)?.name,
      isTyping
    });
  });

  // Real-time message received
  socket.on('message:send', (data) => {
    const { conversationId, text, senderId, attachmentUrl } = data;
    const message = {
      messageId: `msg_${Date.now()}`,
      conversationId,
      senderId,
      senderName: users.get(senderId)?.name,
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

    io.emit(`message:${conversationId}`, message);
  });

  // User leaves
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    for (const [userId, socketId] of userSessions.entries()) {
      if (socketId === socket.id) {
        const user = users.get(userId);
        if (user) {
          user.isOnline = false;
          user.lastSeen = new Date();
          users.set(userId, user);
        }
        
        userSessions.delete(userId);
        io.emit('presence:updated', {
          userId,
          isOnline: false,
          lastSeen: new Date()
        });
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
