import React, { useEffect, useState } from "react"
import { subHeader } from "../services/styles"
import { FullScreenLoader } from "./Loading"
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import MapView, { LatLng, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MultiSelector, MultiSelectorOption, SingleSelector } from "./MultiSelector";
import { dummyPlace, placeToRegion, locationToLatLng, Place } from "../types";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const mapWidth = Dimensions.get('window').width
const mapHeight = Dimensions.get('window').height / 2

export const LocationFinder = () => {
    const [place, setPlace] = useState<Place | undefined>()
    const [yesNo, setYesNo] = useState<'yes' | 'no' | undefined>()
    const { goBack } = useNavigation()
    useEffect(() => {
        (async () => {
            await new Promise(r => setTimeout(r, 2000));
            setPlace(dummyPlace)
        })()
    }, [])
    const error = false
    if (error) {
        return <Text>oops</Text>
    } else if (!place) {
        return <FullScreenLoader />
    } else {
        return <>
            <IconButton onPress={goBack} icon='arrow-left' size={40} style={styles.backButton} />
            <View style={{ flex: 1, }}>
                <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={placeToRegion(place, mapWidth, mapHeight)}>
                    <Marker coordinate={locationToLatLng(place.geometry.location)} />
                </MapView>
                <View style={{ padding: 20 }}>
                    <Text style={subHeader}>Are you skiing at Verbier today?</Text>
                    <SingleSelector selected={yesNo} set={setYesNo} options={yesNoOptions} />
                    {yesNo === 'no' && <>
                        <Text style={subHeader}>Which resort are you at today?</Text>

                    </>}
                </View>
            </View>
        </>
    }
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
    backButton: {
        position: 'absolute',
        top: 10,
        left: 0,
        zIndex: 10,
    }
})