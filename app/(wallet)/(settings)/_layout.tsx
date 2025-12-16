
import { Stack, useRouter } from 'expo-router';
import { LucideChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

export default function SettingsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' }, // Slate-900
        headerTintColor: '#f8fafc', // Slate-50
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
             <LucideChevronLeft color="#f8fafc" size={24} />
          </Pressable>
        ),
      }}>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="security" options={{ title: 'Security' }} />
    </Stack>
  );
}
