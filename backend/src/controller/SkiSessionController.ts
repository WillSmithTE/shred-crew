import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { CreateSessionRequest, CreateSessionResponse, Place } from "../types";
import { validateHttpBody } from "../util/validateHttpBody";
import geohash from 'ngeohash';

export const skiSessionController = {
    add: async (req: Request<{}, CreateSessionRequest>, res: Response<CreateSessionResponse>) => {
        const place = req.body;
        validateHttpBody(place, res, verifyPlace, () => {
            res.json({ createdAt: 5, id: '123', place, userId: '999' })
            // const hash = geohash.encode(geometry.location.lat, geometry.location.lng)
            // const params = {
            //     TableName: USERS_TABLE,
            //     Item: {
            //         userId: userId,
            //         name: name,
            //     },
            // };
            // try {
            //     await dynamoDbClient.put(params).promise();
            //     res.json({ userId, name });
            // } catch(error) {
            //     console.log(error);
            //     res.status(500).json({ error: "Could not create user" });
            // }        
        })
    }
}

function verifyPlace(place: Place) {
}
