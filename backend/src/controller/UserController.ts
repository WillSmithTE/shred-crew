import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { userService } from "../service/UserService";
import { MyResponse, UserDetails } from "../types";
import { validateHttpBody, verifyDefined } from "../util/validateHttpBody";
import { withJwtFromHeader } from "../service/AuthService";

export const userController = {
    get: async (req: Request, res: Response) => {
        try {
            const user = userService.get(req.params.userId)
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
                const preExistingUser = await userService.get(user.userId)
                try {
                    const result = await userService.upsert({ ...preExistingUser, ...user })
                    res.json(result);
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: `Could not update user - ${error.toString()}` });
                }
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