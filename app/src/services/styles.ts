import { StyleSheet } from "react-native"
import { colors } from "../constants/colors"

export const { subHeader, header } = StyleSheet.create({
    subHeader: {
        fontSize: 16,
        paddingTop: 15,
        fontWeight: 'bold'
    },
    header: {
        fontSize: 30,
        fontWeight: '400',
        color: colors.orange,
        fontFamily: 'Baloo-Bhaijaan'
    },
})