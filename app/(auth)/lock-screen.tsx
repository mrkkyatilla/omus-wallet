
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSecurity } from '@/hooks/useSecurity';
import { LucideDelete, LucideFingerprint } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Toast from 'react-native-toast-message';

const PIN_LENGTH = 6;

export default function LockScreen() {
  const { verifyPin, authenticateWithBiometrics } = useSecurity();
  const [pin, setPin] = useState('');

  // Try to authenticate with biometrics as soon as the screen loads
  useEffect(() => {
    const attemptBiometrics = async () => {
        await authenticateWithBiometrics();
    }
    attemptBiometrics();
  }, [authenticateWithBiometrics]);

  const handleKeyPress = async (key: string) => {
    let newPin = pin;
    if (key === 'del') {
      newPin = newPin.slice(0, -1);
    } else if (pin.length < PIN_LENGTH) {
      newPin = pin + key;
    }
    setPin(newPin);

    // When PIN is fully entered, verify it
    if (newPin.length === PIN_LENGTH) {
      const success = await verifyPin(newPin);
      if (!success) {
        Toast.show({ type: 'error', text1: 'Incorrect PIN' });
        setPin(''); // Reset PIN on failure
      }
    }
  };

  const PinInputDisplay = ({ length }: { length: number }) => (
    <View className="flex-row gap-x-4">
      {Array.from({ length: PIN_LENGTH }).map((_, index) => (
        <View
          key={index}
          className={`h-4 w-4 rounded-full ${index < length ? 'bg-blue-500' : 'bg-slate-700'}`}>
        </View>
      ))}
    </View>
  );

  const Keypad = () => (
     <View className="w-full max-w-xs">
        <View className="flex-row justify-between mb-4">
            {['1', '2', '3'].map(k => <KeypadButton key={k} value={k} />)}
        </View>
         <View className="flex-row justify-between mb-4">
            {['4', '5', '6'].map(k => <KeypadButton key={k} value={k} />)}
        </View>
         <View className="flex-row justify-between mb-4">
            {['7', '8', '9'].map(k => <KeypadButton key={k} value={k} />)}
        </View>
         <View className="flex-row justify-between mb-4">
            {/* Biometrics Button */}
            <Pressable onPress={authenticateWithBiometrics} className="w-20 h-20 items-center justify-center rounded-full bg-slate-800">
                <LucideFingerprint color="white" size={28}/>
            </Pressable>
            <KeypadButton key='0' value='0' />
            <KeypadButton key='del' value='del' isIcon />
        </View>
    </View>
  );

  const KeypadButton = ({ value, isIcon }: { value: string, isIcon?: boolean }) => (
      <Pressable onPress={() => handleKeyPress(value)} className="w-20 h-20 items-center justify-center rounded-full bg-slate-800">
          {isIcon ? <LucideDelete color="white" size={28}/> : <ThemedText className="text-3xl text-white">{value}</ThemedText>}
      </Pressable>
  )


  return (
    <ThemedView className="flex-1 items-center justify-between bg-slate-950 py-24">
      <View className="items-center">
        <ThemedText className="text-2xl font-bold text-white">Enter PIN</ThemedText>
        <ThemedText className="mt-2 text-slate-400">Unlock your wallet to continue.</ThemedText>
      </View>

      <PinInputDisplay length={pin.length} />

      <Keypad />
    </ThemedView>
  );
}
