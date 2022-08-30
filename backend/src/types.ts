export type UserDetails = {
    name: string,
    email: string,
    userId: string,
    hasDoneInitialSetup?: boolean,
    imageUri?: string,
    loginType: LoginType,
    ski: SkiDetails,
    bio?: string,
    createdAt?: number,
    otherImages?: string[],
    matches?: { [userId: string]: boolean }
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
    geometry?: {
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
    userLocation: MyLocation,
    resort: Place,
}

export type CreateSessionResponse = SkiSession

export type SkiSession = {
    id: string,
    userId: string,
    createdAt: number,
    userLocation: MyLocation,
    resort: Place,
}
export type GetPeopleFeedRequest = {
    userId: string,
    location: MyLocation,
}
export type GetPeopleFeedResponse = {
    people: PersonInFeed[],
}
export type PersonInFeed = {
    name: string,
    userId: string,
    imageUri?: string,
    ski: SkiDetails,
    bio?: string,
    sessionResort: Place,
    otherImages: string[],
}

export type RegisterRequest = { name: string, email: string, password: string }
export type LoginRequest = { email: string, password: string }

export type MyResponse<T> =
    { error: string } | T

export type GoogleSignInRequest = {
    idToken: string
}