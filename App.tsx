/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';


import { TimerProvider } from './src/context/TimerContext';
import AppNavigator from './src/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';


function App(): React.JSX.Element {

  return (
    <TimerProvider>
      <NavigationContainer>
      <AppNavigator />
      </NavigationContainer>
    </TimerProvider>
  );
}


export default App;
