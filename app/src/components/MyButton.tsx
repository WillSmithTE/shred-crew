import React from "react"
import { StyleSheet } from "react-native"
import { Button } from "react-native-paper"

type Props = {
    text: string,
    onPress: () => void,
    icon?: string,
    style?: {},
}
export const MyButton = ({ text, onPress, icon, style }: Props) => {
    return <Button compact color='black' mode='text' onPress={onPress} style={[styles.button, style]} uppercase={false}
        icon={icon} contentStyle={{ flexDirection: 'row-reverse' }}>
        {text}
    </Button>
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 6,
        fontWeight: 'bold',
        shadowOffset: { height: 8, width: 0 },
        shadowOpacity: 1,
        shadowColor: '#00000040',
        shadowRadius: 4,
        backgroundColor: 'white',
        alignSelf: 'center',
        padding: 5,
    }
})