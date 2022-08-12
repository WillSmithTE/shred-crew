import React, { useEffect, useState } from "react"
import { subHeader } from "../services/styles"
import { FullScreenLoader } from "./Loading"
import { Text, View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import MapView, { LatLng, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MultiSelector, MultiSelectorOption, SingleSelector } from "./MultiSelector";
import { dummyPlace, placeToRegion as googlePlaceToRegion, locationToLatLng, GooglePlace, userLocationToRegion } from "../types";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BackButton } from "./BackButton";
import { useForm } from "react-hook-form";
import { ResortLookup } from "./ResortLookup";
import { useUserLocation } from "../services/useUserLocation";

const mapWidth = Dimensions.get('window').width
const mapHeight = Dimensions.get('window').height / 2

async function loader(userLocation: LatLng): Promise<GooglePlace | undefined> {
    await new Promise(r => setTimeout(r, 2000));
    return undefined
    // return dummyPlace
}
export const LocationFinder = () => {
    const [googlePlace, setPlace] = useState<GooglePlace | undefined>()
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
                } else if (userLocation && (googlePlace || noNearbyResort)) {
                    const region = googlePlace ? googlePlaceToRegion(googlePlace, mapWidth, mapHeight) : userLocationToRegion(userLocation)
                    return <>
                        <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region} showsUserLocation={true}>
                            {googlePlace && <Marker coordinate={locationToLatLng(googlePlace.geometry.location)} />}
                        </MapView>
                        <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            {googlePlace ? <>
                                <Text style={subHeader}>Are you skiing at Verbier today?</Text>
                                <SingleSelector selected={yesNo} set={setYesNo} options={yesNoOptions} />
                            </> :
                                <>
                                    <Text>No resorts found nearby 😔</Text>
                                </>}
                            {(noNearbyResort || yesNo === 'no') && <SkiResortSelector />
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