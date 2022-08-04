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

export const dummyLoginRegisterResponse: ({ name, email }: { name?: string, email?: string }) => LoginRegisterResponse =
    ({ name = 'John Bob', email = 'John@gmail.com' }) => ({
        user: { name, email, id: myUuid(), imageUri: 'https://asda', loginType: LoginType.EMAIL, ski: { disciplines: {}, styles: {} } },
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
}
export type SkiDiscipline = 'ski' | 'snowboard' | 'ski-skate'
export type UserDisciplines = { [key in SkiDiscipline]?: boolean }

export type SkiStyle = 'moguls' | 'piste' | 'off-piste' | 'backcountry'
export type UserStyles = { [key in SkiStyle]?: boolean }
