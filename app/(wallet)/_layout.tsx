
import { Stack } from 'expo-router';

export default function WalletLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="send" options={{ title: 'Send' }} />
      <Stack.Screen name="receive" options={{ title: 'Receive' }} />
    </Stack>
  );
}
