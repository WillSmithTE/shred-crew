import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { UserDetails } from "../types";
import { UserDetailsWithPassword } from "../backendTypes";

export const userService = {
    get: async (userId: string) => {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId,
            },
        };
        const { Item } = await dynamoDbClient.get(params).promise();
        return Item as UserDetailsWithPassword
    },
    getByEmail: async function (email: string): Promise<UserDetails> {
        const { Items } = await dynamoDbClient.query({
            TableName: USERS_TABLE,
            IndexName: 'gsi1',
            KeyConditionExpression: '#pk = :pk',
            ExpressionAttributeNames: {
                '#pk': 'gsi1pk',
            },
            ExpressionAttributeValues: {
                ':pk': email,
            },
        }).promise()
        return (Items.length > 0 ? Items[0] : undefined) as UserDetailsWithPassword
    },
    add: async (req: Request<{}, {}, UserDetailsWithPassword>, res: Response) => {
        const user = req.body;
        if (typeof user.userId !== "string") {
            res.status(400).json({ error: 'userId must be a string' });
        } else if (typeof name !== "string") {
            res.status(400).json({ error: 'name must be a string' });
        }

        const params = {
            TableName: USERS_TABLE,
            Item: {
                userId: userId,
                name: name,
            },
        };

        try {
            await dynamoDbClient.put(params).promise();
            res.json({ userId, name });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not create user" });
        }
    }
}