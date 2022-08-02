import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from 'react-native-gesture-handler'
import { LoginType } from '../types'

export type LoginState = {
    accessToken: string,
    refreshToken: string,
}
export interface AuthState {
    loginState?: LoginState,
}

const initialState: AuthState = {}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginState: (state, action: PayloadAction<LoginState>) => {
            state.loginState = action.payload
            console.log('setting login state')
        },
        clearAuth: (state, _: PayloadAction<void>) => {
            state.loginState = undefined
        },
    },
})

export const { setLoginState, clearAuth } = authSlice.actions

export const authReducer = authSlice.reducer
