import AWS from "aws-sdk";

export const USERS_TABLE = process.env.USERS_TABLE;
export const RESORTS_TABLE = process.env.RESORTS_TABLE;

const dynamoDbClientParams = {} as any;
if (process.env.IS_OFFLINE) {
    dynamoDbClientParams.region = 'localhost'
    dynamoDbClientParams.endpoint = 'http://localhost:8000'
}
export const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);
dynamoDbClient.batchWrite({
    RequestItems: {
        [USERS_TABLE]: [
            {
                PutRequest: {
                    Item: {
                        "KEY": { "N": "KEY_VALUE" },
                        "ATTRIBUTE_1": { "S": "ATTRIBUTE_1_VALUE" },
                        "ATTRIBUTE_2": { "N": "ATTRIBUTE_2_VALUE" }
                    }
                }
            },
        ]
    }
})
