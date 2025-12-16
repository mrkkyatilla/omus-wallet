
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAddressBook } from '@/hooks/useAddressBook';
import { useSecurity } from '@/hooks/useSecurity';
import { Asset, useWallet } from '@/hooks/useWallet';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  LucideChevronDown,
  LucideDelete,
  LucideFingerprint,
  LucideUsers,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const PIN_LENGTH = 6;

export default function SendScreen() {
  const router = useRouter();
  const { assets, sendTransaction } = useWallet();
  const { contacts } = useAddressBook();
  const { verifyPin, authenticateWithBiometrics } = useSecurity();

  // Component State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets[0] || null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const [addressBookModalVisible, setAddressBookModalVisible] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');

  // --- Main Transaction Logic ---
  const executeTransaction = async () => {
    if (!selectedAsset || !recipientAddress || !amount) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const result = await sendTransaction(selectedAsset, recipientAddress, parseFloat(amount));
      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Transaction Sent',
          text2: `Successfully sent ${amount} ${selectedAsset.symbol}`,
        });
        router.back(); // Use back instead of push to return to the previous screen
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Transaction Failed',
        text2: error.message || 'An unknown error occurred',
      });
    } finally {
      setLoading(false);
      setPin('');
      setPinModalVisible(false);
    }
  };

  // --- Authentication Flow ---
  const handleSendRequest = async () => {
    const biometricSuccess = await authenticateWithBiometrics();
    if (biometricSuccess) {
      await executeTransaction();
    } else {
      setPinModalVisible(true);
    }
  };

  const handlePinKeyPress = async (key: string) => {
    let newPin = pin;
    if (key === 'del') {
      newPin = pin.slice(0, -1);
    } else if (pin.length < PIN_LENGTH) {
      newPin = pin + key;
    }
    setPin(newPin);

    if (newPin.length === PIN_LENGTH) {
      const pinSuccess = await verifyPin(newPin);
      if (pinSuccess) {
        setPinModalVisible(false);
        await executeTransaction();
      } else {
        Toast.show({ type: 'error', text1: 'Incorrect PIN' });
        setPin('');
      }
    }
  };

  // --- UI Components ---
  const renderAssetSelector = () => (
    <Pressable onPress={() => setAssetModalVisible(true)} className="mt-2 rounded-lg bg-slate-800 p-4 flex-row justify-between items-center">
      <View className="flex-row items-center gap-x-3">
        <Image source={{ uri: selectedAsset?.icon }} className="h-10 w-10 rounded-full" />
        <View>
            <ThemedText className="font-bold text-lg text-white">{selectedAsset?.name}</ThemedText>
            <ThemedText className="text-slate-400">Balance: {selectedAsset?.balance.toString()}</ThemedText>
        </View>
      </View>
      <LucideChevronDown color="white" />
    </Pressable>
  );

  const renderAssetModal = () => (
    <Modal animationType="slide" transparent={true} visible={assetModalVisible}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setAssetModalVisible(false)} />
        <View className="absolute bottom-0 w-full rounded-t-2xl bg-slate-900 p-5">
            <FlatList 
                data={assets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={() => { setSelectedAsset(item); setAssetModalVisible(false); }} className="flex-row items-center gap-x-4 p-3 rounded-lg hover:bg-slate-800">
                        <Image source={{ uri: item.icon }} className="h-10 w-10 rounded-full" />
                        <View>
                            <ThemedText className="font-bold text-white text-lg">{item.name}</ThemedText>
                            <ThemedText className="text-slate-400">{item.balance.toString()} {item.symbol}</ThemedText>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    </Modal>
  )

  const renderAddressBookModal = () => (
    <Modal animationType="slide" transparent={true} visible={addressBookModalVisible}>
       <Pressable className="flex-1 bg-black/50" onPress={() => setAddressBookModalVisible(false)} />
        <View className="absolute bottom-0 w-full rounded-t-2xl bg-slate-900 p-5">
            <FlatList 
                data={contacts}
                keyExtractor={(item) => item.address}
                renderItem={({ item }) => (
                    <Pressable onPress={() => { setRecipientAddress(item.address); setAddressBookModalVisible(false); }} className="p-3 rounded-lg hover:bg-slate-800">
                        <ThemedText className="font-bold text-white">{item.name}</ThemedText>
                        <ThemedText className="text-slate-400">{item.address}</ThemedText>
                    </Pressable>
                )}
                ListEmptyComponent={<ThemedText className="text-center text-slate-500">No contacts yet.</ThemedText>}
            />
        </View>
    </Modal>
);

  const PinModal = () => (
    <Modal animationType="slide" transparent={true} visible={pinModalVisible}>
      <Pressable className="flex-1 bg-black/50" onPress={() => setPinModalVisible(false)} />
      <View className="absolute bottom-0 w-full items-center rounded-t-2xl bg-slate-900 py-10">
        <ThemedText className="text-xl font-bold text-white">Enter PIN to Confirm</ThemedText>
        <View className="my-8 flex-row gap-x-4">
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <View
              key={index}
              className={`h-4 w-4 rounded-full ${index < pin.length ? 'bg-blue-500' : 'bg-slate-700'}`}
            />
          ))}
        </View>
        <Keypad onKeyPress={handlePinKeyPress} />
      </View>
    </Modal>
  );

  const Keypad = ({ onKeyPress }: { onKeyPress: (key: string) => void }) => (
    <View className="w-full max-w-xs">
         <View className="flex-row justify-between mb-4">
             <KeypadButton onKey={onKeyPress} value='1' />
             <KeypadButton onKey={onKeyPress} value='2' />
             <KeypadButton onKey={onKeyPress} value='3' />
        </View>
         <View className="flex-row justify-between mb-4">
             <KeypadButton onKey={onKeyPress} value='4' />
             <KeypadButton onKey={onKeyPress} value='5' />
             <KeypadButton onKey={onKeyPress} value='6' />
        </View>
         <View className="flex-row justify-between mb-4">
             <KeypadButton onKey={onKeyPress} value='7' />
             <KeypadButton onKey={onKeyPress} value='8' />
             <KeypadButton onKey={onKeyPress} value='9' />
        </View>
        <View className="flex-row justify-between mb-4">
            <Pressable onPress={async () => { 
                const success = await authenticateWithBiometrics(); 
                if (success) await executeTransaction();
              }}
              className="w-20 h-20 items-center justify-center rounded-full bg-slate-800">
                <LucideFingerprint color="white" size={28}/>
            </Pressable>
            <KeypadButton onKey={onKeyPress} value='0' />
            <KeypadButton onKey={onKeyPress} value='del' isIcon />
        </View>
    </View>
  );

  const KeypadButton = ({ value, isIcon, onKey }: { value: string; isIcon?: boolean; onKey: (key: string) => void }) => (
    <Pressable onPress={() => onKey(value)} className="h-20 w-20 items-center justify-center rounded-full bg-slate-800">
      {isIcon ? <LucideDelete color="white" size={28} /> : <ThemedText className="text-3xl text-white">{value}</ThemedText>}
    </Pressable>
  );

  return (
    <ThemedView className="flex-1 bg-slate-950 p-4">
      {renderAssetModal()}
      {renderAddressBookModal()}
      <PinModal />

      <ThemedText className="mt-8 text-2xl font-bold text-white">Send</ThemedText>
      {renderAssetSelector()}

      <ThemedText className="mt-4 font-bold text-slate-400">Recipient</ThemedText>
      <View className="flex-row items-center rounded-lg bg-slate-800 pr-2">
        <TextInput
          value={recipientAddress}
          onChangeText={setRecipientAddress}
          placeholder="Enter or select an address"
          placeholderTextColor="#94a3b8"
          className="flex-1 p-4 text-white"
        />
        <Pressable onPress={() => setAddressBookModalVisible(true)}>
            <LucideUsers color="#94a3b8" size={24}/>
        </Pressable>
      </View>

      <ThemedText className="mt-4 font-bold text-slate-400">Amount</ThemedText>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="0.0"
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
        className="rounded-lg bg-slate-800 p-4 text-white"
      />

      <View className="flex-1" />

      <Pressable
        onPress={handleSendRequest}
        disabled={loading}
        className="rounded-full bg-blue-500 py-4 disabled:bg-slate-600">
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText className="text-center font-bold text-white">Send</ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}
