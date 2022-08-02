import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

type LoadingProps = {
    theme?: string,
    size?: number | 'large' | 'small',
}

export const Loading = ({ theme = 'white', size = 'large' }: LoadingProps) => {
    const color = theme === 'white' ? '#00bdcd' : '#fff';
    return (
        <View
            style={{
                ...StyleSheet.absoluteFillObject,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};
