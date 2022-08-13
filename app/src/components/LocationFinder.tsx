import React, { useEffect, useState } from "react"
import { subHeader } from "../services/styles"
import { FullScreenLoader } from "./Loading"
import { Text, View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import MapView, { LatLng, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MultiSelector, MultiSelectorOption, SingleSelector } from "./MultiSelector";
import { dummyPlace, placeToRegion as googlePlaceToRegion, locationToLatLng, GooglePlace, userLocationToRegion, Place } from "../types";
import { IconButton } from "react-native-paper";
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

const mapWidth = Dimensions.get('window').width
const mapHeight = Dimensions.get('window').height / 2

function useLoader(): (userLocation: LatLng) => Promise<Place[] | undefined> {
    const { findNearbyResorts } = useResortApi()
    return async ({ latitude, longitude }: LatLng) => {
        return await findNearbyResorts({ lat: latitude, lng: longitude });
    }
    // return dummyPlace
}
export const LocationFinder = () => {
    const [places, setPlaces] = useState<Place[] | undefined>()
    const [place, setPlace] = useState<Place | undefined>()
    const [yesNo1, setYesNo1] = useState<'yes' | 'no' | undefined>()
    const [howAboutHere, setHowAboutHere] = useState<string | undefined>()
    const loader = useLoader()
    const [error, setError] = useState<string | undefined>()
    const userLocation = useUserLocation()

    useEffect(() => {
        (async () => {
            if (userLocation !== undefined) {
                try {
                    const nearestSkiResorts = await loader(userLocation)
                    setPlaces(nearestSkiResorts)
                } catch (e) {
                    console.log(`error finding ski resorts (e=${jsonString(e as any)})`)
                    setError(jsonString(e as any))
                    showError2({ message: 'Something went wrong...', description: jsonString(e as any) })
                }
            }
        })()
    }, [userLocation])

    useEffect(() => {
        if (places !== undefined && places.length > 0) setPlace(places[0])
    }, [places])

    const setResortById = (idToFind: string) => {
        console.log({ idToFind })
        const match = places?.find(({ id }) => id === idToFind)
        console.log({match})
        setPlace(places?.find(({ id }) => id === idToFind))
    }

    useEffect(() => {
        howAboutHere !== undefined && howAboutHere !== 'no' && setResortById(howAboutHere)
    }, [howAboutHere])

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<{ resort: string }>();

    const SkiResortSelector = () => <>
        <Text style={[subHeader, { marginBottom: 20, }]}>Where you at?</Text>
        <ResortLookup {...{ control, errors, setValue, fieldName: 'resort', onSelectResort: setResortById }} />
    </>
    return <>
        <BackButton />
        <View style={{ flex: 1, }}>
            {(() => {
                if (error) {
                    return <Text>oops</Text>
                } else if (userLocation && (places !== undefined)) {
                    const region = place ? googlePlaceToRegion(place.googlePlace, mapWidth, mapHeight) : userLocationToRegion(userLocation)
                    return <>
                        <MapView provider={Device.isDevice ? PROVIDER_GOOGLE : undefined} style={styles.map} region={region} showsUserLocation={true}>
                            {place && <Marker coordinate={locationToLatLng(place.googlePlace.geometry.location)} />}
                        </MapView>
                        <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            {place ? <>
                                <Text style={subHeader}>Are you skiing at {place.name} today?</Text>
                                <SingleSelector selected={yesNo1} set={setYesNo1} options={yesNoOptions} />
                            </> :
                                <>
                                    <Text>No resorts found nearby 😔</Text>
                                </>}
                            {yesNo1 === 'no' && places.length > 1 && <>
                                <Text style={subHeader}>How about here?</Text>
                                <SingleSelector selected={howAboutHere} set={setHowAboutHere}
                                    options={howAboutHere === 'no' ? [{ value: 'no', label: 'Nope' }] :
                                        [...places.slice(1, 6).map(({ id, name }) => ({ value: id, label: name })), { value: 'no', label: 'Nope' }]} />
                            </>}
                            {(place === undefined || howAboutHere === 'no' || (yesNo1 === 'no' && places.length === 1)) && <SkiResortSelector />
                            }
                            <View style={{ flex: 1 }} />
                        </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
    map: {
        width: mapWidth,
        height: mapHeight,
    },
    form: { flex: 1, paddingHorizontal: 20, justifyContent: 'flex-end' },
})