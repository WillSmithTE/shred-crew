import { dynamoDbClient, RESORTS_TABLE } from "../database";
import { Request, Response } from 'express';
import { removeDuplicates } from "../util/removeDuplicates";
import { MyLocation, Place, ViewPort } from "../types";
import { verifyDefined, verifyMyLocation, verifyNumber } from "../util/validateHttpBody";
import { resortService } from "../service/ResortService";
import { locationService } from "../service/LocationService";

export const resortController = {
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
    getAllNearCoordinates: async (req: Request<{}, Place[], MyLocation>, res: Response) => {
        const location: MyLocation = req.body;
        console.debug(`received coordinates (coordinates=${JSON.stringify(req.body, null, 2)}`)
        try {
            verifyMyLocation(location, res)
            const hashes = resortService.getHashesNearLocation(location)
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
                        return it.Items as Place[]
                    })
            )).then((it) => it.flat())

            const placesWithoutDuplicates = removeDuplicates(places, 'id')
            const sorted = locationService.sortByClosest(location, placesWithoutDuplicates, (place) => place.googlePlace.geometry.location)
            res.json(sorted)
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
            const { Item, $response } = await dynamoDbClient.get(params).promise();
            if (Item) {
                res.json(Item);
            } else {
                res
                    .status(404)
                    .json({
                        error: `Could not find resort (id=${req.params.resortId}, 
                        error=${$response.error}, data=${$response.data})`
                    });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not retreive resort" });
        }
    },
}
