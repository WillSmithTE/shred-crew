import React, { useEffect, useState } from "react"
import { ImageBackground, Text, StyleSheet, View, Platform, } from "react-native"
import { Button, IconButton } from 'react-native-paper'
import { showComingSoon, showError, showError2 } from "../components/Error"
// import {
//     GoogleSigninButton,
// } from '@react-native-google-signin/google-signin';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
// import * as GoogleNative from 'expo-google-app-auth';
import * as WebBrowser from 'expo-web-browser';
import { onGoogleSignInButtonPress } from "../components/GoogleSignInButton";
import { useDispatch } from "react-redux";
import { setLoginState } from "../services/authReducer";
import { LoginType } from "../types";
import Constants from "expo-constants";
import { jsonString } from "../util/jsonString";
import { useNavigation } from "@react-navigation/native";
import { MainStackParams } from "../navigation/Navigation";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const loader = (idToken: string) => {
    return {
        accessToken: '123',
        refreshToken: '456',
        name: 'herp derp',
        imageUri: 'https://asodia',
    }
}

type Mode = 'login' | 'register'

type Props = {
    mode: Mode
}
export const LoginRegister = ({ mode }: Props) => {
    const dispatch = useDispatch()
    const { navigate } = useNavigation<NativeStackNavigationProp<MainStackParams>>()

    const [request, _, promptAsync] = Google.useIdTokenAuthRequest({
        webClientId: Constants.manifest?.extra!!.webClientId,
        androidClientId: Constants.manifest?.extra!!.androidClientId,
        iosClientId: Constants.manifest?.extra!!.iosClientId,
        expoClientId: Constants.manifest?.extra!!.expoClientId,
    });

    async function onGooglePress() {
        try {
            const response = await promptAsync();
            if (response.type === 'error') throw new Error(response.error?.message);
            if (response.type !== 'success') return;
            if (!!!response.params.id_token) throw new Error(`no id_token (response=${jsonString(response)})`)
            const result = loader(response.params.id_token)
            dispatch(setLoginState({ ...result, loginType: LoginType.GOOGLE }))
        } catch (err) {
            showError2({ message: `google login failed`, description: (err as any).toString() });
        }
    }
    const onEmailPress = () => {
        navigate(mode === 'login' ? 'LoginEmail' : 'RegisterEmail')
    }

    return <>
        <ImageBackground style={styles.background} source={require('../../assets/splash.png')}>
            <View style={styles.container}>
                <View>
                    <Button icon='email' mode='outlined' onPress={onEmailPress}> {mode === 'login' ? 'Login' : 'Sign up'} with Email</Button>
                    <Button icon='google' mode='outlined' onPress={onGooglePress}>Continue with Google</Button>

                </View>
                <Text>{mode === 'login' ? `Don't` : 'Already'} have an account?&nbsp;
                    <Text style={{ textDecorationLine: 'underline' }} onPress={() => navigate(mode === 'login' ? 'Register' : 'Login')}>{mode === 'login' ? 'Sign up' : 'Login'}</Text>
                </Text>
            </View>
        </ImageBackground>
    </>
}

const styles = StyleSheet.create({
    background: {
        // alignSelf: 'center',
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