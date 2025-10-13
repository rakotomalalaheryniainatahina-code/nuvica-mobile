import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    Image,
    Switch,
    Alert,
    ImageBackground,
    TextInput,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { Ionicons } from "@expo/vector-icons";
import Images from "@/constant/Images";
import ThemedView from "@/components/ThemedView";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ProfileInfoModal from "@/components/Greeting";
import { Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ThemedText from "@/components/ThemedText";
import ThemedScrollView from "@/components/ThemedScrollView";


type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    occupation: string;
    dateOfBirth: string;
    avatar: string;
};

interface ProfileInfoModalProps {
    initialData?: ProfileData;
}

export default function ProfilePage({ initialData }: ProfileInfoModalProps) {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const isLight = theme === Colors.light;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(!isLight);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const vola = 5000;
    const userStats = {
        totalTransactions: 245,
        activeBudgets: 5,
        savingsGoal: 75,
        memberSince: "Septembre 2025",
    };

    const [profileData, setProfileData] = useState({
        firstName: "Jean",
        lastName: "Rakoto",
        email: "jean.rakoto@email.com",
        phone: "+261 34 12 345 67",
        address: "Lot II A 123 Antananarivo",
        city: "Antananarivo",
        country: "Madagascar",
        occupation: "Développeur Web",
        dateOfBirth: "15/03/1990",
        avatar: "file://path/to/image.jpg"
    });

    const handleSaveProfile = (data: ProfileData) => {
        setProfileData(data);
        // Sauvegarder dans votre backend ou AsyncStorage
        console.log("Profile saved:", data);
    };

    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnexion",
                    style: "destructive",
                    onPress: () => {
                        // Logique de déconnexion
                        console.log("Déconnexion...");
                    },
                },
            ]
        );
    };
    const [formData, setFormData] = useState<ProfileData>(
        initialData || {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            phone: "+261 34 12 345 67",
            address: "Lot II A 123 Antananarivo",
            city: "Antananarivo",
            country: "Madagascar",
            occupation: "Développeur",
            dateOfBirth: "15/03/1990",
            avatar: "https://ui-avatars.com/api/?name=John+Doe&size=200&background=6366F1&color=fff&bold=true",
        }
    );
    const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

    const updateField = (field: keyof ProfileData, value: string) => {
        setFormData({ ...formData, [field]: value });
        // Clear error when user types
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };
    const [password, setPassword] = useState("qr]Dkùm#");
    const [showPassword, setShowPassword] = useState(false);

    // Fonction pour générer un mot de passe aléatoire
    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let newPass = "";
        for (let i = 0; i < 15; i++) {
            newPass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPass);

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
            Alert.alert(
                "Permission refusée",
                "Nous avons besoin de la permission d'accès à la caméra."
            );
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
                {
                    text: "Prendre une photo",
                    onPress: takePhoto,
                },
                {
                    text: "Choisir depuis la galerie",
                    onPress: pickImage,
                },
                {
                    text: "Annuler",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const MenuItem = ({
        icon,
        title,
        subtitle,
        onPress,
        rightElement,
        color = theme.text,
        danger = false,
    }: any) => (
        <TouchableOpacity
            style={[
                styles.menuItem,
                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
            ]}
            onPress={onPress}
        >
            <View style={styles.menuLeft}>
                <View
                    style={[
                        styles.menuIcon,
                        {
                            backgroundColor: danger
                                ? "#FF6B6B20"
                                : Colors.primary + "20",
                        },
                    ]}
                >
                    <Ionicons
                        name={icon}
                        size={22}
                        color={danger ? "#FF6B6B" : Colors.primary}
                    />
                </View>
                <View>
                    <Text
                        style={[
                            styles.menuTitle,
                            { color: danger ? "#FF6B6B" : color },
                        ]}
                    >
                        {title}
                    </Text>
                    {subtitle && (
                        <Text
                            style={[
                                styles.menuSubtitle,
                                { color: theme.text },
                            ]}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            {rightElement || (
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.text}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <ThemedSafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header avec Profil */}

                <ThemedView
                    style={styles.header}
                >
                    <ImageBackground source={Images.starBG} style={{ width: "100%", height: "100%", justifyContent: "center", paddingVertical: 15, paddingHorizontal: 24, }}>

                        <View style={[styles.profileSection, { gap: 40 }]}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{
                                        uri: formData.avatar,
                                    }}
                                    style={styles.avatar}
                                />
                            </View>
                            <View>
                                <Text style={styles.userName}>Rakotomalala</Text>
                                <Text style={styles.userEmail}>tahina615@gmail.com</Text>
                                <Text style={{ fontSize: 35, color: "#fff" }}>{vola.toFixed(2)} Ar</Text>
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {userStats.totalTransactions}
                                </Text>
                                <Text style={styles.statLabel}>Transactions</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {userStats.activeBudgets}
                                </Text>
                                <Text style={styles.statLabel}>Budgets</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {userStats.savingsGoal}%
                                </Text>
                                <Text style={styles.statLabel}>Épargne</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </ThemedView>

                {/* Menu Sections */}
                <View style={styles.content}>
                    {/* Compte */}
                    <View >
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Compte
                        </Text>
                        <MenuItem
                            icon="person-outline"
                            title="Informations personnelles"
                            subtitle="Modifier vos informations"
                            onPress={() => setShowAddModal(true)}
                        />
                        {/* Informations personnelles */}
                        <Modal
                            visible={showAddModal}
                            animationType="slide"
                            transparent
                            onRequestClose={() => setShowAddModal(false)}
                        >

                            <View style={styles.modalOverlay}>
                                <View
                                    style={[
                                        styles.modalContent,
                                        { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                                    ]}
                                >
                                    <View style={[styles.modalHeader, { paddingHorizontal: 24, paddingBottom: 24 }]}>
                                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                                            Informations personnelles
                                        </Text>
                                        <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                            <Ionicons name="close" size={28} color={theme.text} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: "100%", backgroundColor: isLight ? "#fff" : "#1F1F1F", paddingHorizontal: 24 }}>
                                        <View style={styles.avatarSection}>
                                            <View style={styles.avatarContainers}>
                                                <Image source={{ uri: formData.avatar }} style={styles.avatars} />
                                                <TouchableOpacity
                                                    style={styles.avatarEditButton}
                                                    onPress={showImageOptions}
                                                >
                                                    <Ionicons name="camera" size={20} color="#FFF" />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={[styles.avatarHint, { color: theme.text }]}>
                                                Appuyez pour changer la photo
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: "column", gap: 20 }}>
                                            <View style={{ flexDirection: "column", gap: 19 }}>
                                                <Text style={{ fontSize: 14, fontWeight: "600", }}>Nom</Text>
                                                <TextInput
                                                    style={[
                                                        styles.input,
                                                        {
                                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                                            color: isLight ? "#2A2A2A" : "#F5F5F5",
                                                        },
                                                    ]}
                                                    placeholder="Nom"
                                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                                    multiline
                                                    numberOfLines={3}
                                                />
                                            </View>
                                            <View style={{ flexDirection: "column", gap: 19 }}>
                                                <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Email</Text>
                                                <TextInput
                                                    style={[
                                                        styles.input,
                                                        {
                                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                                            color: isLight ? "#2A2A2A" : "#F5F5F5",
                                                        },
                                                    ]}
                                                    placeholder="Email"
                                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                                    multiline
                                                    numberOfLines={3}
                                                />
                                            </View>
                                            <View style={{ flexDirection: "column", gap: 19 }}>
                                                <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Numero de telephone</Text>
                                                <TextInput
                                                    style={[
                                                        styles.input,
                                                        {
                                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                                            color: isLight ? "#2A2A2A" : "#F5F5F5",
                                                        },
                                                    ]}
                                                    placeholder="Numero de telephone"
                                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                                    multiline
                                                    numberOfLines={3}
                                                />
                                            </View>
                                            <View style={[styles.buttonContainer, { paddingBottom: 40, gap: 24 }]}>
                                                <TouchableOpacity
                                                    style={[styles.saveButton, { backgroundColor: Colors.primary }]}
                                                    onPress={() => console.log("hello")
                                                    }
                                                >
                                                    <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={[
                                                        styles.cancelButton,
                                                        {
                                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                                        },
                                                    ]}
                                                    onPress={() => setShowAddModal(false)}
                                                >
                                                    <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                                                        Annuler
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>

                        <MenuItem
                            icon="lock-closed-outline"
                            title="Sécurité"
                            subtitle="Mot de passe et authentification"
                            onPress={() => setShowSecurityModal(true)}
                        />
                        {/* Mot de passe et authentification */}

                        <Modal
                            visible={showSecurityModal}
                            animationType="slide"
                            transparent
                            onRequestClose={() => setShowSecurityModal(false)}
                        >

                            <View style={styles.modalOverlay}>
                                <View
                                    style={[
                                        styles.modalContent,
                                        { backgroundColor: isLight ? "#FFF" : "#1F1F1F", },
                                    ]}
                                >
                                    <View style={[styles.modalHeader, { paddingHorizontal: 24, paddingBottom: 24 }]}>
                                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                                            Authentification
                                        </Text>
                                        <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                            <Ionicons name="close" size={28} color={theme.text} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        style={{
                                            height: "100%",
                                            backgroundColor: isLight ? "#fff" : "#1F1F1F",
                                            paddingHorizontal: 24,
                                        }}
                                    >
                                        <View style={{ flexDirection: "column", gap: 20 }}>
                                            {/* Champ Email */}
                                            <View style={{ flexDirection: "column", gap: 19 }}>
                                                <Text style={{ fontSize: 14, fontWeight: "600" }}>Email</Text>
                                                <TextInput
                                                    style={[
                                                        styles.input,
                                                        {
                                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                                            color: theme.text,
                                                        },
                                                    ]}
                                                    placeholder="Email"
                                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                                />
                                            </View>

                                            {/* Champ Ancien mot de passe */}
                                            <View style={{ flexDirection: "column", gap: 19 }}>
                                                <Text style={{ fontSize: 14, fontWeight: "600" }}>Mot de passe</Text>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <TextInput
                                                        style={[
                                                            styles.input,
                                                            {
                                                                flex: 1,
                                                                backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                                                color: isLight ? "#2A2A2A" : "#F5F5F5",
                                                            },
                                                        ]}
                                                        placeholder="Mot de passe"
                                                        placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                                    />
                                                </View>
                                            </View>

                                            {/* Changer le mot de passe */}
                                            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 12 }}>
                                                Changer le mot de passe
                                            </Text>
                                            <View style={{ flexDirection: "column", gap: 19 }}>
                                                <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
                                                    Nouveau mot de passe
                                                </Text>
                                                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",paddingHorizontal:16, borderRadius:6 }}>
                                                    <TextInput
                                                        style={[
                                                            styles.input,
                                                            {
                                                                flex: 1,
                                                                color: isLight ? "#2A2A2A" : "#F5F5F5",
                                                                paddingHorizontal:0
                                                            },
                                                        ]}
                                                        placeholder="Mot de passe"
                                                        value={password}
                                                        onChangeText={setPassword}
                                                        secureTextEntry={!showPassword}
                                                    />
                                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                        <Ionicons
                                                            name={showPassword ? "eye-off" : "eye"}
                                                            size={22}
                                                            color={theme.text}
                                                            style={{ marginLeft: 8 }}
                                                        />
                                                    </TouchableOpacity>
                                                </View>

                                                <TouchableOpacity
                                                    style={[styles.saveButton, { backgroundColor: Colors.primary }]}
                                                    onPress={generatePassword}
                                                >
                                                    <Text style={styles.saveButtonText}>Générer un nouveau mot de passe</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Boutons */}
                                            <View style={[styles.buttonContainer, { paddingBottom: 40, gap: 24 }]}>
                                                <TouchableOpacity
                                                    style={[styles.saveButton, { backgroundColor: Colors.primary }]}
                                                    onPress={() => console.log("Enregistrement...")}
                                                >
                                                    <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={[
                                                        styles.cancelButton,
                                                        {
                                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                                        },
                                                    ]}
                                                    onPress={() => setShowAddModal(false)}
                                                >
                                                    <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                                                        Annuler
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    {/* Préférences */}
                    <View >
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Préférences
                        </Text>
                        <MenuItem
                            icon="notifications-outline"
                            title="Notifications"
                            subtitle={
                                notifications ? "Activées" : "Désactivées"
                            }
                            rightElement={
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{
                                        false: "#767577",
                                        true: Colors.primary,
                                    }}
                                    thumbColor="#FFF"
                                />
                            }
                        />
                        <MenuItem
                            icon="moon-outline"
                            title="Mode sombre"
                            subtitle={darkMode ? "Activé" : "Désactivé"}
                            rightElement={
                                <Switch
                                    value={darkMode}
                                    onValueChange={setDarkMode}
                                    trackColor={{
                                        false: "#767577",
                                        true: Colors.primary,
                                    }}
                                    thumbColor="#FFF"
                                />
                            }
                        />
                    </View>

                    {/* Données */}
                    <View >
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Données
                        </Text>
                        <MenuItem
                            icon="download-outline"
                            title="Exporter les données"
                            subtitle="Télécharger vos transactions"
                            onPress={() => console.log("Export data")}
                        />
                        <MenuItem
                            icon="cloud-upload-outline"
                            title="Sauvegarde"
                            subtitle="Dernière sauvegarde: Aujourd'hui"
                            onPress={() => console.log("Backup")}
                        />
                        <MenuItem
                            icon="analytics-outline"
                            title="Rapports"
                            subtitle="Voir les statistiques détaillées"
                            onPress={() => console.log("Reports")}
                        />
                    </View>

                    {/* Support */}
                    <View >
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Support
                        </Text>
                        <MenuItem
                            icon="help-circle-outline"
                            title="Aide & FAQ"
                            onPress={() => console.log("Help")}
                        />
                        <MenuItem
                            icon="chatbubble-outline"
                            title="Nous contacter"
                            onPress={() => console.log("Contact")}
                        />
                        <MenuItem
                            icon="star-outline"
                            title="Évaluer l'application"
                            onPress={() => console.log("Rate app")}
                        />
                        <MenuItem
                            icon="document-text-outline"
                            title="Conditions d'utilisation"
                            onPress={() => console.log("Terms")}
                        />
                        <MenuItem
                            icon="shield-checkmark-outline"
                            title="Politique de confidentialité"
                            onPress={() => console.log("Privacy")}
                        />
                    </View>

                    {/* À propos */}
                    <View>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            À propos
                        </Text>
                        <MenuItem
                            icon="information-circle-outline"
                            title="Version"
                            subtitle="1.0.0 (Build 100)"
                        />
                        <MenuItem
                            icon="heart-outline"
                            title="Développé avec couer"
                            subtitle={`Par Rakotomalala, le ${userStats.memberSince}`}
                        />
                    </View>

                    {/* Déconnexion */}
                    <View>
                        <MenuItem
                            icon="log-out-outline"
                            title="Déconnexion"
                            onPress={handleLogout}
                            danger
                        />
                    </View>

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 340,
        backgroundColor: Colors.primary,
    },
    profileSection: {
        alignItems: "flex-start",
        marginBottom: 24,
        flexDirection: "row",
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 6,
        borderWidth: 4,
        borderColor: Colors.green,
    },
    editAvatarButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFF",
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: "#FFF",
        opacity: 0.9,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 6,
        padding: 20,
        backdropFilter: "blur(10px)",
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#FFF",
        opacity: 0.9,
    },
    statDivider: {
        width: 1,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        marginHorizontal: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
        marginTop: 24,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 6,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },
    menuLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 16,
    },
    menuIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 24,
        maxHeight: "90%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    avatarSection: {
        alignItems: "center",
        paddingVertical: 32,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.green,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFF",
    },
    avatarHint: {
        fontSize: 13,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 6,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 16,
        gap: 12,
    },
    saveButton: {
        paddingVertical: 16,
        borderRadius: 6,
        alignItems: "center",
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