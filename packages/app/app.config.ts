import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: "Verena",
        slug: "verena",
        extra: {
            ...config.extra,
            apiUrl: "http://localhost:3000" // "https://www.verena.app"
        }
    }
}
