import { UserDetails } from "./types";

export type UserDetailsWithPassword = UserDetails & {
    password: string,
}