import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { subHeader } from "../services/styles"
import { FullScreenLoader } from "./Loading"
import { Text, View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import MapView, { LatLng, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MultiSelector, MultiSelectorOption, SingleSelector } from "./MultiSelector";
import { dummyPlace, placeToRegion as googlePlaceToRegion, locationToLatLng, GooglePlace, userLocationToRegion, Place } from "../types";
import { Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "./BackButton";
import { useForm } from "react-hook-form";
import { ResortLookup } from "./ResortLookup";
import { useUserLocation } from "../services/useUserLocation";
import { useResortApi } from "../api/api";
import { jsonString } from "../util/jsonString";
import { showError, showError2 } from "./Error";
import * as Device from 'expo-device'
import { TouchableOpacity } from "react-native-gesture-handler";
import { tryCatchAsync } from "../util/tryCatchAsync";
import { arrayToMap } from "../util/arrayToMap";
import BottomSheet from '@gorhom/bottom-sheet';

function useLoader() {
    const { findNearbyResorts, findResort } = useResortApi()
    return {
        findNearbyResorts: async ({ latitude, longitude }: LatLng) => {
            return await findNearbyResorts({ lat: latitude, lng: longitude });
        },
        findResort: async (id: string) => {
            return await findResort(id)
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
    const [error, setError] = useState<string | undefined>()
    const userLocation = useUserLocation()

    const mapWidth = Dimensions.get('window').width
    const mapHeight = Dimensions.get('window').height * (yesNo1 === 'no' ? 0.3 : .65)
    const styles = createStyles(mapWidth, mapHeight)

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

    useMemo(() => {
        if (yesNo1 === 'no') setSelectedPlace(undefined)
        else setSelectedPlace(initialPlace)
    }, [yesNo1])

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<{ resort: string }>();

    const onClickResortSearchResult = (id: string) => {
        tryCatchAsync(
            () => loader.findResort(id),
            setSelectedPlace,
            setError,
        )
    }

    return <>
        <BackButton />
        <View style={{ flex: 1, }}>
            {(() => {
                if (error) {
                    return <Text>oops</Text>
                } else if (userLocation && (places !== undefined)) {
                    const place = selectedPlace || initialPlace
                    const region = place ? googlePlaceToRegion(place.googlePlace, mapWidth, mapHeight) : userLocationToRegion(userLocation)
                    return <>
                        {<MapView provider={Device.isDevice ? PROVIDER_GOOGLE : undefined} style={styles.map} region={region} showsUserLocation={true}>
                            {selectedPlace && <Marker coordinate={locationToLatLng(selectedPlace.googlePlace.geometry.location)} />}
                        </MapView>}
                        <KeyboardAvoidingView style={[styles.form, { marginTop: 15 }]}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            {initialPlace ? <>
                                <Text style={[subHeader, { paddingBottom: 10 }]}>Are you skiing at {initialPlace.name} today?</Text>
                                <SingleSelector selected={yesNo1} set={setYesNo1} options={yesNoOptions} />
                            </> :
                                <>
                                    <Text>No resorts found nearby 😔</Text>
                                </>}
                            {yesNo1 === 'no' && <>
                                <View style={{ paddingTop: 20 }} />
                                <ResortLookup {...{ placeholder: 'Where you at?', fieldName: 'resort', onSelectResort: onClickResortSearchResult, control, errors, setValue }} />
                                <SingleSelector selected={howAboutHere} set={setHowAboutHere}
                                    options={[...places.slice(1, 6).map(({ id, name }) => ({ value: id, label: name }))]} />
                            </>}
                            <View style={{ flex: 1 }} />
                            <Button mode='text'>Next</Button>
                        </KeyboardAvoidingView>
                        {selectedPlace && <ConfirmationDrawer />}
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
})

const ConfirmationDrawer = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return <>
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <View style={{}}>
                <Text>Awesome 🎉</Text>
            </View>
        </BottomSheet>
    </>
}