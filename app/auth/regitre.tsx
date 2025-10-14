import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constant/Colors";
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "react-native";
import ThemedPressable from '../../components/ThemedPressable';
import GoogleImage from "@/assets/icons/google.svg";
import Separator from "@/components/Separator";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import ThemedText from "@/components/ThemedText";
import { Text } from "react-native";


const Regitre = () => {
    const colorScheme = useColorScheme();
    const route = useRouter()
    const [email , setEmail] = useState<string>("")
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light

    const handleGoogleLogin = () => {
        console.log('Continue with Google');
    };

    return (
        <ThemedSafeAreaView style={{ position: "relative", flex: 1, justifyContent: "space-between" }}>
            <ThemedView style={{ zIndex: 2, position: "absolute", flex: 1, gap: 20, marginHorizontal: "auto", width: "100%", height: "100%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                                <Image source={require("@/assets/images/logo_white.png")} style={{ width: 60, height: 60, objectFit: "contain", borderRadius:10 }} />
                <ThemedText style={{ color: "#fff", textAlign: "center", fontSize: 30, }}>Inscription</ThemedText>
                <ThemedView style={{ width: "88%", padding: 20, height: "auto", backgroundColor: theme.bgSecondary, borderRadius: 6, justifyContent: "center", alignItems: "center", }}>
                    <TextInput placeholder="Votre adresse email" value={email} onChange={(e) => setEmail(e.nativeEvent.text)} style={{ width: "100%", height: 50, borderRadius: 6, borderColor: theme.coloborder, borderWidth: 1, paddingHorizontal: 16, color: theme.text }} />
                    <Separator style={{ height: 30 }} />
                    <TextInput placeholder="Votre numero de téléphone" style={{ width: "100%", height: 50, borderRadius: 6, borderColor: theme.coloborder, borderWidth: 1, paddingHorizontal: 16, color: theme.text }} />
                    <Separator style={{ height: 30 }} />
                    <TextInput placeholder="Votre mot de passe" secureTextEntry style={{ width: "100%", height: 50, borderRadius: 6, borderColor: theme.coloborder, borderWidth: 1, paddingHorizontal: 16, color: theme.text }} />
                    <Separator style={{ height: 40 }} />
                    <ThemedPressable onPress={() => route.push(`/auth/verify?email=${email}`) } style={{ width: "100%", borderRadius: 6, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" }}>
                        <ThemedText style={{ color: "#fff", fontSize: 16 }}>S'inscrire</ThemedText>
                    </ThemedPressable>
                    <Separator style={{ height: 30 }} />
                    <View style={{ position: "relative", width: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                        <View style={{ position: "relative", width: "100%", height: 1, backgroundColor: theme.coloborder }}></View>
                        <ThemedText style={{ position: "absolute", backgroundColor: theme.bgSecondary, padding: 10, color: theme.text }}>Ou</ThemedText>
                    </View>
                    <Separator style={{ height: 30 }} />
                     <TouchableOpacity
                        style={[styles.socialButton, {borderColor: theme.coloborder,borderRadius:6, borderWidth: 1,}]}
                        onPress={handleGoogleLogin}
                        activeOpacity={0.8}
                    >
                        <GoogleImage width={30} height={30} />
                        <Text style={[styles.socialButtonText, {color: theme.text}]}>Continuer avec Google</Text>
                    </TouchableOpacity>
                    <Separator style={{ height: 20 }} />
                    <View>
                        <ThemedText style={{ color: theme.text, fontSize: 14 }}>Vous avez déjà un compte ? <Link style={{ color: Colors.primary, fontSize: 14 }} href="/auth/login">Se connecter</Link></ThemedText>
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

const styles = StyleSheet.create({
    socialButton: {
        width: '100%',
        height: 56,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    socialButtonText: {
        fontSize: 16,
    },
});