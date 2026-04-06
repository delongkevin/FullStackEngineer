import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import BudgetScreen from './screens/BudgetScreen';
import GoalsScreen from './screens/GoalsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (newUserId) => {
    setUserId(newUserId);
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginFlow">
            {(props) => (
              <LoginScreen {...props} onLogin={handleLogin} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: '#10B981',
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
            tabBarActiveTintColor: '#10B981',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            options={{
              title: 'My Finance',
              tabBarLabel: 'Dashboard',
            }}
          >
            {(props) => <DashboardScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Transactions"
            options={{
              title: 'Transactions',
              tabBarLabel: 'Transactions',
            }}
          >
            {(props) => <TransactionsScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Budget"
            options={{
              title: 'Budget',
              tabBarLabel: 'Budget',
            }}
          >
            {(props) => <BudgetScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Goals"
            options={{
              title: 'Goals',
              tabBarLabel: 'Goals',
            }}
          >
            {(props) => <GoalsScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Settings"
            options={{
              title: 'Settings',
              tabBarLabel: 'Settings',
            }}
          >
            {(props) => (
              <SettingsScreen
                {...props}
                userId={userId}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setUserId(null);
                }}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
