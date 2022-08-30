import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { CreateSessionRequest, CreateSessionResponse, GetPeopleFeedRequest, GetPeopleFeedResponse, Place, SkiSession } from "../types";
import { validateHttpBody } from "../util/validateHttpBody";
import geohash from 'ngeohash';
import { v4 as uuidv4 } from 'uuid';
import { withJwtFromHeader } from "../service/AuthService";
import { dummyPeopleFeedPeople } from "../util/dummyData";

export const skiSessionController = {
    add: async (req: Request<{}, {}, CreateSessionRequest>, res: Response<CreateSessionResponse>) => {
        const body = req.body;
        validateHttpBody(body, res, verifyCreateSessionRequest, () => {
            withJwtFromHeader(req, res, async (jwtInfo) => {
                res.json({ createdAt: new Date().getTime(), id: uuidv4(), userId: jwtInfo.userId, resort: body.resort, userLocation: body.userLocation })
            })
        })
    },
    findNearbyPeople: async (req: Request<{}, {}, GetPeopleFeedRequest>, res: Response<GetPeopleFeedResponse>) => {
        const body = req.body;
        validateHttpBody(body, res, verifyGetPeopleFeedRequest, () => {
            withJwtFromHeader(req, res, async (jwtInfo) => {
                res.json({ people: dummyPeopleFeedPeople })
            })
        })
    },
}

function verifyCreateSessionRequest(a: CreateSessionRequest) {
}
function verifyGetPeopleFeedRequest(a: GetPeopleFeedRequest) {
}
