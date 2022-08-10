import React, { useMemo } from "react"
import { FieldErrorsImpl, DeepRequired, UseFormWatch, UseFormSetValue } from "react-hook-form"
import { Text, TouchableOpacity, View } from "react-native"
import { colors } from "../constants/colors"
import { useDebouncedSearch } from "../services/useDebouncedSearch"
import { MyTextInput } from "./MyTextInput"

const resorts = [
    { id: 'whistler', label: 'Whistler' },
    { id: 'thredbo', label: 'Thredbo' },
    { id: 'chamonix', label: 'Chamonix' },
    { id: 'whitewater', label: 'Whitewater' },
]
const searchResorts = async (place: string) => {
    await new Promise(r => setTimeout(r, 300))
    return resorts.filter(({ label }) => label.toLowerCase().includes(place.toLowerCase()))
}
type Props = {
    control: any,
    errors: FieldErrorsImpl<DeepRequired<{}>>,
    watch: UseFormWatch<any>,
    setValue: UseFormSetValue<any>,
    fieldName?: string,
}
export const ResortLookup = ({ control, errors, watch, fieldName = 'resort', setValue }: Props) => {
    const { setInputText: setHomeMountainInput, searchResults: { result: resortResults } } = useDebouncedSearch((place) => searchResorts(place));
    const homeMountainSearchQuery = watch(fieldName)

    useMemo(() => setHomeMountainInput(homeMountainSearchQuery), [homeMountainSearchQuery])

    return <>
        <View style={{ zIndex: 100, elevation: 100, }}>
            <MyTextInput {...{ fieldName, placeholder: 'Home mountain', control, errors, }} />
            <View style={{ position: 'absolute', marginTop: 64, width: '100%' }}>
                {(resortResults?.length === 1 && resortResults[0].label === homeMountainSearchQuery ? [] : resortResults ?? [])
                    .map(({ id, label }, index) => <>
                        <TouchableOpacity onPress={() => setValue(fieldName, label)} style={{ backgroundColor: colors.gray300, padding: 5, }} key={index}>
                            <Text style={{ fontSize: 16, }}>{label}</Text>
                        </TouchableOpacity>
                    </>)
                }
            </View>
        </View>
    </>
}