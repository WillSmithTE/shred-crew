import { baseApiRequest, useBaseApi } from './api';

export function useUserApi() {
    const baseApi = useBaseApi()
    return {
        add: async (email: string) => await baseApiRequest<{}>(
            () => {
                console.debug(`Upserting user (email=${email})`)
                return baseApi.post(`/beta-registered-user`, {
                    body: JSON.stringify({ email }),
                    headers: { "Content-Type": "application/json", }
                })
            },
            `error adding user (email=${email})`,
        ),
    }
}
