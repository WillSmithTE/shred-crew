import { useEffect, useState } from "react";
import { showError } from "../components/Error";
import * as Location from 'expo-location'
import { LatLng } from "react-native-maps";

export const useUserLocation = () => {
    const [location, setLocation] = useState<LatLng | undefined>()

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showError('Permission to access location was denied');
            } else {

                const { coords } = await Location.getCurrentPositionAsync({});
                setLocation(coords);
            }
        })();
    }, []);

    return location ? {
        lat: location.latitude,
        lng: location.longitude
    } : undefined
}