import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type FeatureSettings = {
    [key: string]: boolean
}


export interface settingsState {
    features: FeatureSettings
}

const initialState: settingsState = {
    features: {}
}

type SetFeaturePayload = {
    key: string,
    enabled: boolean,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setFeature: (state, { payload }: PayloadAction<SetFeaturePayload>) => {
            console.debug(`setting feature (${JSON.stringify({ new: payload }, null, 2)})`)
            if (payload.enabled) {
                state.features[payload.key] = true
            } else {
                delete state.features[payload.key]
            }
        }
    }
})

export const { setFeature } = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer
