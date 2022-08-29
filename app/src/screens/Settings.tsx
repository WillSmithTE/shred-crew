import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { BackButton } from '../components/BackButton';
import { FullScreenLoader } from '../components/Loading';
import { colors } from '../constants/colors';
import { RootState } from '../redux/reduxStore';
import { setFeature } from '../redux/settingsReducer';
import { logoutUser } from '../redux/userReducer';

// import { Feature } from '../hooks/useFeature';
// import { RootState } from '../services/reduxStore';
// import { setFeature } from '../services/settingsSlice';

const features: { label: string, key: string }[] = [
  {
    label: 'Test toggle',
    key: 'test',
  },
]
export default function Settings({ }) {
  const savedFeatures = useSelector((state: RootState) => state.settings.features)
  const displayFeatures = features.map((feature) => ({
    ...feature,
    enabled: savedFeatures[feature.key]
  }))
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const onPressLogout = () => {
    setLoading(true)
    dispatch(logoutUser())
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <><Text style={styles.title}>Settings</Text></>
      <BackButton />
      <ScrollView
        style={styles.settingsList}
        contentContainerStyle={{
          paddingTop: 20,
          flex: 1,
        }}
        showsVerticalScrollIndicator
      >
        {displayFeatures.map((feature, i) => {
          const dispatch = useDispatch()
          const onToggleSwitch = (newVal: boolean) => { dispatch(setFeature({ key: feature.key, enabled: newVal })) };

          return <View key={i} style={styles.setting}>
            <Text style={{ fontSize: 16 }}>{feature.label}</Text>
            <Switch value={feature.enabled} onValueChange={onToggleSwitch} ios_backgroundColor='#777a78' trackColor={{ false: '#777a78' }} />
          </View>
        })}
        <TouchableOpacity style={styles.setting} onPress={onPressLogout}>
          <Text style={{ fontSize: 16, paddingBottom: 5 }}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
      {loading && <FullScreenLoader />}
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
