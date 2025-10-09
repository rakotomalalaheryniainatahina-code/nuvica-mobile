import { Colors } from "@/constant/Colors";
import { ScrollView, ScrollViewProps, useColorScheme } from "react-native";
import React from "react";
import { Theme } from "@/types/ColorType";

const ThemedScrollView: React.FC<ScrollViewProps> = ({ style, ...props }) => {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={[{ flex: 1, backgroundColor: theme.background }, style]}
            {...props}
        />
    );
};


export default ThemedScrollView