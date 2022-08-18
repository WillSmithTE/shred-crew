import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { subHeader } from "../services/styles"
import { FullScreenLoader } from "./Loading"
import { Text, View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import MapView, { LatLng, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MultiSelector, MultiSelectorOption, SingleSelector } from "./MultiSelector";
import { dummyPlace, placeToRegion as googlePlaceToRegion, locationToLatLng, GooglePlace, userLocationToRegion as myLocationToRegion, Place, CreateSessionRequest, CreateSessionResponse, dummyLoginRegisterResponse, MyLocation } from "../types";
import { Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "./BackButton";
import { useForm } from "react-hook-form";
import { ResortLookup } from "./ResortLookup";
import { useUserLocation } from "../services/useUserLocation";
import { jsonString } from "../util/jsonString";
import { showError, showError2 } from "./Error";
import * as Device from 'expo-device'
import { TouchableOpacity } from "react-native-gesture-handler";
import { tryCatchAsync } from "../util/tryCatchAsync";
import { arrayToMap } from "../util/arrayToMap";
import BottomSheet from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from "react-redux";
import { useResortApi } from "../api/resortApi";
import { useSkiSessionApi } from "../api/skiSessionApi";
import { createSkiSessionComplete } from "../redux/userReducer";
import { RootState } from "../redux/reduxStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParams } from "../navigation/Navigation";
import Icon from "./Icon";
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
export const LocationFinder = () => {
    const [places, setPlaces] = useState<Place[] | undefined>()
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>()
    const [initialPlace, setInitialPlace] = useState<Place | undefined>()
    const [yesNo1, setYesNo1] = useState<'yes' | 'no' | undefined>()
    const [howAboutHere, setHowAboutHere] = useState<string | undefined>()
    const loader = useLoader()
    const actions = useActions()
    const [error, setError] = useState<string | undefined>()
    const [loading, setLoading] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const userLocation = useUserLocation()
    const dispatch = useDispatch()

    const mapWidth = Dimensions.get('window').width
    const mapHeight = Dimensions.get('window').height * (yesNo1 === 'no' ? 0.3 : .65)
    const styles = createStyles(mapWidth, mapHeight)
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParams>>()

    useEffect(() => {
        (async () => {
            if (userLocation !== undefined) {
                tryCatchAsync(
                    () => loader.findNearbyResorts(userLocation),
                    setPlaces,
                    setError,
                )
            }
        })()
    }, [userLocation])

    useEffect(() => {
        if (places !== undefined && places.length > 0) {
            setInitialPlace(places[0])
        }
    }, [places])

    useEffect(() => {
        setSelectedPlace(places?.find(({ id }) => id === howAboutHere))
    }, [howAboutHere])

    const onClickYesNo1 = useCallback((val?: 'yes' | 'no') => {
        if (val === undefined || val === 'no') setSelectedPlace(undefined)
        else setSelectedPlace(initialPlace)
        setYesNo1(val)
    }, [initialPlace])

    const goNextScreen = useCallback(async () => {
        if (selectedPlace && userLocation) {
            tryCatchAsync(
                () => actions.createSkiSession({ userLocation, resort: selectedPlace }),
                (session) => {
                    dispatch(createSkiSessionComplete(session))
                    navigation.navigate('PeopleFeed')
                },
                setError,
            )
        } else {
            showError(`shouldn't be here, need userLocation and selectedPlace`)
        }
    }, [selectedPlace])
    const onClickSugggestedPlace = useCallback((place) => {
        setSelectedPlace(place)
        if (place !== undefined) setValue(resortLookupFieldName, '')
    }, [])

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<{ resort: string }>();

    const onClickResortSearchResult = (id: string) => {
        tryCatchAsync(
            () => loader.findResort(id),
            setSelectedPlace,
            setError,
        )
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
                                <SingleSelector selected={yesNo1} set={onClickYesNo1} options={yesNoOptions} />
                            </> :
                                <>
                                    <Text>No resorts found nearby 😔</Text>
                                </>}
                            {yesNo1 === 'no' && <>
                                <View style={{ paddingTop: 20 }} />
                                <ResortLookup {...{
                                    placeholder: 'Where you at?', fieldName: resortLookupFieldName, onClear: () => setSelectedPlace(undefined),
                                    onSelectResort: onClickResortSearchResult, control, errors, setValue
                                }} />
                                <SingleSelector selected={selectedPlace} set={onClickSugggestedPlace} idResolver={(place) => place.id}
                                    options={[...places.slice(1, 5).map((it) => ({ value: it, label: it.name }))]} />
                            </>}
                            <View style={{ flex: 1 }} />
                        </KeyboardAvoidingView>
                        {selectedPlace && <Button color='black' mode='text' onPress={() => setShowConfirmation(true)} style={styles.nextButton} uppercase={false}
                            icon='arrow-right' contentStyle={{ flexDirection: 'row-reverse' }}>
                            Next
                        </Button>}
                        <ConfirmationDrawer {...{ placeName: selectedPlace?.name, confirmNext: goNextScreen, show: showConfirmation, setShow: setShowConfirmation }} />
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
        position: 'absolute',
        backgroundColor: 'white',
        right: 32,
        bottom: 22,
        borderRadius: 6,
        fontWeight: 'bold',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 1,
        shadowColor: '#00000040',
        shadowRadius: 4,
    },
})

type ConfirmationDrawerProps = {
    show: boolean, setShow: (val: boolean) => void, confirmNext: () => void, placeName?: string,
}
const ConfirmationDrawer = ({ show, setShow, confirmNext, placeName }: ConfirmationDrawerProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['40%'], []);
    const [selection, setSelection] = useState<'yes' | 'no' | undefined>()

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) setShow(false)
    }, [setShow]);
    useEffect(() => {
        if (selection === 'yes') {
            setShow(false)
            confirmNext()
        } else if (selection === 'no') setShow(false)
    }, [selection])

    return <BottomSheet
        ref={bottomSheetRef}
        index={show ? 0 : -1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: '#D9D9D9', width: 60, }}
    >
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row' }}>
                <Icon name='map-marker' />
                <Text>{placeName}</Text>
            </View>
            <View>
                <Text style={subHeader}>Ready to find a Shred Crew?</Text>
                <SingleSelector options={[
                    { label: 'Yes, take me to the shredders', value: 'yes' },
                    { label: 'No, choose other resort', value: 'no' },
                ]} selected={selection} set={setSelection} />
            </View>
        </View>
    </BottomSheet>
}

const drawerStyles = StyleSheet.create({

})