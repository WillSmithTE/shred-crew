import React from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';

type LoadingProps = {
    theme?: string,
    size?: number | 'large' | 'small',
    backgroundColor?: string,
    opacity?: number,
}

export const Loading = ({ theme = 'white', size = 'large', backgroundColor = 'white', opacity = 0.9 }: LoadingProps) => {
    const color = theme === 'white' ? '#00bdcd' : '#fff';
    return (
        <View
            style={{
                backgroundColor,
                opacity,
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: 'black',
                shadowOpacity: .7,
            }}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

export const FullScreenLoader = () => {
    return <ImageBackground style={styles.background} source={require('../../assets/splash.png')}>
        <Loading opacity={0.5}/>
    </ImageBackground>
}


const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },
    container: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    }
})