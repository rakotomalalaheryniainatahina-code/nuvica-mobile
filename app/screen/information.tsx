import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, TextInput } from "react-native";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { View } from "react-native";
type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
};

interface ProfileInfoModalProps {
    initialData?: ProfileData;
}
const Information = ({ initialData }: ProfileInfoModalProps) => {
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    const isLight = theme === Colors.light;
    const router = useRouter();
    const [formData, setFormData] = useState<ProfileData>(
        initialData || {
            firstName: "Rakotomalala",
            lastName: "Tahina",
            email: "tahina615@gmail.com",
            phone: "+261 34 12 345 67",
            avatar: "https://ui-avatars.com/api/?name=Rakotomalala+Tahina&size=200&background=6366F1&color=fff&bold=true",
        }
    );

    const updateField = (field: keyof ProfileData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            updateField("avatar", result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission refusée", "Nous avons besoin de la permission d'accès à la caméra.");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            updateField("avatar", result.assets[0].uri);
        }
    };
    const showImageOptions = () => {
        Alert.alert(
            "Photo de profil",
            "Choisissez une option",
            [
                { text: "Prendre une photo", onPress: takePhoto },
                { text: "Choisir depuis la galerie", onPress: pickImage },
                { text: "Annuler", style: "cancel" },
            ],
            { cancelable: true }
        );
    };
    return (
        <ThemedSafeAreaView style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" }]}>
            {/* Conseils avec design moderne */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="chevron-back" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                        Informations personnelles
                    </ThemedText>
                </View>
            </View>
            <View style={styles.avatarSection}>
                <View style={styles.avatarContainers}>
                    <Image source={{ uri: formData.avatar }} style={styles.avatars} />
                    <TouchableOpacity style={styles.avatarEditButton} onPress={showImageOptions}>
                        <Ionicons name="camera" size={22} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <ThemedText style={[styles.avatarHint, { color: theme.text }]}>
                    Appuyez pour changer la photo
                </ThemedText>
            </View>
            <View style={styles.formGroup}>

                <ThemedText style={[styles.label, { color: theme.text }]}>Nom : Rakotomalala</ThemedText>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.inputBackground || (colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5'),
                        borderColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'),
                        color: theme.text
                    }]}
                    placeholder="Votre nom"
                    placeholderTextColor={theme.text + "80"}
                />
            </View>

            <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: theme.text }]}>Email : tahina615@gmail.com</ThemedText>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.inputBackground || (colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5'),
                        borderColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'),
                        color: theme.text
                    }]}
                    placeholder="votre@email.com"
                    placeholderTextColor={theme.text + "80"}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.formGroup}>
                <ThemedText style={[styles.label, { color: theme.text }]}>Téléphone : 034 07 513 90</ThemedText>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.inputBackground || (colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5'),
                        borderColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'),
                        color: theme.text
                    }]}
                    placeholder="+261 XX XX XXX XX"
                    placeholderTextColor={theme.text + "80"}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: Colors.primary }]}
                    onPress={() => {
                        Alert.alert("Succès", "Profil mis à jour!");
                    }}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <ThemedText style={styles.saveButtonText}>Enregistrer</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.cancelButton, { backgroundColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'), }]}
                >
                    <ThemedText style={[styles.cancelButtonText, { color: theme.text, }]}>Annuler</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedSafeAreaView>
    );
};

export default Information;


const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: -0.3,
    },
    avatarSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    avatarContainers: {
        position: "relative",
        marginBottom: 12,
    },
    avatars: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: Colors.green,
    },
    avatarEditButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "#FFF",
    },
    avatarHint: {
        fontSize: 13,
        opacity: 0.7,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 10,
    },
    input: {
        borderRadius: 6,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
    },
    buttonContainer: {
        marginVertical: 24,
        gap: 12,
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
        borderRadius: 6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFF",
    },
    cancelButton: {
        paddingVertical: 16,
        borderRadius: 6,
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});