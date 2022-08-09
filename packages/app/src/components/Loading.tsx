import React from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';

type LoadingProps = {
    theme?: string,
    size?: number | 'large' | 'small',
    backgroundColor?: string,
}

export const Loading = ({ theme = 'white', size = 'large', backgroundColor = 'white' }: LoadingProps) => {
    const color = theme === 'white' ? '#00bdcd' : '#fff';
    return (
        <View
            style={{
                backgroundColor,
                opacity: .9,
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