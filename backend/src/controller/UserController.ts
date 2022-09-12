import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { userService } from "../service/UserService";
import { MyResponse, SetPokeRequest, SetPokeResponse, UserDetails } from "../types";
import { validateHttpBody, verifyBool, verifyDefined, verifyString } from "../util/validateHttpBody";
import { withJwtFromHeader } from "../service/AuthService";
import { conversationService } from "../service/ConversationService";
import { tryCatch } from "../util/tryCatch";
import { notificationService } from "../service/NotificationService";
import { HttpError } from "../util/HttpError";

export const userController = {
    get: async (req: Request, res: Response) => {
        try {
            const user = await userService.get(req.params.userId)
            if (user) {
                res.json(user);
            } else {
                res
                    .status(404)
                    .json({ error: 'Could not find user with provided "userId"' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not retreive user" });
        }

    },
    update: async (req: Request<{}, {}, UserDetails>, res: Response<MyResponse<UserDetails>>) => {
        validateHttpBody(req.body, res, validateUserDetails, async () => {
            withJwtFromHeader(req, res, async (jwtInfo) => {
                const user = req.body
                if (user.userId !== jwtInfo.userId) res.status(400).json({ error: `user id doesn't match user id in token (token=${jwtInfo.userId}, body=${user.userId})` })
                else {
                    const preExistingUser = await userService.get(user.userId)
                    try {
                        const result = await userService.upsert({ ...preExistingUser, ...user })
                        res.json(result);
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({ error: `Could not update user - ${error.toString()}` });
                    }
                }
            })
        })
    },
    setPoke: async (req: Request<{}, {}, SetPokeRequest>, res: Response<MyResponse<SetPokeResponse>>) => {
        withJwtFromHeader(req, res, async (jwtInfo) => {
            validateHttpBody(req.body, res, validateSetPokeRequest, async () => {
                tryCatch(async () => {
                    const otherUserId = req.body.userId
                    const otherUser = await userService.get(otherUserId)
                    if (!otherUser) throw new HttpError(`user doesn't exist (user=${otherUserId})`, 400)
                    const thisUser = await userService.get(jwtInfo.userId)
                    if (!thisUser) throw new HttpError(`user doesn't exist (user=${jwtInfo.userId})`, 400)
                    else {
                        if (req.body.isPoked && otherUser.poked && otherUser.poked[jwtInfo.userId] === true) { // it's a match!
                            console.debug(`match found (users=${thisUser.userId}, ${otherUserId})`)
                            // delete from other user poked
                            const poked = await userService.setPoked(thisUser, otherUser, false)
                            const thisUserNewConvo = await conversationService.create(thisUser, otherUser)

                            await notificationService.notify(otherUser.pushToken, { title: `New match!` })
                            res.json({ newConvo: thisUserNewConvo, poked })
                        } else {
                            const poked = await userService.setPoked(thisUser, otherUser, req.body.isPoked)
                            // TODO notify others at resort?
                            res.json({ poked })
                        }
                    }
                }, res)
            })

        })
    }
}

function validateUserDetails(a: any): a is UserDetails {
    verifyDefined(a.name, 'name')
    verifyDefined(a.email, 'email')
    verifyDefined(a.userId, 'userId')
    verifyDefined(a.loginType, 'loginType')
    verifyDefined(a.ski, 'ski')
    return true
}
function validateSetPokeRequest(a: SetPokeRequest): a is SetPokeRequest {
    verifyDefined(a.userId, 'userId')
    verifyDefined(a.isPoked, 'isPoked')
    verifyString(a.userId, 'userId')
    verifyBool(a.isPoked, 'isPoked')
    return true
}