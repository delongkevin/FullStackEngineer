# Fitness Tracker App

A comprehensive cross-platform fitness tracking application built with React Native and Expo. Track workouts, monitor health metrics, integrate with wearable devices, and achieve your fitness goals.

## 🚀 Features

### Core Features
- **Workout Logging** - Track running, cycling, swimming, gym sessions, yoga, and walking
- **Health Metrics Integration** - Apple HealthKit and Google Fit sync
- **Wearable Support** - Apple Watch, Wear OS, and Fitbit integration
- **Goal Tracking** - Set and monitor fitness goals with progress tracking
- **Weekly Summaries** - View workout stats and health trends

### Health Monitoring
- ❤️ Heart Rate tracking and trends
- 👟 Daily step counter with progress bars
- 🔥 Calorie burn tracking
- 💧 Water intake monitoring
- 😴 Sleep quality tracking

### User Management
- User registration and authentication
- Profile customization (weight, height, age, fitness goal)
- BMI calculation
- Personal statistics dashboard

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo
- **React Navigation** (bottom-tab + stack navigation)
- **react-native-chart-kit** - Beautiful health metrics charts
- **axios** - API communication
- **moment.js** - Date/time formatting

### Backend
- **Node.js** + **Express**
- **In-memory database** (easily upgradable to MongoDB/PostgreSQL)
- **CORS enabled** for cross-origin requests
- **RESTful API architecture**

### Platform Support
- **iOS** - Native Swift integration with HealthKit
- **Android** - Native Kotlin integration with Google Fit
- **Web** - React Native Web (expo-web)

## 📱 Installation & Setup

### Prerequisites
- Node.js 14+ and npm
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli` (for building)

### Backend Setup
```bash
cd fitness-tracker-backend
npm install
npm start
```
The API will run on `http://localhost:5000`

### Frontend Setup
```bash
cd fitness-tracker-app
npm install
npm start
```

#### Run on Specific Platform
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## 🏗️ Architecture

### Project Structure
```
fitness-tracker-backend/
├── .env.example          # Environment variables
├── package.json
└── server.js             # Main Express server
    ├── Auth routes       # Registration & login
    ├── User routes       # Profile management
    ├── Workout routes    # Logging & retrieval
    ├── Health routes     # HealthKit/Google Fit data
    ├── Goals routes      # Goal CRUD operations
    └── Wearables routes  # Device integration status

fitness-tracker-app/
├── App.js               # Root navigation component
├── package.json
└── screens/
    ├── HomeScreen.js    # Login/registration
    ├── WorkoutsScreen.js # Workout logging & history
    ├── HealthScreen.js   # Health metrics dashboard
    ├── GoalsScreen.js    # Goal management
    └── ProfileScreen.js  # User profile & settings
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile

### Workouts
- `POST /api/workouts` - Log new workout
- `GET /api/workouts/:userId` - Get user's workouts
- `GET /api/summary/:userId/weekly` - Get weekly summary

### Health Data
- `GET /api/healthkit/:userId?metric=all` - Get all health metrics
- `GET /api/healthkit/:userId?metric=heartRate` - Get specific metric

### Devices
- `GET /api/wearables/:userId` - Get connected devices

### Goals
- `POST /api/goals/:userId` - Create new goal
- `GET /api/goals/:userId` - Get user's goals

## 🔐 Security Features

### Current Implementation
- User authentication via email
- Data isolation per userId
- CORS protection
- Request body validation

### Production Recommendations
- Implement JWT tokens
- Add OAuth 2.0 for HealthKit/Google Fit
- Enable HTTPS only
- Add rate limiting
- Encrypt sensitive data
- Implement refresh tokens

## 🚀 Deployment

### Build for iOS
```bash
npm run eas:build:ios
```
Outputs TestFlight invite link

### Build for Android
```bash
npm run eas:build:android
```
Outputs APK download link or Google Play release

### Build Both Platforms
```bash
npm run eas:build:all
```

## 📊 Health Metrics Integration

### Apple HealthKit (iOS)
- Requires HealthKit capability in Xcode
- Requests user permission on first launch
- Syncs: Heart rate, steps, calories, water, sleep
- Real-time background sync support

### Google Fit (Android)
- OAuth 2.0 authentication required
- Syncs: Steps, calories, heart rate, sleep, distance
- Background job scheduling for periodic sync

### Simulation Mode
Current backend provides **mock health data** for testing without actual device integration.

## 📈 Example Workouts

Pre-configured workout types:
- **Running** - Track distance, pace, elevation
- **Cycling** - Road, mountain, stationary
- **Swimming** - Stroke tracking, pool length
- **Gym** - Sets, reps, weight, exercises
- **Yoga** - Duration, intensity, style
- **Walking** - Casual pace, distance tracking

## 🎯 Next Steps

### Upcoming Features
- [ ] Social sharing (share workouts on social media)
- [ ] Friend leaderboards & challenges
- [ ] Advanced nutrition tracking
- [ ] Meal planning integration
- [ ] Personal trainer messaging
- [ ] AI-powered workout recommendations
- [ ] Voice coaching during workouts
- [ ] Export health data (PDF, CSV)

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration flow
- [ ] User login with email
- [ ] Log multiple workout types
- [ ] View health metrics
- [ ] Create and track goals
- [ ] Update profile settings
- [ ] Pull-to-refresh health data
- [ ] Wearable device status updates
- [ ] Smooth navigation between tabs

## 📝 Environment Variables

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fitness-tracker
JWT_SECRET=your_super_secret_key_here_min_32_chars
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Kevin Douglas Delong - [GitHub](https://github.com/delongkevin)

## 🙏 Acknowledgments

- Expo for easy cross-platform development
- React Native community
- Apple HealthKit & Google Fit for health data APIs
- Chart.js for beautiful data visualizations
