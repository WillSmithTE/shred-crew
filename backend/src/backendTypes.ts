import { JwtPayload } from "jsonwebtoken";
import { UserDetails } from "./types";

export type BackendUser = UserDetails & {
    password: string,
    gsi2sk?: string,
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
    gsi2sk: string,
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

export type MarkReadRequest = {
    conversationId: string,
    time: number,
}