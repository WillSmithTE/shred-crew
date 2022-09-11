import { IMessage, User as MessageUser } from "react-native-gifted-chat";
import { BaseUserProfile, Message, } from "./types";

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

export function messageToIMessage(message: Message): IMessage {
    return {
        ...message,
        user: { _id: message.user.userId }
    }
}
export function iMessageToMessage(message: IMessage): Message {
    return {
        ...message,
        _id: message._id.toString(),
        user: { userId: message.user._id.toString(), name: '' },
        createdAt: typeof message.createdAt === 'number' ? message.createdAt : message.createdAt.valueOf(),
    }

}