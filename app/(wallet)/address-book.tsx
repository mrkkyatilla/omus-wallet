
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAddressBook } from '@/hooks/useAddressBook';
import * as Clipboard from 'expo-clipboard';
import { LucideCopy, LucidePlus, LucideTrash2 } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function AddressBookScreen() {
  const { contacts, addContact, deleteContact } = useAddressBook();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleAddContact = () => {
    if (name && address) {
      addContact({ name, address });
      setName('');
      setAddress('');
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Contact Added',
        text2: `${name} has been added to your address book.`,
      });
    } else {
      Alert.alert('Error', 'Please fill in both name and address.');
    }
  };

  const handleDeleteContact = (contactAddress: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            deleteContact(contactAddress);
            Toast.show({
              type: 'error',
              text1: 'Contact Deleted',
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  const copyToClipboard = async (addr: string) => {
    await Clipboard.setStringAsync(addr);
    Toast.show({ type: 'success', text1: 'Address copied to clipboard' });
  };

  return (
    <ThemedView className="flex-1 bg-slate-950 p-4">
      <ThemedText className="mb-4 text-2xl font-bold text-white">Address Book</ThemedText>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <View className="mb-3 rounded-lg bg-slate-800 p-4">
            <View className="flex-row justify-between">
              <View>
                <ThemedText className="font-bold text-white">{item.name}</ThemedText>
                <ThemedText className="mt-1 font-mono text-sm text-slate-400" ellipsizeMode="middle" numberOfLines={1}>
                  {item.address}
                </ThemedText>
              </View>
              <View className="flex-row items-center gap-x-4">
                <Pressable onPress={() => copyToClipboard(item.address)}>
                  <LucideCopy color="#94a3b8" />
                </Pressable>
                <Pressable onPress={() => handleDeleteContact(item.address)}>
                  <LucideTrash2 color="#ef4444" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-700 py-10">
            <ThemedText className="text-slate-400">Your address book is empty.</ThemedText>
          </View>
        )}
      />

      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-8 right-8 h-16 w-16 items-center justify-center rounded-full bg-blue-500">
        <LucidePlus color="white" size={28} />
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
         <Pressable className="flex-1 bg-black/50" onPress={() => setModalVisible(false)} />
        <View className="absolute bottom-0 w-full rounded-t-2xl bg-slate-800 p-5">
          <ThemedText className="mb-4 text-xl font-bold text-white">Add New Contact</ThemedText>
          <TextInput
            className="mb-3 rounded-lg bg-slate-700 p-4 text-white"
            placeholder="Name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="mb-5 rounded-lg bg-slate-700 p-4 text-white"
            placeholder="Address"
            placeholderTextColor="#94a3b8"
            value={address}
            onChangeText={setAddress}
          />
          <Pressable onPress={handleAddContact} className="rounded-full bg-blue-500 py-4">
            <ThemedText className="text-center font-bold text-white">Add Contact</ThemedText>
          </Pressable>
        </View>
      </Modal>
    </ThemedView>
  );
}
