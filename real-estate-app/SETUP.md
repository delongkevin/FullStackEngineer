# Real Estate App Setup Instructions

## Prerequisites

- Node.js v14+
- npm or yarn
- React Native development environment:
  - For Android: Android Studio + Android SDK
  - For iOS: Xcode + iOS SDK (macOS only)
  - For Web: Expo (included in dependencies)

## Step 1: Install Dependencies

```bash
cd real-estate-app
npm install
# or
yarn install
```

## Step 2: Configure Environment

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=10000
```

Update the `API_BASE_URL` in each screen file:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

## Step 3: Start Backend Server

The app requires a backend API server running. Ensure your backend:

1. Is running on `http://localhost:3001` (or configure the URL)
2. Has the required endpoints (see Backend Requirements below)
3. Returns proper CORS headers for mobile requests

```bash
# In your backend directory
npm start
```

## Step 4: Run the App

### Option A: Android

```bash
npm run android
# or
react-native run-android
```

Requirements:
- Android Studio installed
- Android SDK configured
- Android emulator running or device connected

### Option B: iOS

```bash
npm run ios
# or
react-native run-ios
```

Requirements:
- Xcode installed
- Pod dependencies installed: `cd ios && pod install && cd ..`
- iOS simulator or device available

### Option C: Web (Development)

```bash
npm run web
# or
expo start --web
```

## Backend Requirements

The app expects these API endpoints on your backend:

### Authentication

```
POST /api/auth/login
Body: { email, password }
Response: { token, userId }

POST /api/auth/register
Body: { name, email, password, phone }
Response: { token, userId }
```

### Properties

```
GET /api/properties/search?city=&state=&minPrice=&maxPrice=&bedrooms=
Response: [{ propertyId, title, city, state, price, ... }]

GET /api/properties/:id
Response: { propertyId, title, description, images[], ... }

GET /api/properties/featured
Response: [{ propertyId, title, ... }]
```

### Favorites

```
GET /api/favorites
Response: [{ propertyId, title, ... }]

POST /api/favorites/:propertyId
Response: { success: true }

DELETE /api/favorites/:propertyId
Response: { success: true }
```

### Bookings

```
GET /api/bookings
Response: [{ bookingId, propertyId, tourDate, tourTime, status, ... }]

POST /api/bookings
Body: { propertyId, tourDate, tourTime }
Response: { bookingId, ... }

DELETE /api/bookings/:bookingId
Response: { success: true }
```

### User

```
GET /api/users/me
Response: { userId, name, email, phone, avatar, ... }

PUT /api/users/me
Body: { name, phone }
Response: { userId, name, email, ... }

GET /api/properties-stats
Response: { totalProperties, totalViews, averageRating, ... }
```

## Testing

### Unit Tests

```bash
npm test
```

### Run with Debug Logs

Android:
```bash
react-native log-android
```

iOS:
```bash
react-native log-ios
```

## Troubleshooting

### Module Not Found Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Metro Bundler Issues

```bash
# Clear cache
npm start -- --reset-cache
```

### Android SDK Issues

```bash
# Update SDK
sdkmanager --update
```

### Firebase/Pod Issues (iOS)

```bash
cd ios
pod install --repo-update
cd ..
```

### API Connection Errors

1. Check backend is running: `http://localhost:3001`
2. On Android emulator, use `10.0.2.2` instead of `localhost`
3. Check firewall settings
4. Verify CORS headers on backend

### AsyncStorage Errors

AsyncStorage works with the actual device/emulator. For web, use browser localStorage.

## Development Workflow

1. **Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Edit screens in `screens/`
   - Add utilities in `utils/`
   - Update constants if needed

3. **Test**
   ```bash
   npm test
   ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

## Performance Tips

1. **Use FlatList instead of ScrollView for long lists**
2. **Memoize expensive components with React.memo()**
3. **Use shouldComponentUpdate or useMemo for optimization**
4. **Lazy load images with proper caching**
5. **Avoid unnecessary re-renders with proper state management**

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Validate all user inputs on backend
- [ ] Implement rate limiting on API
- [ ] Secure token storage (AsyncStorage has limitations)
- [ ] Don't expose sensitive data in logs
- [ ] Use environment variables for secrets
- [ ] Implement proper error handling

## Production Build

### Android

```bash
cd android
./gradlew bundleRelease
# or APK:
./gradlew assembleRelease
cd ..
```

### iOS

```bash
# Using Xcode GUI
# Select Product > Archive
# Or via terminal:
xcodebuild -workspace ios/RealEstateApp.xcworkspace \
  -scheme RealEstateApp \
  -configuration Release \
  -archivePath ./build/RealEstateApp.xcarchive \
  archive
```

### Web

```bash
npm run build
# Output in build/ directory
```

## Support and Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Docs](https://docs.expo.dev/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)

## Bug Reporting

Create an issue with:
- Platform (iOS/Android/Web)
- Steps to reproduce
- Expected vs actual behavior
- Logs/screenshots
- Device/emulator details

## Frequently Asked Questions

**Q: How do I change the API URL?**
A: Update `API_BASE_URL` in the respective screen files or create a config file.

**Q: How do I debug on device?**
A: Enable USB Debugging (Android) or Xcode debugging (iOS), then connect device.

**Q: Can I use this with Expo?**
A: Yes, the app uses Expo-compatible packages.

**Q: How do I maintain user session?**
A: Token is stored in AsyncStorage and automatically added to requests.
