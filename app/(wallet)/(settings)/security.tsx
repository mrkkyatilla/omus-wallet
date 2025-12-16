
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSecurity } from '@/hooks/useSecurity';
import { useRouter } from 'expo-router';
import { LucideDelete } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Toast from 'react-native-toast-message';

const PIN_LENGTH = 6;

export default function SecurityScreen() {
  const router = useRouter();
  // The setPin function from the hook, used to save the PIN securely.
  const { setPin, hasPin } = useSecurity();
  // The local pin state for the input fields.
  const [pin, setPinValue] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      if (isConfirming) {
        setConfirmPin((p) => p.slice(0, -1));
      } else {
        setPinValue((p) => p.slice(0, -1));
      }
      return;
    }

    if (isConfirming) {
      if (confirmPin.length < PIN_LENGTH) {
        setConfirmPin((p) => p + key);
      }
    } else {
      if (pin.length < PIN_LENGTH) {
        setPinValue((p) => p + key);
      }
    }
  };

  const handlePinComplete = async () => {
    if (pin.length === PIN_LENGTH && !isConfirming) {
      setIsConfirming(true);
    } else if (confirmPin.length === PIN_LENGTH) {
      if (pin === confirmPin) {
        const success = await setPin(pin); // Use the hook's setPin function.
        if (success) {
          Toast.show({ type: 'success', text1: 'PIN Set Successfully' });
          router.back();
        } else {
          Toast.show({ type: 'error', text1: 'Failed to set PIN' });
        }
      } else {
        Toast.show({ type: 'error', text1: "PINs do not match!" });
        setPinValue(''); // Reset local pin state.
        setConfirmPin('');
        setIsConfirming(false);
      }
    }
  };

  // This effect triggers the check when a PIN is fully entered.
  useEffect(() => {
    handlePinComplete();
  }, [pin, confirmPin]);

  const PinInputDisplay = ({ length }: { length: number }) => (
    <View className="flex-row gap-x-4">
      {Array.from({ length: PIN_LENGTH }).map((_, index) => (
        <View
          key={index}
          className={`h-4 w-4 rounded-full ${
            index < length ? 'bg-blue-500' : 'bg-slate-700'
          }`}></View>
      ))}
    </View>
  );

  const Keypad = () => (
    <View className="w-full max-w-xs">
      <View className="mb-4 flex-row justify-between">
        {['1', '2', '3'].map((k) => (
          <KeypadButton key={k} value={k} />
        ))}
      </View>
      <View className="mb-4 flex-row justify-between">
        {['4', '5', '6'].map((k) => (
          <KeypadButton key={k} value={k} />
        ))}
      </View>
      <View className="mb-4 flex-row justify-between">
        {['7', '8', '9'].map((k) => (
          <KeypadButton key={k} value={k} />
        ))}
      </View>
      <View className="mb-4 flex-row justify-between">
        <View className="h-20 w-20" />
        <KeypadButton key="0" value="0" />
        <KeypadButton key="del" value="del" isIcon />
      </View>
    </View>
  );

  const KeypadButton = ({ value, isIcon }: { value: string; isIcon?: boolean }) => (
    <Pressable
      onPress={() => handleKeyPress(value)}
      className="h-20 w-20 items-center justify-center rounded-full bg-slate-800">
      {isIcon ? (
        <LucideDelete color="white" size={28} />
      ) : (
        <ThemedText className="text-3xl text-white">{value}</ThemedText>
      )}
    </Pressable>
  );

  return (
    <ThemedView className="flex-1 items-center justify-between bg-slate-950 py-16">
      <View className="items-center">
        <ThemedText className="text-2xl font-bold text-white">
          {hasPin ? 'Change PIN' : isConfirming ? 'Confirm Your PIN' : 'Create a PIN'}
        </ThemedText>
        <ThemedText className="mt-2 text-slate-400">
          Your PIN will be used to unlock the app and sign transactions.
        </ThemedText>
      </View>

      <PinInputDisplay length={isConfirming ? confirmPin.length : pin.length} />

      <Keypad />
    </ThemedView>
  );
}
