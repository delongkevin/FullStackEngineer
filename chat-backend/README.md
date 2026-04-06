# Chat & Messaging Application - Backend API

A production-ready real-time chat and messaging server built with Node.js, Express, Socket.IO, and Firebase integration ready. Supports real-time messaging, user presence tracking, typing indicators, and message reactions with comprehensive REST API and WebSocket support.

## Features

- **Real-time Messaging**: Instant message delivery via Socket.IO with WebSocket fallback
- **User Authentication**: JWT-based registration and login with token expiration
- **Presence Tracking**: Real-time online/offline status with last-seen timestamps
- **Typing Indicators**: Live "User is typing" notifications during composition
- **Message Reactions**: Add emoji reactions to messages with user attribution
- **Message History**: Paginated message retrieval with configurable limits
- **Conversation Management**: Create, retrieve, and delete conversations
- **User Discovery**: Find and browse user profiles to start new conversations
- **Read Receipts**: Track message read status
- **Push Notification Ready**: Firebase Cloud Messaging integration hooks
- **Analytics**: Conversation statistics and user activity metrics
- **Scalable Architecture**: In-memory storage pattern (easy migration to MongoDB/Firebase)

## Technology Stack

- **Runtime**: Node.js 18+
- **Web Framework**: Express.js 4.18
- **Real-time**: Socket.IO 4.6 with automatic reconnection
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Firebase**: firebase-admin 12.0 (ready for Firestore/Realtime DB)
- **CORS**: Cross-origin request handling
- **Environment**: dotenv for configuration

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Setup

```bash
cd chat-backend
npm install

# Create .env file from template
cp .env.example .env

# Update .env with your configuration
# PORT=3000
# JWT_SECRET=your_secret_key
# FIREBASE_API_KEY=your_firebase_key
# etc.

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Authentication Routes

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "avatar": "https://ui-avatars.com/api/?name=John+Doe"
}

Response:
{
  "userId": "user_1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "userId": "user_1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### User Routes

#### Get Current User
```bash
GET /api/users/me
Authorization: Bearer <token>

Response:
{
  "userId": "user_1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "isOnline": true,
  "lastSeen": "2024-01-15T10:30:00Z"
}
```

#### Get All Users
```bash
GET /api/users
Authorization: Bearer <token>

Response: [
  { "userId": "...", "name": "...", "email": "...", ... }
]
```

#### Update User Status
```bash
POST /api/users/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "isOnline": true
}
```

#### Get User Presence
```bash
GET /api/users/:userId/presence

Response:
{
  "userId": "user_1234567890",
  "name": "John Doe",
  "isOnline": true,
  "lastSeen": "2024-01-15T10:30:00Z"
}
```

### Conversation Routes

#### Create/Get Conversation
```bash
POST /api/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "user_9876543210"
}

Response:
{
  "conversationId": "user_1234567890_user_9876543210",
  "participants": ["user_1234567890", "user_9876543210"],
  "type": "direct",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

#### Get User Conversations
```bash
GET /api/conversations
Authorization: Bearer <token>

Response: [
  {
    "conversationId": "...",
    "participants": [...],
    "otherUser": { ... },
    "lastMessage": { ... },
    "unreadCount": 0
  }
]
```

#### Delete Conversation
```bash
DELETE /api/conversations/:conversationId
Authorization: Bearer <token>

Response: { "success": true }
```

### Message Routes

#### Get Messages
```bash
GET /api/messages/:conversationId?limit=50&offset=0
Authorization: Bearer <token>

Response:
{
  "conversationId": "...",
  "messages": [
    {
      "messageId": "msg_1234567890",
      "conversationId": "...",
      "senderId": "...",
      "senderName": "John",
      "text": "Hello!",
      "timestamp": "2024-01-15T10:30:00Z",
      "isRead": true,
      "reactions": [
        { "userId": "...", "emoji": "❤️", "userName": "Jane" }
      ]
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

#### Send Message
```bash
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "user_1234567890_user_9876543210",
  "text": "Hello, how are you?",
  "type": "text",
  "attachmentUrl": null
}

Response: { "messageId": "...", "timestamp": "...", ... }
```

#### Mark Message as Read
```bash
PUT /api/messages/:messageId/read
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "..."
}

Response: { "messageId": "...", "isRead": true, ... }
```

#### Add Message Reaction
```bash
POST /api/messages/:messageId/reaction
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "...",
  "emoji": "❤️"
}

Response: { "messageId": "...", "reactions": [...], ... }
```

### Analytics Routes

#### Get Conversation Stats
```bash
GET /api/stats/conversation/:conversationId
Authorization: Bearer <token>

Response:
{
  "totalMessages": 125,
  "myMessages": 45,
  "unreadCount": 0,
  "lastMessageTime": "2024-01-15T10:30:00Z"
}
```

#### Get User Stats
```bash
GET /api/stats/user
Authorization: Bearer <token>

Response:
{
  "conversations": 12,
  "totalMessages": 342,
  "activeConversations": 8,
  "lastActiveTime": "2024-01-15T10:30:00Z"
}
```

## Real-time Events (Socket.IO)

### Client Events

#### Join User
```javascript
socket.emit('user:join', {
  userId: 'user_1234567890',
  token: 'eyJhbGciOiJIUzI1NiIs...'
});
```

#### Send Message (Real-time)
```javascript
socket.emit('message:send', {
  conversationId: 'conv_id',
  text: 'Hello!',
  senderId: 'user_id',
  attachmentUrl: null
});
```

#### Show Typing
```javascript
socket.emit('message:typing', {
  conversationId: 'conv_id',
  userId: 'user_id',
  isTyping: true
});
```

### Server Events

#### Message Received
```javascript
socket.on(`message:${conversationId}`, (message) => {
  // Handle new message
  console.log('New message:', message);
});
```

#### User Typing
```javascript
socket.on(`typing:${conversationId}`, (data) => {
  // data: { userId, userName, isTyping }
  console.log(`${data.userName} is typing...`);
});
```

#### Presence Updated
```javascript
socket.on('presence:updated', (data) => {
  // data: { userId, isOnline, lastSeen }
  console.log(`User ${data.userId} is ${data.isOnline ? 'online' : 'offline'}`);
});
```

## Database Schema (In-Memory)

### Users Map
```javascript
Map<userId, {
  userId: string,
  name: string,
  email: string,
  password: string,
  avatar: string,
  createdAt: Date,
  isOnline: boolean,
  lastSeen: Date
}>
```

### Conversations Map
```javascript
Map<conversationId, {
  conversationId: string,
  participants: [string, string],
  createdAt: Date,
  type: 'direct' | 'group',
  lastMessage?: Message
}>
```

### Messages Map
```javascript
Map<conversationId, Message[]>

Message {
  messageId: string,
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string,
  type: 'text' | 'image' | 'file',
  attachmentUrl?: string,
  timestamp: Date,
  isRead: boolean,
  reactions: [{
    userId: string,
    emoji: string,
    userName: string
  }]
}
```

## Migration Guide

### To MongoDB

Replace in-memory Maps with MongoDB collections:

```javascript
// Before
const users = new Map();
users.set(userId, userData);

// After
const users = db.collection('users');
await users.insertOne({ _id: userId, ...userData });
```

### To Firebase Realtime Database

```javascript
const db = admin.database();
db.ref('users').child(userId).set(userData);
```

### To Firestore

```javascript
const db = admin.firestore();
await db.collection('users').doc(userId).set(userData);
```

## Security Recommendations

1. **JWT Token Management**
   - Use strong secret keys (minimum 32 characters)
   - Implement token refresh for long sessions
   - Add token blacklist for logout

2. **Password Security**
   - Hash passwords with bcrypt (min 10 rounds)
   - Enforce minimum 8-character passwords
   - Implement rate limiting on login attempts

3. **Data Validation**
   - Validate all user inputs server-side
   - Implement strict CORS policies
   - Add rate limiting on API endpoints

4. **Encryption**
   - Use HTTPS in production
   - Consider end-to-end message encryption
   - Hash sensitive data at rest

5. **Database Security**
   - Use connection pooling
   - Implement database backups
   - Audit database access logs

## Deployment

### EAS Build (Expo)

```bash
# Build for Android
eas build --platform android --debug

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t chat-backend:1.0.0 .
docker run -p 3000:3000 -e JWT_SECRET=key chat-backend:1.0.0
```

### Cloud Deployment (Firebase Functions)

```javascript
const functions = require('firebase-functions');
const app = require('./server');

exports.api = functions.https.onRequest(app);
```

### Environment Variables

Required for production:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<32+ character secret>
FIREBASE_API_KEY=<your_firebase_key>
FIREBASE_AUTH_DOMAIN=<your_domain>
FIREBASE_DATABASE_URL=<your_url>
FIREBASE_PROJECT_ID=<your_project>
```

## Performance Optimization

1. **Message Pagination**: Limit to 50 messages per request
2. **Connection Pooling**: Use persistent socket connections
3. **Caching**: Cache user presence for 30 seconds
4. **Compression**: Enable gzip compression for responses
5. **Indexing**: Index conversationId and userId for fast queries

## Future Enhancements

1. **Group Messaging**: Support conversations with multiple participants
2. **Message Search**: Full-text search across message history
3. **File Sharing**: Upload and share documents/images/videos
4. **Voice Messages**: Record and send audio messages
5. **Video Calling**: Integration with WebRTC or Twilio
6. **Message Encryption**: End-to-end encryption for all messages
7. **Scheduled Messages**: Queue messages for future delivery
8. **Message Editing**: Edit sent messages with edit history
9. **Muting Conversations**: Silence notifications for specific chats
10. **Custom Status**: User status with emojis and expiration

## Testing

```bash
# Test user registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123"
  }'

# Test sending message
curl -X POST http://localhost:3000/api/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "...",
    "text": "Hello World!"
  }'
```

## Troubleshooting

### Connection Issues
- Ensure CORS is enabled for client origin
- Check Socket.IO version compatibility
- Verify JWT tokens haven't expired

### Message Not Sending
- Validate conversation ID exists
- Check user authentication token
- Verify both users are in conversation participants

### Typing Indicator Lag
- Reduce typing debounce timeout
- Implement client-side prediction
- Check network latency

## Support

For issues or questions:
1. Check error message and logs
2. Review API documentation
3. Test with curl or Postman
4. Enable debug logging: `DEBUG=*`

## License

MIT License - See LICENSE file for details

## Author

Kevin Delong - Software Engineer
Built as part of portfolio demonstration project
