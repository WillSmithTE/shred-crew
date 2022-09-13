import { dynamoDbClient, USERS_TABLE } from "../database";
import { Conversation, LoginType, Message, SendMessageRequest, UserDetails } from "../types";
import { BackendConversation, markers, BackendUser, BackendMessage } from "../backendTypes";
import { myId } from "./myId";

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
    get: async (userId: string, conversationId: string) => {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId,
                sk: `${markers.conversation}${conversationId}`,
            },
        };
        const { Item } = await dynamoDbClient.get(params).promise();
        return backendConversationToFrontend(Item as BackendConversation)
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
    }
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
