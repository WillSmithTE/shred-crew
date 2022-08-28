import React, { useState } from "react"
import { Text, StyleSheet, View, } from "react-native"
import { Button, IconButton, TextInput } from 'react-native-paper'
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { MainStackParams } from "../navigation/Navigation";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from "react-hook-form";
import { loginUser, setLoginState } from "../redux/userReducer";
import { dummyLoginRegisterResponse, LoginRegisterResponse, LoginRequest, LoginType, RegisterRequest } from "../types";
import { setUserState } from "../redux/userReducer";
import { Loading } from "./Loading";
import { myUuid } from "../services/myUuid";
import { MyTextInput } from "./MyTextInput";
import { useUserApi } from "../api/userApi";
import { useAuthApi } from "../api/authApi";
import { BackButton } from "./BackButton";

const useActions = () => {
    const authApi = useAuthApi()
    return {
        register: async (request: RegisterRequest) => {
            return await authApi.register(request)
        },
        login: async (request: LoginRequest) => {
            return await authApi.login(request)
        },
    }
}
type Mode = 'login' | 'register'

type Props = {
    mode: Mode
}
export const LoginRegisterEmail = ({ mode }: Props) => {
    const loginMode = mode === 'login'
    const dispatch = useDispatch()
    const { goBack } = useNavigation<NativeStackNavigationProp<MainStackParams>>()
    const [loading, setLoading] = useState(false)
    const actions = useActions()

    const { control, handleSubmit, formState } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });
    const onSubmit = async (data: LoginRequest | RegisterRequest) => {
        setLoading(true)
        const { user, auth } = await (loginMode ? actions.login(data as LoginRequest) : actions.register(data as RegisterRequest))
        setLoading(false)
        dispatch(loginUser({ user, loginState: auth }))
    }
    return <>
        <View style={styles.container}>
            <BackButton />
            <View style={{ paddingHorizontal: 20, width: '90%', }}>
                <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 30, alignSelf: 'center'}}>{loginMode ? 'Login' : 'Create account'}</Text>
                {!loginMode && <View style={styles.inputContainer}>
                    <MyTextInput {...{
                        control, formState, fieldName: 'name', placeholder: 'Name',
                        rules: { required: requiredRule, maxLength: maxLenRule, },
                    }} />
                </View>
                }
                <View style={styles.inputContainer}>
                    <MyTextInput {...{
                        control, formState, fieldName: 'email', placeholder: 'Email',
                        rules: { required: requiredRule, maxLength: maxLenRule, pattern: emailRule }
                    }} />
                </View>
                <View style={styles.inputContainer}>
                    <MyTextInput {...{
                        control, formState, fieldName: 'password', placeholder: 'Password', secureTextEntry: true,
                        rules: { required: requiredRule, maxLength: maxLenRule, minLength: minLenRule }, autoCapitalize: 'none'
                    }} />
                </View>
            </View>
            <View style={{ marginLeft: 'auto', padding: 20, }}>
                <Button onPress={handleSubmit(onSubmit)} style={{}} mode='contained'>Next</Button>
            </View>
        </View>
        {loading && <Loading />}
    </>
}

const requiredRule = { value: true, message: 'Required' }
const maxLenRule = { value: 100, message: `That's too long` }
const minLenRule = { value: 8, message: `That's too short` }
const emailRule = {
    value: /\S+@\S+\.\S+/,
    message: "Invalid email"
}
const styles = StyleSheet.create({
    background: {
        // alignSelf: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },
    closeButton: {
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: .7,
        alignSelf: 'flex-start',
        flex: 1,
    },
    container: {
        // justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
    },
    inputContainer: {
        // width: '80%',
        // paddingTop: 2
    },
    input: {
        // width: '80%',
        // flex: 1,
    },
    errorText: {
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: .7,
        color: 'red',
    }
})