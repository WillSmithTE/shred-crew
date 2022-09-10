import { dynamoDbClient, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { withJwtFromHeader } from "../service/AuthService";

export const conversationController = {
    getAllForUser: async (req: Request, res: Response) => {
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
                res.json(Items)
            } catch (e) {
                res.status(500).json({ error: e.toString() })
            }
        })
    },
}

