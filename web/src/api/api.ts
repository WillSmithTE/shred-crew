import { jsonString } from '../util/jsonString';

const useBaseApiBuilder = ({ baseUrl = '', fetchWith = fetch }) => {
    const get = async <T = object,>(url: string, options = {}, accessToken = undefined) =>
        request<T>(url, { ...options, method: 'GET' }, true, accessToken);

    const post = async <T = {}>(url: string, options: RequestInit = {}, accessToken = undefined) => {
        return request<T>(url, { ...options, method: 'POST' }, true, accessToken);
    };

    const put = async <T = {}>(url: string, options = {}, accessToken = undefined) =>
        request<T>(url, { ...options, method: 'PUT' }, true, accessToken);

    const patch = async (url: string, options = {}, accessToken = undefined) =>
        request(url, { ...options, method: 'PATCH' }, true, accessToken);

    const deleteX = async (url: string, options = {}, accessToken = undefined) =>
        request(url, { ...options, method: 'DELETE' }, true, accessToken);

    const request = async <T = any,>(url: string, options: RequestInit = {}, invokeErrorCallbacks = true, accessToken?: string) => {
        console.debug(`about to fetch (baseUrl=${baseUrl}, path=${url}, body=${options.body})`)
        return fetchWith(`${baseUrl}${url}`, { // could add refresh token ${auth ? `?refresh_token=${loginState!!.refreshToken}` : ''}
            ...options,
            body: options.body,
            // credentials: 'include',
            headers: {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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

const BASE_URL = process.env.NODE_ENV === 'development' ?
    'http://localhost:8080' : 'https://b01cg79fb2.execute-api.eu-central-1.amazonaws.com'

export function useBaseApi() {
    return useBaseApiBuilder({ baseUrl: BASE_URL })
}

export class HttpError {
    public message: String
    public code: number
    public constructor({ message, code }: { message: String, code: number }) {
        this.message = message
        this.code = code
    }
}
