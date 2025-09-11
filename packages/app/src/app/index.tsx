
import { Stack, Text, styled } from '@tamagui/core'

const StyledButton = styled(Stack, {
  backgroundColor: '$blue10',
  borderRadius: '$4',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  cursor: 'pointer',
})

const Title = styled(Text, {
  fontSize: '$8',
  fontWeight: 'bold',
  color: '$color12',
})

export default function Home() {
  return (
    <Stack flex={1} justifyContent="center" alignItems="center" gap="$4" backgroundColor="$background">
      <Title>Welcome to Tamagui!</Title>
      <StyledButton>
        <Text color="white" fontWeight="bold">
          Hello Tamagui
        </Text>
      </StyledButton>
    </Stack>
  )
}