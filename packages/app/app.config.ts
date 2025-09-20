import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
    const isProduction = process.env.APP_VARIANT === "production" || process.env.NODE_ENV === "production";
    return {
        ...config,
        name: "Verena",
        slug: "verena",
        extra: {
            ...config.extra,
            apiUrl: isProduction ? "https://www.verena.app" : "http://localhost:3000"
        }
    }
}
