import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import { defaultSkiDetails, GoogleSignInRequest, LoginRegisterResponse, LoginRequest, LoginState, LoginType, RegisterRequest, UserDetails } from "../types";
import bcrypt from "bcryptjs";
import { validateHttpBody, verifyDefined as validateDefined, verifyString as validateString } from "../util/validateHttpBody";
import { userService, backendUserToFrontend } from "../service/UserService";
import { authService } from "../service/AuthService";
import { myConfig } from "../myConfig";
import { myId } from "../service/myId";
import { conversationService } from "../service/ConversationService";
import { BackendUser } from "../backendTypes";

export const authController = {
    login: async (req: Request<{}, LoginRequest>, res: Response<LoginRegisterResponse>) => {
        const body = req.body
        validateHttpBody(body, res, validateLoginRequest, async () => {
            const preExistingUser = await userService.getByEmail(body.email.toLowerCase(), LoginType.EMAIL)
            if (preExistingUser === undefined) res.status(401).send()
            else {
                const isValidPassword = await bcrypt.compare(body.password, preExistingUser.password);
                if (isValidPassword) {
                    const loginState = authService.generateTokens(preExistingUser.userId, preExistingUser.email)
                    res.json({ user: backendUserToFrontend(preExistingUser), auth: loginState });
                } else {
                    res.status(401).send()
                }
            }
        })

    },
    register: async (req: Request<{}, {}, RegisterRequest>, res: Response<LoginRegisterResponse>) => {
        const body = req.body
        validateHttpBody(body, res, validateRegisterRequest, async () => {
            const email = body.email.toLowerCase()
            console.debug(`registering (email=${email})`)
            const preExistingUser = await userService.getByEmail(email, LoginType.EMAIL)
            if (preExistingUser !== undefined) res.status(409).send()
            else {
                const salt = await bcrypt.genSalt(10);
                const saltedPassword = await bcrypt.hash(body.password, salt);
                const user: BackendUser = {
                    userId: myId(),
                    name: body.name,
                    password: saltedPassword,
                    loginType: LoginType.EMAIL,
                    email: email,
                    ski: defaultSkiDetails,
                }
                try {
                    const userResponse = await userService.upsert(user)
                    const conversations = await conversationService.createBootstrapConversations(user)
                    const loginState = authService.generateTokens(user.userId, user.email)
                    res.json({ user: userResponse, auth: loginState, conversations });
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
            const backendUser = await userService.get(accessToken.userId)
            console.debug({ backendUser })
            if (backendUser === undefined || (accessToken === undefined && refreshToken === undefined)) {
                res.status(401).send()
            } else {
                let accessTokenToReturn = body.accessToken
                if (!accessToken) {
                    accessTokenToReturn = authService.generateToken(refreshToken, myConfig.accessTokenSecret, myConfig.accessTokenLife)
                }
                const user = backendUserToFrontend(backendUser)
                const conversations = await conversationService.getAllForUser(user.userId)
                return res.json({ user, conversations, auth: { accessToken: accessTokenToReturn, refreshToken: body.refreshToken } })
            }
        })
    },
    googleSignIn: async (req: Request<{}, {}, GoogleSignInRequest>, res: Response<LoginRegisterResponse>) => {
        const body = req.body
        validateHttpBody(body, res, validateGoogleSignInRequest, async () => {
            try {
                const tokenDecoded = await authService.googleIdTokenToUserDetails(body.idToken)
                const preExistingUser = await userService.getByEmail(tokenDecoded.email, LoginType.GOOGLE)
                const user = preExistingUser ??
                    await userService.upsertWithoutPassword(tokenDecoded)
                const conversations = preExistingUser ?
                    await conversationService.getAllForUser(user.userId) :
                    await conversationService.createBootstrapConversations(user)

                const loginState = authService.generateTokens(user.userId, user.email)
                res.json({ user, conversations, auth: loginState });
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: `Could not sign in with google: ${error}` } as any);
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
function validateGoogleSignInRequest(a: GoogleSignInRequest) {
    validateDefined(a.idToken, 'idToken')
    validateString(a.idToken, 'idToken')
}