import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { LoginRegisterResponse, LoginRequest, LoginState, LoginType, RegisterRequest, UserDetails } from "../types";
import bcrypt from "bcryptjs";
import { validateHttpBody, verifyDefined as validateDefined, verifyString as validateString } from "../util/validateHttpBody";
import { userService, withoutPassword } from "../service/UserService";
import { v4 as uuidv4 } from 'uuid';
import { authService } from "../service/AuthService";
import { myConfig } from "../myConfig";
import { access } from "fs";

export const authController = {
    login: async (req: Request<{}, LoginRequest>, res: Response<LoginRegisterResponse>) => {
        const body = req.body
        validateHttpBody(body, res, validateLoginRequest, async () => {
            const preExistingUser = await userService.getByEmail(body.email)
            if (preExistingUser === undefined) res.status(404).json({ error: `User not found (email=${body.email})` } as any)
            else {
                const isValidPassword = await bcrypt.compare(body.password, preExistingUser.password);
                if (!isValidPassword) res.status(401).send()
                else {
                    const loginState = authService.generateTokens(preExistingUser.userId, preExistingUser.email)
                    res.json({ user: withoutPassword(preExistingUser), auth: loginState });
                }
            }
        })

    },
    register: async (req: Request<{}, RegisterRequest>, res: Response<LoginRegisterResponse>) => {
        const body = req.body
        validateHttpBody(body, res, validateRegisterRequest, async () => {
            console.debug(`registering (email=${body.email})`)
            const preExistingUser = await userService.getByEmail(body.email)
            if (preExistingUser !== undefined) res.status(409).send()
            else {
                const salt = await bcrypt.genSalt(10);
                const saltedPassword = await bcrypt.hash(body.password, salt);
                const user = {
                    userId: uuidv4(),
                    name: body.name,
                    password: saltedPassword,
                    loginType: LoginType.EMAIL,
                    email: body.email,
                    ski: { disciplines: {}, styles: {}, },
                }
                try {
                    const userResponse = await userService.upsert(user)
                    const loginState = authService.generateTokens(user.userId, user.email)
                    res.json({ user: userResponse, auth: loginState });
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: `Could not register: ${error}` } as any);
                }
            }
        })
    },
    refreshAuth: async (req: Request<{}, {}, LoginState>, res: Response<LoginRegisterResponse>) => {
        const body = req.body
        validateHttpBody(body, res, validateLoginState, async () => {
            const accessToken = authService.verifyJwt(body.accessToken, myConfig.accessTokenSecret)
            const refreshToken = authService.verifyJwt(body.refreshToken, myConfig.refreshTokenSecret)
            if (accessToken === undefined && refreshToken === undefined) {
                res.status(401).send()
            } else {
                let accessTokenToReturn = body.accessToken
                if (!accessToken) {
                    accessTokenToReturn = authService.generateToken(refreshToken, myConfig.accessTokenSecret, myConfig.accessTokenLife)
                }
                const user = withoutPassword(await userService.get(refreshToken.userId))
                return { user, auth: { accessToken: accessTokenToReturn, refreshToken } }
            }
        })
    },
}

function validateRegisterRequest(a: RegisterRequest) {
    validateLoginRequest(a)
    validateDefined(a.name, 'name')
    validateString(a.name, 'name')
}
function validateLoginRequest(a: LoginRequest) {
    validateDefined(a.password, 'password')
    validateString(a.password, 'password')
    validateDefined(a.email, 'email')
    validateString(a.email, 'email')
}
function validateLoginState(a: LoginState) {
    validateDefined(a.accessToken, 'accessToken')
    validateString(a.accessToken, 'accessToken')
    validateDefined(a.refreshToken, 'refreshToken')
    validateString(a.refreshToken, 'refreshToken')
}