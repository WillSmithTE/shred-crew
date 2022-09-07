import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { IconButton } from "react-native-paper"

type Props = {
    customStyles?: StyleProp<ViewStyle>,
    absolute?: boolean,
}
export const BackButton = ({ customStyles = {}, absolute = true }: Props) => {
    const { goBack } = useNavigation()
    return <IconButton onPress={goBack} icon='long-arrow-alt-left' size={40}
        style={[absolute ? styles.backButton : {}, customStyles]} />
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 10,
        left: 5,
        zIndex: 10,
    }
})
