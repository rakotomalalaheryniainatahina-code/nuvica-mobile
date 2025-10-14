import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constant/Colors";
import { Image } from "react-native";
import { useColorScheme } from "react-native";
import ThemedPressable from '../../components/ThemedPressable';
import OTPTextInput from "react-native-otp-textinput";
import Separator from "@/components/Separator";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import ThemedText from "@/components/ThemedText";


const Verify = () => {
    const searchParams = useLocalSearchParams();
    const email = searchParams?.email as string | undefined;
    const colorScheme = useColorScheme();
    const [code, setCode] = useState("");
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    return (
        <ThemedSafeAreaView style={{ position: "relative", flex: 1, justifyContent: "space-between" }}>
            <ThemedView style={{ zIndex: 2, position: "absolute", flex: 1, gap: 20, marginHorizontal: "auto", width: "100%", height: "100%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                <Image source={require("@/assets/images/logo_white.png")} style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 10 }} />
                <ThemedText style={{ color: "#fff", textAlign: "center", fontSize: 30, }}>Vérifier l'e-mail</ThemedText>
                <ThemedView style={{ width: "88%", padding: 20, height: "auto", backgroundColor: theme.bgSecondary, borderRadius: 6, justifyContent: "center", alignItems: "center", }}>
                    <ThemedText style={{ color: theme.text, textAlign: "center", fontSize: 13 }}>Nous avons envoyé le code à votre adresse e-mail</ThemedText>
                    <Separator style={{ height: 20 }} />
                    <ThemedText style={{ color: theme.text, textAlign: "center", fontSize: 20, }}>{email}</ThemedText>
                    <Separator style={{ height: 30 }} />
                    <OTPTextInput
                        inputCount={4}
                        handleTextChange={setCode}
                        tintColor={`${Colors.primary}`}
                        offTintColor="#ccc"
                        style={{ borderRadius: 6, borderColor: theme.coloborder, borderWidth: 1, paddingHorizontal: 16, color: theme.text, marginHorizontal: 10, width: 50, height: 50 }}
                    />
                    <Separator style={{ height: 40 }} />
                    <ThemedPressable style={{ width: "100%", borderRadius: 6, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" }}>
                        <ThemedText style={{ color: "#fff", fontSize: 16 }}>Vérifier</ThemedText>
                    </ThemedPressable>
                    <Separator style={{ height: 30 }} />
                    <ThemedPressable style={{ width: "100%", borderRadius: 6, backgroundColor: theme.background, justifyContent: "center", alignItems: "center" }}>
                        <ThemedText style={{ color: theme.text, fontSize: 16 }}>Envoyer à nouveau</ThemedText>
                    </ThemedPressable>
                </ThemedView>
            </ThemedView>
            <ThemedView style={{ zIndex: 1, width: "100%", height: "50%", backgroundColor: Colors.primary }}>
                <Image source={require("@/assets/images/star.png")} style={{ width: "100%", height: "100%" }} />
            </ThemedView>
        </ThemedSafeAreaView>
    )
}

export default Verify