import { YStack } from "tamagui";
import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { WhyVerena } from "./WhyVerena";
import { HowItWorks } from "./HowItWorks";
import { Security } from "./Security";
import { Footer } from "./Footer";

export const LandingPage: React.FC = () => {
  return (
    <YStack flex={1}>
      <Navigation />
      <Hero />
      <YStack flex={1}>
        <WhyVerena />
        <HowItWorks />
        <Security />
      </YStack>
      <Footer />
    </YStack>
  );
};
