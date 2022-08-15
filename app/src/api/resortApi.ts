import { MyLocation, Place } from '../types';
import { useBaseApi, baseApiRequest } from './api';

export function useResortApi() {
    const baseApi = useBaseApi()
    return {
        findNearbyResorts: async (userLocation: MyLocation) => await baseApiRequest<Place[]>(
            () => {
                console.debug(`Searching for nearby resorts`)
                return baseApi.post<Place[]>(`/resort/coords`, {
                    body: JSON.stringify(userLocation),
                    headers: { "Content-Type": "application/json", }
                })
            },
            'error getting nearby resorts',
        ),
        findResort: async (id: string) => await baseApiRequest<Place>(
            () => {
                console.debug(`finding resort (id=${id})`)
                return baseApi.get(`/resort/${id}`,)
            },
            `error finding resort (id=${id})`,
        ),
    }
}