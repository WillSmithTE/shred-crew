import { dynamoDbClient, USERS_TABLE } from "../database";
import { Conversation, LoginType, Message, SendMessageRequest, UserDetails } from "../types";
import { BackendConversation, markers, BackendUser, BackendMessage, MarkReadRequest } from "../backendTypes";
import { myId } from "./myId";
import { HttpError } from "../util/HttpError";
import { userWill, userPip } from '../util/bootstrapData'

export const conversationService = {
    create: async function (userA: UserDetails, userB: UserDetails): Promise<Conversation> {
        console.debug(`creating conversation (users=${userA.userId}, ${userB.userId})`)
        const conversationId = myId()
        const userAConversation = createConversation(conversationId, userA, userB)
        const userBConversation = createConversation(conversationId, userB, userA)
        await dynamoDbClient.batchWrite({
            RequestItems: {
                [USERS_TABLE]: [
                    {
                        PutRequest: { Item: userAConversation }
                    },
                    {
                        PutRequest: { Item: userBConversation }
                    },
                ]
            }
        }).promise();
        return backendConversationToFrontend(userAConversation)
    },
    getById: async function (userId: string, conversationId: string): Promise<Conversation> {
        return backendConversationToFrontend(await conversationService.getByIdBackend(userId, conversationId))
    },
    getByIdBackend: async function (userId: string, conversationId: string): Promise<BackendConversation> {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId,
                sk: `${markers.conversation}${conversationId}`,
            },
        };
        const { Item } = await dynamoDbClient.get(params).promise();
        return Item as BackendConversation
    },
    addMessage: async function (request: SendMessageRequest, userId: string): Promise<BackendMessage> {
        const backendMessage = createBackendMessage(request, userId)
        await dynamoDbClient.put({
            TableName: USERS_TABLE,
            Item: backendMessage,
        }).promise()
        const conversationRows = await getConversationRows(request.conversationId)
        await addMessageToConversations(conversationRows, backendMessage)
        return backendMessage
    },
    markRead: async function (request: MarkReadRequest, userId: string): Promise<void> {
        const conversation = await conversationService.getByIdBackend(userId, request.conversationId)
        if (conversation === undefined) throw new HttpError(`conversation not found (id=${request.conversationId})`, 400)
        if (conversation.message?.time === request.time) {
            const newConversation: BackendConversation = {
                ...conversation,
                message: conversation.message ?
                    { ...conversation.message, read: { ...conversation.message.read, [userId]: true } } :
                    undefined
            }
            console.debug({ newConversation })
            await dynamoDbClient.put({
                TableName: USERS_TABLE,
                Item: newConversation,
            }).promise()
        } else {
            console.debug(`skipping, times didnt match (conversation=${conversation.message?.time}, received=${request.time})`)
        }
    },
    getAllForUser: async function (userId: string): Promise<Conversation[]> {
        const { Items } = await dynamoDbClient.query({
            TableName: USERS_TABLE,
            KeyConditionExpression: '#userId = :userId AND begins_with(#sk, :sk)',
            ExpressionAttributeNames: {
                '#userId': 'userId',
                '#sk': 'sk',
            },
            ExpressionAttributeValues: {
                ':userId': userId,
                ':sk': markers.conversation,
            },
            ScanIndexForward: false,
        }).promise()
        return Items.map(backendConversationToFrontend)
    },
    createBootstrapConversations: async function (user: UserDetails): Promise<Conversation[]> {
        console.debug(`creating bootstrap conversations (users=${user.userId})`)
        const conversations = await Promise.all([userWill, userPip].map((otherUser) =>
            conversationService.create(user, otherUser)))
        return conversations
    },
}

async function getConversationRows(conversationId: string): Promise<BackendConversation[]> {
    const { Items } = await dynamoDbClient.query({
        TableName: USERS_TABLE,
        IndexName: 'gsi2',
        KeyConditionExpression: '#sk = :sk',
        ExpressionAttributeNames: {
            '#sk': 'sk',
        },
        ExpressionAttributeValues: {
            ':sk': `${markers.conversation}${conversationId}`,
        },
    }).promise()
    return Items as BackendConversation[]
}

async function addMessageToConversations(conversations: BackendConversation[], message: BackendMessage): Promise<void> {
    await Promise.all(conversations.map((conversation) => {
        const newConversation: BackendConversation = {
            ...conversation,
            message: { data: message.data, read: {}, time: new Date().getTime(), user: message.userId },
        }
        return dynamoDbClient.put({
            TableName: USERS_TABLE,
            Item: newConversation,
        }).promise()
    }))
}


function createConversation(id: string, a: UserDetails, b: UserDetails): BackendConversation {
    return {
        sk: `${markers.conversation}${id}`,
        userId: a.userId,
        name: b.name,
        img: b.imageUri,
        created: new Date().getTime(),
        gsi2sk: 'c',
    }
}
export function backendConversationToFrontend(conversation: BackendConversation): Conversation {
    return {
        id: conversation.sk.replace(markers.conversation, ''),
        name: conversation.name,
        img: conversation.img,
        message: conversation.message,
        created: conversation.created,
    }
}

function createBackendMessage(sendMessageRequest: SendMessageRequest, userId: string): BackendMessage {
    const now = new Date().getTime()
    return {
        sk: `${markers.message}${now}#${myId()}`,
        cId: sendMessageRequest.conversationId,
        data: sendMessageRequest.data,
        userId,
        time: now,
    }
}

export function backendMessageToFrontend(backend: BackendMessage): Message {
    return {
        _id: backend.sk.split('#')[2],
        createdAt: backend.time,
        text: backend.data.text,
        user: { userId: backend.userId, name: '' },
    }
}
