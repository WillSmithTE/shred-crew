import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, isAuthEqual, LoginState, loginUser, setLoginState } from "../redux/userReducer";
import { RootState } from "../redux/reduxStore";
import { myUuid } from "./myUuid";
import { dummyLoginRegisterResponse, LoginRegisterResponse, LoginType } from "../types";

const refreshAuth = async function (auth: LoginState): Promise<LoginRegisterResponse> {
    await new Promise(r => setTimeout(r, 1000));
    return dummyLoginRegisterResponse({})
}
export function useUserLoginCheck() {
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.user.loginState)

    const [done, setDone] = useState(false)

    useEffect(() => {
        (async () => {
            if (auth === undefined) {
                setDone(true)
            } else {
                const response = await refreshAuth(auth)
                if (response === undefined) dispatch(clearAuth())
                else dispatch(loginUser({ user: response.user, loginState: response.auth }))
                setDone(true)
            }
        })()

    }, [])

    return done
}