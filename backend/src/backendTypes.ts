import { UserDetails } from "./types";

export type UserDetailsWithPassword = UserDetails & {
    password: string,
}

export type JwtUserInfo = {
    userId: string,
    email: string,
}