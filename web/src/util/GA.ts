export const GA = {
    sendEvent: (name: string) => {
        if (typeof (window as any).gtag !== 'undefined') (window as any).gtag("event", name)
    }
}