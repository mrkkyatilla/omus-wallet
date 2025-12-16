
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams } from 'expo-router';
import { LucideClipboard, LucideExternalLink } from 'lucide-react-native';
import { Pressable, View, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

function DetailRow({ label, value, isAddress = false }: { label: string; value: string; isAddress?: boolean }) {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(value);
    Alert.alert('Copied', `${label} copied to clipboard.`);
  };

  return (
    <View className="mb-4 flex-row items-center justify-between">
      <ThemedText className="text-slate-400">{label}</ThemedText>
      <Pressable onPress={copyToClipboard} className="flex-row items-center gap-x-2">
        <ThemedText className="shrink-0 text-white">
          {isAddress ? `${value.slice(0, 6)}...${value.slice(-4)}` : value}
        </ThemedText>
        <LucideClipboard color="#94a3b8" size={16} />
      </Pressable>
    </View>
  );
}

export default function TransactionDetailsScreen() {
  const params = useLocalSearchParams<{ transaction: string }>();
  const tx = JSON.parse(params.transaction || '{}');

  const isSender = tx.isSender;
  const explorerUrl = tx.type === 'solana'
      ? `https://solscan.io/tx/${tx.id}`
      : `https://etherscan.io/tx/${tx.id}`;

  const openExplorer = () => {
    Linking.openURL(explorerUrl);
  };

  return (
    <ThemedView className="flex-1 bg-slate-950 p-4">
      <View className="rounded-lg bg-slate-800 p-4">
        <View className="items-center py-4">
          <ThemedText className={`text-3xl font-bold ${isSender ? 'text-red-500' : 'text-green-500'}`}>
            {isSender ? 'Sent' : 'Received'} {tx.symbol}
          </ThemedText>
          <ThemedText className="text-xl font-bold text-white">{tx.amount}</ThemedText>
        </View>
        <View className="my-4 h-[1px] bg-slate-700" />
        <DetailRow label="Date" value={tx.date} />
        <DetailRow label="Status" value={tx.status} />
        <DetailRow label="Sender" value={tx.sender} isAddress />
        <DetailRow label="Transaction ID" value={tx.id} isAddress />
      </View>
      <Pressable onPress={openExplorer} className="mt-4 flex-row items-center justify-center gap-x-2 rounded-full bg-blue-500 py-4">
        <LucideExternalLink color="white" />
        <ThemedText className="text-center text-lg font-bold text-white">View on Explorer</ThemedText>
      </Pressable>
    </ThemedView>
  );
}
