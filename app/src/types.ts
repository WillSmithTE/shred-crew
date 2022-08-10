import { Region, LatLng } from "react-native-maps"
import { UserDetails, LoginState } from "./redux/userReducer"
import { myUuid } from "./services/myUuid"

export enum LoginType {
    EMAIL = 'email',
    GOOGLE = 'google',
}

export type LoginRegisterResponse = {
    user: UserDetails,
    auth: LoginState
}

export const dummyLoginRegisterResponse: (userDetails: Partial<UserDetails>) => LoginRegisterResponse =
    ({ name = 'John Bob', email = 'John@gmail.com', imageUri, ...rest } = {}) => ({
        user: {
            name,
            email,
            id: myUuid(),
            imageUri,
            loginType: LoginType.EMAIL,
            ski: { disciplines: {}, styles: {}, skillLevel: 3 }, bio: '',
            ...rest,
        },
        auth: {
            accessToken: '123',
            refreshToken: '999',
            loginType: LoginType.EMAIL,
        }
    })


export type SkiDetails = {
    homeMountain?: string,
    disciplines: UserDisciplines,
    styles: UserStyles,
    skillLevel: number, // 1-5
    backcountryDetails?: string,
}
export type SkiDiscipline = 'ski' | 'snowboard' | 'ski-skate'
export type UserDisciplines = { [key in SkiDiscipline]?: boolean }

export type SkiStyle = 'moguls' | 'piste' | 'off-piste' | 'backcountry'
export type UserStyles = { [key in SkiStyle]?: boolean }


export const dummyPlace: Place = {
    geometry: {
        location: { lat: 46.951211, lng: 11.38775 },
        viewport: {
            northeast: { lat: 46.95294958029151, lng: 11.3895851302915 },
            southwest: { lat: 46.95025161970851, lng: 11.3868871697085 }
        }
    }
}
export type Location = { lat: number, lng: number }
export type Place = {
    geometry: {
        location: Location,
        viewport: {
            northeast: Location,
            southwest: Location
        }
    }
}
export function placeToRegion(place: Place, mapWidth: number, mapHeight: number): Region {
    const latDelta = place.geometry.viewport.northeast.lat - place.geometry.viewport.southwest.lat
    return {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        latitudeDelta: latDelta,
        longitudeDelta: latDelta * mapWidth / mapHeight,
    }
}
export function locationToLatLng({ lat, lng }: Location): LatLng {
    return { latitude: lat, longitude: lng, }
}
