import React, { useState } from "react"
import { Text, StyleSheet, View, } from "react-native"
import { Button, IconButton, TextInput } from 'react-native-paper'
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { MainStackParams } from "../navigation/Navigation";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from "react-hook-form";
import { loginUser, setLoginState } from "../redux/userReducer";
import { dummyLoginRegisterResponse, LoginRegisterResponse, LoginType } from "../types";
import { setUserState, UserDetails } from "../redux/userReducer";
import { Loading } from "./Loading";
import { myUuid } from "../services/myUuid";

type RegisterRequest = { name: string, email: string, password: string }
const registerAction: (request: RegisterRequest) => Promise<LoginRegisterResponse> = async ({ name, email, password }) => {
    await new Promise(r => setTimeout(r, 1000));
    return dummyLoginRegisterResponse({ name, email })

}
type LoginRequest = { email: string, password: string }
const loginAction: (request: LoginRequest) => Promise<LoginRegisterResponse> = async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 1000));
    return dummyLoginRegisterResponse({ email })
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

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });
    const onSubmit = async (data: LoginRequest | RegisterRequest) => {
        setLoading(true)
        const { user, auth } = await (loginMode ? loginAction(data) : registerAction(data as RegisterRequest))
        setLoading(false)
        dispatch(loginUser({ user, loginState: auth }))
    }
    return <>
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20, }}>
                <IconButton onPress={() => goBack()} icon='close' size={40} style={styles.closeButton} />
                <Text style={{  flex: 1, justifyContent: 'center', textAlign: 'center' }}>Icon</Text>
                <IconButton icon='close' size={40} style={[styles.closeButton, { opacity: 0 }]}
                />
            </View>
            <View style={{ paddingHorizontal: 20, width: '100%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{loginMode ? 'Login' : 'Create your account'}</Text>
                {!loginMode && <View style={styles.inputContainer}>
                    <Controller control={control} rules={{ required: requiredRule, maxLength: maxLenRule, }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label='Name'
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                mode='flat'
                            />
                        )}
                        name="name"
                    />
                    <Text style={styles.errorText}>{errors.name?.message ?? ' '}</Text>
                </View>
                }
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: requiredRule, maxLength: maxLenRule, pattern: emailRule }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label='Email'
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                mode='flat'
                            />
                        )}
                        name="email"
                    />
                    <Text style={styles.errorText}>{errors.email?.message ?? ' '}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: requiredRule, maxLength: maxLenRule, minLength: minLenRule }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label='Password'
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry
                                mode='flat'
                            />
                        )}
                        name="password"
                    />
                    <Text style={styles.errorText}>{errors.password?.message ?? ' '}</Text>
                </View>
            </View>
            <View style={{ marginLeft: 'auto', padding: 20, }}>
                <Button onPress={handleSubmit(onSubmit)} style={{ backgroundColor: 'white', borderRadius: 40 }}>Next</Button>
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
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        paddingTop: 20
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