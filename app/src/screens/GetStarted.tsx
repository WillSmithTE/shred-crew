import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { RootStackParams } from '../navigation/Navigation';
import { logoutUser } from '../redux/userReducer';

export const GetStarted = ({ }: Props) => {
  const dispatch = useDispatch()
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const onNextPress = () => {
    navigate('CreateProfile')
  }

  return <>
    <View style={styles.container}>
      <Text style={styles.header}>Congrats for making today a shred day!</Text>
      <Image style={styles.skiierImg} resizeMode={'contain'} source={require('../../assets/skier.jpg')} />
      <View><Button onPress={onNextPress} style={{ width: '60%', alignSelf: 'center', position: 'absolute', top: -40 }} mode='contained'>Let's Get Started</Button></View>
      <Button onPress={() => dispatch(logoutUser())} style={{ opacity: .01, height: 2 }}><Text>logout</Text></Button>
    </View>
  </>
};

type Props = {
};


const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
  },
  container: {
    flex: 1,
    paddingVertical: 50,
  },
  header: {
    // color: 'white',
    paddingHorizontal: '2%',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  skiierImg: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain'

    // height: 500
  },
  nextButton: {
  },
  subHeader: { fontSize: 16, paddingTop: 15, fontWeight: 'bold' },
});
