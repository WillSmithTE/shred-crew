import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, isAuthEqual, loginUser, setLoginState } from "../redux/userReducer";
import { RootState } from "../redux/reduxStore";
import { myUuid } from "./myUuid";
import { dummyLoginRegisterResponse, LoginRegisterResponse, LoginState, LoginType } from "../types";
import { useAuthApi } from "../api/authApi";

function useLoader() {
    const { refreshAuth: refreshAuthApi } = useAuthApi()
    return {
        refreshAuth: async function (auth: LoginState): Promise<LoginRegisterResponse> {
            return await refreshAuthApi(auth);
        },
    }
}
export function useUserLoginCheck() {
    const dispatch = useDispatch()
    const { refreshAuth } = useLoader()
    const auth = useSelector((state: RootState) => state.user.loginState)

    const [done, setDone] = useState(false)

    useEffect(() => {
        (async () => {
            if (auth === undefined) {
                setDone(true)
            } else {
                let response = undefined
                try { response = await refreshAuth(auth) }
                catch (e: any) { console.error(e.toString()) }
                if (response === undefined) dispatch(clearAuth())
                else dispatch(loginUser({ user: response.user, loginState: response.auth }))
                setDone(true)
            }
        })()

    }, [])

    return done
}