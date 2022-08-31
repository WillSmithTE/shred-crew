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
import { colors } from './constants/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

SplashScreen.preventAutoHideAsync();
Sentry.init({
  dsn: Constants.manifest?.extra!!.sentryDsn,
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

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
  const [fontsLoaded] = useFonts({
    'Baloo-Bhaijaan': require('../assets/BalooBhaijaan-Regular.ttf'),
  });

  useMemo(() => {
    (async () => {
      if (isUserLoginCheckComplete && fontsLoaded) {
        await new Promise(r => setTimeout(r, 100)) // wait for dispatches
        setAppIsReady(true);
      }
    })()
  }, [isUserLoginCheckComplete, fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return <>
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer theme={DefaultTheme}>
        <Navigation />
      </NavigationContainer>
      <FlashMessage position='bottom' duration={3000} style={{ alignItems: 'center' }} />
    </GestureHandlerRootView>
  </>
}

const theme = {
  ...PaperDefaultTheme,
  // roundness: 2,
  // version: 3,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    // tertiary: '#a1b2c3'
  },
};
