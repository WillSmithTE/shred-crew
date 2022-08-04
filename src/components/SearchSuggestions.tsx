import React, { useEffect } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Text } from 'react-native';

import {colors} from '../constants/colors';
import { ListItem } from './List';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth, logoutUser } from '../redux/userReducer';
import { MainStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';

export type SearchResult = {
  id: string, label: string
}

type Props = {
  items: SearchResult[]
};

export const SearchSuggestions = ({ items }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)
  const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParams>>()
  const logout = () => {
    dispatch(logoutUser())
  }
  return (
    <></>
    // <FlatList
    //   style={styles.container}
    //   data={items}
    //   keyExtractor={item => item.id}
    //   renderItem={({ item }) => (
    //     <SearchItem
    //       label={item.label}
    //       id={item.id}
    //       key={item.id}
    //       onPress={logout}
    //     />
    //   )}
    //   ItemSeparatorComponent={ListSeparator}
    //   ListHeaderComponent={ListSeparator}
    //   ListFooterComponent={ListSeparator} />
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'black',
    // paddingVertical: 20,
  },
});


type ListItemProps = {
  label: string;
  id: string;
  onPress: () => void;
};

export const SearchItem = ({
  label,
  id,
  onPress = () => null,
}: ListItemProps) => {
  const rowStyles = [itemStyles.row];

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={rowStyles}>
        <Text style={[itemStyles.itemText]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ListSeparator = () => <View style={itemStyles.separator} />;

const itemStyles = StyleSheet.create({
  row: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'silver',
    // backgroundColor: 'black',
    // color: 'white',
  },
  itemText: {
    // color: 'white',
    // fontWeight: 'bold',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});

