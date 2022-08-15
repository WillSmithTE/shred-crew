import React, { useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Avatar, IconButton } from "react-native-paper"
import { colors } from "../constants/colors"

const people = [
    {
        id: '1',
        name: 'Joos Hartmann',
        imageUri: require('../../assets/peopleFeed1.png'),
    },
    {
        id: '2',
        name: 'Pippi Kramer',
        imageUri: require('../../assets/peopleFeed3.png'),
    },
    {
        id: '3',
        name: 'Willi Smith',
        imageUri: require('../../assets/peopleFeed2.png'),
    },
]
export const PeopleFeed = () => {
    const [poked, setPoked] = useState<{ [id: string]: boolean | undefined }>({})

    return <>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.banner}>
                <Avatar.Image size={56} source={require('../../assets/avatar.png')} style={{ marginRight: 13 }} />
                <View>
                    <Text style={styles.bannerHeader}>Welcome to your Shred Feed</Text>
                    <Text>Verbier Mountain Resort</Text>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                {people.map(({ imageUri, name, id }) => {
                    const isPoked = poked[id] === true
                    const onPoke = () => setPoked({ ...poked, [id]: isPoked ? undefined : true })
                    return <View key={id} style={{ flex: 1, minHeight: 360 }}>
                        <Image source={imageUri} resizeMode='contain' style={{ resizeMode: 'cover', width: '100%', flex: 1 }} />
                        <View style={{ flexDirection: 'row', paddingTop: 15, minHeight: 70, }}>
                            <View style={{ backgroundColor: '#2FCE5C', width: 10, height: 10, borderRadius: 5, marginHorizontal: 10 }}></View>
                            <View>
                                <Text style={{ fontWeight: '700' }}>{name}</Text>
                                <Text style={{ textDecorationLine: 'underline' }}>See more</Text>
                            </View>
                            <TouchableOpacity onPress={onPoke} style={{
                                width: 44, height: 44, backgroundColor: isPoked ? colors.secondary : colors.lightGray,
                                flex: 0, marginLeft: 'auto', justifyContent: 'center', alignItems: 'center', marginRight: 12,
                                borderRadius: 7,
                            }}>
                                <Image style={{ width: 24, height: 24 }} source={require('../../assets/horns.png')} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                    </View>
                })}
            </ScrollView>
        </View>
    </>
}
const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 110,
        paddingTop: 20,
    },
    bannerHeader: {
        fontSize: 18,
        fontWeight: '700',
        paddingBottom: 5
    }
})