import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';

export const userService = {
    get: async (req: Request, res: Response) => {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId: req.params.userId,
            },
        };

        try {
            const { Item } = await dynamoDbClient.get(params).promise();
            if (Item) {
                const { userId, name } = Item;
                res.json({ userId, name });
            } else {
                res
                    .status(404)
                    .json({ error: 'Could not find user with provided "userId"' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not retreive user" });
        }

    },
    add: async (req: Request, res: Response) => {
        const { userId, name } = req.body;
        if (typeof userId !== "string") {
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