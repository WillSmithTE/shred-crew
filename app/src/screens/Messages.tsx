import React, {  } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userReducer';
import { RootStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { header } from '../services/styles';


type Props = {

};
export const Messages = ({ }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const logout = () => {
    dispatch(logoutUser())
  }
  return <>
    < View style={[styles.container, { flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 }]}>
      <Text style={header}>Messages</Text>
    </View>
  </>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 20,
  },
});

