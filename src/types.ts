import { LoginState } from "./services/authReducer"
import { UserDetails } from "./services/userReducer"

export enum LoginType {
    EMAIL = 'email',
    GOOGLE = 'google',
}

export type LoginRegisterResponse = {
    user: UserDetails,
    auth: LoginState
}
