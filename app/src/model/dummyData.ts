import { Conversation, Friend, PersonInFeed, Place } from "./types"

export const photoWill = 'https://drive.google.com/uc?id=1IEB_sv_rUetHVT5GjVJWBRMy9uF1ivjp'
export const photoPip = 'https://drive.google.com/uc?id=1ZP5iPXjXyYaiSWMwIIpvHByTERouw8CW'

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
        imageUri: photoPip,
        ski: { disciplines: { ski: true, }, styles: {}, skillLevel: 5 },
        otherImages: [require('../../assets/peopleFeed3-2.png')],
        sessionResort: dummyPlace,
    },
    {
        userId: '3',
        name: 'Willi Smith',
        imageUri: photoWill,
        ski: { disciplines: { ski: true, snowboard: true }, styles: {}, skillLevel: 3 },
        otherImages: [require('../../assets/peopleFeed2-2.png')],
        sessionResort: dummyPlace,
    },
]


export const dummyFriends: { [userId: string]: Friend } = {
    lkjlakn: {
        profile: {
            userId: 'lkjlakn',
            name: 'Will Smith',
            imageUri: photoWill,
        },
        friendSince: twoDaysAgo().getDate(),
        messages: [
            {
                _id: 'lkjlakn',
                createdAt: twoHoursAgo().getDate(),
                text: 'you at thredbo tomorrow?',
                user: {
                    userId: '3', name: ''
                }
            }
        ]
    },
    4: {
        profile: {
            userId: '4',
            name: 'Pip Kramer',
            imageUri: photoPip,
        },
        friendSince: twoHoursAgo().getDate(),
        messages: [{
            _id: 'alksnga',
            createdAt: twoDaysAgo().getDate(),
            text: 'cool cya tthen',
            user: { userId: '4', name: '' }
        }],
    },
}
export function twoDaysAgo() {
    const date = new Date()
    date.setDate(date.getDate() - 2)
    return date
}

export function twoHoursAgo() {
    const date = new Date()
    date.setHours(date.getHours() - 2)
    return date
}

export const dummyConversationWithMessage: Conversation = {
    id: '123asd',
    message: { user: 'user1', time: twoHoursAgo().getTime(), data: { text: 'hey whatup' } },
    name: 'Johnny Schimdt',
    img: photoWill,
    created: twoDaysAgo().getTime(),
}
export const dummyConversation: Conversation = {
    id: '123asd',
    name: 'Johnny Schimdt',
    img: photoWill,
    created: twoHoursAgo().getTime(),
}