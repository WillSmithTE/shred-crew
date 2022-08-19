import { HttpError } from '../model/HttpError';
import { jsonString } from '../util/jsonString';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import { dummyLoginRegisterResponse, MyLocation, Place, UserDetails } from '../types';
import Constants from 'expo-constants';
import { LatLng } from 'react-native-maps';
import { baseApiRequest, MyResponseBuilder, useBaseApi } from './api';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

export function useUserApi() {
    const baseApi = useBaseApi()
    return {
        upsert: async (userState: UserDetails) => await baseApiRequest<UserDetails>(
            () => {
                console.debug(`Upserting user (id=${userState.id})`)
                if (devEnv) return Promise.resolve(MyResponseBuilder(dummyLoginRegisterResponse({ ...userState }).user))
                return baseApi.put<UserDetails>(`/user`)
            },
            'error getting user details',
        ),
    }
}