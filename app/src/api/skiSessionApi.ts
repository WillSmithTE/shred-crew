import { CreateSessionRequest, CreateSessionResponse, GetPeopleFeedRequest, GetPeopleFeedResponse, MyLocation, Place } from '../types';
import { useBaseApi, baseApiRequest } from './api';

export function useSkiSessionApi() {
    const baseApi = useBaseApi()
    return {
        create: async (request: CreateSessionRequest) => baseApiRequest<CreateSessionResponse>(
            () => {
                console.debug(`Creating ski session`)
                return baseApi.post<CreateSessionResponse>(`/ski-session`, {
                    body: JSON.stringify(request),
                    headers: { "Content-Type": "application/json", }
                })
            },
            'error creating ski session',
        ),
        findNearbyPeople: async (request: GetPeopleFeedRequest) => baseApiRequest<GetPeopleFeedResponse>(
            () => {
                console.debug(`finding nearby people`)
                return baseApi.post<CreateSessionResponse>(`/ski-session/people`, {
                    body: JSON.stringify(request),
                    headers: { "Content-Type": "application/json", }
                })
            },
            'error finding nearby people',
        ),
    }
}