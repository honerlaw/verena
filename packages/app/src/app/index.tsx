
import React from 'react';
import { YStack, XStack } from '@tamagui/stacks';
import { Button } from '@tamagui/button';
import { Card } from '@tamagui/card';
import { H1, H2, Paragraph } from '@tamagui/text';
import { Separator } from '@tamagui/separator';
import { Avatar } from '@tamagui/avatar';
import { Input } from '@tamagui/input';
import { Switch } from '@tamagui/switch';
import { Slider } from '@tamagui/slider';

export default function Home() {
  const [switchValue, setSwitchValue] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState([50]);

  return (
    <YStack f={1} p="$4" space="$4">
        <YStack space="$2">
          <H1 textAlign="center">Welcome to Tamagui!</H1>
          <Paragraph textAlign="center" theme="alt2">
            Your Expo app is now powered by Tamagui's design system
          </Paragraph>
        </YStack>

        <Separator />

        <Card elevate size="$4" bordered>
          <Card.Header padded>
            <H2>Card Component</H2>
            <Paragraph theme="alt2">
              This is a beautiful card component with elevation and borders
            </Paragraph>
          </Card.Header>
          <Card.Footer padded>
            <XStack space="$2" justifyContent="flex-end">
              <Button variant="outlined">Cancel</Button>
              <Button theme="active">Confirm</Button>
            </XStack>
          </Card.Footer>
        </Card>

        <YStack space="$3">
          <H2>Interactive Components</H2>
          
          <XStack space="$3" alignItems="center">
            <Paragraph>Dark Mode</Paragraph>
            <Switch 
              checked={switchValue} 
              onCheckedChange={setSwitchValue}
            />
          </XStack>

          <YStack space="$2">
            <Paragraph>Volume: {sliderValue[0]}</Paragraph>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
            >
              <Slider.Track>
                <Slider.TrackActive />
              </Slider.Track>
              <Slider.Thumb circular index={0} />
            </Slider>
          </YStack>

          <Input
            placeholder="Type something here..."
            size="$4"
            borderWidth={2}
          />
        </YStack>

        <YStack space="$3">
          <H2>User Profile</H2>
          <XStack space="$3" alignItems="center">
            <Avatar circular size="$6">
              <Avatar.Image source={{ uri: 'https://github.com/tamagui.png' }} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
            <YStack>
              <Paragraph fontWeight="600">John Doe</Paragraph>
              <Paragraph theme="alt2">john.doe@example.com</Paragraph>
            </YStack>
          </XStack>
        </YStack>

        <YStack space="$2">
          <H2>Button Variants</H2>
          <XStack space="$2" flexWrap="wrap">
            <Button>Default</Button>
            <Button variant="outlined">Outlined</Button>
            <Button theme="active">Active</Button>
            <Button theme="red">Danger</Button>
          </XStack>
        </YStack>
      </YStack>
  );
}