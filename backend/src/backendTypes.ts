import { JwtPayload } from "jsonwebtoken";
import { Conversation, MyLocation, SkiSession, UserDetails } from "./types";

export type BackendUser = UserDetails & {
    password: string,
    seshLoc?: string,
}

export type JwtUserInfo = {
    userId: string,
    email: string,
}

export type MyJwtPayload = JwtPayload & {
    email: string, userId: string,
}

export type BackendConversation = {
    userId: string,
    sk: string,
    message?: {
        time: number,
        user: string,
        data: BackendMessage['data'],
        read: { [userId: string]: boolean }
    },
    name: string,
    img?: string,
    created: number,
}
export const markers = {
    conversation: 'c#',
    user: 'u',
    message: 'm#'
}

export type BackendMessage = {
    userId: string,
    sk: string,
    data: { text: string },
    cId: string,
    time: number,
}
