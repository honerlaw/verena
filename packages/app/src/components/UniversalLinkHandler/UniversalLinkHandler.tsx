import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

export const UniversalLinkHandler: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      const { path } = Linking.parse(url);
      
      // Handle /connect path by navigating to the connector flow
      if (path === '/connect') {
        // Navigate to the connector page for account connection
        router.push('/connector');
      }
    };

    // Handle initial URL if app was opened via universal link
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Handle URL changes while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    handleInitialUrl();

    return () => {
      subscription.remove();
    };
  }, [router]);

  return null; // This component doesn't render anything
};
