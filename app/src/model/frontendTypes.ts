import { User as MessageUser } from "react-native-gifted-chat";
import { BaseUserProfile, } from "./types";

export function toMessageUser(user: BaseUserProfile): MessageUser {
    return {
        _id: user.userId,
        avatar: user.imageUri,
        name: user.name,
    }
}
export function fromMessageUser(user: MessageUser): BaseUserProfile {
    console.log({ user })
    console.log({
        userId: user._id.toString(),
        imageUri: typeof user.avatar === 'number' ? undefined : (typeof user.avatar === 'function' ?
            user.avatar.call('', '').toString() : user.avatar),
        name: user.name ?? '',
    }
    )
    return {
        userId: user._id.toString(),
        imageUri: typeof user.avatar === 'number' ? undefined : (typeof user.avatar === 'function' ?
            user.avatar.call('', '').toString() : user.avatar),
        name: user.name ?? '',
    }
}