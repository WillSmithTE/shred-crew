import { Conversation, GetMessagesRequest, Message, SendMessageRequest, SetPokeRequest, SetPokeResponse, UserDetails } from '../model/types';
import Constants from 'expo-constants';
import { baseApiRequest, MyResponse, useBaseApi } from './api';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

export function useConversationApi() {
    const baseApi = useBaseApi()
    return {
        getConversations: async () => await baseApiRequest<Conversation[]>(
            () => {
                console.debug(`getting conversations`)
                return baseApi.get<Conversation[]>(`/conversation`)
            },
            'error getting conversations',
        ),
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
                const queryParams = new URLSearchParams(request.beforeTime === undefined ?
                    { conversationId: request.conversationId } :
                    { conversationId: request.conversationId, beforeTime: request.beforeTime.toString() }
                )
                if (request.beforeTime === undefined) delete request.beforeTime
                return baseApi.get<Message[]>(`/conversation/message?conversationId=${queryParams.toString()}`)
            },
            'error getting messages',
        ),
    }
}

