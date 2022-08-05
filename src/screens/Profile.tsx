import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import { Button, Portal } from 'react-native-paper';
import { useForm } from "react-hook-form";
import { MyTextInput, requiredRule } from '../components/MyTextInput';
import { SearchSuggestions } from '../components/SearchSuggestions';
import { useDebouncedSearch } from '../services/useDebouncedSearch';
import { Slider } from '@sharcoux/slider'
import { colors } from '../constants/colors';
import { SkiDiscipline, SkiStyle, UserDisciplines, UserStyles } from '../types';
import { FullScreenLoader } from '../components/Loading';
import { logoutUser, setUserState, UserDetails } from '../redux/userReducer';
import { ImagePicker } from '../components/ImagePicker';
import AutoComplete from 'react-native-autocomplete-input'
import { useUserApi } from '../api/api';
import { showError2 } from '../components/Error';
import { useNavigation } from '@react-navigation/native';
import { jsonString } from '../util/jsonString';

function useAction() {
  const { upsert } = useUserApi()
  return async (userDetails: UserDetails) => {
    return upsert(userDetails)
  }
}
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
type FormData = { name: string, bio?: string, homeMountain: string, backcountryDetails: string }
export const Profile = ({ }: Props) => {
  const dispatch = useDispatch()
  const action = useAction()
  const user = useSelector((state: RootState) => state.user.user)
  if (user === undefined) return <FullScreenLoader />
  const isFirstTimeSetup = !!!user?.hasDoneInitialSetup
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(false)
  const [imageUri, setImageUri] = useState(user!!.imageUri)
  const [skillLevel, setSkillLevel] = useState<number>(user!!.ski.skillLevel)
  const [disciplines, setDisciplines] = useState<UserDisciplines>(user.ski.disciplines ?? {})
  const [skiStyles, setSkiStyles] = useState<UserStyles>(user.ski.styles ?? {})
  const { setInputText: setHomeMountainInput, searchResults: { result: resortResults } } = useDebouncedSearch((place) => searchResorts(place));

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      name: user?.name ?? '',
      bio: user?.bio ?? '',
      homeMountain: user?.ski.homeMountain ?? '',
      backcountryDetails: user?.ski.backcountryDetails ?? ''
    }
  });
  const homeMountainSearchQuery = watch('homeMountain')
  useMemo(() => setHomeMountainInput(homeMountainSearchQuery), [homeMountainSearchQuery])
  const onSubmit = async ({ name, bio, homeMountain, backcountryDetails, }: FormData) => {
    setLoading(true)
    try {
      const response = await action({
        id: user.id, email: user.email, bio, imageUri, name, loginType: user.loginType,
        ski: { disciplines, skillLevel, styles: skiStyles, backcountryDetails, homeMountain }
      })
      dispatch(setUserState(response))
      setLoading(false)
      navigate('GetStarted' as any)
    } catch (e: any) {
      setLoading(false)
      showError2({ message: `Something went wrong saving your profile...`, description: jsonString(e) })
    }
  }

  const NextButton = ({ style = {} }) => <Button onPress={handleSubmit(onSubmit)} mode='contained' style={[styles.nextButton, style]}
    icon='arrow-right' contentStyle={{ flexDirection: 'row-reverse' }}>Next</Button>

  return (<ScrollView  >
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 20, }}>
        <Text style={styles.header}>{isFirstTimeSetup ? 'Create' : 'Update'} your profile</Text>
        <NextButton />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ImagePicker {...{ imageUri, setImageUri }} />
        <MyTextInput {...{ fieldName: 'name', placeholder: 'Name', rules: { required: requiredRule }, control, errors, }} />
        <MyTextInput {...{
          multiline: true, fieldName: 'bio', placeholder: 'Tell us about yourself...', rules: { maxLength: { value: 1000, message: 'Too long' } },
          control, errors, style: { height: 100, paddingTop: 5, }
        }} />
        <View style={{ zIndex: 100, elevation: 100, }}>
          <MyTextInput {...{ fieldName: 'homeMountain', placeholder: 'Home mountain', control, errors, }} />
          <View style={{ position: 'absolute', marginTop: 64, width: '100%' }}>
            <AutoComplete data={resortResults?.length === 1 && resortResults[0].label === homeMountainSearchQuery ? [] : resortResults ?? []}
              renderTextInput={() => <View></View>}
              renderResultList={(props) => <View style={{}}>{props.data.map(({ id, label }) =>
                <TouchableOpacity onPress={() => setValue('homeMountain', label)} style={{ backgroundColor: colors.gray300, padding: 5, }} key={id}><Text style={{ fontSize: 16, }}>{label}</Text></TouchableOpacity>
              )}</View>}
            />
          </View>
        </View>
        <View style={{ paddingTop: 0 }}><Text style={[styles.subHeader, {}]}>Ability level</Text></View>
        <SkillLevelSlider {...{ skillLevel, setSkillLevel }} />
        <Text style={styles.subHeader}>Type of shredder</Text>
        <SkiDisciplineSelector {...{ selected: disciplines, set: setDisciplines }} />
        <Text style={styles.subHeader}>Style</Text>
        <SkiStylesSelector {...{ selected: skiStyles, set: setSkiStyles }} />
        {skiStyles.backcountry && <MyTextInput {...{
          multiline: true, fieldName: 'backcountryDetails', placeholder: 'Tell us more about your backcountry experience:\n\nExamples:\n  \u2022 What equipment do you have?\n  \u2022 How experienced are you?',
          rules: {},
          control, errors, style: { height: 200, marginTop: 20, paddingTop: 5 }
        }} />}

      </View>
      <NextButton style={{ alignSelf: 'flex-end' }} />
    </View>
  </ScrollView>
  );
};

type Props = {
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
type SliderProps = { skillLevel: number, setSkillLevel: (num: number) => void }
const SkillLevelSlider = ({ skillLevel, setSkillLevel }: SliderProps) => {
  return < View >
    <Slider
      style={{ width: '100%', height: 40, paddingHorizontal: 7 }}
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
    <View style={{ paddingHorizontal: 3, justifyContent: 'space-between', top: - 25, zIndex: -1, flexDirection: 'row' }}>
      {Array.from(Array(5).keys()).map((index) => {
        const dotColor = 'black' // isTouched && index < skillLevel ? colors.secondary : colors.gray300
        return (
          <View style={{ backgroundColor: dotColor, width: 6, height: 10, borderRadius: 3 }} key={index} />
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

const skiDisciplines: { id: SkiDiscipline, label: string }[] = [
  { id: 'ski', label: 'Skiier' },
  { id: 'snowboard', label: 'Snowboarder' },
  { id: 'ski-skate', label: 'Ski Skater' },
]
type SkiDisciplineSelectorProps = {
  selected: UserDisciplines,
  set: (types: UserDisciplines) => void,
}
const SkiDisciplineSelector = ({ selected, set }: SkiDisciplineSelectorProps) => {
  return <MultiSelector {...{ options: skiDisciplines, selected, set }} />
}
const skiStyles: { id: SkiStyle, label: string }[] = [
  { id: 'moguls', label: 'Moguls' },
  { id: 'piste', label: 'Piste' },
  { id: 'off-piste', label: 'Off-Piste' },
  { id: 'backcountry', label: 'Backcountry' },
]
type SkiStylesSelectorProps = {
  selected: UserStyles,
  set: (types: UserStyles) => void,
}
const SkiStylesSelector = ({ selected, set }: SkiStylesSelectorProps) => {
  return <MultiSelector {...{ options: skiStyles, selected, set }} />
}

type MultiSelectorOptions<S extends string> = {
  id: S,
  label: string,
}
type Thing<S extends string> = { [key in S]?: boolean }
type MultiSelectorProps<S extends string> = {
  selected: Thing<S>,
  set: (types: Thing<S>) => void,
  options: MultiSelectorOptions<S>[]
}
function MultiSelector<S extends string>({ selected, set, options }: MultiSelectorProps<S>) {
  return < View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, }}>
    {options.map(({ id, label }, index) => {
      const isSelected = selected[id] === true
      const onPress = () => set({ ...selected, [id]: isSelected ? undefined : true })
      return <TouchableOpacity onPress={onPress} style={{
        backgroundColor: isSelected ? colors.secondary : colors.gray300,
        borderRadius: 10, padding: 10, marginRight: 10, marginBottom: 10,
      }} key={index}>
        <Text style={{ color: 'black' }}>{label}</Text>
      </TouchableOpacity>
    }
    )}
  </View >

}

