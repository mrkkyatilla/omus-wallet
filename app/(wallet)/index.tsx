
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  LucideArrowLeft,
  LucideArrowUpRight,
  LucideBookUser,
  LucideDownload,
  LucideSend,
  LucideWallet,
} from 'lucide-react-native';
import { useState } from 'react';
import { RefreshControl, ScrollView, View, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWallet } from '@/hooks/useWallet';

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { assets, transactions, refreshData, solanaWallet, ethereumWallet, loading } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const totalUsdBalance = assets.reduce((acc, asset) => acc + (asset.balance * asset.usdValue || 0), 0);

  if (loading && assets.length === 0) {
    return (
      <ThemedView className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#fff" />
        <ThemedText className="mt-4 text-white">Loading Wallet...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}>
        <View style={{ paddingTop: insets.top }} className="px-4">
          {/* Header, Balance, and Action Buttons */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-2">
              <Image source={{ uri: 'https://github.com/Mrk-Kky.png' }} className="h-8 w-8 rounded-full" />
              <ThemedText className="text-white">omus-wallet</ThemedText>
            </View>
            <Pressable>
              <LucideBookUser color="white" />
            </Pressable>
          </View>

          <View className="items-center py-8">
            <ThemedText className="text-lg text-slate-400">Total Balance</ThemedText>
            <ThemedText className="text-5xl font-bold text-white">${totalUsdBalance.toFixed(2)}</ThemedText>
          </View>

          <View className="flex-row justify-around">
            <View className="items-center gap-y-2">
              <Pressable className="h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                <LucideSend color="white" />
              </Pressable>
              <ThemedText className="font-bold text-white">Send</ThemedText>
            </View>
            <View className="items-center gap-y-2">
              <Pressable className="h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                <LucideDownload color="white" />
              </Pressable>
              <ThemedText className="font-bold text-white">Receive</ThemedText>
            </View>
            <View className="items-center gap-y-2">
              <Pressable className="h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                <LucideWallet color="white" />
              </Pressable>
              <ThemedText className="font-bold text-white">Buy</ThemedText>
            </View>
          </View>
        </View>

        <View className="flex-1 pt-8">
          {/* Asset List */}
          <View className="px-4">
            {assets.map((asset) => (
              <View key={asset.id} className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-4">
                  <Image source={{ uri: asset.icon }} className="h-10 w-10 rounded-full" />
                  <View>
                    <ThemedText className="font-bold text-white">{asset.name}</ThemedText>
                    <ThemedText className="text-sm text-slate-400">{asset.symbol}</ThemedText>
                  </View>
                </View>
                <View className="items-end">
                  <ThemedText className="font-bold text-white">
                    {asset.balance.toFixed(4)} {asset.symbol}
                  </ThemedText>
                  <ThemedText className="text-sm text-slate-400">
                    ${(asset.balance * asset.usdValue).toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>

          {/* Transaction History */}
          <View className="px-4 pt-8">
            <ThemedText className="mb-4 text-white">Transaction History</ThemedText>
            {transactions.length > 0 ? (
              transactions.map((tx) => {
                const isSender = tx.sender === solanaWallet?.publicKey.toBase58() || tx.sender === ethereumWallet?.address;
                const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount).toFixed(4) : tx.amount.toFixed(4);
                const transactionData = { ...tx, isSender, amount };

                return (
                  <Link
                    key={tx.id}
                    href={{
                      pathname: '/(wallet)/transaction-details',
                      params: { transaction: JSON.stringify(transactionData) },
                    }}>
                    <View className="mb-4 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-x-4">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-800">
                          {isSender ? (
                            <LucideArrowUpRight color="#ef4444" />
                          ) : (
                            <LucideDownload color="#22c55e" />
                          )}
                        </View>
                        <View>
                          <ThemedText className="font-bold text-white">
                            {isSender ? 'Sent' : 'Received'} {tx.type}
                          </ThemedText>
                          <ThemedText className="text-sm text-slate-400">{tx.date}</ThemedText>
                        </View>
                      </View>
                      <View className="items-end">
                        <ThemedText className={`font-bold ${isSender ? 'text-red-500' : 'text-green-500'}`}>
                          {isSender ? '-' : '+'} {amount} {tx.type}
                        </ThemedText>
                        <ThemedText className="text-sm text-slate-400">{tx.date}</ThemedText>
                      </View>
                    </View>
                  </Link>
                );
              })
            ) : (
              <ThemedText className="text-center text-slate-500">No transactions yet.</ThemedText>
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
