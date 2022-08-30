import { PersonInFeed, Place } from "../types"


export const dummyPlace: Place = {
    id: 'thredbo',
    name: 'Thredbo',
    googlePlace: {
        geometry: {
            location: {
                lat: 37.4224428,
                lng: -122.0842467
            },
            viewport: {
                northeast: {
                    "lat": 37.4239627802915,
                    "lng": -122.0829089197085
                },
                "southwest": {
                    "lat": 37.4212648197085,
                    "lng": -122.0856068802915
                }
            }
        },
    },
    skiResortInfoData: {}
}


export const dummyPeopleFeedPeople: PersonInFeed[] = [
    {
        userId: '1',
        name: 'Joos Hartmann',
        imageUri: require('../../assets/peopleFeed1-1.png'),
        ski: { disciplines: { ski: true, snowboard: true }, styles: {}, skillLevel: 5 },
        otherImages: [require('../../assets/peopleFeed1-2.png')],
        sessionResort: dummyPlace,
    },
    {
        userId: '2',
        name: 'Pippi Kramer',
        imageUri: require('../../assets/peopleFeed3.png'),
        ski: { disciplines: { ski: true, }, styles: {}, skillLevel: 5 },
        otherImages: [require('../../assets/peopleFeed3-2.png')],
        sessionResort: dummyPlace,
    },
    {
        userId: '3',
        name: 'Willi Smith',
        imageUri: require('../../assets/peopleFeed2.png'),
        ski: { disciplines: { ski: true, snowboard: true }, styles: {}, skillLevel: 3 },
        otherImages: [require('../../assets/peopleFeed2-2.png')],
        sessionResort: dummyPlace,
    },
]
