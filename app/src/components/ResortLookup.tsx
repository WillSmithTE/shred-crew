import React, { useMemo } from "react"
import { FieldErrorsImpl, DeepRequired, UseFormWatch, UseFormSetValue, useWatch } from "react-hook-form"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../constants/colors"
import { useDebouncedSearch } from "../services/useDebouncedSearch"
import { ResortStore } from "../types"
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
    errors: FieldErrorsImpl<DeepRequired<{}>>,
    setValue: UseFormSetValue<any>,
    fieldName?: string,
    placeholder?: string
}
export const ResortLookup = ({ control, errors, fieldName = 'resort', setValue, placeholder }: Props) => {
    const { setInputText: setHomeMountainInput, searchResults: { result: resortResults } } = useDebouncedSearch((place) => searchResorts(place));
    const homeMountainSearchQuery = useWatch({ control, name: fieldName })

    useMemo(() => setHomeMountainInput(homeMountainSearchQuery), [homeMountainSearchQuery])
    return <>
        <View style={{ zIndex: 100, elevation: 100, marginBottom: 100, }}>
            <MyTextInput {...{ fieldName, placeholder, control, errors, }} />
            <View style={{ position: 'absolute', marginTop: 64, width: '100%' }}>
                {(resortResults?.length === 1 && resortResults[0].name === homeMountainSearchQuery ? [] : resortResults ?? [])
                    .map(({ id, name: label }, index) => <>
                        <TouchableOpacity onPress={() => setValue(fieldName, label)} style={styles.searchResult} key={label}>
                            <Text style={{ fontSize: 16, }} key={label}>{label}</Text>
                        </TouchableOpacity>
                    </>)
                }
            </View>
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