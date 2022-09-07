import React from "react"
import { Text, StyleSheet, StyleProp, TextStyle, TextInput as NativeTextInput, TextInputProps } from "react-native"
import { TextInput } from 'react-native-paper'
import {
    Controller, DeepRequired, FieldErrorsImpl,
    RegisterOptions, FieldPath, FormState
} from "react-hook-form";
import { useTheme } from 'react-native-paper';

type Props<T> = {
    control: any,
    formState: FormState<T>,
    rules?: Omit<RegisterOptions<{}, FieldPath<{}>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    fieldName: string,
    label?: string,
    placeholder?: string,
    multiline?: boolean,
    style?: StyleProp<TextStyle>,
    secureTextEntry?: boolean,
    autoCapitalize?: 'none' | 'characters' | 'words' | 'sentences',
} & React.ComponentProps<typeof TextInput>

export const MyTextInput = <T,>({ control, rules = {}, fieldName, label, placeholder, multiline, style, secureTextEntry, formState, autoCapitalize = 'sentences', ...otherProps }: Props<T>) => {
    const theme = useTheme()

    return <>
        <>
            <Controller control={control} rules={rules as any}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label={label}
                        style={{ ...styles(theme).input, ...(style as {}) }}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        mode='flat'
                        placeholder={placeholder}
                        multiline={multiline}
                        secureTextEntry={secureTextEntry}
                        render={(innerProps) => (
                            <NativeTextInput
                                {...innerProps}
                                style={[
                                    innerProps.style,
                                    multiline
                                        ? {
                                            paddingTop: 8,
                                            paddingBottom: 8,
                                            height: 100,
                                        }
                                        : null,
                                ]}
                            />
                        )}
                        autoCapitalize={autoCapitalize}
                        {...otherProps}
                    />
                )}
                name={fieldName}
            />
            <ErrorText error={(formState.errors as any)[fieldName]?.message ?? ' '} />
        </>
    </>
}

export const ErrorText = ({ error }: { error: string }) => {
    const theme = useTheme()

    return <Text style={styles(theme).errorText}>{error}</Text>
}

export const requiredRule = { value: true, message: 'Required' }
export const maxLenRule = { value: 100, message: `That's too long` }
export const minLenRule = { value: 8, message: `That's too short` }
export const emailRule = {
    value: /\S+@\S+\.\S+/,
    message: "Invalid email"
}
const styles = (theme: ReactNativePaper.Theme) => StyleSheet.create({
    inputContainer: {
    },
    input: {
    },
    errorText: {
        paddingBottom: 5,
        color: 'red',
        fontWeight: 'bold',
        ...(theme.dark ? {
            shadowOffset: { width: 0, height: 0 },
            shadowColor: 'black',
            shadowOpacity: .7,
        } : {}),
    }
})