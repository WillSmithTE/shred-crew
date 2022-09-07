import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, Alert, Linking, KeyboardAvoidingView } from 'react-native';

import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userReducer';
import { RootStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { header, subHeader } from '../services/styles';
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  IMessage,
  Send,
  SendProps,
} from 'react-native-gifted-chat'
import AccessoryBar from '../components/messages/AccessoryBar'
import CustomActions from '../components/messages/CustomActions'
import CustomView from '../components/messages/CustomView'
import messagesData from '../components/messages/data/messages'
import earlierMessages from '../components/messages/data/earlierMessages'
import Icon from '../components/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-paper';
import { BackButton } from '../components/BackButton';
import { MyAvatar } from '../components/MyAvatar';

const user = {
  _id: 1,
  name: 'Developer',
}

type Props = NativeStackScreenProps<RootStackParams, 'MessagesToOnePerson'> & {

};
export const MessagesToOnePerson = ({ route: { params: { otherUser } } }: Props) => {
  const dispatch = useDispatch()
  // const user = useSelector((state: RootState) => state.user.user)
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loadEarlier, setLoadEarlier] = useState(true)
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // init with only system messages
    setMessages(messagesData) // messagesData.filter(message => message.system),
    setIsLoaded(true)
  }, [])

  const onLoadEarlier = () => {
    setIsLoadingEarlier(true)

    setTimeout(() => {
      setMessages(messages.concat(earlierMessages()))
      setLoadEarlier(true)
      setIsLoadingEarlier(false)
    }, 1500)
  }

  const onSend = (newMessages: IMessage[] = []) => {
    setMessages([newMessages[0], ...messages])
  }

  const renderSend = (props: SendProps<IMessage>) => (
    <Send {...props} containerStyle={{ justifyContent: 'center' }}>
      <Icon name='send' size={30} color={colors.orange} family='MaterialCommunityIcons' style={{ paddingRight: 10 }} />
    </Send>
  )
  return <>
    < SafeAreaView style={[styles.container]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.orange }}>
        <BackButton absolute={false} />
        <MyAvatar image={{ uri: otherUser.imageUri }} name={otherUser.name} style={{ marginRight: 13 }} />
        <Text style={[subHeader, { paddingTop: 0, }]}>{otherUser.name}</Text>
      </View>
      {isLoaded && <GiftedChat
        wrapInSafeArea={true}
        messages={messages}
        onSend={onSend}
        loadEarlier={loadEarlier}
        onLoadEarlier={onLoadEarlier}
        isLoadingEarlier={isLoadingEarlier}
        user={user}
        scrollToBottom
        onLongPressAvatar={user => alert(JSON.stringify(user))}
        keyboardShouldPersistTaps='never'
        renderSend={renderSend}
        isTyping={false}
        infiniteScroll
        renderBubble={(props) => <Bubble
          {...props} wrapperStyle={{ right: { backgroundColor: colors.primary } }} />}

      // minInputToolbarHeight={0}
      />}
      {
        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
      }
    </SafeAreaView>

  </>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    // justifyContent: 'flex-end',
    // alignItems: 'stretch',
  },
});

