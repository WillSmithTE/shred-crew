import React, { useEffect, useMemo, useState } from "react"
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

    const [googleAuthRequest, googleAuthResponse, promptGoogleLogin] = Google.useIdTokenAuthRequest({
        webClientId: Constants.manifest?.extra!!.webClientId,
        androidClientId: Constants.manifest?.extra!!.androidClientId,
        iosClientId: Constants.manifest?.extra!!.iosClientId,
        expoClientId: Constants.manifest?.extra!!.expoClientId,
    });

    async function onGooglePress() {
        setLoading(true)
        promptGoogleLogin();
    }
    const onEmailPress = () => {
        navigate(mode === 'login' ? 'LoginEmail' : 'RegisterEmail')
    }

    useMemo(async () => {
        try {
            if (googleAuthResponse !== null) {
                if (googleAuthResponse.type === 'error') throw new Error(googleAuthResponse.error?.message);
                if (googleAuthResponse.type !== 'success') throw new Error(`google auth type no success (response=${jsonString(googleAuthResponse)})`)
                console.debug(`google sign in successful (response=${jsonString(googleAuthResponse)})`)
                if (!!!googleAuthResponse.params.id_token) throw new Error(`no id_token (response=${jsonString(googleAuthResponse)})`)
                const { user, auth } = await loader.googleLogin(googleAuthResponse.params.id_token)
                dispatch(loginUser({ user, loginState: auth }))
            }
        } catch (err: any) {
            console.debug(err)
            showError2({ message: `google login failed`, description: err.toString() });
        }
    }, [googleAuthResponse])

    return <>
        <ImageBackground style={styles.background} source={require('../../assets/splash.png')}>
            <View style={styles.container}>
                <View style={{ paddingVertical: 20, width: '80%', }}>
                    <TouchableOpacity onPress={onGooglePress} style={[styles.button, { borderRadius: 5, padding: 10, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }]}>
                        <Image style={{ height: 20, width: 20, marginRight: 10 }} resizeMode='contain' source={require('../../assets/Google_logo.png')} />
                        <Text style={{ color: colors.darkDarkGray, alignContent: 'center', fontWeight: 'bold' }}>{mode === 'login' ? 'Login' : 'Sign up'} with Google</Text>
                    </TouchableOpacity>
                    <Button style={styles.button} icon='email' mode='contained' onPress={onEmailPress}> {mode === 'login' ? 'Login' : 'Sign up'} with Email</Button>
                </View>
                <Text>{mode === 'login' ? `Don't` : 'Already'} have an account?&nbsp;
                    <Text style={{ textDecorationLine: 'underline', color: 'black' }} onPress={() => navigate(mode === 'login' ? 'Register' : 'Login')}>{mode === 'login' ? 'Sign up' : 'Login'}</Text>
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