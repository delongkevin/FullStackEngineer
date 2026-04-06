import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SearchScreen from './screens/SearchScreen';
import PropertyListScreen from './screens/PropertyListScreen';
import PropertyDetailScreen from './screens/PropertyDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import BookingsScreen from './screens/BookingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoriteDetailScreen from './screens/FavoriteDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SearchTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SearchListing" 
        component={SearchScreen}
        options={{ title: 'Search Properties' }}
      />
      <Stack.Screen 
        name="PropertyList" 
        component={PropertyListScreen}
        options={({ route }) => ({
          title: route.params?.title || 'Properties',
          headerBackTitle: 'Back'
        })}
      />
      <Stack.Screen 
        name="PropertyDetail" 
        component={PropertyDetailScreen}
        options={{ title: 'Property Details', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}

function FavoritesTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FavoritesList" 
        component={FavoritesScreen}
        options={{ title: 'Saved Properties' }}
      />
      <Stack.Screen 
        name="FavoriteDetail" 
        component={FavoriteDetailScreen}
        options={{ title: 'Property Details', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}

function BookingsTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BookingsList" 
        component={BookingsScreen}
        options={{ title: 'My Tours' }}
      />
    </Stack.Navigator>
  );
}

function ProfileTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileView" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: '',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: '#059669' },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        }
      })}
    >
      <Tab.Screen 
        name="SearchTab" 
        component={SearchTabNavigator}
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          )
        }}
      />
      
      <Tab.Screen 
        name="FavoritesTab" 
        component={FavoritesTabNavigator}
        options={{
          title: 'Saved',
          tabBarLabel: 'Saved',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          )
        }}
      />
      
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingsTabNavigator}
        options={{
          title: 'Tours',
          tabBarLabel: 'Tours',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          )
        }}
      />
      
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileTabNavigator}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [state, dispatch] = useState({
    isLoading: true,
    isSignout: false,
    userToken: null,
    userId: null
  });

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      dispatch({
        isLoading: false,
        isSignout: false,
        userToken: token,
        userId: userId
      });
    } catch (e) {
      dispatch({
        isLoading: false,
        isSignout: false,
        userToken: null,
        userId: null
      });
    }
  };

  const authContext = {
    signIn: async (credentials) => {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/login', {
          email: credentials.email,
          password: credentials.password
        });
        
        const { token, userId } = response.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', userId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({
          isLoading: false,
          isSignout: false,
          userToken: token,
          userId: userId
        });
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Login failed' };
      }
    },
    
    signUp: async (credentials) => {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/register', {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          phone: credentials.phone
        });
        
        const { token, userId } = response.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', userId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({
          isLoading: false,
          isSignout: false,
          userToken: token,
          userId: userId
        });
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Registration failed' };
      }
    },
    
    signOut: async () => {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      delete axios.defaults.headers.common['Authorization'];
      
      dispatch({
        isLoading: false,
        isSignout: true,
        userToken: null,
        userId: null
      });
    }
  };

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state.userToken == null ? (
        <AuthStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
}
