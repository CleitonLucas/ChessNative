import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import QueueScreen from '../screens/QueueScreen';
import GameScreen from '../screens/GameScreen'; 
import AboutScreen from '../screens/AboutScreen';

export type RootStackParamList = {
  Home: undefined;
  Queue: { mode: string };
  Game: { mode: string };
  About: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Queue" component={QueueScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
