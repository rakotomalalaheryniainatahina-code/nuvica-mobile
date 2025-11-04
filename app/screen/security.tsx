import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constant/Colors";
import styles from "@/styles/profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { View } from "react-native";

const SecuritePage = () => {
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    const isLight = theme === Colors.light;
    const [password, setPassword] = useState("Os4E52XuHXMa+xk");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let newPass = "";
        for (let i = 0; i < 15; i++) {
            newPass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPass);
    };
    return (
        <ThemedSafeAreaView style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" }]}>
            {/* Conseils avec design moderne */}
            <View style={styles.section}>
                <View style={[styles.sectionHeader, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                    <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="chevron-back" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                        Sécurité
                    </ThemedText>
                </View>
            </View>
            <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: theme.text }]}>Email</ThemedText>
                <TextInput
                    style={{
                        backgroundColor: theme.inputBackground || (colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5'),
                        borderColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'),
                        color: theme.text,
                        borderRadius: 6,
                        padding: 15,
                        fontSize: 16,
                        borderWidth: 1,
                    }}
                    editable={false}
                    value="tahina615@gmail.com"
                    placeholderTextColor={theme.text + "80"}
                />
            </View>

            <View style={styles.divider} />

            <ThemedText style={[styles.sectionSubtitle, { color: theme.text }]}>Changer le mot de passe</ThemedText>

            <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: theme.text }]}>Nouveau mot de passe</ThemedText>
                <View style={[styles.passwordContainer, {
                    backgroundColor: theme.inputBackground || (colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5'),
                    borderColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'),
                    borderWidth: 1,
                    paddingVertical: 6
                }]}>
                    <TextInput
                        style={{
                            color: theme.text,
                            borderRadius: 6,
                            fontSize: 16,
                            width: "93%",
                        }}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholder="••••••••"
                        placeholderTextColor={theme.text + "80"}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color={theme.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.generateButton, { backgroundColor: Colors.primary + "20" }]}
                onPress={generatePassword}
            >
                <Ionicons name="refresh" size={20} color={Colors.primary} />
                <ThemedText style={[styles.generateButtonText, { color: Colors.primary }]}>
                    Générer un mot de passe
                </ThemedText>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: Colors.primary }]}
                    onPress={() => {
                        Alert.alert("Succès", "Mot de passe mis à jour!");
                    }}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <ThemedText style={styles.saveButtonText}>Enregistrer</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.cancelButton, { backgroundColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'), }]}
                >
                    <ThemedText style={[styles.cancelButtonText, { color: theme.text }]}>Annuler</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedSafeAreaView>
    );
};

export default SecuritePage;