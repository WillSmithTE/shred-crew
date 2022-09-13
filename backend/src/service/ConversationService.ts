import { dynamoDbClient, USERS_TABLE } from "../database";
import { Conversation, LoginType, UserDetails } from "../types";
import { BackendConversation, markers, BackendUser } from "../backendTypes";
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
}

function createConversation(id: string, a: UserDetails, b: UserDetails): BackendConversation {
    return {
        sk: `${markers.conversation}${id}`,
        userId: a.userId,
        name: b.name,
        img: b.imageUri,
        created: new Date().getTime(),
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