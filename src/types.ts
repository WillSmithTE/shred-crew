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
        user: { name, email, id: myUuid(), imageUri: 'https://asda', loginType: LoginType.EMAIL, ski: { skiTypes: {} } },
        auth: {
            accessToken: '123',
            refreshToken: '999',
            loginType: LoginType.EMAIL,
        }
    })


export type SkiType = 'ski' | 'snowboard' | 'ski-skate'
