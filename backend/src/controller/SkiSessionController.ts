import { dynamoDbClient, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { CreateSessionRequest, CreateSessionResponse, GetPeopleFeedRequest, GetPeopleFeedResponse, placeToPlaceSummary, SkiSession, UserDetails } from "../types";
import { validateHttpBody, verifyDefined, verifyObject, verifyString } from "../util/validateHttpBody";
import { withJwtFromHeader } from "../service/AuthService";
import { userService } from "../service/UserService";
import { BackendUser, markers } from "../backendTypes";
import { resortService } from "../service/ResortService";
import { tryCatch } from "../util/tryCatch";
import { removeDuplicates } from "../util/removeDuplicates";
import { locationService } from '../service/LocationService'
import { HttpError } from "../util/HttpError";

export const skiSessionController = {
    add: async (req: Request<{}, {}, CreateSessionRequest>, res: Response<CreateSessionResponse>) => {
        const body = req.body;
        withJwtFromHeader(req, res, async (jwtInfo) => {
            validateHttpBody(body, res, verifyCreateSessionRequest, async () => {
                console.debug(`adding session (userId=${jwtInfo.userId})`)
                tryCatch(async () => {
                    const user = await userService.get(jwtInfo.userId)
                    if (user === undefined) throw new HttpError(`user not found (id=${jwtInfo.userId})`, 400)
                    const newSession: SkiSession = {
                        userId: user.userId,
                        resort: body.resort,
                        userLocation: body.userLocation,
                        time: new Date().getTime(),
                    }
                    const updatedUser: BackendUser = {
                        ...user,
                        seshLoc: resortService.getHash(newSession.resort.location),
                        sesh: newSession,
                    }
                    await userService.upsert(updatedUser)
                    res.json(newSession);
                }, res)
            })
        })
    },
    findNearbyPeople: async (req: Request<{}, {}, GetPeopleFeedRequest>, res: Response<GetPeopleFeedResponse>) => {
        const body = req.body;
        withJwtFromHeader(req, res, async (jwtInfo) => {
            validateHttpBody(body, res, verifyGetPeopleFeedRequest, () => {
                console.debug(`getting nearby people (userId=${jwtInfo.userId})`)
                tryCatch(async () => {
                    const hashes = resortService.getHashesNearLocation(body.location)
                    console.debug(`hashes in session search (hashes=${hashes})`)
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
                            .then((it) => {
                                return it.Items as BackendUser[]
                            })
                    )))
                        .flat()
                    const withoutThisUser = removeUser(users, jwtInfo.userId)
                    const withoutDups = removeDuplicates(withoutThisUser, 'userId')
                    const sorted = locationService.sortByClosest(body.location, withoutDups, (user) => user.sesh.resort.location)
                    res.json({ people: sorted })
                }, res)
            })
        })
    },
}

function verifyCreateSessionRequest(a: CreateSessionRequest) {
    verifyDefined(a.resort, 'resort')
    verifyObject(a.resort, 'resort')
    return true
}
function verifyGetPeopleFeedRequest(a: GetPeopleFeedRequest) {
    verifyDefined(a.userId, 'userId')
    verifyString(a.userId, 'userId')
    verifyDefined(a.location, 'location')
    verifyObject(a.location, 'location')
    return true
}

function removeUser(users: UserDetails[], userId: string): UserDetails[] {
    const index = users.findIndex((it) => it.userId === userId)
    if (index !== -1) users.splice(index, 1)
    return users
}