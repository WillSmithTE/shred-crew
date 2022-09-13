import { BackendUser, markers } from "../backendTypes"
import { dynamoDbClient, USERS_TABLE } from "../database"
import { jsonString } from "./jsonString"

async function main() {
    const conversationId = 'qWi91oFN_60WEuLe7Avh1'
    console.debug({USERS_TABLE})
    const { Items } = await dynamoDbClient.query({
        TableName: USERS_TABLE,
        IndexName: 'gsi2',
        KeyConditionExpression: '#sk = :sk',
        ExpressionAttributeNames: {
            '#sk': 'sk',
        },
        ExpressionAttributeValues: {
            ':sk': `${markers.conversation}${conversationId}`,
        },
    }).promise()

    console.debug(jsonString(Items))
}
main()
