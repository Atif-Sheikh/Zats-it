import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './components/Home';
import Chat from './components/Chat';
import Meeting from './components/Meeting';
import Room from './components/Room';

const Stack = createStackNavigator();

console.disableYellowBox = true;

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Meeting" component={Meeting} />
        <Stack.Screen name="Room" component={Room} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
