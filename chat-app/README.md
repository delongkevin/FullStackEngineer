# Chat & Messaging App - React Native Mobile Application

A production-ready cross-platform chat and real-time messaging application built with React Native and Expo. Supports real-time messaging, user presence tracking, typing indicators, and seamless multi-platform deployment to iOS and Android.

Phase 3 status: completed authentication handoff with persisted session bootstrap and reliable logout state reset.

## Features

### Core Messaging
- **Real-time Messaging**: Instant message delivery via Socket.IO
- **Conversation Management**: Create, view, and delete conversations
- **Message History**: Paginated message retrieval with date grouping
- **Read Receipts**: Visual indicators for delivered and read messages
- **Message Reactions**: Add emoji reactions to messages

### User Experience
- **Typing Indicators**: See when users are composing messages
- **User Presence**: Real-time online/offline status with last-seen time
- **User Discovery**: Browse and search for users to start conversations
- **Pull-to-Refresh**: Swipe down to sync latest messages and conversations
- **Avatar System**: Auto-generated or custom user avatars

### Authentication
- **JWT-based Login**: Secure email/password authentication
- **Registration**: Create new account with validation
- **Session Persistence**: Automatic login on app launch
- **Auth State Handoff**: Login/signup now immediately transitions app navigation state
- **Passwordless Ready**: Foundation for OAuth/biometric auth

### User Management
- **Profile Screen**: View and edit user information
- **Account Statistics**: Track conversations, messages, and activity
- **Account Deletion**: Easy logout and session cleanup
- **Edit Profile**: Update name and profile information

### Mobile Optimizations
- **Bottom-Tab Navigation**: Easy access to all features (5 primary screens)
- **Keyboard-Aware**: Proper keyboard handling and input positioning
- **Device-Optimized**: Responsive layouts for all screen sizes
- **Offline Support**: Message queue for unreliable connections

## Technology Stack

### Frontend
- **React Native 0.72**: Cross-platform mobile framework
- **Expo 49**: Development and deployment platform
- **React Navigation 6**: Navigation library with bottom tabs
- **Socket.IO Client**: Real-time messaging via WebSocket
- **Axios**: HTTP client for REST API calls
- **Moment.js**: Date/time formatting and relative time

### Backend Integration
- **Node.js/Express API**: RESTful backend communication
- **JWT Authentication**: Secure token-based auth
- **WebSocket (Socket.IO)**: Real-time data streaming
- **Firebase Ready**: Prepared for cloud integration

### Storage & State
- **AsyncStorage**: Persistent local storage for tokens
- **React Hooks**: State management with useState/useEffect
- **useCallback**: Performance optimized callbacks
- **useRef**: Preserve values across renders

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS: Mac with Xcode (for iOS development)
- Android: Android Studio with emulator or device

### Setup Steps

```bash
# Navigate to project directory
cd chat-app

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

# Update API_BASE_URL in screens if using custom API

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web (preview only)
npm run web
```

## Project Structure

```
chat-app/
├── App.js                          # Root navigation setup
├── package.json                    # Dependencies
├── screens/
│   ├── LoginScreen.js              # Auth - Login/Register
│   ├── ChatsScreen.js              # Conversations list
│   ├── ChatScreen.js               # Message thread
│   ├── UsersScreen.js              # User discovery
│   └── ProfileScreen.js            # User profile
├── assets/
│   └── (images, icons, etc.)
└── README.md                       # Documentation
```

## Screen Details

### 1. LoginScreen
**Purpose**: User authentication  
**Features**:
- Toggle between login and signup modes
- Email and password validation
- Real-time error messages
- Loading state during authentication
- Feature showcase highlights
- Responsive design for all screen sizes

**Key Functions**:
- `validateForm()`: Check required fields and password strength
- `handleLogin()`: POST credentials to /api/auth/login
- `handleSignUp()`: POST new user to /api/auth/register
- Token and userId stored in AsyncStorage

### 2. ChatsScreen
**Purpose**: List all conversations  
**Features**:
- Sorted conversation list (newest first)
- Last message preview with sender indicator
- Unread message badges
- User presence indicator (green/gray dot)
- Swipe/long-press to delete conversation
- Pull-to-refresh functionality
- Avatar display for each conversation

**Key Functions**:
- `fetchConversations()`: GET /api/conversations
- `onRefresh()`: Pull-to-refresh data sync
- `handleDeleteConversation()`: DELETE endpoint
- `openConversation()`: Navigate to ChatScreen

### 3. ChatScreen
**Purpose**: Live messaging interface  
**Features**:
- Real-time message display with Socket.IO
- Message bubbles with sender attribution
- Timestamp for each message
- Typing indicators with animation
- Read receipts (blue checkmarks)
- Message reactions display
- Smooth auto-scroll to latest message
- Keyboard-aware input positioning

**Key Functions**:
- `fetchMessages()`: GET paginated messages
- `sendMessage()`: POST to /api/messages
- `handleTyping()`: Emit typing status via Socket
- Socket event handlers for real-time updates
- Auto-scroll with useRef + FlatList

### 4. UsersScreen
**Purpose**: Discover and search users  
**Features**:
- Full user list browsing
- Search by name or email
- User presence status display
- One-tap conversation creation
- User avatar display
- Pull-to-refresh user list
- Online/offline indicators

**Key Functions**:
- `fetchUsers()`: GET /api/users
- `handleSearch()`: Filter users by query
- `createConversation()`: POST new conversation
- Direct navigation to ChatScreen

### 5. ProfileScreen
**Purpose**: User account management  
**Features**:
- Profile display with avatar
- Account statistics cards (conversations, messages)
- Account creation date
- Last seen timestamp
- Edit profile modal
- Account information display
- Logout functionality
- App version display

**Key Functions**:
- `fetchUserData()`: GET /api/users/me and stats
- `handleEdit()`: Update profile form fields
- `saveChanges()`: Save profile modifications
- `handleLogout()`: Clear tokens and logout

## Navigation Structure

```
App (Root)
├── AuthStack (Login/Register) [when not authenticated]
│   └── LoginScreen
└── AppStack (Authenticated) [when authenticated]
    ├── ChatsTab
    │   ├── ChatsList (ChatsScreen)
    │   └── Chat (ChatScreen) [navigated from list]
    ├── UsersTab
    │   ├── UsersList (UsersScreen)
    │   └── UserChat (ChatScreen) [navigated from users]
    └── ProfileTab
        └── ProfileView (ProfileScreen)
```

## Configuration

### API Endpoint
Update `API_BASE_URL` in screen files:
```javascript
const API_BASE_URL = 'http://localhost:3000';  // Development
const API_BASE_URL = 'https://api.chatapp.com'; // Production
```

### Push Notifications (Optional)
```javascript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
});
```

## Testing Checklist

### Authentication
- [ ] Can register with valid email
- [ ] Cannot register with duplicate email
- [ ] Can login with valid credentials
- [ ] Token persists on app restart
- [ ] Auto-login works after restart

### Messaging
- [ ] Can send text messages
- [ ] Messages appear in real-time
- [ ] Typing indicators display correctly
- [ ] Scrolls to latest message automatically
- [ ] Message history loads on open

### Navigation
- [ ] Bottom tabs switch screens
- [ ] Back button returns to previous screen
- [ ] Modal opens for edit profile
- [ ] No navigation loops

### UI/UX
- [ ] Layout responsive on different screen sizes
- [ ] Keyboard doesn't hide inputs
- [ ] Images load and display correctly
- [ ] Loading spinners show during requests
- [ ] Error messages display appropriately
- [ ] Pull-to-refresh works smoothly

### Performance
- [ ] App launches in <3 seconds
- [ ] Messages load without lag
- [ ] Avatar images cache properly
- [ ] No memory leaks on navigation
- [ ] Battery drain is minimal

## Deployment

### Build for Android (APK)

```bash
npm run build-android

# Or with EAS Build
eas build --platform android --debug

# Sign with keystore for Play Store
eas build --platform android --production
```

### Deploy to Google Play

```bash
eas submit --platform android \
  --latest \
  --key <keystore-path> \
  --key-alias <alias>
```

### Build for iOS (IPA)

```bash
npm run build-ios

# Or with EAS Build
eas build --platform ios --debug

# For TestFlight/App Store
eas build --platform ios --production
```

### Deploy to App Store / TestFlight

```bash
eas submit --platform ios --latest
```

## Development Tips

### Hot Reloading
```bash
# Fast refresh enabled by default with Expo
# Just save file to see changes

# Full reload if needed
npm start
# Press 'r' in terminal
```

### Debugging

```javascript
// Add console logs
console.log('Message:', message);

// Check state changes
useEffect(() => {
  console.log('isTyping changed:', isTyping);
}, [isTyping]);

// Network debugging
axios.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  }
);
```

### Common Issues

**Messages not loading**:
- Check API URL in files
- Verify backend is running
- Check network connectivity
- Look at device network tab

**Push notifications not working**:
- Ensure permission is granted
- Check Firebase config
- Test with Expo notifications

**Socket.IO connection issues**:
- Verify backend Socket.IO enabled
- Check CORS settings
- Try alternate transports

## API Integration

### Authentication Flow
```
1. User enters email/password
2. POST /api/auth/login or /api/auth/register
3. Receive token and userId
4. Store in AsyncStorage
5. Set Authorization header
6. Navigate to main app
```

### Message Flow
```
1. Component mounts, fetch messages
2. GET /api/messages/:conversationId
3. Display message list
4. User types - emit typing via Socket
5. User sends - POST /api/messages
6. Socket.IO broadcasts to recipient
7. Recipient receives via socket listener
8. Both see new message
```

### Real-time Events
```
Socket.IO Events:
- user:join - User connects
- message:send - Send message real-time
- message:typing - Show typing indicator
- message:<conversationId> - Receive message
- typing:<conversationId> - Typing status
- presence:updated - User online/offline
```

## Performance Optimization

1. **Message Pagination**: Load 50 messages at a time
2. **FlatList Optimization**: Extract item renderItem for memoization
3. **Image Caching**: Avatars re-render minimally
4. **Event Cleanup**: Remove listeners on unmount
5. **Reduce State Updates**: Batch updates when possible

## Security

1. **Token Storage**: Stored in AsyncStorage (use Secure Store in production)
2. **HTTPS**: Use in production
3. **Password**: Transmitted in HTTPS only
4. **API Keys**: Never hardcode in client
5. **Input Validation**: Validate all user inputs

## Future Enhancements

1. **Audio Messaging**: Record and send voice messages
2. **Image Sharing**: Upload photos to conversations
3. **Group Chats**: Support multi-user conversations
4. **Message Search**: Search message history
5. **Encryption**: End-to-end message encryption
6. **Push Notifications**: Remote notifications via FCM/APNs
7. **Video Calling**: WebRTC video calls
8. **Call History**: Track calls and messaging
9. **Dark Mode**: Theme support for dark devices
10. **Archived Chats**: Archive old conversations

## Troubleshooting

### "Cannot find variable: io"
- Install socket.io-client: `npm install socket.io-client`

### "AsyncStorage not defined"
- Install: `expo install @react-native-async-storage/async-storage`

### Keyboard overlaps input
- Use `KeyboardAvoidingView` with proper `keyboardVerticalOffset`

### Messages not real-time
- Ensure Socket.IO server running
- Check WebSocket connectivity
- Verify CORS enabled on backend

### App crashes on navigation
- Check navigation prop is passed correctly
- Verify screen names match Stack.Screen names
- Check params passed to routes

## Support

For technical issues:
1. Check device logs: `npx react-native log-android` or `log-ios`
2. Enable Expo CLI verbose: `expo start --verbose`
3. Check backend API is responding
4. Test with curl or Postman first
5. Review Socket.IO connection status

## Dependencies

```json
{
  "expo": "^49.0.0",
  "expo-notifications": "^0.20.1",
  "react": "18.2.0",
  "react-native": "0.72.6",
  "react-navigation": "^6.1.9",
  "axios": "^1.4.0",
  "socket.io-client": "^4.6.1",
  "moment": "^2.29.4"
}
```

## License

MIT License

## Author

Kevin Delong - Full Stack Engineer
