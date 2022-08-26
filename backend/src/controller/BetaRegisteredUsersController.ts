import { BETA_REGISTERED_USERS_TABLE, dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { emailService } from "../service/EmailService";

export const betaRegisteredUsersController = {
    add: async (req: Request<{}, { email: string }>, res: Response) => {
        const { email } = req.body;
        console.debug(`adding user to beta list (email=${email})`)
        if (typeof email !== "string" || email === undefined) {
            res.status(400).json({ error: `email must be a string (email=${email})` });
        }

        const params = {
            TableName: BETA_REGISTERED_USERS_TABLE,
            Item: {
                email
            },
        };

        try {
            await dynamoDbClient.put(params).promise();
            await emailService.sendWelcome(email)
            res.json({ email });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not create user" });
        }
    }
}