import { SetPokeRequest, SetPokeResponse, UserDetails } from '../model/types';
import Constants from 'expo-constants';
import { baseApiRequest, MyResponse, useBaseApi } from './api';

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
        setPoke: async (request: SetPokeRequest) => await baseApiRequest<SetPokeResponse>(
            () => {
                console.debug(`setting poke (otherUserId=${request.userId}`)
                return baseApi.post<SetPokeResponse>(`/user/poke`, { body: JSON.stringify(request) })
            },
            'error sending poke',
        ),
    }
}
