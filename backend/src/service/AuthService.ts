import { dynamoDbClient, RESORTS_TABLE, USERS_TABLE } from "../database";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { myConfig } from "../myConfig";

export const authService = {
    generateTokens: function (userId: string, email: string) {
        const jwtUserInfo = { userId: userId, email: email }
        const accessToken = jwt.sign(jwtUserInfo, myConfig.accessTokenSecret, { expiresIn: myConfig.accessTokenLife })
        const refreshToken = jwt.sign(jwtUserInfo, myConfig.refreshTokenSecret, { expiresIn: myConfig.refreshTokenLife })
        return {
            accessToken,
            refreshToken,
        }
    },
}