import { Avatar } from 'react-native-paper';
import * as ExpoImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = { imageUri?: string, setImageUri: (uri?: string) => void }
export const ImagePicker = ({ imageUri, setImageUri }: Props) => {

    const pickImage = async () => {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            setImageUri(result.uri);
        }
    };

    return <>
        <TouchableOpacity onPress={pickImage}>
            <Avatar.Image size={150} source={{ uri: imageUri }} />
        </TouchableOpacity>
    </>
}