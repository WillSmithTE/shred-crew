import { showError2 } from "../components/Error"
import { jsonString } from "./jsonString"

export async function tryCatchAsync<T>(
    getter: () => Promise<T>,
    setResult: (result: T) => void,
    setError: (error: any) => void,
) {
    try {
        const result = await getter()
        setResult(result)
    } catch (e) {
        console.log(`http error (e=${jsonString(e as any)})`)
        setError(jsonString(e as any))
        showError2({ message: 'Something went wrong...', description: jsonString(e as any) })
    }

}