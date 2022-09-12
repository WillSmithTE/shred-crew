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
    // matches?: { [userId: string]: boolean },
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

export type SkiDetails = {
    homeMountain?: Place,
    disciplines: UserDisciplines,
    styles: UserStyles,
    skillLevel?: number, // 1-5
    backcountryDetails?: string,
}
export const defaultSkiDetails: SkiDetails = { disciplines: {}, styles: {}, }
export type SkiDiscipline = 'ski' | 'snowboard' | 'ski-skate'
export type UserDisciplines = { [key in SkiDiscipline]?: boolean }

export type SkiStyle = 'moguls' | 'piste' | 'off-piste' | 'backcountry'
export type UserStyles = { [key in SkiStyle]?: boolean }

export type Place = {
    id: string,
    name: string,
    googlePlace: GooglePlace,
    skiResortInfoData: {},
    gsi1pk: string,
    gsi1sk: string,
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

export type MyResponse<T> =
    { error: string } | T

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
    poked: UserDetails['poked'],
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

export type GetMessagesRequest = {
    conversationId: string,
    beforeTime?: string,
}

export type SendMessageRequest = {
    conversationId: string,
    data: MessageData,
}