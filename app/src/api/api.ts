import { HttpError } from '../model/HttpError';
import { jsonString } from '../util/jsonString';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reduxStore';
import { dummyLoginRegisterResponse, MyLocation, Place, UserDetails } from '../types';
import Constants from 'expo-constants';
import { LatLng } from 'react-native-maps';

const devEnv = Constants.manifest?.releaseChannel === undefined || Constants.manifest?.releaseChannel === 'dev'

export function useUserApi() {
    const baseApi = useBaseApi()
    return {
        upsert: async (userState: UserDetails) => await baseApiRequest<UserDetails>(
            () => {
                console.debug(`Upserting user (id=${userState.id})`)
                if (devEnv) return Promise.resolve(MyResponseBuilder(dummyLoginRegisterResponse({ ...userState }).user))
                return baseApi.put<UserDetails>(`/user`)
            },
            'error getting user details',
        ),
    }
}
export function useResortApi() {
    const baseApi = useBaseApi()
    return {
        findNearbyResorts: async (userLocation: MyLocation) => await baseApiRequest<Place[]>(
            () => {
                console.debug(`Searching for nearby resorts`)
                // if (devEnv) Promise.resolve([])
                return baseApi.post<Place[]>(`/resort/coords`, {
                    body: JSON.stringify(userLocation),
                    headers: { "Content-Type": "application/json", }
                })
            },
            'error getting nearby resorts',
        ),
        findResort: async (id: string) => await baseApiRequest<Place>(
            () => {
                console.debug(`finding resort (id=${id})`)
                // if (devEnv) Promise.resolve([])
                return baseApi.get(`/resort/${id}`,)
            },
            `error finding resort (id=${id})`,
        ),
    }
}

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
                ...options.headers
            }
        })
            .then(async fetchResponse => {
                const baseResponse = {
                    ok: fetchResponse.ok,
                    status: fetchResponse.status,
                    redirected: fetchResponse.redirected,
                    headers: fetchResponse.headers,
                }
                const contentType = fetchResponse.headers.get("content-type");
                const isJson = contentType && contentType.indexOf("application/json") !== -1
                const body = isJson ? await fetchResponse.json() : await fetchResponse.text()

                if (baseResponse.ok) {
                    return {
                        ...baseResponse,
                        body,
                    }
                } else {
                    return {
                        ...baseResponse,
                        error: (body as any).error,
                    };
                }
            })
    };

    return { get, post, put, patch, request, deleteX, };
};

export const baseApiRequest = async <T, U = T>(callback: () => Promise<MyResponse<U>>, errorMessage: string, mapper: ((a: U) => T) = (a) => (a as unknown as T)) => {
    const response = await callback()
    console.debug(`response received: ${jsonString(response)}`)
    if (response.ok) {
        return mapper(response.body!!)
    } else {
        throw new HttpError({ message: `${errorMessage} - ${response.error} - ${jsonString(response)}`, code: response.status })
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
