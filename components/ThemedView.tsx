import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { useColorScheme, View, ViewProps } from "react-native";

const ThemedView: React.FC<ViewProps> = ({style ,...props}) => {
    const colorScheme = useColorScheme();
      const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    
        return (
            <View style={[{backgroundColor: theme.background }, style]} {...props} />
        )
}

export default ThemedView