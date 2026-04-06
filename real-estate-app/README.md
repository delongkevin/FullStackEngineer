# Real Estate Mobile App

A modern, feature-rich real estate application built with React Native that allows users to search for properties, save favorites, book property tours, and manage their profile.

## Features

### 🔍 Search & Browse
- Advanced property search with filters
- Browse properties by location, price, and property type
- Detailed property cards with high-quality images
- Fast loading and smooth scrolling

### ❤️ Favorites Management
- Save properties to your favorites
- View all saved properties in one place
- Quick access to detailed information
- Favorite count tracking

### 📅 Tour Bookings
- Schedule property tours at convenient times
- Manage all your bookings in one screen
- View booking status and confirmation details
- Contact agents directly

### 👤 User Profile
- Manage account information
- View account statistics
- Edit profile details
- Account security and logout

### 🔐 Authentication
- Secure user registration
- Email and password login
- Token-based authentication
- Session management

## Project Structure

```
real-estate-app/
├── screens/                    # Screen components
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── SearchScreen.js
│   ├── PropertyDetailScreen.js
│   ├── PropertyListScreen.js
│   ├── FavoritesScreen.js
│   ├── FavoriteDetailScreen.js
│   ├── BookingsScreen.js
│   └── ProfileScreen.js
├── navigation/                 # Navigation configuration
│   └── RootNavigator.js
├── components/                 # Reusable components
├── utils/                      # Helper functions
├── assets/                     # Images, fonts, etc.
├── App.js                      # Entry point
├── package.json                # Dependencies
└── README.md                   # Documentation
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android development) or Xcode (for iOS development)
- Backend API server running (see Backend Setup)

## Installation

### 1. Clone the repository
```bash
cd real-estate-app
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure API endpoint
Update the `API_BASE_URL` in screen files to match your backend server:

```javascript
const API_BASE_URL = 'http://localhost:3001'; // or your server URL
```

### 4. Start the app

#### For Android:
```bash
npm run android
```

#### For iOS:
```bash
npm run ios
```

#### For Web (using Expo):
```bash
npm run web
```

## Backend Setup

The app requires a backend API server. Ensure your backend provides these endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users/me` - Get current user profile

### Properties
- `GET /api/properties/search` - Search properties
- `GET /api/properties/:id` - Get property details
- `GET /api/properties-stats` - Get property statistics

### Favorites
- `GET /api/favorites` - Get user's favorite properties
- `POST /api/favorites/:propertyId` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:bookingId` - Cancel a booking

## Authentication Flow

1. **Registration**: New users create an account with email and password
2. **Login**: Users authenticate with email and password
3. **Token Storage**: JWT token is stored in AsyncStorage
4. **API Requests**: Token is sent in Authorization header for protected endpoints
5. **Session Management**: Automatic logout when token expires

## Screen Details

### LoginScreen
- Email and password input
- Error display and validation
- Navigation to registration screen
- Secure password field

### RegisterScreen
- Full name, email, phone, and password input
- Form validation
- Terms and conditions links
- Navigation back to login

### SearchScreen
- Search filter options
- Property listing with pagination
- Quick property preview
- Detailed view navigation

### PropertyDetailScreen
- Full property information
- Image gallery
- Property amenities
- Price and specifications
- Tour booking option
- Contact agent button

### FavoritesScreen
- List of favorite properties
- Quick removal option
- Sorted and filtered view
- Empty state handling

### FavoriteDetailScreen
- Enhanced favorite property view
- Similar to PropertyDetailScreen
- Quick favorite management
- Tour scheduling

### BookingsScreen
- List of scheduled tours
- Booking status display
- Tour date and time
- Agent contact information
- Booking history

### ProfileScreen
- User information display
- Account statistics
- Edit profile capability
- Logout option
- Membership information

## API Integration

The app uses axios for HTTP requests with the following features:

- Automatic Authorization header injection
- Token refresh handling
- Error handling and user feedback
- Request/response interceptors

## State Management

The app uses React Hooks for state management:

- `useState` for component state
- `useEffect` for side effects
- `useContext` for authentication context (future enhancement)

## Styling

Apps uses React Native StyleSheet for cross-platform styling:

- Consistent color palette (green primary: #059669)
- Responsive layouts
- Platform-specific optimizations
- Custom spacing and sizing

## Error Handling

- Network error handling
- User feedback via alerts
- Graceful degradation
- Retry mechanisms for failed requests

## Security Features

- Secure password storage (backend responsibility)
- JWT token authentication
- Secure token storage in AsyncStorage
- HTTPS communication (production)

## Performance Optimizations

- Lazy loading of images
- FlatList virtualization
- Debounced search
- Optimized re-renders
- Async storage caching

## Future Enhancements

- Push notifications for booking confirmations
- Real-time property updates
- Advanced filtering options
- Map view integration
- Property comparison tool
- User reviews and ratings
- Video tours
- Mortgage calculator
- Price history charts

## Troubleshooting

### Common Issues

**API Connection Error**
- Ensure backend server is running
- Check API_BASE_URL configuration
- Verify network connectivity

**Authentication Issues**
- Clear AsyncStorage: `AsyncStorage.clear()`
- Verify credentials
- Check token expiration

**Navigation Issues**
- Ensure all screen components are properly registered
- Check navigation stack configuration
- Verify navigation props passing

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please contact the development team or file an issue in the repository.

## Development Team

- Full Stack Engineer
- Mobile Developer Team

## Changelog

### Version 1.0.0
- Initial release
- Core features implementation
- Authentication system
- Property search and browsing
- Favorites management
- Tour booking system
- User profile management
