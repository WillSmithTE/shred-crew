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
    getConversations: async () => {
      return await conversationApi.getConversations()
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
      getter: loader.getConversations,
      onSuccess: (result) => dispatch(setConversations(result)),
      lastly: () => setIsRefreshing(false),
    })
  }

  return <>
    < SafeAreaView style={[styles.container]}>
      <View style={{}}><Text style={[header, { marginBottom: 20, }]}>Messages</Text></View>
      <FlatList
        style={{}}
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => push('MessagesToOnePerson', { conversation: item })} style={styles.row}>
            <MyAvatar image={{ uri: item.img }} name={item.name} />
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={[styles.rowTitleText]}>{item.name}</Text>
              {item.message &&
                <Text>{item.message.user === user?.userId ? 'You' : item.name?.split(' ')[0]}:&nbsp;
                  {item.message.data.text}</Text>
              }
            </View>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitleText: {
    fontWeight: 'bold',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});

