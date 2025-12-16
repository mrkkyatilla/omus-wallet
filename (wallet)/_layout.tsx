
import { Tabs } from 'expo-router';
import {
  LucideBookUser,
  LucideHome,
  LucideSend,
  LucideSettings,
  LucideWallet,
} from 'lucide-react-native';

export default function WalletLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6', // Blue-500
        tabBarInactiveTintColor: '#64748b', // Slate-500
        tabBarStyle: {
          backgroundColor: '#1e293b', // Slate-800
          borderTopWidth: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <LucideHome color={color} />,
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          title: 'Send',
          tabBarIcon: ({ color }) => <LucideSend color={color} />,
        }}
      />
      <Tabs.Screen
        name="receive"
        options={{
          title: 'Receive',
          tabBarIcon: ({ color }) => <LucideWallet color={color} />,
        }}
      />
      <Tabs.Screen
        name="address-book"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <LucideBookUser color={color} />,
        }}
      />
      {/* New Settings Tab */}
      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <LucideSettings color={color} />,
        }}
      />
    </Tabs>
  );
}
