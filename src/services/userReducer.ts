import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from 'react-native-gesture-handler'
import { LoginType } from '../types'

export type UserDetails = {
    name: string,
    email: string,
    id: string,
    hasDoneInitialSetup?: boolean,
    imageUri: string,
    loginType: LoginType,
}
export interface UserState {
    user?: UserDetails,
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
    },
})

export const { setUserState, clearUser } = userSlice.actions

export const userReducer = userSlice.reducer
