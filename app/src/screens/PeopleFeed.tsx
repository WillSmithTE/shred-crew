import BottomSheet from "@gorhom/bottom-sheet"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { Avatar, IconButton } from "react-native-paper"
import Icon from "../components/Icon"
import { MultiSelector, SingleSelector } from "../components/MultiSelector"
import { MyButton } from "../components/MyButton"
import { MyTextInput } from "../components/MyTextInput"
import { colors } from "../constants/colors"
import { MainStackParams } from "../navigation/Navigation"
import { subHeader } from "../services/styles"
import { getTagsFromSkiDetails, UserDetails } from "../types"
import { skiDisciplineOptions, skiStyleOptions } from "./Profile"
import Swiper from 'react-native-swiper'
import { showComingSoon } from "../components/Error"

const people = [
    {
        id: '1',
        name: 'Joos Hartmann',
        imageUri: require('../../assets/peopleFeed1-1.png'),
        ski: { disciplines: { ski: true, snowboard: true }, styles: {}, skillLevel: 5 },
        otherImages: [require('../../assets/peopleFeed1-2.png')],
    },
    {
        id: '2',
        name: 'Pippi Kramer',
        imageUri: require('../../assets/peopleFeed3.png'),
        ski: { disciplines: { ski: true, }, styles: {}, skillLevel: 5 },
        otherImages: [require('../../assets/peopleFeed3-2.png')],
    },
    {
        id: '3',
        name: 'Willi Smith',
        imageUri: require('../../assets/peopleFeed2.png'),
        ski: { disciplines: { ski: true, snowboard: true }, styles: {}, skillLevel: 3 },
        otherImages: [require('../../assets/peopleFeed2-2.png')],
    },
]
const bannerHeight = 110
type Props = NativeStackScreenProps<MainStackParams, 'PeopleFeed'> & {
};
export const PeopleFeed = ({ route: { params } }: Props) => {
    const [poked, setPoked] = useState<{ [id: string]: boolean | undefined }>({})
    const [showFilters, setShowFilters] = useState(!!params?.firstLoad)
    const [filters, setFilters] = useState<{ [key: string]: boolean }>({})

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
                {people.map((person) => {
                    const { id, name } = person
                    const isPoked = poked[id] === true
                    const onPoke = () => setPoked({ ...poked, [id]: isPoked ? undefined : true })
                    const onPressSeeMore = showComingSoon
                    return <View key={id} style={{ flex: 1, minHeight: 360 }}>
                        <ImageSwiper person={person} />
                        <View style={{ flexDirection: 'row', paddingTop: 15, minHeight: 70, }}>
                            <View style={{ backgroundColor: '#2FCE5C', width: 10, height: 10, borderRadius: 5, marginHorizontal: 10, marginTop: 5, }}></View>
                            <View>
                                <Text style={{ fontWeight: '700' }}>{name}</Text>
                                <TouchableOpacity onPress={onPressSeeMore}>
                                    <Text style={{ textDecorationLine: 'underline' }}>See more</Text>
                                </TouchableOpacity>
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
            <FilterDrawer {...{ filters, setFilters, show: showFilters, setShow: setShowFilters, confirmNext: console.log }} />
        </View>
    </>
}
const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: bannerHeight,
        paddingTop: 20,
    },
    bannerHeader: {
        fontSize: 18,
        fontWeight: '700',
        paddingBottom: 5
    },
    tag: {
        backgroundColor: colors.secondary,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
    }
})

type FilterDrawerProps = {
    show: boolean, setShow: (val: boolean) => void, confirmNext: () => void,
    filters: { [key: string]: boolean }, setFilters: (it: { [key: string]: boolean }) => void,
}
const FilterDrawer = ({ show, setShow, confirmNext, filters, setFilters }: FilterDrawerProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const form = useForm({
        defaultValues: {
            dayMission: ''
        }
    });

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setShow(false)
            confirmNext()
        }
    }, [setShow]);

    useMemo(() => {
        if (show) bottomSheetRef.current?.expand()
        else bottomSheetRef.current?.close()
    }, [show])

    return <BottomSheet
        ref={bottomSheetRef}
        index={show ? 0 : -1}
        snapPoints={[Dimensions.get('screen').height - bannerHeight]}
        onChange={handleSheetChanges}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: '#D9D9D9', width: 60, }}
    >
        <View style={{ flex: 1, paddingHorizontal: 20, }}>
            <Text style={[subHeader, { paddingBottom: 10 }]}>Filter</Text>
            <Text style={{ paddingBottom: 10 }}>What are you looking for today?</Text>
            <View>
                <MultiSelector {...{ options: [...skiDisciplineOptions, ...skiStyleOptions], selected: filters, set: setFilters }} />
                <TouchableOpacity style={{ position: 'absolute', right: 0, bottom: -5 }} onPress={() => setFilters({})}>
                    <Text style={{ textDecorationLine: 'underline' }}>Clear all</Text>
                </TouchableOpacity>
            </View>
            <MyTextInput {...{ ...form, fieldName: 'dayMission', multiline: true, style: { marginTop: 30, }, placeholder: 'This description will be shown to others in their feed...' }} />
            <MyButton text='View Shredders' icon='arrow-down' onPress={() => { confirmNext(); setShow(false) }} style={{ width: 154, alignSelf: 'center', }} />
        </View>
    </BottomSheet>
}

type ImageSwiperProps = {
    person: Partial<UserDetails>
}
const ImageSwiper = ({ person: { imageUri, ski, otherImages } }: ImageSwiperProps) => {
    const [currentScreen, setCurrentScreen] = useState(0)
    const swipeRef = useRef<Swiper>(null);

    const images = [imageUri, ...(otherImages ?? [])]
    const onBackward = (): void => {
        if (currentScreen > 0) {
            swipeRef.current?.scrollBy(-1)
            setCurrentScreen((prevState) => prevState - 1);
        }
    };

    const onForward = (): void => {
        if (currentScreen < images.length) {
            swipeRef.current?.scrollBy(1)
            setCurrentScreen((prevState) => prevState + 1)
        }
    };

    return <>
        <View style={{ height: 300 }}>
            <Swiper
                loop={false}
                ref={swipeRef}
            >
                {images.map((imgUri, index) =>
                    <Image source={imgUri as any} resizeMode='cover' resizeMethod='resize' style={{ resizeMode: 'cover', width: '100%', height: '100%' }} key={index} />
                )}
            </Swiper>
            <View style={{ position: 'absolute', top: 12, left: 12, flexDirection: 'row' }}>
                {getTagsFromSkiDetails(ski).map((tag) => <View key={tag} style={styles.tag}><Text>{tag}</Text></View>)}
            </View>
        </View>
    </>

}