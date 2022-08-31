import { dynamoDbClient, USERS_TABLE } from "../database";
import { LoginType, UserDetails } from "../types";
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
    getByEmail: async function (email: string, loginType: LoginType): Promise<UserDetailsWithPassword | undefined> {
        const { Items } = await dynamoDbClient.query({
            TableName: USERS_TABLE,
            IndexName: 'gsi2',
            KeyConditionExpression: '#email = :email AND #loginType = :loginType',
            ExpressionAttributeNames: {
                '#email': 'email',
                '#loginType': 'loginType',
            },
            ExpressionAttributeValues: {
                ':email': email,
                ':loginType': loginType,
            },
        }).promise()
        return Items.length > 0 ? (Items[0] as UserDetailsWithPassword) : undefined
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