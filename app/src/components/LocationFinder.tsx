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
    const [yesNo, setYesNo] = useState<'yes' | 'no' | undefined>()
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

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<{ resort: string }>();

    const SkiResortSelector = () => <>
        <Text style={[subHeader, { marginBottom: 20, }]}>Where you at?</Text>
        <ResortLookup {...{ control, errors, setValue, fieldName: 'resort', }} />
    </>
    return <>
        <BackButton />
        <View style={{ flex: 1, }}>
            {(() => {
                if (error) {
                    return <Text>oops</Text>
                } else if (userLocation && (places !== undefined)) {
                    const place = places[0]
                    const region = place ? googlePlaceToRegion(place.googlePlace, mapWidth, mapHeight) : userLocationToRegion(userLocation)
                    return <>
                        <MapView provider={Device.isDevice ? PROVIDER_GOOGLE : undefined} style={styles.map} region={region} showsUserLocation={true}>
                            {place && <Marker coordinate={locationToLatLng(place.googlePlace.geometry.location)} />}
                        </MapView>
                        <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            {place ? <>
                                <Text style={subHeader}>Are you skiing at {place.name} today?</Text>
                                <SingleSelector selected={yesNo} set={setYesNo} options={yesNoOptions} />
                            </> :
                                <>
                                    <Text>No resorts found nearby 😔</Text>
                                </>}
                            {(place === undefined || yesNo === 'no') && <SkiResortSelector />
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
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
]

const styles = StyleSheet.create({
    map: {
        width: mapWidth,
        height: mapHeight,
    },
    form: { flex: 1, padding: 20, justifyContent: 'flex-end' },
})