import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constant/Colors";
import { Image, TextInput, View } from "react-native";
import { Text, useColorScheme } from "react-native";
import ThemedPressable from '../../components/ThemedPressable';
import GoogleImage from "@/assets/icons/google.svg";
import Separator from "@/components/Separator";
import { Link, useRouter } from "expo-router";
import { useState } from "react";


const Regitre = () => {
    const colorScheme = useColorScheme();
    const route = useRouter()
    const [email , setEmail] = useState<string>("")
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    return (
        <ThemedSafeAreaView style={{ position: "relative", flex: 1, justifyContent: "space-between" }}>
            <ThemedView style={{ zIndex: 2, position: "absolute", flex: 1, gap: 20, marginHorizontal: "auto", width: "100%", height: "100%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                <Image source={require("@/assets/images/logo.png")} style={{ width: 50, height: 50 }} />
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 30, }}>Inscription</Text>
                <ThemedView style={{ width: "88%", padding: 20, height: "auto", backgroundColor: theme.bgSecondary, borderRadius: 15, justifyContent: "center", alignItems: "center", }}>
                    <TextInput placeholder="Votre adresse email" value={email} onChange={(e) => setEmail(e.nativeEvent.text)} style={{ width: "100%", height: 50, borderRadius: 10, borderColor: theme.coloborder, borderWidth: 2, paddingHorizontal: 16, color: theme.text }} />
                    <Separator style={{ height: 30 }} />
                    <TextInput placeholder="Votre numero de téléphone" style={{ width: "100%", height: 50, borderRadius: 10, borderColor: theme.coloborder, borderWidth: 2, paddingHorizontal: 16, color: theme.text }} />
                    <Separator style={{ height: 30 }} />
                    <TextInput placeholder="Votre mot de passe" secureTextEntry style={{ width: "100%", height: 50, borderRadius: 10, borderColor: theme.coloborder, borderWidth: 2, paddingHorizontal: 16, color: theme.text }} />
                    <Separator style={{ height: 40 }} />
                    <ThemedPressable onPress={() => route.push(`/auth/verify?email=${email}`) } style={{ width: "100%", borderRadius: 10, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#fff", fontSize: 20 }}>S'inscrire</Text>
                    </ThemedPressable>
                    <Separator style={{ height: 30 }} />
                    <View style={{ position: "relative", width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                        <View style={{ position: "relative", width: "100%", height: 2, backgroundColor: theme.coloborder }}></View>
                        <Text style={{ position: "absolute", backgroundColor: theme.bgSecondary, padding: 10, color: theme.text }}>Ou</Text>
                    </View>
                    <Separator style={{ height: 30 }} />
                    <ThemedPressable style={{ flexDirection: "row", borderColor: theme.coloborder, borderWidth: 2, borderRadius: 10, justifyContent: "center", gap: 20, alignItems: "center", }}>
                        <GoogleImage width={30} height={30} />
                        <Text style={{ color: theme.text, fontSize: 20 }}>Continuer avec Google</Text>
                    </ThemedPressable>
                    <Separator style={{ height: 20 }} />
                    <View>
                        <Text style={{ color: theme.text, fontSize: 14 }}>Vous avez déjà un compte ? <Link style={{ color: Colors.primary, fontSize: 14 }} href="/">Se connecter</Link></Text>
                    </View>
                </ThemedView>
            </ThemedView>
            <ThemedView style={{ zIndex: 1, width: "100%", height: "50%", backgroundColor: Colors.primary }}>
                <Image source={require("@/assets/images/star.png")} style={{ width: "100%", height: "100%" }} />
            </ThemedView>
        </ThemedSafeAreaView>
    )
}

export default Regitre