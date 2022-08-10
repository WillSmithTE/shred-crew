import React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'

export const MyImageBackground = () => {
    return <ImageBackground style={styles.background} source={require('../../assets/splash.png')} />
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },
})