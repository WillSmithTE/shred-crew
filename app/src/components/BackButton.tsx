import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet } from "react-native"
import { IconButton } from "react-native-paper"

export const BackButton = () => {
    const { goBack } = useNavigation()
    return <IconButton onPress={goBack} icon='arrow-left' size={40} style={styles.backButton} />
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        paddingBottom: 5,
    }
})
