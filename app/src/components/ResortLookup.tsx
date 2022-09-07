import React, { useCallback, useMemo } from "react"
import { FieldErrorsImpl, DeepRequired, UseFormWatch, UseFormSetValue, useWatch, FormState } from "react-hook-form"
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { IconButton, TextInput } from "react-native-paper"
import { colors } from "../constants/colors"
import { useDebouncedSearch } from "../services/useDebouncedSearch"
import { ResortStore } from "../model/types"
import { MyTextInput } from "./MyTextInput"

const resorts = getResorts()
const searchResorts = async (place: string) => {
    console.log('searching resorts')
    if (place.length < 2) return []
    return resorts
        .filter(({ name }) => name.toLowerCase().includes(place.toLowerCase()))
        .slice(0, 5)
}
type Props = {
    control: any,
    formState: FormState<{}>,
    setValue: UseFormSetValue<any>,
    fieldName?: string,
    placeholder?: string,
    onSelectResort: (resortId: string) => void,
    onClear?: () => void,
}
export const ResortLookup = ({ control, formState, fieldName = 'resort', setValue, placeholder, onSelectResort, onClear }: Props) => {
    const { setInputText: setHomeMountainInput, searchResults: { result: resortResults } } = useDebouncedSearch((place) => searchResorts(place));
    const searchQuery = useWatch({ control, name: fieldName })

    useMemo(() => setHomeMountainInput(searchQuery), [searchQuery])
    const onPressX = useCallback(() => {
        setValue(fieldName, '')
        onClear && onClear()
    }, [fieldName, setValue])
    return <>
        <View style={{ zIndex: 100, elevation: 100, }}>
            <MyTextInput {...{ fieldName, placeholder, control, formState, }}
                left={<TextInput.Icon icon='search' size={20} />}
                right={searchQuery !== undefined && searchQuery.length > 0 && <TextInput.Icon onPress={onPressX} icon='times' size={20} />}
            />
            <View style={{ marginTop: 64, position: 'absolute', width: '100%' }}>
                {(resortResults?.length === 1 && resortResults[0].name === searchQuery ? [] : resortResults ?? [])
                    .map(({ id, name: label }, index) =>
                        <TouchableOpacity onPress={() => { setValue(fieldName, label); onSelectResort(id) }}
                            style={styles.searchResult} key={id}>
                            <Text style={{ fontSize: 16, }} key={label}>{label}</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
            <View style={{ flex: 1 }} />
        </View>
    </>
}

const styles = StyleSheet.create({
    searchResult: {
        backgroundColor: colors.gray300,
        padding: 5,
        borderBottomColor: 'silver',
        borderBottomWidth: .5,
    }
})

function getResorts(): ResortStore[] {
    console.log('getting resorts')
    const resorts = require('../../assets/resortStore.json')
    return resorts
}