import { dynamoDbClient, RESORTS_TABLE } from "../database";
import { Request, Response } from 'express';
import geohash from 'ngeohash';
import { removeDuplicates } from "../util/removeDuplicates";
import { MyLocation, Place, ViewPort } from "../types";

export function validateHttpBody<T>(item: T, res: Response, validate: (item: T) => void, onSuccessValidation: (item: T) => void,) {
    try {
        validate(item)
        onSuccessValidation(item)
    } catch (e) {
        res.status(400).json({ error: e.toString() })
    }
}

export function verifyDefined(a: any, res: Response, fieldName: string) {
    if (a === undefined) {
        throw new Error(`${fieldName} can't be undefined`)
    }
}
export function verifyNumber(a: any, res: Response, fieldName: string): a is number {
    if (typeof a === 'number') return true
    throw new Error(`${fieldName} must be a number`)
}

