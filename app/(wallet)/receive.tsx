
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWallet, Asset } from '@/hooks/useWallet';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { LucideCheck, LucideChevronDown, LucideCopy } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Modal, Pressable, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';

export default function ReceiveScreen() {
  const { assets } = useWallet();
  const receivableAssets = assets.filter((asset) => !asset.name.includes('USDC'));

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(receivableAssets[0] || null);
  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (selectedAsset?.address) {
      await Clipboard.setStringAsync(selectedAsset.address);
      setCopied(true);
      Toast.show({
        type: 'success',
        text1: 'Copied to Clipboard',
        text2: selectedAsset.address,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ... (renderAssetSelector and Modal components remain the same) ...

  return (
    <ThemedView className="flex-1 items-center bg-slate-950 p-4">
      {/* ... (Modal is the same) ... */}

      <ThemedText className="mt-8 text-2xl font-bold text-white">Receive Funds</ThemedText>
      <ThemedText className="mt-2 text-center text-slate-400">
        Select a wallet and share the address or QR code to receive funds.
      </ThemedText>

      <View className="w-full max-w-xs px-4">{/* renderAssetSelector() */}</View>

      {selectedAsset?.address && (
        <View className="mt-10 flex-1 items-center">
          <View className="rounded-2xl bg-white p-4">
            <QRCode value={selectedAsset.address} size={220} />
          </View>

          <View className="mt-8 w-full max-w-sm items-center rounded-lg bg-slate-800 p-4">
            <ThemedText className="text-slate-400">{selectedAsset.name} Address</ThemedText>
            <View className="mt-2 flex-row items-center gap-x-3">
              <ThemedText
                className="flex-shrink text-center font-mono text-sm text-white"
                numberOfLines={1}
                ellipsizeMode="middle">
                {selectedAsset.address}
              </ThemedText>
              <Pressable onPress={copyToClipboard}>
                {copied ? <LucideCheck color="#22c55e" /> : <LucideCopy color="white" />}
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ThemedView>
  );
}
