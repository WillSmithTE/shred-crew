import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { myConfig } from "../myConfig";
import { JwtUserInfo, MyJwtPayload } from "../backendTypes";
import { OAuth2Client } from 'google-auth-library';
import { defaultSkiDetails, LoginType, UserDetails } from "../types";

const googleClient = new OAuth2Client(myConfig.googleExpoClientId)
export const authService = {
    generateToken: function (jwtUserInfo: JwtUserInfo, secret: string, expiresIn: string) {
        return jwt.sign(jwtUserInfo, secret, { expiresIn })
    },
    generateTokens: function (userId: string, email: string) {
        const jwtUserInfo = { userId: userId, email: email }
        return {
            accessToken: authService.generateToken(jwtUserInfo, myConfig.accessTokenSecret, myConfig.accessTokenLife),
            refreshToken: authService.generateToken(jwtUserInfo, myConfig.refreshTokenSecret, myConfig.refreshTokenLife),
        }
    },
    verifyJwt: function (token: string, secret: string): MyJwtPayload | undefined {
        try {
            const decoded = jwt.verify(token, secret) as JwtPayload
            const userId = decoded['userId'], email = decoded['email']
            if (!userId || !email) throw 'Missing id or email in jwt'
            return { ...decoded, userId, email }
        } catch (e) {
            return undefined
        }
    },
    // https://developers.google.com/identity/sign-in/web/backend-auth
    googleIdTokenToUserDetails: async function (idToken: string): Promise<UserDetails> {
        console.debug(`verify google sign in (idToken=${idToken})`)
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: [myConfig.googleAndroidClientId, myConfig.googleExpoClientId, myConfig.googleIosClientId],
        });
        const payload = ticket.getPayload();
        return {
            userId: `google:${payload.sub}`,
            imageUri: payload.picture,
            createdAt: new Date().getTime(),
            email: payload.email,
            loginType: LoginType.GOOGLE,
            name: payload.name ?? '',
            ski: defaultSkiDetails,
        }
    }
}

export function withJwtFromHeader<T>(req: Request<{}, {}, T>, res: Response, onSuccess: (userInfo: JwtUserInfo) => void,) {
    try {
        const token = getTokenFromHeader(req)
        const { userId, email } = authService.verifyJwt(token, myConfig.accessTokenSecret)
        onSuccess({ userId, email })
    } catch (e) {
        res.status(401).json({ error: e.toString() })
    }
}

function getTokenFromHeader(req: Request): string {
    return req.header('Authorization').replace('Bearer ', '')
}

