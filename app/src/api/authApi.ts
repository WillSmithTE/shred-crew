import { LoginRegisterResponse, LoginRequest, LoginState, RegisterRequest } from '../types';
import Constants from 'expo-constants';
import { baseApiRequest, useBaseApi } from './api';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

export function useAuthApi() {
    const baseApi = useBaseApi()
    return {
        refreshAuth: async (request: LoginState) => await baseApiRequest<LoginRegisterResponse>(
            () => {
                console.debug(`refreshing login state`)
                return baseApi.post<LoginRegisterResponse>(`/auth/refresh-auth`, { body: JSON.stringify(request) }, false)
            },
            `error refreshing login state`,
        ),
        login: async (request: LoginRequest) => await baseApiRequest<LoginRegisterResponse>(
            () => {
                console.debug(`attempting login (email=${request.email})`)
                return baseApi.post<LoginRegisterResponse>(`/auth/login`, { body: JSON.stringify(request) }, false)
            },
            `error logging in (email=${request.email})`,
        ),
        register: async (request: RegisterRequest) => await baseApiRequest<LoginRegisterResponse>(
            () => {
                console.debug(`attempting registration (email=${request.email})`)
                return baseApi.post<LoginRegisterResponse>(`/auth/register`, { body: JSON.stringify(request) }, false)
            },
            `error registering (email=${request.email})`,
        ),
        googleSignin: async (idToken: string) => await baseApiRequest<LoginRegisterResponse>(
            () => {
                console.debug(`attempting google sign in`)
                return baseApi.post<LoginRegisterResponse>(`/auth/google-sign-in`, { body: JSON.stringify({ idToken }) }, false)
            },
            `error attempting google sign in`,
        ),
    }
}
