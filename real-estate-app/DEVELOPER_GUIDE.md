# Real Estate App - Developer Guide

## Getting Started

### First Time Setup

1. **Clone & Install**
   ```bash
   cd real-estate-app
   npm install
   ```

2. **Start Backend**
   ```bash
   # In your backend directory
   npm start
   ```

3. **Run App**
   ```bash
   # Android
   npm run android

   # iOS
   npm run ios

   # Web
   npm run web
   ```

## Common Development Tasks

### Adding a New Screen

1. **Create the component file**
   ```javascript
   // screens/NewScreen.js
   import React, { useState, useEffect } from 'react';
   import { View, Text, StyleSheet } from 'react-native';

   export default function NewScreen() {
     return (
       <View style={styles.container}>
         <Text>New Screen</Text>
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center'
     }
   });
   ```

2. **Register in navigation**
   ```javascript
   // App.js or RootNavigator.js
   import NewScreen from './screens/NewScreen';

   // Add to appropriate stack
   <Stack.Screen name="New" component={NewScreen} />
   ```

### Adding API Integration

1. **Add method to apiService**
   ```javascript
   // services/apiService.js
   export const apiService = {
     // ... existing methods
     getNewData: async (params) => {
       try {
         const response = await apiClient.get('/api/endpoint', { params });
         return response.data;
       } catch (error) {
         throw error.response?.data || { error: ERROR_MESSAGES.GENERIC_ERROR };
       }
     }
   };
   ```

2. **Use in screen**
   ```javascript
   import { apiService } from '../services/apiService';

   const fetchData = async () => {
     try {
       setLoading(true);
       const data = await apiService.getNewData({ filter: 'value' });
       setState(data);
     } catch (error) {
       Alert.alert('Error', error.error || 'Failed to fetch');
     } finally {
       setLoading(false);
     }
   };
   ```

### Adding Validation

1. **Create validation schema**
   ```javascript
   // utils/validation.js
   const newFormSchema = {
     field1: {
       required: true,
       validate: (value) => value.length > 0,
       errorMessage: 'Field is required'
     },
     field2: {
       required: false,
       validate: (value) => /pattern/.test(value),
       errorMessage: 'Invalid format'
     }
   };
   ```

2. **Use in form**
   ```javascript
   const [errors, setErrors] = useState({});

   const handleSubmit = () => {
     const newErrors = validateForm(formData, newFormSchema);
     if (hasErrors(newErrors)) {
       setErrors(newErrors);
       return;
     }
     // Submit form
   };
   ```

### Adding Styling

Use React Native StyleSheet for consistency:

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SPACING.LG
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center'
  }
});
```

## State Management Patterns

### Simple State

```javascript
const [value, setValue] = useState('initial');
```

### Object State

```javascript
const [state, setState] = useState({
  data: [],
  loading: false,
  error: null
});

// Update
setState(prev => ({ ...prev, loading: true }));
```

### Multiple Related States

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Or use useReducer for complex logic
const [state, dispatch] = useReducer(reducer, initialState);
```

## Navigation Tips

### Pass Data Between Screens

```javascript
// From screen 1
navigation.navigate('ScreenName', { 
  id: item.id, 
  data: item 
});

// In screen 2
const { id, data } = route.params;
```

### Listen to Navigation Events

```javascript
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    // Screen came into focus - refresh data
    fetchData();
  });

  return unsubscribe;
}, [navigation]);
```

### Go Back with Data

```javascript
// From detail screen
navigation.navigate('List', { 
  refresh: true 
});

// In list screen
useEffect(() => {
  if (route.params?.refresh) {
    fetchData();
  }
}, [route.params?.refresh]);
```

## HTTP Requests

### GET Request

```javascript
const fetchData = async () => {
  try {
    const response = await apiService.getData(params);
    setData(response);
  } catch (error) {
    setError(error.message);
  }
};
```

### POST Request

```javascript
const submitForm = async (formData) => {
  try {
    const response = await apiService.createData(formData);
    console.log('Created:', response);
  } catch (error) {
    Alert.alert('Error', error.error);
  }
};
```

### With Loading State

```javascript
const fetchWithLoading = async () => {
  try {
    setLoading(true);
    const response = await apiService.getData();
    setData(response);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};
```

## Debugging

### Console Logging

```javascript
console.log('Simple log:', value);
console.warn('Warning:', value);
console.error('Error:', error);
```

### React Native Debugger

```bash
# Install
npm install -g react-native-debugger

# Run a simulator/emulator first, then:
react-native-debugger
```

### Network Inspection

Monitor API calls in React Native Debugger:
1. Open React Native Debugger
2. Navigate to Network tab
3. Perform actions in app
4. View request/response

### State Inspector

Debug state changes in React Native Debugger:
1. Open Debugger
2. Navigate to Redux/State tab
3. Watch state updates in real-time

## Common Issues & Solutions

### API Connection Error

**Problem**: `Network Error` or `Cannot connect to server`

**Solution**:
```javascript
// Check API URL
const API_BASE_URL = 'http://10.0.2.2:3001'; // Android emulator
// or
const API_BASE_URL = 'http://localhost:3001'; // Physical device on same network
```

### AsyncStorage Error

**Problem**: `AsyncStorage is not available`

**Solution**: AsyncStorage only works with physical devices/emulators, not web unless you install `@react-native-async-storage/async-storage`

### Token Expiration

**Problem**: `401 Unauthorized` after some time

**Solution**:
```javascript
// Implement token refresh in interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);
```

### Performance Issues

**Problem**: Slow list scrolling or UI lag

**Solution**:
```javascript
// Use FlatList with optimization
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

### Memory Leaks

**Problem**: App crashes after several navigation cycles

**Solution**:
```javascript
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    const response = await apiService.getData();
    if (isMounted) {
      setData(response);
    }
  };

  fetchData();

  return () => {
    isMounted = false; // Cleanup
  };
}, []);
```

## Code Style Guidelines

### Naming Conventions

```javascript
// Components
export default function PropertyCard() {}

// Functions
const handlePropertyPress = (property) => {};
const fetchProperties = async () => {};

// Variables
const propertyList = [];
const isLoading = false;
const MAX_ITEMS = 100;

// Files
screens/PropertyDetailScreen.js
services/apiService.js
utils/validation.js
```

### Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ComponentName({ navigation, route }) {
  // 1. State
  const [state, setState] = useState();

  // 2. Effects
  useEffect(() => {
    // Initialize
  }, []);

  // 3. Handlers
  const handleAction = () => {
    // Handle
  };

  // 4. Render
  return (
    <View style={styles.container}>
      {/* Content */}
    </View>
  );
}

// Styles at bottom
const styles = StyleSheet.create({
  container: {}
});
```

### Error Handling

```javascript
try {
  const result = await apiService.action();
  // Success handling
} catch (error) {
  // Specific error handling
  if (error.response?.status === 400) {
    // Validation error
  } else if (error.response?.status === 401) {
    // Authentication error
  } else {
    // Generic error
    Alert.alert('Error', error.message);
  }
}
```

## Testing Guide

### Manual Testing Checklist

- [ ] Authentication (login, register)
- [ ] Property search and filtering
- [ ] Adding/removing favorites
- [ ] Booking tours
- [ ] Profile management
- [ ] Logout
- [ ] Network errors handling
- [ ] Offline behavior (if applicable)
- [ ] Loading states
- [ ] Navigation flows

### Test Scenarios

1. **Happy Path**: Normal user flow with valid data
2. **Error Handling**: Invalid inputs, network errors
3. **Edge Cases**: Empty lists, large datasets
4. **Performance**: Slow network, large lists
5. **Security**: Token expiration, unauthorized access

## Useful Tools & Extensions

### VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- React Native Tools
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)

### Command Line Tools

```bash
# Check app version
cat package.json | grep version

# List installed packages
npm list --depth=0

# Check for outdated packages
npm outdated

# Update packages
npm update

# Clean cache
npm cache clean --force
```

## Performance Tips

### 1. Lazy Load Heavy Components

```javascript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### 2. Optimize Renders

```javascript
const MemoizedComponent = React.memo(Component);
```

### 3. Use FlatList for Long Lists

```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
/>
// NOT:
<ScrollView>
  {items.map(item => <Item key={item.id} />)}
</ScrollView>
```

### 4. Debounce Search

```javascript
const debouncedSearch = debounce(handleSearch, 500);
```

## Resources

- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Axios Documentation](https://axios-http.com)
- [React Hooks](https://react.dev/reference/react/hooks)

## Quick Reference Commands

```bash
# Start development
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run web
npm run web

# Run tests
npm test

# Reset metro cache
npm start -- --reset-cache

# Check for errors
npm run lint

# Build for production (Android)
cd android && ./gradlew bundleRelease

# Build for production (iOS)
xcodebuild -workspace ios/App.xcworkspace -scheme App
```

## Tips & Tricks

### Hot Reload

Press `R` twice in terminal running `npm start` to reload the app

### Debug Menu

Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open debug menu

### Network Inspector

Use React Native Debugger to inspect all network requests

### Performance Monitor

Enable Performance Monitor to check FPS and memory usage

## Future Learning

- Advanced state management (Redux, Zustand)
- Offline-first architecture
- Real-time updates (WebSocket, Firebase)
- Payment integration
- Push notifications
- Advanced animations
- Native modules
- App Store/Play Store deployment

Good luck with development! 🚀
