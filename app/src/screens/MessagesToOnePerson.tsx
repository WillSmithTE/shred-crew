import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';

import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { subHeader } from '../services/styles';
import {
  Bubble,
  GiftedChat,
  IMessage,
  Send,
  SendProps,
} from 'react-native-gifted-chat'
import Icon from '../components/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { MyAvatar } from '../components/MyAvatar';
import { tryCatchAsync } from '../util/tryCatchAsync';
import { useConversationApi } from '../api/conversationApi';
import { messageToIMessage } from '../model/frontendTypes';
import { MarkReadRequest, SendMessageRequest } from '../model/types';

const useLoader = () => {
  const conversationApi = useConversationApi()
  return {
    getMessages: async function (conversationId: string, beforeTime?: number): Promise<IMessage[]> {
      console.debug({ conversationId, beforeTime })
      return (await conversationApi.getMessages({ conversationId, beforeTime }))
        .map(messageToIMessage)
    },
    sendMessage: async function (request: SendMessageRequest): Promise<IMessage> {
      return messageToIMessage(
        await conversationApi.sendMessage(request)
      )
    },
    markAsRead: async function (request: MarkReadRequest): Promise<void> {
      await conversationApi.markAsRead(request)
    },
  }
}
type Props = NativeStackScreenProps<RootStackParams, 'MessagesToOnePerson'> & {

};
export const MessagesToOnePerson = ({ route: { params: { conversation } } }: Props) => {
  console.debug({ conversation })
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)
  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loadEarlier, setLoadEarlier] = useState(true)
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const loader = useLoader()

  const getMoreMessages = useCallback((beforeTime?: number, lastly?: () => void) => {
    tryCatchAsync({
      getter: () => loader.getMessages(conversation.id, beforeTime),
      onSuccess: (newMessages) => {
        setMessages([...newMessages, ...messages])
      },
      lastly: () => {
        lastly && lastly()
      }
    })
  }, [messages, setIsLoaded, loader])

  useEffect(() => {
    getMoreMessages(undefined, () => setIsLoaded(true))
    if (conversation.message) loader.markAsRead({ conversationId: conversation.id, time: conversation.message.time })
  }, [])

  const onLoadEarlier = () => {
    if (messages.length > 0) {
      setIsLoadingEarlier(true)
      getMoreMessages(
        messages[messages.length - 1].createdAt.valueOf(),
        () => { setLoadEarlier(true); setLoadEarlier(false) }
      )
    }
  }

  const onSend = (newMessages: IMessage[] = []) => {
    tryCatchAsync({
      getter: () => loader.sendMessage({ conversationId: conversation.id, data: { text: newMessages[0].text } }),
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
        <BackButton absolute={false} onPress={goBack} />
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
        user={{ _id: user!!.userId, name: user?.name, avatar: user?.imageUri }}
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

