# Finance Tracker - Mobile App

Cross-platform personal finance management application for iOS and Android.

## 🚀 Quick Start

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

## 📱 Platform Features

### iOS (Swift)
- Native integration with Apple Wallet
- iCloud sync for financial data
- Siri shortcut automation
- Widget support (lock screen, home screen)

### Android (Kotlin)
- Google Pay integration
- Material Design 3 UI
- Notification channels
- Background job scheduling

## 🎯 App Screens

1. **Dashboard** - Financial overview with balance, KPIs, and spending breakdown
2. **Transactions** - Detailed transaction history with filtering and search
3. **Budget** - Budget management with progress tracking
4. **Goals** - Financial goal tracking with progress visualization
5. **Settings** - User profile and account management

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (bottom tabs + stack)
- **Charts**: react-native-chart-kit
- **HTTP**: axios
- **State Management**: React hooks

## 📊 Key Features

✅ Expense and income tracking
✅ Smart budget planning  
✅ Financial goal setting
✅ Real-time analytics dashboard
✅ Spending insights by category
✅ Fraud detection alerts
✅ User authentication
✅ Profile management
✅ Data persistence

## 🎨 UI/UX Highlights

- **Color Scheme**: Green accent (#10B981) for positive actions
- **Typography**: Clear hierarchy with bold headings
- **Components**: Cards, progress bars, charts, bottom sheets
- **Accessibility**: Touch-friendly spacing, readable fonts
- **Performance**: Optimized re-renders, lazy loading

## 🧪 Testing Checklist

- [ ] User registration with all fields
- [ ] User login with email
- [ ] Add expenses with categories
- [ ] Add income transactions
- [ ] View transaction history
- [ ] Filter transactions by type
- [ ] Create budget for category
- [ ] Track budget vs spending
- [ ] Create financial goal
- [ ] View goal progress
- [ ] Edit user profile
- [ ] Check dashboard analytics
- [ ] Pull-to-refresh on all screens
- [ ] Logout functionality

## 📈 Target Audiences

✅ **Personal finance managers** - Full expense tracking
✅ **Budget-conscious users** - Smart budget planning
✅ **Savers** - Goal tracking and progress
✅ **Students** - Simple expense management
✅ **Freelancers** - Income tracking and analytics
✅ **Couples/Families** - Shared expense tracking (future)

## 🔒 Data Privacy

- All data stored locally on device
- Optional cloud sync (future)
- No third-party ad networks
- Regular security audits
- Encrypted sensitive fields

## 🚀 Deployment Targets

- iOS: TestFlight or App Store
- Android: Google Play Store or GitHub Releases
- Web: Expo Web for browser access

## ⚙️ Environment Setup

1. **Expo Account** (free): https://expo.dev/signup
2. **EAS Account** (builds): https://eas.expo.dev
3. **Apple Developer** (iOS): https://developer.apple.com
4. **Google Play Developer** (Android): https://play.google.com/console

## 💡 Tips for Developers

- Use Android emulator or iOS simulator
- Expo Go app for quick testing
- Hot reload enabled by default
- Check console for errors with `npm start`
- Build locally before EAS Build
- Test on real devices before release

## 📝 License

MIT License
