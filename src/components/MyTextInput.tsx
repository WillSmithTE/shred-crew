import React from "react"
import { Text, StyleSheet, StyleProp, TextStyle, TextInput as NativeTextInput } from "react-native"
import { TextInput } from 'react-native-paper'
import {
    Controller, DeepRequired, FieldErrorsImpl,
    RegisterOptions, FieldPath
} from "react-hook-form";

type Props = {
    control: any,
    errors: FieldErrorsImpl<DeepRequired<{}>>,
    rules?: Omit<RegisterOptions<{}, FieldPath<{}>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    fieldName: string,
    label?: string,
    placeholder?: string,
    multiline?: boolean,
    style?: StyleProp<TextStyle>,
}
export const MyTextInput = ({ control, errors, rules = {}, fieldName, label, placeholder, multiline, style }: Props) => {
    return <>
        <>
            <Controller control={control} rules={rules as any}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label={label}
                        style={{ ...styles.input, ...(style as {}) }}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        mode='flat'
                        placeholder={placeholder}
                        multiline={multiline}
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
                    />
                )}
                name={fieldName}
            />
            <Text style={styles.errorText}>{(errors as any)[fieldName]?.message ?? ' '}</Text>
        </>
    </>
}

export const requiredRule = { value: true, message: 'Required' }
export const maxLenRule = { value: 100, message: `That's too long` }
export const minLenRule = { value: 8, message: `That's too short` }
export const emailRule = {
    value: /\S+@\S+\.\S+/,
    message: "Invalid email"
}
const styles = StyleSheet.create({
    inputContainer: {
    },
    input: {
    },
    errorText: {
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: .7,
        color: 'red',
    }
})