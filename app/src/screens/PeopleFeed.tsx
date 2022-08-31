import BottomSheet from "@gorhom/bottom-sheet"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { Avatar, IconButton, Portal, Modal } from "react-native-paper"
import Icon from "../components/Icon"
import { MultiSelector, SingleSelector } from "../components/MultiSelector"
import { MyButton } from "../components/MyButton"
import { MyTextInput } from "../components/MyTextInput"
import { colors } from "../constants/colors"
import { RootStackParams, RootTabParamList } from "../navigation/Navigation"
import { subHeader } from "../services/styles"
import { GetPeopleFeedRequest, getTagsFromSkiDetails, MyLocation, PersonInFeed, SkiSession, UserDetails } from "../types"
import { skiDisciplineOptions, skiStyleOptions } from "./Profile"
import Swiper from 'react-native-swiper'
import { showComingSoon } from "../components/Error"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/reduxStore"
import { FullScreenLoader } from "../components/Loading"
import { useNavigation } from "@react-navigation/native"
import { dummyPeopleFeedPeople } from "../model/dummyData"
import { useSkiSessionApi } from "../api/skiSessionApi"
import { tryCatchAsync } from "../util/tryCatchAsync"
import { logoutUser } from "../redux/userReducer"

function useLoader() {
    const skiSessionApi = useSkiSessionApi()
    return {
        findNearbyPeople: async (request: GetPeopleFeedRequest) => {
            return await skiSessionApi.findNearbyPeople(request)
        }
    }
}

const bannerHeight = 110
type Props = NativeStackScreenProps<RootTabParamList, 'PeopleFeed'> & {
};
export const PeopleFeed = ({ route: { params } }: Props) => {
    const dispatch = useDispatch()
    const skiSession = useSelector((root: RootState) => root.user.skiSession)
    const [poked, setPoked] = useState<{ [id: string]: boolean | undefined }>({})
    const [showFilters, setShowFilters] = useState(skiSession === undefined)
    const [filters, setFilters] = useState<{ [key: string]: boolean }>({})
    const { navigate, getState, push } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [people, setPeople] = useState<PersonInFeed[]>()

    const loader = useLoader()
    useEffect(() => {
        if (skiSession !== undefined) {
            tryCatchAsync(
                () => loader.findNearbyPeople({ userId: skiSession.userId, location: skiSession.resort.googlePlace.geometry.location }),
                (response) => {
                    setPeople(response.people)
                },
            )
        }
    }, [skiSession])

    const onPressLocation = (session: SkiSession) => {
        push('LocationFinder', { initialPlace: session.resort })
    }

    if (skiSession === undefined) {
        push('LocationFinder')
        return <FullScreenLoader />
    }
    return <>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.banner}>
                <Avatar.Image size={56} source={require('../../assets/avatar.png')} style={{ marginRight: 13 }} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.bannerHeader}>Shred Crew Feed</Text>
                    <TouchableOpacity onPress={() => onPressLocation(skiSession)}><Text>{skiSession.resort?.name ?? 'Verbier Mountain Resort'}</Text></TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setShowFilters(true)} style={{}}><Icon name='sliders-h' family='FontAwesome5' size={20} /></TouchableOpacity>
            </View>
            {people === undefined ? <View style={{ flex: 1 }}>
                <FullScreenLoader background={false} />
            </View> :
                <ScrollView style={{ flex: 1 }}>
                    {people.map((person) => {
                        const { userId, name } = person
                        const isPoked = poked && poked[userId] === true
                        const onPressSeeMore = showComingSoon
                        const onPoke = (userId: string, newVal: boolean) => setPoked({ ...poked, [userId]: isPoked ? undefined : true })

                        return <View key={userId} style={{ flex: 1, minHeight: 360 }}>
                            <ImageSwiper person={person} />
                            <View style={{ flexDirection: 'row', paddingTop: 15, minHeight: 70, }}>
                                <View style={{ backgroundColor: '#2FCE5C', width: 10, height: 10, borderRadius: 5, marginHorizontal: 10, marginTop: 5, }}></View>
                                <View>
                                    <Text style={{ fontWeight: '700' }}>{name}</Text>
                                    <TouchableOpacity onPress={onPressSeeMore}>
                                        <Text style={{ textDecorationLine: 'underline' }}>See more</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => onPoke(userId, !isPoked)} style={{
                                    width: 44, height: 44, backgroundColor: isPoked ? colors.secondary : colors.lightGray,
                                    flex: 0, marginLeft: 'auto', justifyContent: 'center', alignItems: 'center', marginRight: 12,
                                    borderRadius: 7,
                                }}>
                                    <Image style={{ width: 24, height: 24 }} source={require('../../assets/horns.png')} resizeMode='contain' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    })}
                </ScrollView>
            }
            <FilterDrawer {...{ filters, setFilters, show: showFilters, setShow: setShowFilters, confirmNext: () => { setShowFilters(false) } }} />
        </View>
    </>
}
const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: bannerHeight,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    bannerHeader: {
        fontSize: 18,
        fontWeight: '700',
        paddingBottom: 5
    },
    tag: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
    },
    firstLoadModalContainer: {
        position: 'absolute',
        top: 0,
        backgroundColor: 'white',
        height: '90%',
        width: '100%',
    },
})

type FilterDrawerProps = {
    show: boolean, setShow: (val: boolean) => void, confirmNext: () => void,
    filters: { [key: string]: boolean }, setFilters: (it: { [key: string]: boolean }) => void,
}
const FilterDrawer = ({ show, setShow, confirmNext, filters, setFilters }: FilterDrawerProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setShow(false)
            confirmNext()
        }
    }, [setShow]);

    useMemo(() => {
        if (show) bottomSheetRef.current?.expand()
        else bottomSheetRef.current?.close()
    }, [show])

    return <BottomSheet
        ref={bottomSheetRef}
        index={show ? 0 : -1}
        snapPoints={[Dimensions.get('screen').height - bannerHeight]}
        onChange={handleSheetChanges}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: '#D9D9D9', width: 60, }}
    >
        <Filters {...{ next: confirmNext, filters, setFilters }} />
    </BottomSheet>
}

type ImageSwiperProps = {
    person: Partial<UserDetails>
}
const ImageSwiper = ({ person: { imageUri, ski, otherImages } }: ImageSwiperProps) => {
    const [currentScreen, setCurrentScreen] = useState(0)
    const swipeRef = useRef<Swiper>(null);

    const images = [imageUri, ...(otherImages ?? [])]
    const onBackward = (): void => {
        if (currentScreen > 0) {
            swipeRef.current?.scrollBy(-1)
            setCurrentScreen((prevState) => prevState - 1);
        }
    };

    const onForward = (): void => {
        if (currentScreen < images.length) {
            swipeRef.current?.scrollBy(1)
            setCurrentScreen((prevState) => prevState + 1)
        }
    };

    return <>
        <View style={{ height: 300 }}>
            <Swiper
                loop={false}
                ref={swipeRef}
            >
                {images.map((imgUri, index) =>
                    <Image source={{ uri: imgUri }} resizeMode='cover' resizeMethod='resize' style={{ resizeMode: 'cover', width: '100%', height: '100%' }} key={index} />
                )}
            </Swiper>
            <View style={{ position: 'absolute', top: 12, left: 12, flexDirection: 'row' }}>
                {getTagsFromSkiDetails(ski).map((tag) => <View key={tag} style={styles.tag}><Text>{tag}</Text></View>)}
            </View>
        </View>
    </>

}

type FiltersProps = {
    next: () => void,
    filters: { [key: string]: boolean },
    setFilters: (it: { [key: string]: boolean }) => void,
}
const Filters = ({ filters, setFilters, next }: FiltersProps) => {

    const form = useForm({
        defaultValues: {
            dayMission: ''
        }
    });

    return <View style={{ flex: 1, paddingHorizontal: 20, }}>
        <Text style={[subHeader, { paddingBottom: 10 }]}>Filter</Text>
        <Text style={{ paddingBottom: 10 }}>What are you looking for today?</Text>
        <View>
            <MultiSelector {...{ options: [...skiDisciplineOptions, ...skiStyleOptions], selected: filters, set: setFilters }} />
            <TouchableOpacity style={{ position: 'absolute', right: 0, bottom: -5 }} onPress={() => setFilters({})}>
                <Text style={{ textDecorationLine: 'underline' }}>Clear all</Text>
            </TouchableOpacity>
        </View>
        <MyTextInput {...{ ...form, fieldName: 'dayMission', multiline: true, style: { marginTop: 30, }, placeholder: 'This description will be shown to others in their feed...' }} />
        <MyButton text='View Shredders' icon='arrow-down' onPress={next} style={{ width: 154, alignSelf: 'center', }} />
    </View>
}