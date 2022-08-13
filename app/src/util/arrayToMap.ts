export function arrayToMap<S, T extends keyof S>(input: S[], keyFieldName: T): Map<string, S> {
    return input.reduce((map, obj) => map.set(obj[keyFieldName], obj), new Map())

}