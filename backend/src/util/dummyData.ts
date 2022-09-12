
import { LoginType, Place, PlaceSummary, UserDetails } from "../types"


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
    skiResortInfoData: {},
    gsi1pk: 'Geohash',
    gsi1sk: 'haosdha',
}
export const dummyPlaceSummary: PlaceSummary = {
    id: 'thredbo',
    name: 'Thredbo',
    location: {
        lat: 37.4224428,
        lng: -122.0842467
    },
}


export const dummyPeopleFeedPeople: UserDetails[] = [
    {
        userId: '1',
        name: 'Joos Schwarzmann',
        imageUri: 'https://images.unsplash.com/photo-1600356604219-84058a7b2bce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
        ski: { disciplines: { ski: true, snowboard: true }, styles: {}, skillLevel: 5 },
        otherImages: [],
        sesh: { resort: dummyPlaceSummary, time: new Date().getTime(), userId: '1', },
        email: 'joosschwarz@gmail.com',
        loginType: LoginType.GOOGLE,
    },
    {
        userId: '2',
        name: 'Pippi Kramer',
        imageUri: 'https://images.unsplash.com/photo-1614358571391-7c8d63674c15?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
        ski: { disciplines: { ski: true, }, styles: {}, skillLevel: 5 },
        otherImages: [],
        sesh: { resort: dummyPlaceSummary, time: new Date().getTime(), userId: '2', },
        email: 'pipk@gmail.com',
        loginType: LoginType.GOOGLE,
    },
    {
        userId: '3',
        name: 'Willi Smith',
        imageUri: 'https://images.unsplash.com/photo-1488580923008-6f98dfbd7a25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        ski: { disciplines: { ski: true, snowboard: true }, styles: {}, skillLevel: 3 },
        otherImages: [],
        sesh: { resort: dummyPlaceSummary, time: new Date().getTime(), userId: '3', },
        email: 'willsmith@gmail.com',
        loginType: LoginType.EMAIL,
    },
]
