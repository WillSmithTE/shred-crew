import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';

import { colors } from '../constants/colors';
import { ListItem, ListSeparator } from '../components/List';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth, logoutUser } from '../redux/userReducer';
import { RootStackParams, RootTabParamList } from '../navigation/Navigation';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Button, IconButton } from 'react-native-paper';
import { MyImageBackground } from '../components/MyImageBackground';
import { showComingSoon } from '../components/Error';
import { LocationFinder } from '../components/LocationFinder';
import Icon from '../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
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

