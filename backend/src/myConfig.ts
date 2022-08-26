export const myConfig = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenLife: parseInt(process.env.ACCESS_TOKEN_LIFE),
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenLife: parseInt(process.env.REFRESH_TOKEN_LIFE),
}