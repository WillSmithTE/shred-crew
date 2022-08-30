import React, { useState } from "react"
import { ImageBackground, Text, StyleSheet, View, Image, } from "react-native"
import { Button } from 'react-native-paper'
import { showError2 } from "../components/Error"
// import {
//     GoogleSigninButton,
// } from '@react-native-google-signin/google-signin';
import * as Google from 'expo-auth-session/providers/google';
// import * as GoogleNative from 'expo-google-app-auth';
import { useDispatch } from "react-redux";
import { loginUser, } from "../redux/userReducer";
import { dummyLoginRegisterResponse, LoginRegisterResponse } from "../types";
import Constants from "expo-constants";
import { jsonString } from "../util/jsonString";
import { useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../navigation/Navigation";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FullScreenLoader } from "./Loading";
import { colors } from "../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthApi } from "../api/authApi";

const useLoader = () => {
    const authApi = useAuthApi()
    return {
        googleLogin: async (idToken: string) => {
            return await authApi.googleSignin(idToken)
        }
    }
}
type Mode = 'login' | 'register'

type Props = {
    mode: Mode
}
export const LoginRegister = ({ mode }: Props) => {
    const dispatch = useDispatch()
    const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParams>>()
    const [loading, setLoading] = useState(false)
    const loader = useLoader()

    const [request, _, promptAsync] = Google.useIdTokenAuthRequest({
        webClientId: Constants.manifest?.extra!!.webClientId,
        androidClientId: Constants.manifest?.extra!!.androidClientId,
        iosClientId: Constants.manifest?.extra!!.iosClientId,
        expoClientId: Constants.manifest?.extra!!.expoClientId,
    });

    async function onGooglePress() {
        try {
            setLoading(true)
            const response = await promptAsync();
            if (response.type === 'error') throw new Error(response.error?.message);
            if (response.type !== 'success') return;
            if (!!!response.params.id_token) throw new Error(`no id_token (response=${jsonString(response)})`)
            const { user, auth } = await loader.googleLogin(response.params.id_token)
            dispatch(loginUser({ user, loginState: auth }))
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
                <View style={{ paddingVertical: 20 }}>
                    <TouchableOpacity onPress={onGooglePress} style={[styles.button, { padding: 10, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }]}>
                        <Image style={{ height: 20, width: 20, marginRight: 10 }} resizeMode='contain' source={require('../../assets/Google_logo.png')} />
                        <Text style={{ color: colors.darkDarkGray, alignContent: 'center', fontWeight: 'bold' }}>{mode === 'login' ? 'Login' : 'Sign up'} with Google</Text>
                    </TouchableOpacity>
                    <Button style={styles.button} icon='email' mode='contained' onPress={onEmailPress}> {mode === 'login' ? 'Login' : 'Sign up'} with Email</Button>
                </View>
                <Text>{mode === 'login' ? `Don't` : 'Already'} have an account?&nbsp;
                    <Text style={{ textDecorationLine: 'underline' }} onPress={() => navigate(mode === 'login' ? 'Register' : 'Login')}>{mode === 'login' ? 'Sign up' : 'Login'}</Text>
                </Text>
            </View>
        </ImageBackground>
        {loading && <FullScreenLoader />}
    </>
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
    },
    button: {
        marginVertical: 10,
    }
})