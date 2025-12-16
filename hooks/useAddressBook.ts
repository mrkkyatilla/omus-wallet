
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'address-book';

export type Contact = {
  name: string;
  address: string;
};

export function useAddressBook() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    } catch (e) {
      console.error('Failed to load contacts.', e);
    }
  };

  const addContact = async (contact: Contact) => {
    try {
      const newContacts = [...contacts, contact];
      setContacts(newContacts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
    } catch (e) {
      console.error('Failed to save contact.', e);
    }
  };

  const deleteContact = async (address: string) => {
    try {
      const newContacts = contacts.filter((c) => c.address !== address);
      setContacts(newContacts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
    } catch (e) {
      console.error('Failed to delete contact.', e);
    }
  };

  return { contacts, addContact, deleteContact, refresh: loadContacts };
}
 