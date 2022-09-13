import { BackendUser } from "../backendTypes";
import { LoginType } from "../types";

export const userWill: BackendUser = {
    name: 'Will Smith',
    email: 'willsmithte@gmail.com',
    userId: '1',
    hasDoneInitialSetup: false,
    imageUri: 'https://willsmithte-shred-crew-static.s3.eu-central-1.amazonaws.com/will.png',
    loginType: LoginType.EMAIL,
    ski: { disciplines: { snowboard: true }, styles: { "off-piste": true, backcountry: true }, skillLevel: 3 },
    bio: `I've only been snowboarding for a few years but quickly fell in love with it. I love off-piste and mixing multiple hot chocolates into my day.`,
    createdAt: 1663082221,
    otherImages: undefined,
    matches: [],
    poked: {},
    pushToken: undefined,
    sesh: undefined,
    password: '$2a$08$IrAD/55BGuP011ThPfHniuzu0NHTdBG7ZA4F2mq/j1EjvOy/aiYXq',
    gsi2sk: undefined,
}
export const userPip: BackendUser = {
    name: 'Pip Kramer',
    email: 'pipakramer@gmail.com',
    userId: '2',
    hasDoneInitialSetup: false,
    imageUri: 'https://willsmithte-shred-crew-static.s3.eu-central-1.amazonaws.com/pip.png',
    loginType: LoginType.EMAIL,
    ski: { disciplines: { ski: true }, styles: { "off-piste": true, backcountry: true, moguls: true }, skillLevel: 5 },
    bio: '',
    createdAt: 1663082225,
    otherImages: undefined,
    matches: [],
    poked: {},
    pushToken: undefined,
    sesh: undefined,
    password: '$2a$08$26AJ7Z0fqXd61DdQ1Y5lBuhdxscJDhHAVfeV2unFeQVfijmX7g8WC',
    gsi2sk: undefined,
}