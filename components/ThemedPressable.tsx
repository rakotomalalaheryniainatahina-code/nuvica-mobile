import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import React from "react";
import { Pressable, PressableProps, StyleProp, useColorScheme, ViewStyle } from "react-native";

type ThemedPressableProps = PressableProps & {
    style?: StyleProp<ViewStyle>;
};

const ThemedPressable: React.FC<ThemedPressableProps> = ({ style, ...props }) => {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;

    return (
        <Pressable
            style={[{ borderRadius: 10 , width: "100%" , padding:15 , marginHorizontal: 'auto', justifyContent: "center", alignItems: "center"}, style]}
            {...props}
        />
    );
};

export default ThemedPressable;
