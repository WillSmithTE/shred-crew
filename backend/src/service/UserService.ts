import { dynamoDbClient, USERS_TABLE } from "../database";
import { LoginType, UserDetails } from "../types";
import { markers, BackendUser } from "../backendTypes";

export const userService = {
    get: async (userId: string) => {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId,
                sk: markers.user,
            },
        };
        const { Item } = await dynamoDbClient.get(params).promise();
        return Item as BackendUser
    },
    getByEmail: async function (email: string, loginType: LoginType): Promise<BackendUser | undefined> {
        const { Items } = await dynamoDbClient.query({
            TableName: USERS_TABLE,
            IndexName: 'gsi1',
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
        return Items.length > 0 ? (Items[0] as BackendUser) : undefined
    },
    upsert: async function (user: BackendUser): Promise<UserDetails> {
        console.debug(`upserting user (id=${user.userId})`)
        const params = {
            TableName: USERS_TABLE,
            Item: {
                ...user,
                sk: markers.user,
            },
        };
        await dynamoDbClient.put(params).promise()
        return backendUserToFrontend(user)
    },
    upsertWithoutPassword: async function (user: UserDetails): Promise<UserDetails> {
        console.debug(`upserting user without password (id=${user.userId})`)
        const params = {
            TableName: USERS_TABLE,
            Item: {
                ...user,
                sk: 'u',
            },
        };
        await dynamoDbClient.put(params).promise()
        return user
    },
    setPoked: async function (userA: BackendUser, userB: BackendUser, isPoked: boolean): Promise<UserDetails['poked']> {
        console.debug(`setting poked (userA=${userA.userId}, userB=${userB.userId}, poked=${isPoked})`)
        const poked = { ...userA.poked }
        if (isPoked) poked[userB.userId] = true
        else delete poked[userB.userId]
        await dynamoDbClient.put({
            TableName: USERS_TABLE,
            Item: {
                ...userA,
                poked,
            },
        }).promise()
        return poked
    },
}

export function backendUserToFrontend(backend: BackendUser): UserDetails {
    const user = { ...backend }
    delete user.password
    return {
        ...user,
    }
}