import { Response } from 'express';

export function validateHttpBody<T>(item: T, res: Response, validate: (item: T) => void, onSuccessValidation: (item: T) => void,) {
    try {
        validate(item)
        onSuccessValidation(item)
    } catch (e) {
        res.status(400).json({ error: e.toString() })
    }
}

export function verifyDefined(a: any, fieldName: string) {
    if (a === undefined) {
        throw new Error(`${fieldName} can't be undefined`)
    }
}
export function verifyNumber(a: any, fieldName: string): a is number {
    if (typeof a === 'number') return true
    throw new Error(`${fieldName} must be a number`)
}
export function verifyString(a: any, fieldName: string): a is string {
    if (typeof a === 'string') return true
    throw new Error(`${fieldName} must be a string`)
}
export function verifyBool(a: any, fieldName: string): a is boolean {
    if (typeof a === 'boolean') return true
    throw new Error(`${fieldName} must be a boolean`)
}

