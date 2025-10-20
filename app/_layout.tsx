import { Stack } from 'expo-router';
import { useAuthListener } from '../hooks/useAuthListener';
import { useUserStore } from '../store/useUserStore';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  useAuthListener();
  const loading = useUserStore((s) => s.loading);

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
