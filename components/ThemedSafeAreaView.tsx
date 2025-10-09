import { Colors } from "@/constant/Colors";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";
import React from "react";
import { Theme } from "@/types/ColorType";

const ThemedSafeAreaView: React.FC<SafeAreaViewProps> = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[{ flex: 1, backgroundColor: theme.background }, style]}
        {...props}
      />
    </SafeAreaProvider>
  );
};


export default ThemedSafeAreaView