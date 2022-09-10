import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { subHeader } from "../services/styles"
import { FullScreenLoader } from "./Loading"
import { Text, View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MultiSelectorOption, SelectorButtons, SingleSelector } from "./MultiSelector";
import { placeToRegion as googlePlaceToRegion, locationToLatLng, latLngToRegion as myLocationToRegion, Place, CreateSessionRequest, MyLocation, latLngToLocation } from "../model/types";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "./BackButton";
import { useForm } from "react-hook-form";
import { ResortLookup } from "./ResortLookup";
import { useUserLocation } from "../services/useUserLocation";
import { showError } from "./Error";
import * as Device from 'expo-device'
import { tryCatchAsync } from "../util/tryCatchAsync";
import BottomSheet from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from "react-redux";
import { useResortApi } from "../api/resortApi";
import { useSkiSessionApi } from "../api/skiSessionApi";
import { createSkiSessionComplete } from "../redux/userReducer";
import { RootState } from "../redux/reduxStore";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/Navigation";
import Icon from "./Icon";
import { MyButton } from "./MyButton";
import { colors } from "../constants/colors";
// import BottomSheet from 'reanimated-bottom-sheet';

function useLoader() {
    const { findNearbyResorts, findResort } = useResortApi()
    return {
        findNearbyResorts: async (location: MyLocation) => {
            return await findNearbyResorts(location);
        },
        findResort: async (id: string) => {
            return await findResort(id)
        }
    }
}
function useActions() {
    const { create } = useSkiSessionApi()
    return {
        createSkiSession: async (request: CreateSessionRequest) => {
            return await create(request)
        }
    }
}
type Props = NativeStackScreenProps<RootStackParams, 'LocationFinder'> & {
};
export const LocationFinder = ({ route: { params } }: Props) => {
    const skiSession = useSelector((state: RootState) => state.user.skiSession)
    const [places, setPlaces] = useState<Place[] | undefined>()
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(skiSession?.resort)
    const [initialPlace, setInitialPlace] = useState<Place | undefined>(skiSession?.resort)
    const [yesNo, setYesNo] = useState<'yes' | 'no' | undefined>()
    const [howAboutHere, setHowAboutHere] = useState<string | undefined>()
    const loader = useLoader()
    const actions = useActions()
    const [error, setError] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)
    console.debug({ loading })

    const [showConfirmation, setShowConfirmation] = useState(false)
    const userLocation = useUserLocation()
    const dispatch = useDispatch()


    const showSearchBar = yesNo === 'no' || initialPlace === undefined

    const mapWidth = Dimensions.get('window').width
    const mapHeight = Dimensions.get('window').height * (showSearchBar ? 0.3 : .65)
    const styles = createStyles(mapWidth, mapHeight)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()

    useEffect(() => {
        (async () => {
            if (userLocation !== undefined) {
                tryCatchAsync({
                    getter: () => loader.findNearbyResorts(latLngToLocation(userLocation)),
                    onSuccess: setPlaces,
                    onError: setError,
                })
            }
        })()
    }, [userLocation])

    useEffect(() => {
        if (initialPlace === undefined && places !== undefined && places.length > 0) {
            setInitialPlace(places[0])
        }
    }, [places, initialPlace])

    useEffect(() => {
        setSelectedPlace(places?.find(({ id }) => id === howAboutHere))
    }, [howAboutHere])

    const onClickYesNo = useCallback((val?: 'yes' | 'no') => {
        if (val === undefined || val === 'no') setSelectedPlace(undefined)
        else setSelectedPlace(initialPlace)
        setYesNo(val)
    }, [initialPlace])

    const onPressNext = () => {
        goNextScreen()
    }

    const goNextScreen = useCallback(async () => {
        if (selectedPlace && userLocation) {
            tryCatchAsync({
                getter: () => actions.createSkiSession({ userLocation: latLngToLocation(userLocation), resort: selectedPlace }),
                onSuccess: (session) => {
                    console.log({ session })
                    dispatch(createSkiSessionComplete(session))
                    navigation.navigate('PeopleFeed', { showFilters: true })
                },
                onError: setError,
            })
        } else {
            showError(`shouldn't be here, need userLocation and selectedPlace`)
        }
    }, [selectedPlace])
    const onClickSugggestedPlace = useCallback((place) => {
        setSelectedPlace(place)
        if (place !== undefined) setValue(resortLookupFieldName, '')
    }, [])

    const { control, handleSubmit, formState, setValue } = useForm<{ resort: string }>();

    const onClickResortSearchResult = (id: string) => {
        tryCatchAsync({
            getter: () => loader.findResort(id),
            onSuccess: setSelectedPlace,
            onError: setError,
        })
    }
    const resortLookupFieldName = 'resort'

    return <>
        <BackButton />
        <View style={[{ flex: 1, }]}>
            {(() => {
                if (error) {
                    return <Text>oops</Text>
                } else if (loading) {
                    return <FullScreenLoader />
                } else if (userLocation && (places !== undefined)) {
                    const place = selectedPlace || initialPlace
                    const region = place ? googlePlaceToRegion(place.googlePlace, mapWidth, mapHeight) : myLocationToRegion(userLocation)
                    const markerPlaces = selectedPlace && !places.map((it) => it.id).includes(selectedPlace.id) ? [selectedPlace, ...places] : places
                    return <>
                        {<MapView provider={Device.isDevice ? PROVIDER_GOOGLE : undefined} style={[styles.map,]} region={region} showsUserLocation={true}>
                            {markerPlaces.map((it) => <Marker coordinate={locationToLatLng(it.googlePlace.geometry.location)} key={it.id} />)}
                        </MapView>}
                        <KeyboardAvoidingView style={[styles.form, { marginTop: 15 }]}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            {initialPlace ? <>
                                <Text style={[subHeader, { paddingBottom: 10 }]}>Are you skiing at {initialPlace.name} today?</Text>
                                <SingleSelector selected={yesNo} set={onClickYesNo} options={yesNoOptions} />
                            </> :
                                <>
                                    <Text style={{ paddingTop: 10 }}>No resorts found nearby 😔</Text>
                                </>}
                            {showSearchBar && <>
                                <View style={{ paddingTop: 20 }} />
                                <ResortLookup {...{
                                    placeholder: 'Where you at?', fieldName: resortLookupFieldName, onClear: () => setSelectedPlace(undefined),
                                    onSelectResort: onClickResortSearchResult, control, formState, setValue
                                }} />
                                <SingleSelector selected={selectedPlace} set={onClickSugggestedPlace} idResolver={(place) => place.id}
                                    options={[...places.slice(1, 5).map((it) => ({ value: it, label: it.name }))]} />
                            </>}
                            {selectedPlace && <MyButton icon='arrow-right' text='Next' onPress={onPressNext} style={styles.nextButton} />}
                            <View style={{ flex: 1 }} />
                        </KeyboardAvoidingView>
                        {/* <ConfirmationDrawer {...{ placeName: selectedPlace?.name, confirmNext: goNextScreen, show: showConfirmation, setShow: setShowConfirmation }} /> */}
                    </>

                } else {
                    return <FullScreenLoader />
                }
            })()
            }
        </View>
    </>
}

const yesNoOptions: MultiSelectorOption<'yes' | 'no'>[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
]

const createStyles = (mapWidth: number, mapHeight: number) => StyleSheet.create({
    map: {
        width: mapWidth,
        height: mapHeight,
    },
    form: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'flex-end',
    },
    nextButton: {
        alignSelf: 'flex-end'
    },
})

type ConfirmationDrawerProps = {
    show: boolean, setShow: (val: boolean) => void, confirmNext: () => void, placeName?: string,
}
const ConfirmationDrawer = ({ show, setShow, confirmNext, placeName }: ConfirmationDrawerProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['40%'], []);
    const [selection, setSelection] = useState<'yes' | 'no' | undefined>()

    console.log({ show })

    const handleSheetChanges = useCallback((index: number) => {
        console.log({ index })
        if (index === -1) setShow(false)
    }, [setShow]);
    console.log({ index: show ? 0 : -1 })
    const onPressButton = useCallback((val) => {
        console.log('in here', val)
        if (val === 'yes') confirmNext()
        else if (val === 'no') setShow(false)
    }, [])
    return <BottomSheet
        ref={bottomSheetRef}
        index={show ? 0 : -1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: colors.grayBackground, width: 60, }}
    >
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row' }}>
                <Icon name='map-marker' color={colors.primary} />
                <Text style={{ paddingLeft: 10 }}>{placeName}</Text>
            </View>
            <View>
                <Text style={[subHeader, { paddingVertical: 10 }]}>Ready to find a Shred Crew?</Text>
                <SelectorButtons options={[
                    { label: 'Yes, take me to the shredders', value: 'yes' },
                    { label: 'No, choose other resort', value: 'no' },
                ]} onPress={onPressButton} />
            </View>
        </View>
    </BottomSheet>
}

const drawerStyles = StyleSheet.create({

})