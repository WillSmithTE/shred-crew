import { dynamoDbClient, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { withJwtFromHeader } from "../service/AuthService";
import { Conversation, GetMessagesRequest, Message, MyResponse, SendMessageRequest } from "../types";
import { tryCatch } from "../util/tryCatch";
import { validateHttpBody, verifyBool, verifyDefined, verifyNumber, verifyString } from "../util/validateHttpBody";
import { BackendMessage, markers } from "../backendTypes";
import { myId } from "../service/myId";

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
                        ':sk': 'c#',
                    },
                    ScanIndexForward: false,
                }).promise()
                res.json(Items as Conversation[])
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
                        KeyConditionExpression: '#cId = :cId AND begins_with(#sk, :sk1) AND LT(#sk, :sk2',
                        ExpressionAttributeNames: {
                            '#cId': 'cId',
                            '#sk': 'sk',
                        },
                        ExpressionAttributeValues: {
                            ':cId': req.query.conversationId,
                            ':sk1': markers.message,
                            ':sk2': `${markers.message}${req.query.beforeTime ?? new Date().getTime()}`,
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
        sk: `${markers.message}#${now}#${myId()}`,
        cId: sendMessageRequest.conversationId,
        data: sendMessageRequest.data,
        userId,
        time: now,
    }
}