import { Colors } from "@/constant/Colors";
import { useColorScheme, View, ViewProps } from "react-native";
import React from "react";
import { Theme } from "@/types/ColorType";

const Separator: React.FC<ViewProps> = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;

  return (
    <View
      style={[{ width: "100%", height:20}, style]}
      {...props}
    />
  );
};

export default Separator;