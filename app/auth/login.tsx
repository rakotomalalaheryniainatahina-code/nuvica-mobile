import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constant/Colors";
import { Image, TextInput, View } from "react-native";
import { useColorScheme } from "react-native";
import ThemedPressable from '../../components/ThemedPressable';
import GoogleImage from "@/assets/icons/google.svg";
import Separator from "@/components/Separator";
import { useState } from "react";
import { Checkbox } from 'expo-checkbox';
import { Link } from "expo-router";
import ThemedText from "@/components/ThemedText";


const Login = () => {
    const [isChecked, setChecked] = useState(false);
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    return (
        <ThemedSafeAreaView style={{ position: "relative", flex: 1, justifyContent: "space-between" }}>
            <ThemedView style={{ zIndex: 2, position: "absolute", flex: 1, gap: 20, marginHorizontal: "auto", width: "100%", height: "100%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                <Image source={require("@/assets/images/logo.png")} style={{ width: 50, height: 50 }} />
                <ThemedText style={{ color: "#fff", textAlign: "center", fontSize: 30, }}></ThemedText>
                <ThemedView style={{ width: "88%", padding: 20, height: "auto", backgroundColor: theme.bgSecondary, borderRadius: 15, justifyContent: "center", alignItems: "center", }}>
                    <ThemedPressable style={{ flexDirection: "row", borderColor: theme.coloborder, borderWidth: 2, borderRadius: 10, justifyContent: "center", gap: 20, alignItems: "center", }}>
                        <GoogleImage width={30} height={30} />
                        <ThemedText style={{ color: theme.text, fontSize: 20 }}>Continuer avec Google</ThemedText>
                    </ThemedPressable>
                    <Separator style={{ height: 40 }} />
                    <View style={{ position: "relative", width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                        <View style={{ position: "relative", width: "100%", height: 2, backgroundColor: theme.coloborder }}></View>
                        <ThemedText style={{ position: "absolute", backgroundColor: theme.bgSecondary, padding: 10, color: theme.text }}>Ou connectez-vous avec</ThemedText>
                    </View>
                    <Separator style={{ height: 40 }} />
                    <TextInput placeholder="Votre adresse email" style={{ width: "100%", height: 50, borderRadius: 10, borderColor: theme.coloborder, borderWidth: 2, paddingHorizontal: 16, color: theme.text }} />
                    <Separator style={{ height: 30 }} />
                    <TextInput placeholder="Votre mot de passe" secureTextEntry style={{ width: "100%", height: 50, borderRadius: 10, borderColor: theme.coloborder, borderWidth: 2, paddingHorizontal: 16, color: theme.text }} />
                    <Separator style={{ height: 30 }} />
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Checkbox
                                value={isChecked}
                                onValueChange={setChecked}
                                style={{ width: 15, height: 15, borderColor: theme.coloborder, borderWidth: 1.5, }}
                                color={isChecked ? Colors.primary : undefined}
                            />
                            <ThemedText style={{ color: theme.text, fontSize: 12 }}>Souviens toi de moi</ThemedText>
                        </View>
                        <Link style={{ color: Colors.primary, fontSize: 12 }} href="/">Mot de passe oublié ?</Link>
                    </View>
                    <Separator style={{ height: 40 }} />
                    <ThemedPressable style={{ width: "100%", borderRadius: 10, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" }}>
                        <ThemedText style={{ color: "#fff", fontSize: 20 }}>Se connecter</ThemedText>
                    </ThemedPressable>
                    <Separator style={{ height: 30 }} />
                    <View>
                        <ThemedText style={{ color: theme.text, fontSize: 14 }}>Vous n’avez pas de compte ? <Link style={{ color: Colors.primary, fontSize: 14 }} href="/auth/regitre">S'inscrire</Link></ThemedText>
                    </View>
                </ThemedView>

            </ThemedView>
            <ThemedView style={{ zIndex: 1, width: "100%", height: "50%", backgroundColor: Colors.primary }}>
                <Image source={require("@/assets/images/star.png")} style={{ width: "100%", height: "100%" }} />
            </ThemedView>
        </ThemedSafeAreaView>
    )
}

export default Login