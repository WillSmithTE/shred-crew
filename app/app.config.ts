export default ({ config }: any) => {
    return {
        ...config,
        extra: {
            ...(config.extra ?? {}),
            webClientId: `${process.env.GOOGLE_WEB_APP_KEY}.apps.googleusercontent.com`,
            androidClientId: `${process.env.GOOGLE_ANDROID_APP_KEY}.apps.googleusercontent.com`,
            iosClientId: `${process.env.GOOGLE_IOS_APP_KEY}.apps.googleusercontent.com`,
            expoClientId: `${process.env.GOOGLE_EXPO_APP_KEY}.apps.googleusercontent.com`,
            sentryDsn: process.env.SENTRY_DSN,
            ...getConfig()
        },
        hooks: {
            postPublish: [
                {
                    file: "sentry-expo/upload-sourcemaps",
                    config: {
                        organization: "willsmithte",
                        project: "shred-crew",
                        authToken: process.env.SENTRY_AUTH_TOKEN
                    }
                }
            ]
        }
    };
};

function getConfig() {
    const environment: 'dev' | 'prod' | undefined = process.env['ENVIRONMENT'] as 'dev' | 'prod' | undefined

    if (environment === 'prod') {
        return { apiBaseUrl: 'https://b01cg79fb2.execute-api.eu-central-1.amazonaws.com', }
    } else if (environment === 'dev') {
        return { apiBaseUrl: 'https://cfwjn30knb.execute-api.eu-central-1.amazonaws.com', }
    } else {
        return { apiBaseUrl: 'http://192.168.1.105:8080', }
    }
}
