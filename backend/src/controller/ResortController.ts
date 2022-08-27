import { dynamoDbClient, RESORTS_TABLE } from "../database";
import { Request, Response } from 'express';
import geohash from 'ngeohash';
import { removeDuplicates } from "../util/removeDuplicates";
import { MyLocation, Place, ViewPort } from "../types";
import { verifyDefined, verifyNumber } from "../util/validateHttpBody";

const coordinateSearchMargin = 0.05
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
            verifyCoordinates(location, res)
            const [southwestLat, southwestLng] = [location.lat - coordinateSearchMargin, location.lng - coordinateSearchMargin]
            const [northeastLat, northeastLng] = [location.lat + coordinateSearchMargin, location.lng + coordinateSearchMargin]
            const hashes = geohash.bboxes(southwestLat, southwestLng, northeastLat, northeastLng, 4);
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
            const sorted = sortByClosest(location, placesWithoutDuplicates)
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

function verifyCoordinates(location: MyLocation, res: Response) {
    verifyDefined(location, 'location')
    verifyNumber(location.lat, 'location.lat')
    verifyNumber(location.lng, 'location.lng')
}

function sortByClosest(location: MyLocation, resorts: Place[]): Place[] {
    const resortsWithDistances = resorts.map((resort) => ({
        ...resort,
        distance: getDistanceBetweenPoints(location, resort.googlePlace.geometry.location)
    }))
    return resortsWithDistances.sort((a, b) => a.distance - b.distance)
}

function getDistanceBetweenPoints(a: MyLocation, b: MyLocation) {
    // from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const something = 0.5 - c((b.lat - a.lat) * p) / 2 +
        c(a.lat * p) * c(b.lat * p) *
        (1 - c((b.lng - a.lng) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(something)); // 2 * R; R = 6371 km
}
