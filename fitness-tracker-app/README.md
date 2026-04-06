# Fitness Tracker - Mobile App

Cross-platform fitness tracking application for iOS and Android.

## Quick Start

```bash
npm install
npm start
```

Select your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web

## Building for Production

### iOS
```bash
npm run eas:build:ios
```

### Android
```bash
npm run eas:build:android
```

### Both
```bash
npm run eas:build:all
```

## Platform Features

### iOS (Swift)
- HealthKit integration for native health data sync
- Apple Watch companion app support
- CarPlay support for in-car workouts
- Siri Shortcuts automation

### Android (Kotlin)
- Google Fit integration
- Wear OS smartwatch support
- Google Assistant integration
- Material Design 3 UI

## Environment Setup

1. **Expo Account** (free): https://expo.dev/signup
2. **EAS Account** (free tier available): https://eas.expo.dev
3. **Apple Developer Account** (for TestFlight): https://developer.apple.com
4. **Google Play Developer Account** (for Play Store): https://developer.android.com

## File Structure

```
app/
├── App.js                    # Root component & navigation
└── screens/
    ├── HomeScreen.js         # Auth/onboarding
    ├── WorkoutsScreen.js     # Log & view workouts
    ├── HealthScreen.js       # Health metrics
    ├── GoalsScreen.js        # Goal tracking
    └── ProfileScreen.js      # User profile
```

## Target Audiences

✅ **Fitness Enthusiasts** - Complete workout tracking
✅ **Health-Conscious Users** - Real-time health metrics
✅ **Competitive Athletes** - Goal tracking & analytics
✅ **Remote Health Providers** - Patient health monitoring
✅ **Corporate Wellness Programs** - Employee fitness data
