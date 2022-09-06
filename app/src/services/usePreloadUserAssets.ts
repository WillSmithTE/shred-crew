import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, loginUser } from "../redux/userReducer";
import { RootState } from "../redux/reduxStore";
import { LoginRegisterResponse, LoginState, UserDetails } from "../model/types";
import { useAuthApi } from "../api/authApi";
import { showError } from "../components/Error";
import { jsonString } from "../util/jsonString";
import { Image } from "react-native";
import FastImage from 'react-native-fast-image'

export function usePreloadUserAssets() {
    const user = useSelector((state: RootState) => state.user.user)
    const [done, setDone] = useState(false)

    const callPreload = async () => {
        if (user === undefined) setDone(true)
        else {
            // const preFetchTasks: Promise<any>[] = []
            const imageUris: (string | undefined)[] = [
                user.imageUri,
                ...(user.otherImages ?? []),
                ...Object.values(user.friends ?? {}).map((friend) => friend.profile.imageUri),
            ]
            FastImage.preload(imageUris.map((uri) => ({uri})))
            
            console.debug('returning, in preloadUserAssets')
            // await Promise.all(preFetchTasks)
            setDone(true)
        }
    }
    return { done, callPreload }

}