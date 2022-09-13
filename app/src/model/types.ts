import { IMessage } from "react-native-gifted-chat"
import { Region, LatLng } from "react-native-maps"
import { myUuid } from "../services/myUuid"

export type UserDetails = BaseUserProfile & {
    name: string,
    email: string,
    userId: string,
    hasDoneInitialSetup?: boolean,
    imageUri?: string,
    loginType: LoginType,
    ski?: SkiDetails,
    bio?: string,
    createdAt?: number,
    otherImages?: string[],
    matches?: { userId: string, convId: string }[],
    poked?: { [userId: string]: boolean },
    pushToken?: string,
    sesh?: SkiSession,
}
export type BaseUserProfile = {
    name: string,
    userId: string,
    imageUri?: string,
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
    auth: LoginState,
    conversations?: Conversation[],
}

export const dummyLoginRegisterResponse: (userDetails: Partial<UserDetails>) => LoginRegisterResponse =
    ({ name = 'John Bob', email = 'John@gmail.com', imageUri, ...rest } = {}) => ({
        user: {
            name,
            email,
            userId: myUuid(),
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
    homeMountain?: Place,
    disciplines: UserDisciplines,
    styles: UserStyles,
    skillLevel?: number, // 1-5
    backcountryDetails?: string,
}
export function skillLevelDescription(level: number) {
    switch (level) {
        case 1: return 'Beginner'
        case 2:
        case 3: return 'Intermediate'
        case 4:
        case 5: return 'Advanced'
        default:
            console.error(`failed to get description for skill level (level=${level})`)
            return ''
    }
}
export function getTagsFromSkiDetails(skiDetails?: SkiDetails): string[] {
    if (skiDetails === undefined) return []
    return [
        ...(skiDetails.skillLevel ? [skillLevelDescription(skiDetails.skillLevel)] : []),
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
        viewport: ViewPort
    }
}
export type ViewPort = {
    northeast: MyLocation,
    southwest: MyLocation
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
export function myLocationToRegion({ lat, lng }: MyLocation): Region {
    return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: .02,
        longitudeDelta: .02,
    }
}

export type ResortStore = {
    id: string,
    name: string,
}

export type CreateSessionRequest = {
    userLocation?: MyLocation,
    resort: PlaceSummary,
}

export type CreateSessionResponse = SkiSession

export type SkiSession = {
    userId: string,
    time: number,
    userLocation?: MyLocation,
    resort: PlaceSummary,
}
export type PlaceSummary = {
    id: string,
    location: MyLocation,
    name: string,
}
export function placeToPlaceSummary(place: Place): PlaceSummary {
    return {
        id: place.id,
        name: place.name,
        location: place.googlePlace.geometry.location,
    }
}

export type GetPeopleFeedRequest = {
    userId: string,
    location: MyLocation,
}
export type GetPeopleFeedResponse = {
    people: UserDetails[],
}

export type RegisterRequest = { name: string, email: string, password: string }
export type LoginRequest = { email: string, password: string }

export type GoogleSignInRequest = {
    idToken: string
}

export type Message = {
    _id: string;
    text: string;
    createdAt: number;
    user: BaseUserProfile;
    image?: string;
    video?: string;
    audio?: string;
    system?: boolean;
    sent?: boolean;
    received?: boolean;
    pending?: boolean;
}

export type SetPokeRequest = {
    userId: string,
    isPoked: boolean,
}
export type SetPokeResponse = {
    user: UserDetails,
    newConvo?: Conversation,
}

export type MessageData = { text: string }
export type Conversation = {
    id: string,
    message?: { time: number, user: string, data: MessageData },
    name: string,
    img?: string,
    created: number,
}

export function sortConversations(conversations: Conversation[]): Conversation[] {
    return conversations.sort((a, b) => {
        if (a.message === undefined && b.message === undefined) return b.created - a.created
        if (a.message === undefined) return -1
        else if (b.message === undefined) return 1
        else return b.message.time - a.message.time
    })
}

export type GetMessagesRequest = {
    conversationId: string,
    beforeTime?: number,
}

export type SendMessageRequest = {
    conversationId: string,
    data: MessageData,
}

export type GetConversationDetailsRequest = {
    conversationId: string,
}