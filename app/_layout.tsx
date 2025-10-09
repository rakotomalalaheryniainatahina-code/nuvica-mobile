import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [loaded] = useFonts({
    Manrope: require('../assets/fonts/Manrope-Medium.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <>
      <StatusBar barStyle="default" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
