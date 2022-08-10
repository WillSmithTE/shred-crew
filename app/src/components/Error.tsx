import { showMessage, hideMessage, MessageOptions } from "react-native-flash-message";

export const showError = (message: string) => {
    console.error(message)
    showMessage({ message, type: 'danger' })
}
export const showError2 = (options: MessageOptions) => {
    console.error(options.message)
    showMessage({ ...options, type: 'danger' })
}

export const showComingSoon = () => { showMessage({ message: 'Coming soon!', type: 'success' }) }

