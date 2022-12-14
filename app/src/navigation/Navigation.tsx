import React from 'react';
import { Home } from '../screens/Home';
import { TextDemo, ButtonDemo, FormDemo } from '../screens/Demos';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Login } from '../screens/Login';
import { LoginEmail } from '../screens/LoginEmail';
import { Register } from '../screens/Register';
import { RegisterEmail } from '../screens/RegisterEmail';
import { CreateProfile } from '../screens/CreateProfile';
import { GetStarted } from '../screens/GetStarted';
import { LocationFinder } from '../components/LocationFinder';
import { Profile } from '../screens/Profile';
import { EditProfile } from '../screens/EditProfile';
import { PeopleFeed } from '../screens/PeopleFeed';
import { BaseUserProfile, Conversation, Place } from '../model/types';
import Settings from '../screens/Settings';
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import Icon, { IC } from '../components/Icon';
import { ConversationsList } from '../screens/ConversationsList';
import { MessagesToOnePerson } from '../screens/MessagesToOnePerson';
import ResortInfoSearch from '../screens/ResortInfoSearch';

export type RootStackParams = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined
  Register: undefined;
  RegisterEmail: undefined;
  Login: undefined;
  LoginEmail: undefined;
  CreateProfile: undefined
  GetStarted: undefined
  LocationFinder: undefined
  EditProfile: undefined
  Settings: undefined
  MessagesToOnePerson: { conversation: Conversation }
  ResortInfoSearch: undefined
};

const Stack = createNativeStackNavigator<RootStackParams>();

export const Navigation = () => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.loginState)
  const hasDoneInitialSetup = useSelector((state: RootState) => !!state.user.user?.hasDoneInitialSetup)
  const user = useSelector((state: RootState) => state.user)
  console.debug({ loginState: user.loginState })
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {
        isLoggedIn ?
          (hasDoneInitialSetup ? <>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            {/* <Stack.Screen name="Home" component={Home} /> */}
            <Stack.Screen name="LocationFinder" component={LocationFinder} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="MessagesToOnePerson" component={MessagesToOnePerson} />
          </> :
            <>
              <Stack.Screen name="GetStarted" component={GetStarted} />
              <Stack.Screen name="CreateProfile" component={CreateProfile} />
            </>
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

export type RootTabParamList = {
  Home?: { showOptions?: boolean };
  ConversationsList: undefined
  PeopleFeed?: { showFilters?: boolean }
  ResortInfoSearch: undefined
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParams>
>;

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const features = useSelector((state: RootState) => state.settings.features)

  return (
    <SafeAreaProvider>
      <BottomTab.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          tabBarActiveTintColor: colors.orange,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 2,
          }
        })}
      >
        <BottomTab.Screen
          name="Home"
          component={Home}
          options={({ navigation }: RootTabScreenProps<'Home'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="home" family='MaterialCommunityIcons' color={color} />,
          })}
        />
        <BottomTab.Screen
          name="PeopleFeed"
          component={PeopleFeed}
          options={({ navigation }: RootTabScreenProps<'PeopleFeed'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="user-friends" family='FontAwesome5' color={color} />,
          })}
        />
        <BottomTab.Screen
          name="ResortInfoSearch"
          component={ResortInfoSearch}
          options={({ navigation }: RootTabScreenProps<'ResortInfoSearch'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="mountain" family='FontAwesome5' color={color} />,
          })}
        />
        <BottomTab.Screen
          name="ConversationsList"
          component={ConversationsList}
          options={({ navigation }: RootTabScreenProps<'ConversationsList'>) => ({
            tabBarIcon: ({ color }) => <TabBarIcon name="message" family='MaterialCommunityIcons' color={color} />,
          })}
        />

      </BottomTab.Navigator>
    </SafeAreaProvider>
  );
}

function TabBarIcon(props: {
  name: string;
  color: string;
  family?: IC['family'];
}) {
  return <Icon family={props.family} props={{ size: 30, style: { marginBottom: 0, paddingTop: 5 }, ...props }} color={props.color} />;
}

