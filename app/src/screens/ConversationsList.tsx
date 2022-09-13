import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { header } from '../services/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListSeparator } from '../components/List';
import { MyAvatar } from '../components/MyAvatar';
import { useConversationApi } from '../api/conversationApi';
import { tryCatchAsync } from '../util/tryCatchAsync';
import { setConversations } from '../redux/userReducer';

function useLoader() {
  const conversationApi = useConversationApi()
  return {
    getConversationsAndMatches: async () => {
      return await conversationApi.getConversationsAndMatches()
    }
  }
}
type Props = {

};
export const ConversationsList = ({ }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)
  const conversations = useSelector((state: RootState) => state.user.conversations)
  const { navigate, push } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const loader = useLoader()

  const onRefresh = async () => {
    setIsRefreshing(true)
    tryCatchAsync({
      getter: loader.getConversationsAndMatches,
      onSuccess: (result) => dispatch(setConversations(result)),
      lastly: () => setIsRefreshing(false),
    })
  }
  console.debug({ conversations })
  return <>
    < SafeAreaView style={[styles.container]}>
      <View style={{}}><Text style={[header, { marginBottom: 20, }]}>Messages</Text></View>
      <FlatList
        style={{}}
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isRead = item.message?.read[user!!.userId] === true || item.message?.user === user?.userId
          return <TouchableOpacity onPress={() => push('MessagesToOnePerson', { conversation: item })} style={styles.row}>
            <MyAvatar image={{ uri: item.img }} name={item.name} />
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={[styles.rowTitleText, !isRead && styles.unreadText]}>{item.name}</Text>
              {item.message ?
                <Text style={!isRead && styles.unreadText}>{item.message.user === user?.userId ? 'You' : item.name?.split(' ')[0]}:&nbsp;
                  {item.message.data.text}</Text> :
                <Text>No messages (yet 😏)</Text>
              }
            </View>
          </TouchableOpacity>
        }}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={ListSeparator}
        ListFooterComponent={ListSeparator}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />

    </SafeAreaView>

  </>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.background,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  row: {
    // paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitleText: {
    fontWeight: '500',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  unreadText: {
    fontWeight: '800',
  }
});

