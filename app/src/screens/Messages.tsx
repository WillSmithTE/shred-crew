import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, Alert, Linking } from 'react-native';

import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userReducer';
import { RootStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { header } from '../services/styles';
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

const filterBotMessages = (message: any) =>
  !message.system && message.user && message.user._id && message.user._id === 2
const findStep = (step: any) => (message: any) => message._id === step

const user = {
  _id: 1,
  name: 'Developer',
}

const otherUser = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://facebook.github.io/react/img/logo_og.png',
}

type Props = {

};
export const Messages = ({ }: Props) => {
  const dispatch = useDispatch()
  // const user = useSelector((state: RootState) => state.user.user)
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const logout = () => {
    dispatch(logoutUser())
  }
  const [inverted, setInverted] = useState(false)
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loadEarlier, setLoadEarlier] = useState(true)
  const [typingText, setTypingText] = useState(null)
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false)
  const [appIsReady, setAppIsReady] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // init with only system messages
    setMessages(messagesData) // messagesData.filter(message => message.system),
    setAppIsReady(true)
    setIsTyping(false)
  }, [])

  const onLoadEarlier = () => {
    setIsLoadingEarlier(true)

    setTimeout(() => {
      setMessages(GiftedChat.prepend(
        messages,
        earlierMessages() as IMessage[],
        Platform.OS !== 'web',
      ) as any)
      setLoadEarlier(true)
      setIsLoadingEarlier(false)
      // if (this._isMounted === true) {
      // }
    }, 1500) // simulating network
  }

  const onSend = (messages = []) => {
    const sentMessages = [{ ...(messages[0] as {}), sent: true, received: true }]
    setMessages(GiftedChat.append(
      messages,
      sentMessages as any,
      Platform.OS !== 'web',
    ) as any)
    setStep(step + 1)
    // for demo purpose
    setTimeout(() => botSend(step), Math.round(Math.random() * 1000))
  }

  const botSend = (step = 0) => {
    const newMessage = (messagesData as IMessage[])
      .reverse()
      .filter(filterBotMessages)
      .find(findStep(step))
    if (newMessage) {
      setMessages(GiftedChat.append(
        messages,
        [newMessage],
        Platform.OS !== 'web'
      ))
    }
  }

  const parsePatterns = (_linkStyle: any) => {
    return [
      {
        pattern: /#(\w+)/,
        style: { textDecorationLine: 'underline', color: 'darkorange' },
        onPress: () => Linking.openURL('http://gifted.chat'),
      },
    ]
  }

  function renderCustomView(props: any) {
    return <CustomView {...props} />
  }

  const onReceive = (text: string) => {
    setMessages(GiftedChat.append(
      messages as any,
      [
        {
          _id: Math.round(Math.random() * 1000000),
          text,
          createdAt: new Date(),
          user: otherUser,
        },
      ],
      Platform.OS !== 'web',
    ))
  }

  const onSendFromUser = (messages: IMessage[] = []) => {
    const createdAt = new Date()
    const messagesToUpload = messages.map(message => ({
      ...message,
      user,
      createdAt,
      _id: Math.round(Math.random() * 1000000),
    }))
    onSend(messagesToUpload)
  }

  const changeIsTyping = () => {
    setIsTyping(!isTyping)
  }

  const renderAccessory = () => (
    <AccessoryBar onSend={onSendFromUser} isTyping={changeIsTyping} />
  )

  const renderCustomActions = (props: any) =>
    Platform.OS === 'web' ? null : (
      <CustomActions {...props} onSend={onSendFromUser} />
    )

  const renderBubble = (props: any) => {
    return <Bubble {...props} />
  }

  const renderSystemMessage = (props: any) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    )
  }

  const onQuickReply = (replies: any) => {
    const createdAt = new Date()
    if (replies.length === 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies[0].title,
          user,
        },
      ])
    } else if (replies.length > 1) {
      onSend([
        {
          createdAt,
          _id: Math.round(Math.random() * 1000000),
          text: replies.map(reply => reply.title).join(', '),
          user,
        },
      ])
    } else {
      console.warn('replies param is not set correctly')
    }
  }

  const renderQuickReplySend = () => <Text>{' custom send =>'}</Text>

  const renderSend = (props: SendProps<IMessage>) => (
    <Send {...props} containerStyle={{ justifyContent: 'center' }}>
      <Icon name='send' size={30} color='tomato' family='MaterialCommunityIcons' />
    </Send>
  )


  return <>
    < View style={[styles.container]}>
      <Text style={header}>Messages</Text>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        loadEarlier={loadEarlier}
        onLoadEarlier={onLoadEarlier}
        isLoadingEarlier={isLoadingEarlier}
        parsePatterns={parsePatterns}
        user={user}
        scrollToBottom
        onLongPressAvatar={user => alert(JSON.stringify(user))}
        onPressAvatar={() => alert('short press')}
        onPress={() => {
          Alert.alert('Bubble pressed')
        }}
        keyboardShouldPersistTaps='never'
        renderSystemMessage={renderSystemMessage}
        renderSend={renderSend}
        inverted={Platform.OS !== 'web'}
        timeTextStyle={{ left: { color: 'red' }, right: { color: 'yellow' } }}
        isTyping={isTyping}
        infiniteScroll
      />

    </View>
  </>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    // paddingVertical: 20,
  },
});

