import { Response, Request } from 'express';
import { JwtUserInfo } from '../backendTypes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { myConfig } from '../myConfig';

export function withJwt<T>(req: Request<{}, {}, T>, res: Response, onSuccess: (userInfo: JwtUserInfo) => void,) {
    try {
        const token = getToken(req)
        const decoded = jwt.verify(token, myConfig.accessTokenSecret) as JwtPayload
        const userId = decoded['userId'], email = decoded['email']

        if (userId && email) onSuccess({ userId, email })
        else throw 'Missing id or email in jwt'
    } catch (e) {
        res.status(401).json({ error: e.toString() })
    }
}

function getToken(req: Request): string {
    return req.header('Authorization').replace('Bearer ', '')
}