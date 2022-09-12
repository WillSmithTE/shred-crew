import { MyLocation, Place, ViewPort } from "../types";

export const locationService = {
    sortByClosest: function <T>(location: MyLocation, items: T[], getLocation: (item: T) => MyLocation): T[] {
        const withDistances = items.map((resort) => ({
            ...resort,
            distance: getDistanceBetweenPoints(location, getLocation(resort))
        }))
        return withDistances.sort((a, b) => a.distance - b.distance)
    },
}

function getDistanceBetweenPoints(a: MyLocation, b: MyLocation) {
    // from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const something = 0.5 - c((b.lat - a.lat) * p) / 2 +
        c(a.lat * p) * c(b.lat * p) *
        (1 - c((b.lng - a.lng) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(something)); // 2 * R; R = 6371 km
}
