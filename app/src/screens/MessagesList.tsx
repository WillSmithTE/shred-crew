import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../redux/reduxStore';
import { useNavigation } from '@react-navigation/native';
import { header } from '../services/styles';
import {
  IMessage,
} from 'react-native-gifted-chat'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListSeparator } from '../components/List';
import { MyAvatar } from '../components/MyAvatar';
import { fromMessageUser } from '../model/frontendTypes';
import { photoPip, photoWill } from '../model/dummyData';
import { Friend } from '../model/types';

type Props = {

};
export const MessagesList = ({ }: Props) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)
  const { navigate, push } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }
  const friendsList = useMemo(() => {
    return Object.values(user?.friends ?? {})
      .sort((a, b) => {
        if (a.messages === undefined || a.messages.length === 0) return 1
        else if (b.messages === undefined || b.messages.length === 0) return -1
        else return b.messages[0].createdAt.valueOf() - a.messages[0].createdAt.valueOf()
      })
  }, [user?.friends])

  return <>
    < SafeAreaView style={[styles.container]}>
      <View style={{}}><Text style={[header, { marginBottom: 20, }]}>Messages</Text></View>
      <FlatList
        style={{}}
        data={friendsList}
        keyExtractor={item => item.profile.userId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => push('MessagesToOnePerson', { otherUser: item.profile })} style={styles.row}>
            <MyAvatar image={{ uri: item.profile.imageUri }} name={item.profile.name} />
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={[styles.rowTitleText]}>{item.profile.name}</Text>
              {item.messages.length > 0 &&
                <Text>{item.profile.userId === user?.userId ? 'You' : item.profile.name?.split(' ')[0]}:&nbsp;
                  {item.messages[0].text}</Text>
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

