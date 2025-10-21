npm install -g expo-cli

# Create new Expo project
npx create-expo-app ComputerStoreApp
cd ComputerStoreApp

# Install dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-vector-icons

npm run ios
# or
expo run:ios

npm run android
# or
expo run:android

npm run web


Production build
expo build:android
expo build:ios

npx expo export --platform android
npx expo export --platform ios


Back end server handling
# Deploy to Heroku
heroku create your-pc-store-backend
heroku addons:create mongolab
git push heroku main

# Or deploy to AWS/Azure/DigitalOcean

Apple store-backend

expo build:ios
# Follow Apple App Store guidelines

Andriod play store-backend
expo build:android
# Follow Google Play Store guidelines