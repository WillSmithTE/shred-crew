import React from "react"
import { colors } from "../constants/colors"
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

export type MultiSelectorOption<S> = {
    value: S,
    label: string,
}
type Thing<S extends string> = { [key in S]?: boolean }
type MultiSelectorProps<S extends string> = {
    selected: Thing<S>,
    set: (types: Thing<S>) => void,
    options: MultiSelectorOption<S>[],
}
export function MultiSelector<S extends string>({ selected, set, options }: MultiSelectorProps<S>) {
    return < View style={styles.container}>
        {options.map(({ value: id, label }, index) => {
            const isSelected = selected[id] === true
            const onPress = () => set({ ...selected, [id]: isSelected ? undefined : true })
            return <TouchableOpacity onPress={onPress} style={buttonStyles(isSelected).button} key={index}>
                <Text style={{ color: 'black' }}>{label}</Text>
            </TouchableOpacity>
        }
        )}
    </View >

}

type SingleSelectorProps<S> = {
    selected?: S,
    set: (newVal?: S) => void,
    options: MultiSelectorOption<S>[],
    idResolver?: (it: S) => string,
}
export function SingleSelector<S>({ selected, set, options, idResolver = (it) => (it as any)?.toString() }: SingleSelectorProps<S>) {
    return < View style={styles.container}>
        {options.map(({ value, label }, index) => {
            const isSelected = selected !== undefined && idResolver(selected) === idResolver(value)
            const onPress = () => set(isSelected ? undefined : value)
            return <TouchableOpacity onPress={onPress} style={buttonStyles(isSelected).button} key={index}>
                <Text style={{ color: 'black' }}>{label}</Text>
            </TouchableOpacity>
        }
        )}
    </View >
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, },
})

const buttonStyles = (isSelected: boolean) => StyleSheet.create({
    button: {
        backgroundColor: isSelected ? colors.secondary : colors.gray300,
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
        minWidth: 50,
        alignItems: 'center',
    }
})
