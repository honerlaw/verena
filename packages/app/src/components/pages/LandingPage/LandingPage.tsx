import { YStack } from "tamagui";
import { ScrollView } from "react-native";
import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { WhyVerena } from "./WhyVerena";
import { HowItWorks } from "./HowItWorks";
import { Security } from "./Security";
import { Footer } from "./Footer";

export const LandingPage: React.FC = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Navigation />
      <Hero />
      <YStack>
        <WhyVerena />
        <HowItWorks />
        <Security />
      </YStack>
      <Footer />
    </ScrollView>
  );
};
