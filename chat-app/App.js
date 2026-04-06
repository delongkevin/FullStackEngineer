import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

import LoginScreen from './screens/LoginScreen';
import ChatsScreen from './screens/ChatsScreen';
import ChatScreen from './screens/ChatScreen';
import UsersScreen from './screens/UsersScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function ChatsTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChatsList" 
        component={ChatsScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.otherUserName || 'Chat',
          headerBackTitle: 'Back'
        })}
      />
    </Stack.Navigator>
  );
}

function UsersTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UsersList" 
        component={UsersScreen}
        options={{ title: 'New Chat' }}
      />
      <Stack.Screen 
        name="UserChat" 
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.otherUserName || 'Chat',
          headerBackTitle: 'Back'
        })}
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
    </Stack.Navigator>
  );
}

function AppStack({ userId, token, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#2563eb',
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
        name="ChatsTab" 
        component={ChatsTabNavigator}
        options={{
          title: 'Chats',
          tabBarLabel: 'Chats',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
          )
        }}
      />
      
      <Tab.Screen 
        name="UsersTab" 
        component={UsersTabNavigator}
        options={{
          title: 'Users',
          tabBarLabel: 'Users',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
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
          tabBarIcon: ({ color, size }) => (
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
        const response = await axios.post('http://localhost:3000/api/auth/login', {
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
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          name: credentials.name,
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
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state.userToken == null ? (
        <AuthStack />
      ) : (
        <AppStack 
          userId={state.userId} 
          token={state.userToken}
          onLogout={authContext.signOut}
        />
      )}
    </NavigationContainer>
  );
}
