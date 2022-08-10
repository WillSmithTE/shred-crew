import React, { useEffect, useState } from "react"
import { ImageBackground, Text, StyleSheet, View, Platform, } from "react-native"
import { Button, IconButton } from 'react-native-paper'
import { showComingSoon } from "../components/Error"
// import {
//     GoogleSigninButton,
// } from '@react-native-google-signin/google-signin';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
// import * as GoogleNative from 'expo-google-app-auth';
import * as WebBrowser from 'expo-web-browser';

type GoogleSignInButtonProps = {
    onSuccess: (result: any) => void,
    onError: (result: any) => void,
}

export type AuthResult = {
    idToken: string,
}

WebBrowser.maybeCompleteAuthSession();

export const onGoogleSignInButtonPress = ({
    onSuccess,
    onError,
}: GoogleSignInButtonProps) => {
    const isStandaloneAndroid = !__DEV__ && Platform.OS === 'android';

    function login() {
        // if (isStandaloneAndroid) return oldSignInAsync();
        // newSignInAsync();
        newSignInAsync()
    }

    function handleSuccessSignIn(token: string) {
        onSuccess(token);
    }

    // this will run only on Android standalone app
    // async function oldSignInAsync(): Promise<void> {
    //     try {
    //         const result = await GoogleNative.logInAsync({
    //             scopes: ['profile', 'email'],
    //             androidStandaloneAppClientId: process.env.GOOGLE_ANDROID_APP_KEY,
    //         });
    //         if (result.type !== 'success') return;

    //         const token = result.idToken;
    //         if (!token) throw new Error('Forbiden');

    //         handleSuccessSignIn(token);
    //     } catch (err) {
    //         if (onError) onError(err as Error);
    //     }
    // }

    // this will NOT run on Android standalone app
    async function newSignInAsync() {
        try {
            const response = await promptAsync();
            if (response.type === 'error') throw new Error(response.error?.message);
            if (response.type !== 'success') return;
            if (!!!response.authentication?.idToken) throw new Error('response authentication undefined')
            handleSuccessSignIn(response.authentication.idToken);
        } catch (err) {
            if (onError) onError(err as Error);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, _, promptAsync] = Google.useIdTokenAuthRequest({
        webClientId: Constants.manifest?.extra!!.webClientId,
        androidClientId: Constants.manifest?.extra!!.androidClientId,
        iosClientId: Constants.manifest?.extra!!.iosClientId,
        expoClientId: Constants.manifest?.extra!!.expoClientId,
    });

    login()
}
