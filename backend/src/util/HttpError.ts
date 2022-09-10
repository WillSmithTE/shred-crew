export class HttpError {
    public message: string
    public code: number
    public constructor(message: string, code: number) {
        this.message = message
        this.code = code
    }
}