import { Avatar, IconButton } from 'react-native-paper';
import * as ExpoImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { colors } from '../constants/colors';
import { Loading } from './Loading';

type Props = { imageUri?: string, setImageUri: (uri?: string) => void }
export const ImagePicker = ({ imageUri, setImageUri }: Props) => {
    const [loading, setLoading] = useState(false)
    const pickImage = async () => {
        if (!loading) {
            setLoading(true)
            const result = await ExpoImagePicker.launchImageLibraryAsync({
                mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                setImageUri(result.uri);
            } else {
                setLoading(false)
            }
        }
    };
    const showDefaultIcon = imageUri === undefined || loading
    return <>
        <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', paddingBottom: 20, }}>
            <Avatar.Icon style={[{ backgroundColor: 'gray' }, !showDefaultIcon && { display: 'none' }]} icon='account' color={colors.gray300} size={120} />
            <Avatar.Image style={showDefaultIcon && { display: 'none' }} size={120} source={{ uri: imageUri }} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)} />
            <IconButton icon='pencil-circle' size={40} color={colors.secondary} style={{ position: 'absolute', left: 70, top: 70 }} />
            {loading && <Loading backgroundColor='transparent' />}
        </TouchableOpacity>
    </>
}