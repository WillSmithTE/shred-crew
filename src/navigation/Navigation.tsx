import React from 'react';
import { Home } from '../screens/Home';
import { TextDemo, ButtonDemo, FormDemo } from '../screens/Demos';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens/Login';
import { LoginEmail } from '../screens/LoginEmail';
import { Register } from '../screens/Register';
import { RegisterEmail } from '../screens/RegisterEmail';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Profile } from '../screens/Profile';

export type MainStackParams = {
  Home: undefined;
  Register: undefined;
  RegisterEmail: undefined;
  Login: undefined;
  LoginEmail: undefined;
  Profile: undefined
};

const Stack = createNativeStackNavigator<MainStackParams>();

export const Navigation = () => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.loginState)
  const hasDoneInitialSetup = useSelector((state: RootState) => !!state.user.user?.hasDoneInitialSetup)
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {
        isLoggedIn ?
          (hasDoneInitialSetup ? <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
          </> :
            <Stack.Screen name="Profile" component={Profile} />
          )
          :
          <>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="RegisterEmail" component={RegisterEmail} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="LoginEmail" component={LoginEmail} />
          </>
      }
    </Stack.Navigator>
  );
}