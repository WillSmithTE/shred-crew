import { CreateSessionRequest, CreateSessionResponse, MyLocation, Place } from '../types';
import { useBaseApi, baseApiRequest } from './api';

export function useSkiSessionApi() {
    const baseApi = useBaseApi()
    return {
        create: async (request: CreateSessionRequest) => await baseApiRequest<CreateSessionResponse>(
            () => {
                console.debug(`Creating ski session`)
                return baseApi.post<CreateSessionResponse>(`/ski-session`, {
                    body: JSON.stringify(request),
                    headers: { "Content-Type": "application/json", }
                })
            },
            'error creating ski session',
        ),
    }
}