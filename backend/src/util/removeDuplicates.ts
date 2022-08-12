export function removeDuplicates<S, T extends keyof S>(input: S[], fieldName: T): S[] {
    return [...input.reduce((map, obj) => map.set(obj[fieldName], obj), new Map()).values()];

}