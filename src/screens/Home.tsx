import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import colors from '../constants/colors';
import { ListItem, ListSeparator } from '../components/List';
import { MainStackParams } from '../navigation/Main';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../services/authReducer';

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

export const Home = ({ navigation }: Props) => {
  const dispatch = useDispatch()
  return (
    <FlatList
      style={styles.container}
      data={screens}
      keyExtractor={item => item.title}
      renderItem={({ item }) => (
        <ListItem
          title={'Logout'}
          subtitle={'click me to logout :)'}
          onPress={() => dispatch(clearAuth())}
        />
      )}
      ItemSeparatorComponent={ListSeparator}
      ListHeaderComponent={ListSeparator}
      ListFooterComponent={ListSeparator}
    />
  );
};

type Props = {
  navigation: StackNavigationProp<MainStackParams, 'List'>;
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 20,
  },
});

