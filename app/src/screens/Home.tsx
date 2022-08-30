import React, { } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userReducer';
import { RootTabParamList } from '../navigation/Navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { Avatar, IconButton } from 'react-native-paper';
import { showComingSoon } from '../components/Error';
import Icon from '../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { header } from '../services/styles';

const friends = [
  {
    id: '3',
    name: 'Will Smith',
    imageUri: require('../../assets/peopleFeed2.png'),
  },
  {
    id: '4',
    name: 'Pip Kramer',
    imageUri: require('../../assets/peopleFeed3.png'),
  },
  { id: undefined, name: '', imageUri: '' }, { id: undefined, name: '', imageUri: '' }, { id: undefined, name: '', imageUri: '' }, { id: undefined, name: '', imageUri: '' }
]

type Props = NativeStackScreenProps<RootTabParamList, 'Home'> & {
};
export const Home = ({ route: { params } }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)
  const { navigate } = useNavigation()
  const logout = () => {
    dispatch(logoutUser())
  }
  const avatarSize = 75
  return (
    <>
      {/* <MyImageBackground /> */}
      < View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 }}>
        < View style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={header}>Welcome</Text>
          <IconButton icon='cog-outline' color='black' onPress={() => navigate('Settings')} />
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ flexGrow: 0, paddingTop: 5, marginBottom: 25 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', }}>
            {friends.map((friend, i) =>
              <LinearGradient
                colors={friend.id === undefined ? [colors.background, colors.background, colors.background] : ['#7ED6F2', '#EFF17F', '#FFAC3E', '#F4AB74', '#FFA768']}
                style={[{ marginRight: 4, borderRadius: avatarSize, padding: 3, }]} key={i}
              >
                <TouchableOpacity onPress={showComingSoon} activeOpacity={.2}>
                  <View style={{ backgroundColor: colors.background, padding: 3, borderRadius: avatarSize }}>
                    {friend.id ? <Avatar.Image size={avatarSize} source={friend.imageUri} /> : <Avatar.Text size={avatarSize} label='' style={{ backgroundColor: colors.lightGray }} />}
                  </View>
                </TouchableOpacity>
              </LinearGradient>)}
          </View>
        </ScrollView>
        <WideButton text='Find a Shred Crew' onPress={() => navigate('PeopleFeed')} icon={{ family: 'FontAwesome5', name: 'user-friends' }} />
        <WideButton text='Group Events' onPress={showComingSoon} icon={{ family: 'FontAwesome5', name: 'calendar' }} />
        <WideButton text='Search for mountain info' onPress={showComingSoon} icon={{ family: 'FontAwesome5', name: 'mountain' }} />
        <TouchableOpacity style={[styles.button, {
          alignSelf: 'flex-start',
          backgroundColor: colors.grayBackground, justifyContent: 'flex-end', alignItems: 'flex-start',
          marginTop: 5, height: 130, width: 130, flexDirection: 'column', padding: 20,
        }]} onPress={() => navigate('EditProfile')}>
          <Icon family='FontAwesome5' name='user' />
          <Text style={{ paddingTop: 10 }}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </>)
};

type WideButtonProps = {
  onPress: () => void,
  icon: { family: string, name: string },
  text: string,
}
const WideButton = ({ onPress, icon, text }: WideButtonProps) => {
  return <TouchableOpacity style={styles.button} onPress={onPress} >
    <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingHorizontal: 20, }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 16, }}>
        <Icon family={icon.family as any} name={icon.name} size={15} style={{ marginRight: 10 }} />
        <Text >{text}</Text>
      </View>
      <Icon family='FontAwesome' name='long-arrow-right' size={15} />
    </View>
  </TouchableOpacity >

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 20,
  },
  button: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: colors.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    // padding: 10,
    minWidth: 50,
    // backgroundColor: 'green',
  },
});

