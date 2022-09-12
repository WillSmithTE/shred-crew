import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Conversation, LoginState, SkiSession, sortConversations, UserDetails } from '../model/types'
import equal from 'fast-deep-equal'
import { dummyConversation } from '../model/dummyData'

type ActionType = 'createSkiSession'
export interface UserState {
    user?: UserDetails,
    loginState?: LoginState,
    loading?: { [actionType in ActionType]?: boolean },
    conversations?: Conversation[],
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
            state.conversations = undefined
        },
        loginUser: (state, { payload }: PayloadAction<UserState>) => {
            state.conversations = payload.conversations ? sortConversations(payload.conversations) : undefined
            state.loginState = payload.loginState
            state.user = payload.user
            state.loading = payload.loading
        },
        createSkiSessionComplete: (state, { payload }: PayloadAction<SkiSession>) => {
            if (state.user) state.user.sesh = payload
        },
        setPoked: (state, { payload }: PayloadAction<UserDetails['poked']>) => {
            if (state.user) state.user.poked = payload
        },
        addConversation: (state, { payload }: PayloadAction<Conversation>) => {
            state.conversations = state.conversations === undefined ?
                [payload] :
                [payload, ...state.conversations]
        },
        setConversations: (state, { payload }: PayloadAction<Conversation[]>) => {
            state.conversations = sortConversations(payload)
        }
    },
})

export const { setUserState, clearUser, clearAuth, setLoginState, logoutUser, loginUser, createSkiSessionComplete, setPoked,
    addConversation, setConversations } =
    userSlice.actions

export const userReducer = userSlice.reducer

export function isAuthEqual(a: LoginState, b: LoginState): boolean {
    return equal(a, b)
}
