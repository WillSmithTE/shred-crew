import { GetMessagesRequest, Message, SendMessageRequest, SetPokeRequest, SetPokeResponse, UserDetails } from '../model/types';
import Constants from 'expo-constants';
import { baseApiRequest, MyResponse, useBaseApi } from './api';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

export function useConversationApi() {
    const baseApi = useBaseApi()
    return {
        sendMessage: async (request: SendMessageRequest) => await baseApiRequest<Message>(
            () => {
                console.debug(`sending message`)
                return baseApi.post<Message>(`/conversation/message`, { body: JSON.stringify(request) })
            },
            'error getting user details',
        ),
        getMessages: async (request: GetMessagesRequest) => await baseApiRequest<Message[]>(
            () => {
                console.debug(`getting messages`)
                return baseApi.post<Message[]>(`/conversation`, { body: JSON.stringify(request) })
            },
            'error getting messages',
        )
    }
}

