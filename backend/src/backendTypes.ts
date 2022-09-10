import { JwtPayload } from "jsonwebtoken";
import { Conversation, UserDetails } from "./types";

export type UserDetailsWithPassword = UserDetails & {
    password: string,
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
    message?: { time: number, user: string, data: { text: string } },
    name: string,
    img?: string,
    created: number,
}
export const markers = {
    conversation: 'c#',
    user: 'u',
}