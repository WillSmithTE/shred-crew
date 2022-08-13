import AWS from "aws-sdk";

export const USERS_TABLE = process.env.USERS_TABLE;
export const RESORTS_TABLE = process.env.RESORTS_TABLE;

const dynamoDbClientParams = process.env.IS_OFFLINE ?
    {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    } :
    { region: 'eu-central-1' }

export const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);
