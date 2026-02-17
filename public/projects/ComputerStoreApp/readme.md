# ComputerStoreApp

A full-featured e-commerce mobile application for computer hardware and accessories, built with React Native and Expo.

## 🚀 Features

- 📱 Cross-platform support (iOS, Android, Web)
- 🛒 Shopping cart with real-time updates
- 💳 Stripe payment integration
- 📸 Product image capture and upload
- 🔒 Secure authentication and data storage
- ⭐ Product reviews and ratings
- 📦 Order tracking system
- 🎨 Modern, intuitive UI/UX

## 🛠 Tech Stack

- **Frontend**: React 18.2.0, React Native 0.72.0
- **Framework**: Expo 49.0.0
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Payment**: Stripe React Native SDK
- **State Management**: Context API
- **Forms**: Formik + Yup validation
- **Notifications**: Expo Notifications
- **Media**: Expo Camera, Image Picker
- **Storage**: Expo Secure Store

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional but recommended)

### Setup
```bash
# Install dependencies
npm install

# For Expo Go development
npm start

# For iOS simulator (Mac only)
npm run ios

# For Android emulator
npm run android

# For web browser
npm run web
```

## 🔧 Configuration

1. Create an `enviroment.env` file with your API keys:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
API_BASE_URL=https://your-api-url.com
```

2. Update the Stripe key in `app.js` if needed

## 📱 Building for Production

### Android
```bash
npm run build:android
# or
expo build:android
```

### iOS
```bash
npm run build:ios
# or
expo build:ios
```

## 🎯 Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context (Cart, Auth)
├── data/           # Static data and configurations
├── screens/        # App screens/pages
├── server/         # Backend integration
└── services/       # API and utility services
```

## 📄 Key Screens

- **HomeScreen** - Featured products and categories
- **ProductsScreen** - Browse all products
- **ProductDetailScreen** - Detailed product information
- **CartScreen** - Shopping cart management
- **CheckoutScreen** - Payment processing with Stripe
- **ProfileScreen** - User account management
- **OrderTrackingScreen** - Track order status
- **ReviewsScreen** - Product reviews and ratings

## 🚢 Deployment

This app can be deployed to:
- **Google Play Store** (Android)
- **Apple App Store** (iOS)
- **Web** (Progressive Web App)

Follow the respective platform guidelines for submission.

## 📝 License

MIT License - Kevin Douglas Delong