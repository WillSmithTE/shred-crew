import React from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';

type LoadingProps = {
    theme?: string,
    size?: number | 'large' | 'small',
}

export const Loading = ({ theme = 'white', size = 'large' }: LoadingProps) => {
    const color = theme === 'white' ? '#00bdcd' : '#fff';
    return (
        <View
            style={{
                backgroundColor: 'white',
                opacity: .9,
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

export const FullScreenLoader = () => {
    return <ImageBackground style={styles.background} source={require('../../assets/splash.png')}>
        <Loading />
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