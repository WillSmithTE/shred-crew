import { dynamoDbClient, RESORTS_TABLE } from "../database";
import { Request, Response } from 'express';
import geohash from 'ngeohash';
import { removeDuplicates } from "../util/removeDuplicates";
import { MyLocation, Place, ViewPort } from "../types";

export const resortService = {
    search: async (req: Request, res: Response) => {
        const params = {
            TableName: RESORTS_TABLE,
        };
        const { Items } = await dynamoDbClient.scan(params).promise();
        if (Items) {
            res.json(Items);
        } else {
            res.status(404).json({ error: 'no items found' });
        }
    },
    // change to take 1 coordinate and add/subtract maybe 0.5 from either side
    getAllWithinCoordinates: async (req: Request<{}, Place[], ResortSearchByCoordinatesDto>, res: Response) => {
        const { southwest, northeast } = req.body;
        console.debug(JSON.stringify(req.body, null, 2))
        try {
            verifyCoordinates(southwest, northeast, res)
            const hashes = geohash.bboxes(southwest.lat, southwest.lng, northeast.lat, northeast.lng, 4);
            console.info(JSON.stringify({ hashes }));
            const places = await Promise.all(hashes.map((hash) =>
                dynamoDbClient.query({
                    // TableName: RESORTS_TABLE,
                    // KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :hash)',
                    // ExpressionAttributeNames: {
                    //     '#pk': 'gsi1pk',
                    //     '#sk': 'gsi1sk'
                    // },
                    // ExpressionAttributeValues: {
                    //     ':pk': 'Geohash',
                    //     ':hash': hash
                    // },
                    TableName: RESORTS_TABLE,
                    IndexName: 'gsi1',
                    KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :hash)',
                    ExpressionAttributeNames: {
                        '#pk': 'gsi1pk',
                        '#sk': 'gsi1sk'
                    },
                    ExpressionAttributeValues: {
                        ':pk': 'Geohash',
                        ':hash': hash
                    },
                }).promise()
                    .then((it) => {
                        console.log(`matchedResorts=${JSON.stringify(it, null, 2)}`)
                        return it.Items as Place[]
                    })
            )).then((it) => it.flat())

            const placesWithoutDuplicates = removeDuplicates(places, 'id')
            res.status(200).json(placesWithoutDuplicates)
        } catch (e) {
            res.status(400).json({ error: e.toString() })
        }
    },
}


type ResortSearchByCoordinatesDto = ViewPort
function verifyCoordinates(southwest: MyLocation, northeast: MyLocation, res: Response) {
    verifyDefined(southwest, res, 'southwest')
    verifyDefined(northeast, res, 'northeast')
    verifyNumber(southwest.lat, res, 'southwest.lat')
    verifyNumber(southwest.lng, res, 'southwest.lng')
    verifyNumber(northeast.lat, res, 'southwest.lat')
    verifyNumber(northeast.lat, res, 'southwest.lng')
}

function verifyDefined(a: any, res: Response, fieldName: string) {
    if (a === undefined) {
        throw new Error(`${fieldName} can't be undefined`)
    }
}
function verifyNumber(a: any, res: Response, fieldName: string): a is number {
    console.log({ a, fieldName, type: typeof a })
    if (typeof a === 'number') return true
    throw new Error(`${fieldName} must be a number`)
}