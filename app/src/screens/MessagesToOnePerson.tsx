import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { tryCatchAsync } from '../util/tryCatchAsync';
import { useConversationApi } from '../api/conversationApi';

const user = {
  _id: 1,
  name: 'Developer',
}

const useLoader = () => {
  const conversationApi = useConversationApi()
  return {
    getMessages: async function (conversationId: string, aftertime?: number): Promise<IMessage[]> {
      return await conversationApi.getMessages(conversationId, aftertime)
    },
    sendMessage: async function (message: IMessage): Promise<IMessage> {
      return await conversationApi.sendMessage(message)
    },
  }
}
type Props = NativeStackScreenProps<RootStackParams, 'MessagesToOnePerson'> & {

};
export const MessagesToOnePerson = ({ route: { params: { conversation } } }: Props) => {
  const dispatch = useDispatch()
  // const user = useSelector((state: RootState) => state.user.user)
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loadEarlier, setLoadEarlier] = useState(true)
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const loader = useLoader()

  const getMoreMessages = useCallback((afterTime?: number, lastly?: () => void) => {
    tryCatchAsync({
      getter: () => loader.getMessages(conversation.id, afterTime),
      onSuccess: (newMessages) => {
        setMessages([...newMessages, ...messages])
      },
      lastly: () => {
        setIsLoaded(true)
        lastly && lastly()
      }
    })
  }, [messages, setIsLoaded, loader])

  useEffect(() => {
    getMoreMessages()
  }, [])

  const onLoadEarlier = () => {
    setIsLoadingEarlier(true)
    getMoreMessages(messages[messages.length - 1].createdAt.valueOf(), () => { setLoadEarlier(true); setLoadEarlier(false) })
  }

  const onSend = (newMessages: IMessage[] = []) => {
    tryCatchAsync({
      getter: () => loader.sendMessage(newMessages[0]),
      onSuccess: (message) => setMessages([message, ...messages]),
    })
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
        <MyAvatar image={{ uri: conversation.img }} name={conversation.name} style={{ marginRight: 13 }} />
        <Text style={[subHeader, { paddingTop: 0, }]}>{conversation.name}</Text>
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

