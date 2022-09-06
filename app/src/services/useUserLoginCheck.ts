import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, loginUser } from "../redux/userReducer";
import { RootState } from "../redux/reduxStore";
import { LoginRegisterResponse, LoginState } from "../model/types";
import { useAuthApi } from "../api/authApi";
import { showError } from "../components/Error";
import { jsonString } from "../util/jsonString";

function useLoader() {
    const { refreshAuth: refreshAuthApi } = useAuthApi()
    return {
        refreshAuth: async function (auth: LoginState): Promise<LoginRegisterResponse> {
            console.debug(1)
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
                try {
                    response = await refreshAuth(auth)
                    console.debug({ response })
                    setDone(true)
                    if (response === undefined) dispatch(clearAuth())
                    else dispatch(loginUser({ user: response.user, loginState: response.auth }))
                }
                catch (e: any) {
                    showError(jsonString(e))
                    setDone(true)
                    dispatch(clearAuth())
                }
            }
        })()

    }, [])

    return done
}