import uuid from 'react-native-uuid'

export function myUuid() {
    return uuid.v4().toString()
}