import { JwtPayload } from "jsonwebtoken";
import { UserDetails } from "./types";

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