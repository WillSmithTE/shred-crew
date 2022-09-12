import { MyLocation } from "../types";
import geohash from 'ngeohash';

const coordinateSearchMargin = 0.05
const numHashDigitsToMatch = 4

export const resortService = {
    getHashesNearLocation: function (location: MyLocation): string[] {
        const [southwestLat, southwestLng] = [location.lat - coordinateSearchMargin, location.lng - coordinateSearchMargin]
        const [northeastLat, northeastLng] = [location.lat + coordinateSearchMargin, location.lng + coordinateSearchMargin]
        return geohash.bboxes(southwestLat, southwestLng, northeastLat, northeastLng, numHashDigitsToMatch)
    },
    getHash: function (location: MyLocation): string {
        return geohash.encode(location.lat, location.lng)
    }
}

