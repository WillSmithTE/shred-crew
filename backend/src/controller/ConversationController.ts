import { dynamoDbClient, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { withJwtFromHeader } from "../service/AuthService";
import { Conversation, GetConversationDetailsRequest, GetMessagesRequest, Message, MyResponse, SendMessageRequest } from "../types";
import { tryCatch } from "../util/tryCatch";
import { validateHttpBody, verifyBool, verifyDefined, verifyNumber, verifyString } from "../util/validateHttpBody";
import { BackendMessage, markers } from "../backendTypes";
import { myId } from "../service/myId";
import { backendConversationToFrontend, conversationService } from "../service/ConversationService";

export const conversationController = {
    getAllForUser: async (req: Request, res: Response<MyResponse<Conversation[]>>) => {
        withJwtFromHeader(req, res, async ({ userId }) => {
            console.debug(`getting conversations (userId=${userId})`)
            try {
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
                const conversations = Items.map(backendConversationToFrontend)
                res.json(conversations)
            } catch (e) {
                res.status(500).json({ error: e.toString() })
            }
        })
    },
    getAllMessagesForConversation: async (req: Request<{}, {}, {}, GetMessagesRequest>, res: Response<MyResponse<Message[]>>) => {
        withJwtFromHeader(req, res, async ({ userId }) => {
            validateHttpBody(req.query, res, validateGetMessagesRequest, async () => {
                console.debug(`getting messages (conversation=${req.query.conversationId})`)
                tryCatch(async () => {
                    const { Items } = await dynamoDbClient.query({
                        TableName: USERS_TABLE,
                        IndexName: 'conv',
                        KeyConditionExpression: '#cId = :cId AND #sk BETWEEN :sk1 AND :sk2',
                        ExpressionAttributeNames: {
                            '#cId': 'cId',
                            '#sk': 'sk',
                        },
                        ExpressionAttributeValues: {
                            ':cId': req.query.conversationId,
                            ':sk1': `${markers.message}0!`, // ! is less than #. $ is more than it
                            ':sk2': `${markers.message}${req.query.beforeTime ?? new Date().getTime()}$`,
                        },
                        ScanIndexForward: false,
                        Limit: 20,
                    }).promise()
                    res.json((Items as BackendMessage[]).map(backendMessageToFrontend))
                }, res)
            })
        })
    },
    addMessage: async (req: Request<{}, {}, SendMessageRequest>, res: Response<Message>) => {
        withJwtFromHeader(req, res, async ({ userId }) => {
            validateHttpBody(req.body, res, validateSendMessageRequest, async () => {
                console.debug(`adding message`)
                tryCatch(async () => {
                    const backendMessage = createBackendMessage(req.body, userId)
                    await dynamoDbClient.put({
                        TableName: USERS_TABLE,
                        Item: backendMessage,
                    }).promise()
                    res.json(backendMessageToFrontend(backendMessage))
                }, res)
            })
        })
    },
    getDetails: async (req: Request<GetConversationDetailsRequest>, res: Response<MyResponse<Conversation>>) => {
        withJwtFromHeader(req, res, async ({ userId }) => {
            validateHttpBody(req.params, res, validateGetDetailsRequest, async () => {
                console.debug(`getting conversation details (id=${req.params.conversationId})`)
                tryCatch(async () => {
                    const conversation = await conversationService.get(userId, req.params.conversationId)
                    res.json(conversation)
                }, res)
            })
        })
    },
}

function validateSendMessageRequest(a: SendMessageRequest): a is SendMessageRequest {
    verifyDefined(a.conversationId, 'conversationId')
    verifyDefined(a.data?.text, 'data?.text')
    verifyString(a.conversationId, 'conversationId')
    verifyString(a.data?.text, 'data?.text')
    return true
}

function validateGetMessagesRequest(a: GetMessagesRequest): a is GetMessagesRequest {
    verifyDefined(a.conversationId, 'conversationId')
    verifyString(a.conversationId, 'conversationId')
    if (a.beforeTime !== undefined) {
        verifyNumber(parseInt(a.beforeTime), 'afterTime')
    }
    return true
}

function backendMessageToFrontend(backend: BackendMessage): Message {
    return {
        _id: backend.sk.split('#')[2],
        createdAt: backend.time,
        text: backend.data.text,
        user: { userId: backend.userId, name: '' },
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

function validateGetDetailsRequest(a: GetConversationDetailsRequest): a is GetConversationDetailsRequest {
    verifyDefined(a.conversationId, 'conversationId')
    verifyString(a.conversationId, 'conversationId')
    return true
}
