import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { BackButton } from '../components/BackButton';
import { FullScreenLoader } from '../components/Loading';
import { ResortLookup } from '../components/ResortLookup';
import { colors } from '../constants/colors';
import { RootState } from '../redux/reduxStore';
import { setFeature } from '../redux/settingsReducer';
import { logoutUser } from '../redux/userReducer';

// import { Feature } from '../hooks/useFeature';
// import { RootState } from '../services/reduxStore';
// import { setFeature } from '../services/settingsSlice';

export default function ResortInfoSearch({ }) {
  const savedFeatures = useSelector((state: RootState) => state.settings.features)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const onPressLogout = () => {
    setLoading(true)
    dispatch(logoutUser())
  }
  const hookForms = useForm<{ resort: string }>();
  const resortLookupFieldName = 'resort'
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ResortLookup {...{
        ...hookForms, placeholder: 'Search for resort info', fieldName: resortLookupFieldName,
        onSelectResort: console.log
      }} />
      <View style={{ padding: 20 }}>
        <Text>Resorts near you:</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 10,
    paddingBottom: 20,
    alignSelf: 'center',
  },
  settingsList: {
    flex: 1,
  },
  setting: {
    flexDirection: 'row',
    borderColor: 'grey',
    padding: 10,
    borderWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  }
});
