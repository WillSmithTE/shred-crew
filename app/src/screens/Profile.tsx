import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import { Button } from 'react-native-paper';
import { useForm } from "react-hook-form";
import { MyTextInput, requiredRule } from '../components/MyTextInput';
import { Slider } from '@sharcoux/slider'
import { colors } from '../constants/colors';
import { formatSkiDiscipline, formatSkiStyle, Place, SkiDiscipline, skiDisciplines, SkiStyle, skiStyles, UserDetails, UserDisciplines, UserStyles } from '../model/types';
import { FullScreenLoader } from '../components/Loading';
import { logoutUser, setUserState, } from '../redux/userReducer';
import { ImagePicker } from '../components/ImagePicker';
import { showError2 } from '../components/Error';
import { useNavigation } from '@react-navigation/native';
import { jsonString } from '../util/jsonString';
import { RootStackParams } from '../navigation/Navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MultiSelector, MultiSelectorOption } from '../components/MultiSelector';
import { BackButton } from '../components/BackButton';
import { ResortLookup } from '../components/ResortLookup';
import { useUserApi } from '../api/userApi';
import { useResortApi } from '../api/resortApi';
import { tryCatchAsync } from '../util/tryCatchAsync';
import { showMessage } from 'react-native-flash-message';

function useLoader() {
    const { findResort } = useResortApi()
    return {
        findResort: async (id: string) => {
            return await findResort(id)
        }
    }
}
function useAction() {
    const { upsert } = useUserApi()
    return async (userDetails: UserDetails) => {
        return upsert({ ...userDetails, hasDoneInitialSetup: true })
    }
}
type FormData = { name: string, bio?: string, homeMountain: string, backcountryDetails: string }
type Props = {
    mode: 'edit' | 'create'
};

export const Profile = ({ mode }: Props) => {
    const dispatch = useDispatch()
    // dispatch(logoutUser())
    const action = useAction()
    const user = useSelector((state: RootState) => state.user.user)
    if (user === undefined) return <FullScreenLoader />
    const { navigate, goBack } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [loading, setLoading] = useState(false)
    const [imageUri, setImageUri] = useState(user.imageUri)
    const [skillLevel, setSkillLevel] = useState<number>(user.ski?.skillLevel ?? 3)
    const [disciplines, setDisciplines] = useState<UserDisciplines>(user.ski?.disciplines ?? {})
    const [skiStyles, setSkiStyles] = useState<UserStyles>(user.ski?.styles ?? {})
    const [homeMountainPlace, setHomeMountainPlace] = useState<Place | undefined>(user.ski?.homeMountain)
    const isCreate = mode === 'create'
    const loader = useLoader()
    const { control, handleSubmit, formState, watch, setValue } = useForm<FormData>({
        defaultValues: {
            name: user?.name ?? '',
            bio: user?.bio ?? '',
            homeMountain: homeMountainPlace?.name ?? '',
            backcountryDetails: user?.ski?.backcountryDetails ?? ''
        }
    });
    const onClickResortSearchResult = (id: string) => {
        tryCatchAsync(
            () => loader.findResort(id),
            setHomeMountainPlace,
        )
    }
    const onSubmit = async ({ name, bio, homeMountain, backcountryDetails, }: FormData) => {
        setLoading(true)
        try {
            const response = await action({
                userId: user.userId, email: user.email, bio, imageUri, name, loginType: user.loginType,
                ski: { disciplines, skillLevel, styles: skiStyles, backcountryDetails, homeMountain: homeMountainPlace }
            })
            dispatch(setUserState(response))
            if (!isCreate) {
                goBack()
            } 
        } catch (e: any) {
            setLoading(false)
            showError2({ message: `Something went wrong saving your profile...`, description: jsonString(e) })
        }
    }

    const NextButton = ({ style = {} }) => <Button onPress={handleSubmit(onSubmit)} mode='contained' style={[styles.nextButton, style]}
        icon={isCreate ? 'arrow-right' : undefined} contentStyle={{ flexDirection: 'row-reverse' }}>
        {isCreate ? 'Next' : 'Save'}
    </Button>
    const SkipButton = ({ style = {} }) => <Button onPress={handleSubmit(onSubmit)} mode='outlined' style={[styles.nextButton, style]}
        icon='arrow-right' contentStyle={{ flexDirection: 'row-reverse' }}>
        {'Skip'}
    </Button>

    return (
        <SafeAreaView>
            <ScrollView >
                {/* <ImageBackground style={styles.background} source={require('../../assets/splash.png')} /> */}
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
                        <BackButton absolute={false} />
                        <Text style={styles.header}>{isCreate ? 'Create' : 'Edit'} your profile</Text>
                        {isCreate ? <SkipButton /> : <NextButton />}
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        <ImagePicker {...{ imageUri, setImageUri }} />
                        <MyTextInput {...{ fieldName: 'name', placeholder: 'Name', rules: { required: requiredRule }, control, formState, }} />
                        <MyTextInput {...{
                            multiline: true, fieldName: 'bio', placeholder: 'Tell us about yourself...', rules: { maxLength: { value: 1000, message: 'Too long' } },
                            control, formState, style: { height: 100, paddingTop: 5, }
                        }} />
                        <ResortLookup {...{ fieldName: 'homeMountain', control, formState, watch, setValue, placeholder: 'Home mountain', onSelectResort: onClickResortSearchResult }} />
                        <View style={{ paddingTop: 0 }}><Text style={[styles.subHeader, {}]}>Ability level</Text></View>
                        <SkillLevelSlider {...{ skillLevel, setSkillLevel }} />
                        <Text style={styles.subHeader}>Type of shredder</Text>
                        <SkiDisciplineSelector {...{ selected: disciplines, set: setDisciplines }} />
                        <Text style={styles.subHeader}>Style</Text>
                        <SkiStylesSelector {...{ selected: skiStyles, set: setSkiStyles }} />
                        {skiStyles.backcountry &&
                            <KeyboardAvoidingView style={[{}, {}]}
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                                <MyTextInput {...{
                                    multiline: true, fieldName: 'backcountryDetails', placeholder: 'Tell us more about your backcountry experience:\n\nExamples:\n  \u2022 What equipment do you have?\n  \u2022 How experienced are you?',
                                    rules: {},
                                    control, formState, style: { height: 200, marginTop: 20, paddingTop: 5 }
                                }} />
                            </KeyboardAvoidingView>}

                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                        <Button onPress={() => dispatch(logoutUser())} style={{ opacity: .01 }}>logout</Button>
                        <NextButton style={{ alignSelf: 'flex-end' }} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    header: {
        // color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    nextButton: {
    },
    subHeader: { fontSize: 16, paddingTop: 15, fontWeight: 'bold' },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },
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
            onResponderGrant={() => true} // try fix slider on android inside scrollview

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

export const skiDisciplineOptions: MultiSelectorOption<SkiDiscipline>[] = skiDisciplines.map((id) => ({
    value: id, label: formatSkiDiscipline(id)
}))
type SkiDisciplineSelectorProps = {
    selected: UserDisciplines,
    set: (types: UserDisciplines) => void,
}
const SkiDisciplineSelector = ({ selected, set }: SkiDisciplineSelectorProps) => {
    return <MultiSelector {...{ options: skiDisciplineOptions, selected, set }} />
}
export const skiStyleOptions: MultiSelectorOption<SkiStyle>[] = skiStyles.map((id) => ({
    value: id, label: formatSkiStyle(id)
}))
type SkiStylesSelectorProps = {
    selected: UserStyles,
    set: (types: UserStyles) => void,
}
const SkiStylesSelector = ({ selected, set }: SkiStylesSelectorProps) => {
    console.log({ selected })
    return <MultiSelector {...{ options: skiStyleOptions, selected, set }} />
}

