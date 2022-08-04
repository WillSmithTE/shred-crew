import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';

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
import { Slider } from '@sharcoux/slider'
import { colors } from '../constants/colors';
import { SkiType } from '../types';
import { logoutUser, UserSkiTypes } from '../redux/userReducer';

const resorts = [
  { id: 'whistler', label: 'Whistler' },
  { id: 'thredbo', label: 'Thredbo' },
  { id: 'chamonix', label: 'Chamonix' },
  { id: 'whitewater', label: 'Whitewater' },
]
const searchResorts = async (place: string) => {
  await new Promise(r => setTimeout(r, 300))
  return resorts.filter(({ label }) => label.toLowerCase().includes(place.toLowerCase()))
}
export const Profile = ({ }: Props) => {
  const user = useSelector((state: RootState) => state.user.user)
  const isFirstTimeSetup = !!!user?.hasDoneInitialSetup
  const dispatch = useDispatch()

  const [skillLevel, setSkillLevel] = useState<number | undefined>()
  const [skiTypes, setSkiTypes] = useState<UserSkiTypes>(user?.ski?.skiTypes ?? {})
  const { setInputText, searchResults } = useDebouncedSearch((place) => searchResorts(place));

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
      <Text style={styles.subHeader}>Ability level</Text>
      <SkillLevelSlider {...{ skillLevel, setSkillLevel }} />
      <Text style={styles.subHeader}>Type of shredder</Text>
      <SkiTypeSelector {...{ selected: skiTypes, set: setSkiTypes }} />
      <Text style={styles.subHeader}>Style</Text>

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
    paddingVertical: 50,
  },
  header: {
    // color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nextButton: {

  },
  subHeader: { fontSize: 16, paddingTop: 15, fontWeight: 'bold' },
});

const UNTOUCHED_COLOR = colors.gray300
type SliderProps = { skillLevel?: number, setSkillLevel: (num: number) => void }
const SkillLevelSlider = ({ skillLevel, setSkillLevel }: SliderProps) => {
  const isTouched = !!skillLevel
  return < View >
    <Slider
      style={{ width: '100%', height: 40 }}
      minimumValue={1}
      maximumValue={5}
      step={1}
      value={skillLevel ?? 1}
      onValueChange={setSkillLevel}
      minimumTrackTintColor={'black'}
      maximumTrackTintColor={'black'}
      thumbTintColor={colors.secondary}
      thumbSize={20}
    />
    <View style={{ justifyContent: 'space-between', top: - 25, zIndex: -1, flexDirection: 'row' }}>
      {Array.from(Array(5).keys()).map((index) => {
        const dotColor = 'black' // isTouched && index < skillLevel ? colors.secondary : colors.gray300
        return (
          <View style={{ backgroundColor: isTouched ? dotColor : colors.gray300, width: 6, height: 10, borderRadius: 3 }} key={index} />
        )
      })}
    </View>
    <View style={{ justifyContent: 'space-between', top: -10, left: 0, right: 0, zIndex: -1, flexDirection: 'row' }}>
      <View style={{ backgroundColor: '#3AB64A', width: 15, height: 15 }} />
      <View style={{ backgroundColor: '#3076BE', width: 15, height: 15 }} />
      <View style={{ backgroundColor: '#EF1C24', width: 15, height: 15 }} />
      <View style={{ backgroundColor: '#000000', width: 15, height: 15 }} />
      <View style={{ backgroundColor: '#000000', width: 15, height: 15, transform: [{ rotate: '45deg' }] }} />
    </View>
  </View >

}

const skiTypes: { id: SkiType, label: string }[] = [
  { id: 'ski', label: 'Skiier' },
  { id: 'snowboard', label: 'Snowboarder' },
  { id: 'ski-skate', label: 'Ski Skater' },
]
type SkiTypeSelectorProps = {
  selected: UserSkiTypes,
  set: (types: UserSkiTypes) => void,
}
const SkiTypeSelector = ({ selected, set }: SkiTypeSelectorProps) => {
  return < View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, }}>
    {skiTypes.map(({ id, label }, index) => {
      const isSelected = selected[id] === true
      const onPress = () => set({ ...selected, [id]: isSelected ? undefined : true })
      return <TouchableOpacity onPress={onPress} style={{
        backgroundColor: isSelected ? colors.secondary : colors.gray300,
        borderRadius: 10, padding: 10, marginRight: 10,
      }} key={index}>
        <Text style={{ color: 'black' }}>{label}</Text>
      </TouchableOpacity>
    }
    )}
  </View >

}

