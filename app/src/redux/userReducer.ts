import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from 'react-native-gesture-handler'
import { CreateSessionResponse, LoginState, LoginType, SkiDetails, SkiDiscipline, SkiSession, UserDetails } from '../types'
import equal from 'fast-deep-equal'

type ActionType = 'createSkiSession'
export interface UserState {
    user?: UserDetails,
    loginState?: LoginState,
    skiSession?: SkiSession,
    loading?: { [actionType in ActionType]?: boolean }
}
const initialState: UserState = { loading: {} }

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserState: (state, action: PayloadAction<UserDetails>) => {
            console.log({ user: action.payload })
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
            state.loading = undefined
            state.skiSession = undefined
        },
        loginUser: (state, { payload: { user, loginState } }: PayloadAction<UserState>) => {
            state.loginState = loginState
            state.user = user
        },
        createSkiSessionComplete: (state, { payload }: PayloadAction<SkiSession>) => {
            state.skiSession = payload
        },
    },
})

export const { setUserState, clearUser, clearAuth, setLoginState, logoutUser, loginUser, createSkiSessionComplete } =
    userSlice.actions

export const userReducer = userSlice.reducer

export function isAuthEqual(a: LoginState, b: LoginState): boolean {
    return equal(a, b)
}
