import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthListener } from "../hooks/useAuthListener";
import { useUserStore } from "../store/useUserStore";

export default function Index() {
  const { ready } = useAuthListener();
  const user = useUserStore(s => s.user);

  if (!ready) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Redirect href={user ? "/(drawer)/(tabs)" : "/auth"} />;
}
