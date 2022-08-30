import { dynamoDbClient, USERS_TABLE } from "../database";
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
    getByEmail: async function (email: string) {
        const { Items } = await dynamoDbClient.query({
            TableName: USERS_TABLE,
            IndexName: 'gsi1',
            KeyConditionExpression: '#email = :email',
            ExpressionAttributeNames: {
                '#email': 'email',
            },
            ExpressionAttributeValues: {
                ':email': email,
            },
        }).promise()
        return (Items.length > 0 ? Items[0] : undefined) as UserDetailsWithPassword
    },
    upsert: async function (user: UserDetailsWithPassword): Promise<UserDetails> {
        console.debug(`upserting user (id=${user.userId})`)
        const params = {
            TableName: USERS_TABLE,
            Item: user,
        };
        await dynamoDbClient.put(params).promise()
        return withoutPassword(user as UserDetailsWithPassword)
    },
    upsertWithoutPassword: async function (user: UserDetails): Promise<UserDetails> {
        console.debug(`upserting user without password (id=${user.userId})`)
        const params = {
            TableName: USERS_TABLE,
            Item: user,
        };
        await dynamoDbClient.put(params).promise()
        return user
    },
}

export function withoutPassword(withPassword: UserDetailsWithPassword): UserDetails {
    const user = { ...withPassword }
    delete user.password
    return user
}