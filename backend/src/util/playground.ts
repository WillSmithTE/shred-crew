import { BackendUser, markers } from "../backendTypes"
import { dynamoDbClient, USERS_TABLE } from "../database"
import { jsonString } from "./jsonString"

async function main() {
    const hashes = ['u0hu', 'u0hv']
    const users = (await Promise.all(hashes.map((hash) =>
        dynamoDbClient.query({
            TableName: USERS_TABLE,
            IndexName: 'sesh',
            KeyConditionExpression: '#sk = :sk AND begins_with(#seshLoc, :hash)',
            ExpressionAttributeNames: {
                '#sk': 'sk',
                '#seshLoc': 'seshLoc'
            },
            ExpressionAttributeValues: {
                ':sk': markers.user,
                ':hash': hash
            },
        }).promise()
            .then((it: any) => {
                return it.Items as BackendUser[]
            })
    )))
        .flat()

    console.debug(jsonString(users))
}
main()
