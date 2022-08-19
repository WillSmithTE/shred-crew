import { Region, LatLng } from "react-native-maps"
import { myUuid } from "./services/myUuid"

export type UserDetails = {
    name: string,
    email: string,
    id: string,
    hasDoneInitialSetup?: boolean,
    imageUri?: string,
    loginType: LoginType,
    ski: SkiDetails,
    bio?: string,
    createdAt?: number,
    otherImages?: string[]
}
export type LoginState = {
    accessToken: string,
    refreshToken: string,
}

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
export function skillLevelDescription(level: number) {
    switch (level) {
        case 1: return 'Beginner'
        case 2:
        case 3: return 'Intermediate'
        case 4:
        case 5: return 'Advanced'
    }
}
export function getTagsFromSkiDetails(skiDetails?: SkiDetails): string[] {
    if (skiDetails === undefined) return []
    return [
        skillLevelDescription(skiDetails.skillLevel)!!,
        ...(Object.keys(skiDetails.disciplines) as SkiDiscipline[])
            .filter((key) => skiDetails.disciplines[key] === true)
            .map(formatSkiDiscipline)
    ]
}
export const skiDisciplines: SkiDiscipline[] = ['ski', 'snowboard', 'ski-skate']
export type SkiDiscipline = 'ski' | 'snowboard' | 'ski-skate'
export type UserDisciplines = { [key in SkiDiscipline]?: boolean } & Object
export function formatSkiDiscipline(discipline: SkiDiscipline) {
    switch (discipline) {
        case 'ski': return 'Skiier'
        case 'snowboard': return 'Snowboarder'
        case 'ski-skate': return 'Ski Skater'
    }
}
export const skiStyles: SkiStyle[] = ['moguls', 'piste', 'off-piste', 'backcountry',]
export type SkiStyle = 'moguls' | 'piste' | 'off-piste' | 'backcountry'
export type UserStyles = { [key in SkiStyle]?: boolean }
export function formatSkiStyle(style: SkiStyle) {
    switch (style) {
        case 'moguls': return 'Moguls'
        case 'piste': return 'Piste'
        case 'off-piste': return 'Off-Piste'
        case 'backcountry': return 'Backcountry'
    }
}

export type Place = {
    id: string,
    name: string,
    googlePlace: GooglePlace,
    skiResortInfoData: {},
}

export const dummyPlace: GooglePlace = {
    geometry: {
        location: { lat: 46.951211, lng: 11.38775 },
        viewport: {
            northeast: { lat: 46.95294958029151, lng: 11.3895851302915 },
            southwest: { lat: 46.95025161970851, lng: 11.3868871697085 }
        }
    }
}
export type MyLocation = { lat: number, lng: number }
export type GooglePlace = {
    geometry: {
        location: MyLocation,
        viewport: {
            northeast: MyLocation,
            southwest: MyLocation
        }
    }
}
export function placeToRegion(place: GooglePlace, mapWidth: number, mapHeight: number): Region {
    const latDelta = place.geometry.viewport.northeast.lat - place.geometry.viewport.southwest.lat
    return {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        latitudeDelta: latDelta,
        longitudeDelta: latDelta * mapWidth / mapHeight,
    }
}
export function locationToLatLng({ lat, lng }: MyLocation): LatLng {
    return { latitude: lat, longitude: lng, }
}
export function latLngToLocation({ latitude, longitude }: LatLng): MyLocation {
    return { lat: latitude, lng: longitude, }
}
export function latLngToRegion({ latitude, longitude }: LatLng): Region {
    return {
        latitude,
        longitude,
        latitudeDelta: .02,
        longitudeDelta: .02,
    }
}

export type ResortStore = {
    id: string,
    name: string,
}

type ResortOrCustomResort =
    { resort: Place, customResort?: never } |
    { resort?: never, customResort: { name: string } }

export type CreateSessionRequest = {
    userLocation: MyLocation,
} & ResortOrCustomResort

export type CreateSessionResponse = SkiSession

export type SkiSession = {
    id: string,
    userId: string,
    createdAt: number,
    userLocation: MyLocation,
} & ResortOrCustomResort

export type GetPeopleFeedResponse = {
    skiSession: SkiSession,
    people: {}[

    ],
}
export type PersonInFeed = {
    id: string,
    name: string,
    imageUri?: string,
}
