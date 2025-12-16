
import * as LocalAuthentication from 'expo-local-authentication';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'user_pin';

interface SecurityContextType {
  isUnlocked: boolean;
  hasPin: boolean;
  lock: () => void;
  unlock: () => void;
  setPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  authenticateWithBiometrics: () => Promise<boolean>;
}

export const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    const checkPin = async () => {
      try {
        const pin = await SecureStore.getItemAsync(PIN_KEY);
        setHasPin(!!pin);
        // App is locked by default
        setIsUnlocked(false);
      } catch (error) {
        console.error('Failed to check for PIN', error);
      }
    };
    checkPin();
  }, []);

  const lock = () => {
    setIsUnlocked(false);
  };

  const unlock = () => {
    setIsUnlocked(true);
  };

  const setPin = async (pin: string) => {
    try {
      await SecureStore.setItemAsync(PIN_KEY, pin);
      setHasPin(true);
      setIsUnlocked(true);
      return true;
    } catch (error) {
      console.error('Failed to set PIN', error);
      return false;
    }
  };

  const verifyPin = async (pin: string) => {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (storedPin && storedPin === pin) {
        setIsUnlocked(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to verify PIN', error);
      return false;
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to proceed',
      });
      if (result.success) {
        setIsUnlocked(true);
      }
      return result.success;
    } catch (error) {
      console.error('Biometric authentication failed', error);
      return false;
    }
  };

  const contextValue = {
    isUnlocked,
    hasPin,
    lock,
    unlock,
    setPin,
    verifyPin,
    authenticateWithBiometrics,
  };

  return (
    <SecurityContext.Provider value={contextValue}>{children}</SecurityContext.Provider>
  );
};
