import { UserDetails } from '../model/types';
import Constants from 'expo-constants';
import { baseApiRequest, useBaseApi } from './api';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

export function useUserApi() {
    const baseApi = useBaseApi()
    return {
        upsert: async (userState: UserDetails) => await baseApiRequest<UserDetails>(
            () => {
                console.debug(`Upserting user (id=${userState.userId}`)
                return baseApi.put<UserDetails>(`/user`, { body: JSON.stringify(userState) })
            },
            'error getting user details',
        ),
    }
}
