import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State } from 'react-native-gesture-handler'
import { Conversation, CreateSessionResponse, LoginState, LoginType, SkiDetails, SkiDiscipline, SkiSession, sortConversations, UserDetails } from '../model/types'
import equal from 'fast-deep-equal'
import { dummyConversation, dummyFriends } from '../model/dummyData'

type ActionType = 'createSkiSession'
export interface UserState {
    user?: UserDetails,
    loginState?: LoginState,
    skiSession?: SkiSession,
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
            // TODO REMOVE DUMMY 
            state.conversations = [dummyConversation]
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
        loginUser: (state, { payload }: PayloadAction<UserState>) => {
            state = payload
            state.conversations = payload.conversations ? sortConversations(payload.conversations) : []
            // TODO REMOVE DUMMY 
            state.conversations = [dummyConversation]
        },
        createSkiSessionComplete: (state, { payload }: PayloadAction<SkiSession>) => {
            state.skiSession = payload
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
