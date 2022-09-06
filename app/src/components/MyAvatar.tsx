import { StyleProp, ViewStyle } from "react-native"
import { Avatar } from "react-native-paper"
import { AvatarImageSource } from "react-native-paper/lib/typescript/components/Avatar/AvatarImage"
import PaperAvatarImage from "./PaperAvatarImage"

type Props = {
    image?: AvatarImageSource,
    name: string,
    size?: number,
    style?: StyleProp<ViewStyle>,
}
export const MyAvatar = ({ image, name, size = 40, style }: Props) => {
    return image ?
        <PaperAvatarImage size={size} source={image} style={style} /> :
        <Avatar.Text size={size} label={name.charAt(0)} style={style} />
}