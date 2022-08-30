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


export const dummyPlace: GooglePlace = {
    geometry: {
        location: { lat: 46.951211, lng: 11.38775 },
        viewport: {
            northeast: { lat: 46.95294958029151, lng: 11.3895851302915 },
            southwest: { lat: 46.95025161970851, lng: 11.3868871697085 }
        }
    }
}
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

export type CreateSessionRequest = Place
export type CreateSessionResponse = SkiSession

export type SkiSession = {
    id: string,
    userId: string,
    place: Place,
    createdAt: number,
}

export type RegisterRequest = { name: string, email: string, password: string }
export type LoginRequest = { email: string, password: string }

export type MyResponse<T> =
    { error: string } | T

export type GoogleSignInRequest = {
    idToken: string
}