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
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfilePage() {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const isLight = theme === Colors.light;

    const [notifications, setNotifications] = useState(true);
    const [biometric, setBiometric] = useState(false);
    const [darkMode, setDarkMode] = useState(!isLight);

    const userStats = {
        totalTransactions: 245,
        activeBudgets: 5,
        savingsGoal: 75,
        memberSince: "Janvier 2024",
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
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header avec Profil */}
                <LinearGradient
                    colors={
                        isLight
                            ? [Colors.primary, "#7C3AED", "#6366F1"]
                            : ["#1a1a2e", "#16213e", "#0f3460"]
                    }
                    style={styles.header}
                >
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{
                                    uri: "https://ui-avatars.com/api/?name=John+Doe&size=200&background=6366F1&color=fff&bold=true",
                                }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>John Doe</Text>
                        <Text style={styles.userEmail}>john.doe@email.com</Text>
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
                </LinearGradient>

                {/* Menu Sections */}
                <View style={styles.content}>
                    {/* Compte */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Compte
                        </Text>
                        <MenuItem
                            icon="person-outline"
                            title="Informations personnelles"
                            subtitle="Modifier vos informations"
                            onPress={() => console.log("Profile info")}
                        />
                        <MenuItem
                            icon="lock-closed-outline"
                            title="Sécurité"
                            subtitle="Mot de passe et authentification"
                            onPress={() => console.log("Security")}
                        />
                        <MenuItem
                            icon="card-outline"
                            title="Méthodes de paiement"
                            subtitle="Gérer vos cartes"
                            onPress={() => console.log("Payment methods")}
                        />
                    </View>

                    {/* Préférences */}
                    <View style={styles.section}>
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
                        <MenuItem
                            icon="finger-print-outline"
                            title="Authentification biométrique"
                            subtitle={biometric ? "Activée" : "Désactivée"}
                            rightElement={
                                <Switch
                                    value={biometric}
                                    onValueChange={setBiometric}
                                    trackColor={{
                                        false: "#767577",
                                        true: Colors.primary,
                                    }}
                                    thumbColor="#FFF"
                                />
                            }
                        />
                        <MenuItem
                            icon="globe-outline"
                            title="Langue"
                            subtitle="Français"
                            onPress={() => console.log("Language")}
                        />
                        <MenuItem
                            icon="cash-outline"
                            title="Devise"
                            subtitle="Ariary (MGA)"
                            onPress={() => console.log("Currency")}
                        />
                    </View>

                    {/* Données */}
                    <View style={styles.section}>
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
                    <View style={styles.section}>
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
                    <View style={styles.section}>
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
                            title="Développé avec ❤️"
                            subtitle={`Membre depuis ${userStats.memberSince}`}
                        />
                    </View>

                    {/* Déconnexion */}
                    <View style={styles.section}>
                        <MenuItem
                            icon="log-out-outline"
                            title="Déconnexion"
                            onPress={handleLogout}
                            danger
                        />
                    </View>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 24,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#FFF",
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
        fontSize: 14,
        color: "#FFF",
        opacity: 0.9,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 16,
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
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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
});