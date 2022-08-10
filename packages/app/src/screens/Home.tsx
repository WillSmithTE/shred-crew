import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';

import { colors } from '../constants/colors';
import { ListItem, ListSeparator } from '../components/List';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth, logoutUser } from '../redux/userReducer';
import { MainStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { MyImageBackground } from '../components/MyImageBackground';
import { showComingSoon } from '../components/Error';
import { LocationFinder } from '../components/LocationFinder';

const screens = [
  {
    title: 'Text',
    subtitle: 'An example of using the Text.js components.',
    target: 'TextDemo',
  },
  {
    title: 'Form',
    subtitle: 'An example of using the Form.js components.',
    target: 'FormDemo',
  },
  {
    title: 'Button',
    subtitle: 'An example of using the Button.js components.',
    target: 'ButtonDemo',
  },
];

type Props = NativeStackScreenProps<MainStackParams, 'Home'> & {
};
export const Home = ({ route: { params } }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParams>>()
  const logout = () => {
    dispatch(logoutUser())
  }
  return (<>
    {params?.showOptions === undefined || params?.showOptions === true ?
      <>
        <MyImageBackground />
        < View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button style={styles.button} mode='contained' onPress={() => navigate('LocationFinder')}>I'm on the mountain now</Button>
          <Button style={styles.button} mode='contained' onPress={showComingSoon}>I'm planning a trip</Button>
        </View>
      </> :
      <FlatList
        style={styles.container}
        data={screens}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <ListItem
            title={'Logout'}
            subtitle={'click me to logout :)'}
            onPress={logout}
          />
        )}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={ListSeparator}
        ListFooterComponent={ListSeparator} />
    }
  </>)
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 20,
  },
  button: {
    width: '80%',
    marginVertical: 10,
  }
});

