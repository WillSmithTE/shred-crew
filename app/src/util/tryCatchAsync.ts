import { showError2 } from "../components/Error"
import { jsonString } from "./jsonString"
import { noop } from "./noop"

export async function tryCatchAsync<T>({ getter, onSuccess, onError = noop, lastly = noop }: {
    getter: () => Promise<T>,
    onSuccess: (result: T) => void,
    onError?: (error: any) => void,
    lastly?: () => void,
}) {
    try {
        const result = await getter()
        onSuccess(result)
    } catch (e) {
        const jsonStringError = jsonString(e)
        console.log(`http error (e=${jsonStringError}})`)
        onError(jsonStringError)
        showError2({ message: 'Something went wrong...', description: jsonString(e) })
    } finally {
        lastly()
    }

}