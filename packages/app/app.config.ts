export default ({ config }: any) => {
    return {
        ...config,
        extra: {
            ...(config.extra ?? {}),
            webClientId: `${process.env.GOOGLE_WEB_APP_KEY}.apps.googleusercontent.com`,
            androidClientId: `${process.env.GOOGLE_ANDROID_APP_KEY}.apps.googleusercontent.com`,
            iosClientId: `${process.env.GOOGLE_IOS_APP_KEY}.apps.googleusercontent.com`,
            expoClientId: `${process.env.GOOGLE_EXPO_APP_KEY}.apps.googleusercontent.com`,
        },
    };
};
