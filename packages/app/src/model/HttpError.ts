export class HttpError {
    public message: String
    public code: number
    public constructor({message, code}: {message: String, code: number}) {
        this.message = message
        this.code=code
    }
}