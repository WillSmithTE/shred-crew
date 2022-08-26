import { HttpError } from '../model/HttpError';
import { jsonString } from '../util/jsonString';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import { dummyLoginRegisterResponse, LoginRegisterResponse, LoginRequest, MyLocation, Place, RegisterRequest, UserDetails } from '../types';
import Constants from 'expo-constants';
import { LatLng } from 'react-native-maps';
import { baseApiRequest, MyResponseBuilder, useBaseApi } from './api';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

export function useUserApi() {
    const baseApi = useBaseApi()
    return {
        upsert: async (userState: UserDetails) => await baseApiRequest<UserDetails>(
            () => {
                console.debug(`Upserting user (id=${userState.userId}`)
                if (devEnv) return Promise.resolve(MyResponseBuilder(dummyLoginRegisterResponse({ ...userState }).user))
                return baseApi.put<UserDetails>(`/user`)
            },
            'error getting user details',
        ),
        login: async (request: LoginRequest) => await baseApiRequest<LoginRegisterResponse>(
            () => {
                console.debug(`attempting login (email=${request.email})`)
                return baseApi.post<LoginRegisterResponse>(`/auth/login`)
            },
            `error logging in (email=${request.email})`,
        ),
        register: async (request: RegisterRequest) => await baseApiRequest<LoginRegisterResponse>(
            () => {
                console.debug(`attempting registration (email=${request.email})`)
                return baseApi.post<LoginRegisterResponse>(`/auth/register`)
            },
            `error registering (email=${request.email})`,
        ),
    }
}
