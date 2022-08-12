import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from 'react-native-gesture-handler'
import { LoginState, LoginType, SkiDetails, SkiDiscipline, UserDetails } from '../types'
import equal from 'fast-deep-equal'

export interface UserState {
    user?: UserDetails,
    loginState?: LoginState,
}
const initialState: UserState = {}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserState: (state, action: PayloadAction<UserDetails>) => {
            state.user = action.payload
            console.log('setting user state')
        },
        clearUser: (state, _: PayloadAction<void>) => {
            state.user = undefined
        },
        setLoginState: (state, action: PayloadAction<LoginState>) => {
            state.loginState = action.payload
            console.log('setting login state')
        },
        clearAuth: (state, _: PayloadAction<void>) => {
            state.loginState = undefined
        },
        logoutUser: (state, _: PayloadAction<void>) => {
            console.log('logging out')
            state.loginState = undefined
            state.user = undefined
        },
        loginUser: (state, { payload: { user, loginState } }: PayloadAction<UserState>) => {
            state.loginState = loginState
            state.user = user
        }
    },
})

export const { setUserState, clearUser, clearAuth, setLoginState, logoutUser, loginUser } = userSlice.actions

export const userReducer = userSlice.reducer

export function isAuthEqual(a: LoginState, b: LoginState): boolean {
    return equal(a, b)
}
