import { YStack, ScrollView } from "tamagui";
import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { WhyVerena } from "./WhyVerena";
import { HowItWorks } from "./HowItWorks";
import { Security } from "./Security";
import { FooterSection } from "./FooterSection";
import { useRef } from "react";

export const LandingPage: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  return (
    <ScrollView style={{ flex: 1 }} ref={scrollViewRef}>
      <Navigation scrollViewRef={scrollViewRef} />
      <Hero />
      <YStack>
        <WhyVerena />
        <Security />
        <HowItWorks />
      </YStack>
      <FooterSection />
    </ScrollView>
  );
};
