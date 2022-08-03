import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Navigation } from './navigation/Navigation';
import { Provider } from 'react-redux';
import { store } from './redux/reduxStore';
import FlashMessage from "react-native-flash-message";
import * as SplashScreen from 'expo-splash-screen'
import { useUserLoginCheck } from './services/useUserLoginCheck';
import { View } from 'react-native';
import { DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <AppInternals />
        </PaperProvider>
      </Provider>
    </>
  );
}

const AppInternals = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const isUserLoginCheckComplete = useUserLoginCheck()

  useMemo(() => {
    (async () => {
      if (isUserLoginCheckComplete) {
        await new Promise(r => setTimeout(r, 100)) // wait for dispatches
        setAppIsReady(true);
      }
    })()
  }, [isUserLoginCheckComplete]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return <>
    <View style={{ flex: 1, }} onLayout={onLayoutRootView}>
      <NavigationContainer theme={DefaultTheme}>
        <Navigation />
      </NavigationContainer>
      <FlashMessage position='bottom' duration={3000} style={{ alignItems: 'center' }} />
    </View>
  </>
}

const theme = {
  ...PaperDefaultTheme,
  // roundness: 2,
  // version: 3,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#2CBBE9',
    secondary: '#7ED6F2',
    // tertiary: '#a1b2c3'
  },
};
