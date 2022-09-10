import BottomSheet from "@gorhom/bottom-sheet"
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from "react-native"
import { Avatar, IconButton, Portal, Modal, Button } from "react-native-paper"
import Icon from "../components/Icon"
import { MultiSelector, SingleSelector } from "../components/MultiSelector"
import { MyButton } from "../components/MyButton"
import { MyTextInput } from "../components/MyTextInput"
import { colors } from "../constants/colors"
import { RootStackParams, RootTabParamList } from "../navigation/Navigation"
import { header, subHeader } from "../services/styles"
import { GetPeopleFeedRequest, getTagsFromSkiDetails, MyLocation, PersonInFeed, SetPokeRequest, SkiSession, UserDetails, Conversation } from "../model/types"
import { skiDisciplineOptions, skiStyleOptions } from "./Profile"
import Swiper from 'react-native-swiper'
import { showComingSoon } from "../components/Error"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/reduxStore"
import { FullScreenLoader } from "../components/Loading"
import { useNavigation } from "@react-navigation/native"
import { dummyConversation, dummyPeopleFeedPeople } from "../model/dummyData"
import { useSkiSessionApi } from "../api/skiSessionApi"
import { tryCatchAsync } from "../util/tryCatchAsync"
import { addConversation, logoutUser, setPoked } from "../redux/userReducer"
import { useUserApi } from "../api/userApi"
import { MyAvatar } from "../components/MyAvatar"

function useLoader() {
    const skiSessionApi = useSkiSessionApi()
    return {
        findNearbyPeople: async (request: GetPeopleFeedRequest) => {
            return await skiSessionApi.findNearbyPeople(request)
        }
    }
}
function useActions() {
    const userApi = useUserApi()
    return {
        setPoke: async (request: SetPokeRequest) => {
            return await userApi.setPoke(request)
        }
    }
}
const bannerHeight = 80
type Props = NativeStackScreenProps<RootTabParamList, 'PeopleFeed'> & {
};
export const PeopleFeed = ({ route: { params } }: Props) => {
    const dispatch = useDispatch()
    const skiSession = useSelector((root: RootState) => root.user.skiSession)
    const poked = useSelector((root: RootState) => root.user.user)?.poked ?? {}
    const [filters, setFilters] = useState<{ [key: string]: boolean } | undefined>(undefined)
    const [showFilters, setShowFilters] = useState(params?.showFilters === true)
    const { navigate, getState, push } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [people, setPeople] = useState<PersonInFeed[]>()
    const [loadingPokes, setLoadingPokes] = useState<{ [key: string]: boolean }>({})
    const [newMatch, setNewMatch] = useState<Conversation>()

    const loader = useLoader()
    const actions = useActions()
    useEffect(() => {
        if (skiSession !== undefined) {
            tryCatchAsync({
                getter: () => loader.findNearbyPeople({ userId: skiSession.userId, location: skiSession.resort.googlePlace.geometry.location }),
                onSuccess: (response) => {
                    setPeople(response.people)
                },
            })
        }
    }, [skiSession])

    const onPressLocation = (session?: SkiSession) => {
        push('LocationFinder', { initialPlace: session?.resort })
    }
    const onPoke = async (userId: string, newVal: boolean) => {
        setLoadingPokes({ ...loadingPokes, userId: true })
        tryCatchAsync({
            getter: () => actions.setPoke({ userId, isPoked: newVal }),
            onSuccess: (response) => {
                if (response.newConvo !== undefined) {
                    dispatch(addConversation(response.newConvo))
                    setNewMatch(response.newConvo)
                }
                dispatch(setPoked(response.poked))
            },
            lastly: () => setLoadingPokes({ ...loadingPokes, userId: false })
        })
    }

    return <>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.banner}>
                <Avatar.Image size={56} source={require('../../assets/avatar.png')} style={{ marginRight: 13 }} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.bannerHeader}>Shred Crew Feed</Text>
                    <TouchableOpacity onPress={() => onPressLocation(skiSession)}><Text style={{ textDecorationLine: 'underline' }}>{skiSession?.resort?.name ?? 'No resort'}</Text></TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setShowFilters(true)} style={{}}><Icon name='sliders-h' family='FontAwesome5' size={20} /></TouchableOpacity>
            </View>
            {skiSession === undefined ?
                <TouchableOpacity onPress={() => onPressLocation(skiSession)} style={{ marginTop: 20, backgroundColor: colors.primary, alignItems: 'center', width: '40%', borderRadius: 10, alignSelf: 'center' }}>
                    <Text style={[subHeader, { color: 'white', textAlign: 'center', alignSelf: 'center', flexWrap: 'wrap', flexShrink: 1, padding: 20 }]}>Pick a resort</Text>
                </TouchableOpacity> :
                <ScrollView style={{ flex: 1 }}>
                    {people === undefined ?
                        <FullScreenLoader background={false} /> :
                        people.map((person) => {
                            const { userId, name } = person
                            const isPoked = poked && poked[userId] === true
                            const onPressSeeMore = showComingSoon

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
                </ScrollView>}
            {newMatch && <NewMatchModal newMatch={newMatch} onClose={() => setNewMatch(undefined)} />}
            <FilterDrawer {...{ filters, setFilters, show: showFilters, setShow: setShowFilters, confirmNext: () => { setShowFilters(false) } }} />
        </SafeAreaView>
    </>
}
const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: bannerHeight,
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
    filters?: { [key: string]: boolean }, setFilters: (it: { [key: string]: boolean }) => void,
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
    filters?: { [key: string]: boolean },
    setFilters: (it: { [key: string]: boolean }) => void,
}
const Filters = ({ filters = {}, setFilters, next }: FiltersProps) => {

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
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 5 }} onPress={() => setFilters({})}>
                <Text style={{ textDecorationLine: 'underline' }}>Clear all</Text>
            </TouchableOpacity>
        </View>
        <MyTextInput {...{ ...form, fieldName: 'dayMission', multiline: true, style: { marginTop: 15, }, placeholder: 'This description will be shown to others in their feed...' }} />
        <MyButton text='View Shredders' icon='arrow-down' onPress={next} style={{ alignSelf: 'center', }} />
    </View>
}

type NewMatchModalProps = {
    newMatch: Conversation,
    onClose: () => void,
}
const NewMatchModal = ({ newMatch, onClose }: NewMatchModalProps) => {
    return <Modal visible={true} onDismiss={onClose} contentContainerStyle={newMatchModalStyles.container}>
        <Text style={[header, { color: 'black', textAlign: 'center' }]}>Ooooohhh yeaaaaah</Text>
        <Text style={[subHeader, { fontSize: 20, textAlign: 'center' }]}>Time to Shred</Text>
        <MyAvatar name={newMatch!!.name} image={{ uri: newMatch?.img }} size={80} style={{ marginTop: 20 }} />
        <Button onPress={showComingSoon} style={[newMatchModalStyles.button, { backgroundColor: colors.orange }]} mode='contained'>Send a message</Button>
        <Button mode='outlined' style={[newMatchModalStyles.button,]} onPress={onClose}>Back to Feed</Button>
    </Modal>
}

const newMatchModalStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        width: '80%',
        alignSelf: 'center',
        padding: 20,
        alignItems: 'center',
        display: 'flex',
        opacity: .9,
        borderRadius: 40,
    },
    button: {
        marginTop: 20,
        width: 200
        // width: '60%'
    }
})