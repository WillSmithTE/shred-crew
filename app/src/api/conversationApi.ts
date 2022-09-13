import { Conversation, GetConversationDetailsRequest, GetMessagesRequest, MarkReadRequest, Message, SendMessageRequest, SetPokeRequest, SetPokeResponse, UserDetails } from '../model/types';
import Constants from 'expo-constants';
import { baseApiRequest, MyResponse, useBaseApi } from './api';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

export function useConversationApi() {
    const baseApi = useBaseApi()
    return {
        getConversationsAndMatches: async () => await baseApiRequest<Conversation[]>(
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
                const encodedConvId = decodeURI(request.conversationId)
                const queryParams = new URLSearchParams(request.beforeTime === undefined ?
                    { conversationId: encodedConvId } :
                    { conversationId: encodedConvId, beforeTime: request.beforeTime.toString() }
                )
                if (request.beforeTime === undefined) delete request.beforeTime
                return baseApi.get<Message[]>(`/conversation/message?${queryParams.toString()}`)
            },
            'error getting messages',
        ),
        getConversationDetails: async (request: GetConversationDetailsRequest) => await baseApiRequest<Conversation>(
            () => {
                console.debug(`getting conversation (id=${request.conversationId})`)
                return baseApi.get<Conversation>(`/conversation/details/${request.conversationId})`)
            },
            'error getting conversation details',
        ),
        markAsRead: async (request: MarkReadRequest) => await baseApiRequest(
            () => {
                console.debug(`marking read (conversation=${request.conversationId})`)
                return baseApi.post<Conversation>(`/conversation/read`, { body: JSON.stringify(request) })
            },
            'error marking conversation as read',
        ),
    }
}

