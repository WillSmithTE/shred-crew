import React, { useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import {colors} from '../constants/colors';
import { ListItem, ListSeparator } from '../components/List';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth, logoutUser } from '../redux/userReducer';
import { MainStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';

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

export const Home = ({ }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParams>>()
  const logout = () => {
    dispatch(logoutUser())
  }
  return (
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
  )
};

type Props = {
  // navigation: NativeStackNavigationProp<MainStackParams, 'Home'>;
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 20,
  },
});

