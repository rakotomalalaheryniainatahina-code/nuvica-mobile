import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { Text, TextProps, useColorScheme,  } from "react-native";

const ThemedText: React.FC<TextProps> = ({style ,...props}) => {
    const colorScheme = useColorScheme();
      const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    
        return (
            <Text style={[{fontFamily: "Manrope", color: theme.text}, style]} {...props} />
        )
}

export default ThemedText