import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';

import colors from '../constants/colors';
import { ListItem, ListSeparator } from '../components/List';
import { MainStackParams } from '../navigation/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import { Button } from 'react-native-paper';
import { useForm, Controller, Control, FieldValues } from "react-hook-form";
import { MyTextInput, requiredRule } from '../components/MyTextInput';
import { Home } from './Home'
import { SearchSuggestions } from '../components/SearchSuggestions';
import { useDebouncedSearch } from '../services/useDebouncedSearch';

const resorts = [
  { id: 'whistler', label: 'Whistler' },
  { id: 'thredbo', label: 'Thredbo' },
  { id: 'chamonix', label: 'Chamonix' },
]
const searchResorts = async (place: string) => {
  await new Promise(r => setTimeout(r, 300))
  return resorts.filter(({ label }) => label.toLowerCase().includes(place.toLowerCase()))
}

export const Profile = ({ }: Props) => {
  const user = useSelector((state: RootState) => state.user.user)
  const isFirstTimeSetup = !!!user?.hasDoneInitialSetup
  const dispatch = useDispatch()

  const [homeMountainSearchResults, setMountainSearchResults] = useState([])
  const { inputText, setInputText, searchResults } = useDebouncedSearch((place) => searchResorts(place));

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      name: user?.name ?? '',
      homeMountain: user?.ski?.homeMountain ?? ''
    }
  });
  const homeMountainSearchQuery = watch('homeMountain')
  useMemo(() => setInputText(homeMountainSearchQuery), [homeMountainSearchQuery])
  const onSubmit = console.log

  const NextButton = () => <Button onPress={handleSubmit(onSubmit)} mode='contained' style={styles.nextButton}
    icon='arrow-right' contentStyle={{ flexDirection: 'row-reverse' }}>Next</Button>

  return (<View style={styles.container}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, }}>
      <Text style={styles.header}>{isFirstTimeSetup ? 'Create' : 'Update'} your profile</Text>
      <NextButton />
    </View>
    <View style={{ paddingHorizontal: 20, }}>
      <MyTextInput {...{ fieldName: 'name', placeholder: 'Name', rules: { required: requiredRule }, control, errors, }} />
      <MyTextInput {...{
        multiline: true, fieldName: 'bio', placeholder: 'Tell us about yourself...', rules: { required: requiredRule },
        control, errors, style: { height: 100 }
      }} />
      <View>
        <MyTextInput {...{ fieldName: 'homeMountain', placeholder: 'Home mountain', control, errors, }} />
        {searchResults.result &&
          <View style={{ zIndex: 100, position: 'absolute', top: 64, width: '100%' }}><SearchSuggestions items={searchResults.result} /></View>
        }
      </View>
    </View>
  </View>
  );
};

type Props = {
};


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextButton: {

  }
});

