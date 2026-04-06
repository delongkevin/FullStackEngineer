# Real-time Chat & Messaging App — Technical Q&A Documentation

**Project:** Real-time Chat & Messaging App
**Slug:** `chat-app`
**Category:** Mobile (React Native / Expo)
**Live Demo:** `/projects/chat-app/index.html`
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)
**Android APK:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/download/android-artifacts-latest/chat-app-debug.apk)
**iOS Source:** [chat-app/](https://github.com/delongkevin/FullStackEngineer/tree/main/chat-app)
**Backend Source:** `/chat-backend/`

---

## Overview

ChatApp is a production-ready cross-platform messaging application built with React Native, Expo, Node.js, and Socket.IO. It supports real-time instant messaging, user presence tracking, typing indicators, message reactions, and read receipts. The backend provides JWT authentication, REST endpoints for conversation and user management, and a WebSocket server via Socket.IO for all real-time events. The portfolio demo renders an interactive two-panel preview showing a searchable conversation list with presence indicators, a live thread view, and simulated typing replies.

---

## 1. Architecture & Design Q&A

**Q1. How is Socket.IO integrated with the React Native app?**

The WebSocket connection is established in a `SocketService` singleton module that wraps `socket.io-client`. The singleton pattern ensures only one socket connection exists per app session regardless of how many screens mount and unmount. `SocketService.connect(serverUrl, token)` is called once after successful JWT auth — the token is passed as a query parameter in the socket handshake for server-side validation. Individual screens call `SocketService.on('message', handler)` and `SocketService.off('message', handler)` inside `useEffect` cleanup functions, preventing memory leaks from orphaned event listeners. `SocketService.emit('typing', { conversationId })` is throttled with a 500ms `lodash.throttle` wrapper to prevent event flooding during fast typing.

**Q2. How do typing indicators work across multiple conversations?**

The server maintains a `typingUsers` Map: `{ conversationId → Set<userId> }`. When a client emits a `typing` event, the server does `typingUsers.get(conversationId)?.add(userId)` and broadcasts `{ conversationId, userId, isTyping: true }` to the conversation room (excluding the sender). A server-side 3-second timeout via `setTimeout` automatically removes the user from the set and broadcasts `{ isTyping: false }` if no further `typing` event is received. On the React Native client, `ChatsScreen` maintains a `typingState: { [conversationId]: string[] }` map and renders a "User is typing..." indicator in the conversation list and the open thread. The indicator uses `Animated.loop` with a pulsing opacity to visually signal active input.

**Q3. How is message pagination implemented to prevent loading thousands of messages at once?**

The `GET /api/conversations/:id/messages?limit=50&offset=0` endpoint returns messages in reverse-chronological order. The React Native `MessageList` component uses a `FlatList` with `inverted={true}` — new messages appear at the bottom naturally, and scrolling up loads older history. At the top of the list, a "Load earlier" button triggers the next page fetch with an incremented `offset`. New pages are prepended to the existing array using `setMessages(prev => [...olderMessages, ...prev])`. This prevents list jumps by tracking `FlatList`'s `onScrollToIndexFailed` and restoring scroll position with `ref.current.scrollToIndex()` after the prepend completes.

**Q4. How are emoji message reactions stored and rendered?**

Reactions are stored as an embedded array in each message document: `message.reactions: [{ emoji, userId, userName }]`. The `POST /api/messages/:id/reactions` endpoint adds or removes a reaction (toggling if the same user sends the same emoji twice). Socket.IO broadcasts a `reaction_update` event to the conversation room with the updated message object — all connected clients replace their local cached message with the server response. In the React Native UI, reactions are rendered as a horizontal flex row of `TouchableOpacity` chips below each message bubble: `"{emoji} {count}"`. The `onLongPress` on a message bubble opens a bottom sheet with the full reaction picker.

**Q5. How does read receipt tracking work?**

When a user opens a conversation, the client emits a `read` event: `{ conversationId, lastReadMessageId }`. The server stores `{ userId, conversationId, lastReadAt, lastReadMessageId }` in a `readReceipts` Map. Messages are fetched with the current user's `lastReadMessageId` — messages older than that have `isRead: true`. In the conversation list, unread count is computed as `messages.length - (lastReadIndex + 1)` and shown as a badge. In the thread view, a "Read" tick appears below each `fromMe` message once the peer's `lastReadMessageId` advances past it, implemented by comparing the peer's receipt ID against the message index in the conversation array.

---

## 2. Technology Stack Q&A

**Q1. Why Socket.IO instead of raw WebSockets or Firebase Realtime Database?**

Socket.IO was chosen over raw WebSockets because it provides automatic reconnection logic, room-based event routing, and fallback to HTTP long-polling in restrictive network environments — all critical for a mobile chat app where connectivity is intermittent. Firebase Realtime Database was evaluated but rejected for the portfolio demo because it introduces Google account dependencies and obscures the WebSocket architecture that demonstrates distributed systems knowledge. Socket.IO's explicit server-side `io.to(room).emit()` pattern makes the real-time event flow transparent and easy to reason about in code review.

**Q2. How does JWT authentication integrate with both REST and Socket.IO?**

The Express server uses a `jwtMiddleware` function applied to all `/api/*` routes via `app.use('/api', jwtMiddleware, router)`. For Socket.IO, the `io.use()` middleware validates the JWT from the socket handshake query: `const token = socket.handshake.query.token; jwt.verify(token, SECRET, cb)`. Both middleware functions attach the decoded `{ userId, email }` payload to the request/socket context (`req.user`, `socket.user`), so route handlers and socket event handlers access the same identity object. This ensures every room join, message send, and typing event is attributed to an authenticated user — unauthenticated socket connections are rejected before any room assignment occurs.

**Q3. What Firebase integration points are prepared but not yet active?**

The app source includes three Firebase integration stubs: (1) `firebaseConfig.js` — imports `initializeApp`, `getFirestore`, and `getMessaging` with a comment block for the config object, allowing Firestore to replace the in-memory message store; (2) `FirebaseAuth.js` — a drop-in alternative to the custom JWT auth that delegates to `firebase/auth` sign-in providers (Google, Apple, Email); (3) `fcmService.js` — wraps `expo-notifications` with Firebase Cloud Messaging token registration, enabling server-push notifications via `POST https://fcm.googleapis.com/fcm/send`. Activating these requires adding a `google-services.json` / `GoogleService-Info.plist` and uncommenting three lines in `App.js`.

**Q4. How does the demo simulate typing replies without a real backend?**

The demo's `simulateTypingReply()` function: (1) shows the peer's name in the `#typing` `aria-live` region immediately; (2) waits 900ms via `setTimeout`; (3) selects a random response string; (4) pushes the response into the active conversation's `messages` array; (5) clears the typing indicator; (6) re-renders both the conversation list and the thread view. The 900ms delay mimics a realistic server round-trip plus typing animation time. The `aria-live="polite"` on the typing indicator and messages container ensures assistive technologies announce the new message without interrupting ongoing screen reader output.
