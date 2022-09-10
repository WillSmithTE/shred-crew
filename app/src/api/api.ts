import { HttpError } from '../model/HttpError';
import { jsonString } from '../util/jsonString';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import Constants from 'expo-constants';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

const useBaseApiBuilder = ({ baseUrl = '', fetchWith = fetch, }) => {
    const loginState = useSelector((state: RootState) => state.user.loginState)
    const get = async <T = object,>(url: string, options = {}, auth = true) =>
        request<T>(url, { ...options, method: 'GET' }, true, auth);

    const post = async <T = {}>(url: string, options: RequestInit = {}, auth = true) => {
        return request<T>(url, { ...options, method: 'POST' }, true, auth);
    };

    const put = async <T = {}>(url: string, options = {}, auth = true) =>
        request<T>(url, { ...options, method: 'PUT' }, true, auth);

    const patch = async (url: string, options = {}, auth = true) =>
        request(url, { ...options, method: 'PATCH' }, true, auth);

    const deleteX = async (url: string, options = {}, auth = true) =>
        request(url, { ...options, method: 'DELETE' }, true, auth);

    const request = async <T = any,>(url: string, options: RequestInit = {}, invokeErrorCallbacks = true, auth = true) => {
        if (auth && loginState === undefined) return Promise.reject(myError(`wanted auth request but loginState was undefined`))
        console.debug(`about to fetch (baseUrl=${baseUrl}, path=${url}, body=${options.body})`)
        return fetchWith(`${baseUrl}${url}`, { // could add refresh token ${auth ? `?refresh_token=${loginState!!.refreshToken}` : ''}
            ...options,
            body: options.body,
            // credentials: 'include',
            headers: {
                ...(auth ? { Authorization: `Bearer ${loginState!!.accessToken}` } : {}),
                ...(options.body ? { "Content-Type": "application/json", } : {}),
                ...options.headers
            }
        })
            .then(async fetchResponse => {
                console.debug(`response received (ok=${fetchResponse.ok})`)
                const baseResponse = {
                    ok: fetchResponse.ok,
                    status: fetchResponse.status,
                    redirected: fetchResponse.redirected,
                    headers: fetchResponse.headers,
                }
                console.debug({ baseResponse })
                const contentType = fetchResponse.headers.get("content-type");
                const isJson = contentType && contentType.indexOf("application/json") !== -1
                const body = isJson && baseResponse.ok ? await fetchResponse.json() : await fetchResponse.text()
                if (baseResponse.ok) {
                    return {
                        ...baseResponse,
                        body,
                    }
                } else {
                    console.debug({
                        ...baseResponse,
                        error: (body as any).error,
                    })
                    return {
                        ...baseResponse,
                        error: (body as any).error,
                    };
                }
            })
    };

    return { get, post, put, patch, request, deleteX, };
};

export async function baseApiRequest<T, U = T>(callback: () => Promise<MyResponse<U>>, errorMessage: string, mapper: ((a: U) => T) = (a) => (a as unknown as T)): Promise<T> {
    try {
        const response = await callback()
        console.debug(`response received: ${jsonString(response)}`)
        if (response.ok) {
            return mapper(response.body!!)
        } else {
            throw new HttpError({ message: `${errorMessage} - ${response.error} - ${jsonString(response)}`, code: response.status })
        }
    } catch (e: any) {
        throw new HttpError({ message: jsonString(e), code: e.code })
    }
}

export type MyResponse<T> = {
    body?: T,
    ok: boolean,
    status: number,
    redirected: boolean,
    headers: Headers,
    error?: any,
}
export const MyResponseBuilder = <T>(body: T) => ({
    body, ok: true, status: 200, redirected: false, headers: new Headers(),
})

const myError: (error: string) => MyResponse<void> = (error) => ({
    error, ok: false, status: 400, redirected: false, headers: new Headers()
})

export function useBaseApi() {
    return useBaseApiBuilder({ baseUrl: `${Constants.manifest!!.extra!!.apiBaseUrl}` })
}
