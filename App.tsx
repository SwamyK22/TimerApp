import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { TimerProvider } from './src/context/TimerContext';

export default function App() {
  return (
    <TimerProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TimerProvider>
  );
}
