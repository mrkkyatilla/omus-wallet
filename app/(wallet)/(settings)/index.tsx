
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { LucideChevronRight, LucideShield } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export default function SettingsIndexScreen() {
  return (
    <ThemedView className="flex-1 bg-slate-950 p-4">
      <Link href="/(wallet)/(settings)/security" asChild>
        <Pressable>
          <View className="flex-row items-center justify-between rounded-lg bg-slate-800 p-4">
            <View className="flex-row items-center gap-x-4">
              <LucideShield color="#94a3b8" />
              <ThemedText className="text-lg font-bold text-white">Security</ThemedText>
            </View>
            <LucideChevronRight color="#94a3b8" />
          </View>
        </Pressable>
      </Link>
    </ThemedView>
  );
}
