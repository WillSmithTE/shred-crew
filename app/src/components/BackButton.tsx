import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { IconButton } from "react-native-paper"

type Props = {
    customStyles?: StyleProp<ViewStyle>,
}
export const BackButton = ({ customStyles = {} }: Props) => {
    const { goBack } = useNavigation()
    return <IconButton onPress={goBack} icon='arrow-left' size={40} style={[styles.backButton, customStyles]} />
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 10,
        left: 5,
        zIndex: 10,
    }
})
