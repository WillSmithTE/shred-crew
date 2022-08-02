import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Navigation } from './navigation/Navigation';
import { Provider } from 'react-redux';
import { store } from './services/reduxStore';
import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer theme={DarkTheme}>
          <Navigation />
        </NavigationContainer>
        <FlashMessage position='bottom' duration={3000} style={{alignItems: 'center'}}/>
      </Provider>
    </>
  );
}
