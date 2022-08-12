import { dynamoDbClient, RESORTS_TABLE } from "../database";
import { Request, Response } from 'express';
import geohash from 'ngeohash';
import { removeDuplicates } from "../util/removeDuplicates";
import { MyLocation, Place, ViewPort } from "../types";

const coordinateSearchMargin = 0.05
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
    getAllNearCoordinates: async (req: Request<{}, Place[], ResortSearchByCoordinatesDto>, res: Response) => {
        const location: MyLocation = req.body;
        console.debug(JSON.stringify(req.body, null, 2))
        try {
            verifyCoordinates(location, res)
            const [southwestLat, southwestLng] = [location.lat - coordinateSearchMargin, location.lng - coordinateSearchMargin]
            const [northeastLat, northeastLng] = [location.lat + coordinateSearchMargin, location.lng + coordinateSearchMargin]
            const hashes = geohash.bboxes(southwestLat, southwestLng, northeastLat, northeastLng, 4);
            console.info(JSON.stringify({ hashes }));
            const places = await Promise.all(hashes.map((hash) =>
                dynamoDbClient.query({
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
    getById: async (req: Request<{ resortId: string }, Place>, res: Response) => {
        const params = {
            TableName: RESORTS_TABLE,
            Key: { id: req.params.resortId, },
        };

        try {
            const { Item } = await dynamoDbClient.get(params).promise();
            if (Item) {
                res.json(Item);
            } else {
                res
                    .status(404)
                    .json({ error: `Could not find resort (id=${req.params.resortId})` });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not retreive resort" });
        }
    },
}


type ResortSearchByCoordinatesDto = MyLocation
function verifyCoordinates(location: MyLocation, res: Response) {
    verifyDefined(location, res, 'location')
    verifyNumber(location.lat, res, 'location.lat')
    verifyNumber(location.lng, res, 'location.lng')
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