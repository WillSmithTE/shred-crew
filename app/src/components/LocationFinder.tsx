import React, { useEffect, useState } from "react"
import { subHeader } from "../services/styles"
import { FullScreenLoader } from "./Loading"
import { Text, View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import MapView, { LatLng, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MultiSelector, MultiSelectorOption, SingleSelector } from "./MultiSelector";
import { dummyPlace, placeToRegion, locationToLatLng, Place } from "../types";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "./BackButton";
import { useForm } from "react-hook-form";
import { ResortLookup } from "./ResortLookup";
import { colors } from "../constants/colors";
import * as Location from 'expo-location'
import { showError } from "./Error";
import { useUserLocation } from "../services/useUserLocation";

const mapWidth = Dimensions.get('window').width
const mapHeight = Dimensions.get('window').height / 2

async function loader(userLocation: LatLng): Promise<Place | undefined> {
    await new Promise(r => setTimeout(r, 2000));
    return dummyPlace
}
export const LocationFinder = () => {
    const [place, setPlace] = useState<Place | undefined>()
    const [yesNo, setYesNo] = useState<'yes' | 'no' | undefined>()
    const [noNearbyResort, setNoNearbyResort] = useState(false)

    const error = false
    const userLocation = useUserLocation()
    useEffect(() => {
        (async () => {
            if (userLocation !== undefined) {
                const nearestSkiResort = await loader(userLocation)
                if (nearestSkiResort === undefined) setNoNearbyResort(true)
                else setPlace(nearestSkiResort)
            }
        })()
    }, [userLocation])

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<{ resort: string }>();

    return <>
        <BackButton />
        <View style={{ flex: 1, }}>
            {(() => {
                if (error) {
                    return <Text>oops</Text>
                } else if (noNearbyResort) {

                } else if (!place) {
                    return <FullScreenLoader />
                } else {
                    return <>
                        <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={placeToRegion(place, mapWidth, mapHeight)}>
                            <Marker coordinate={locationToLatLng(place.geometry.location)} />
                        </MapView>
                        <KeyboardAvoidingView style={{ flex: 1, padding: 20, justifyContent: 'flex-end' }}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <Text style={subHeader}>Are you skiing at Verbier today?</Text>
                            <SingleSelector selected={yesNo} set={setYesNo} options={yesNoOptions} />
                            {yesNo === 'no' && <>
                                <Text style={[subHeader, { marginBottom: 20, }]}>Where you at?</Text>
                                <ResortLookup {...{ control, errors, setValue, watch, fieldName: 'resort', }} />
                            </>
                            }
                            <View style={{ flex: 1 }} />
                        </KeyboardAvoidingView>
                    </>
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
})