import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Linking,
    ScrollView,
    useColorScheme,
    TouchableOpacity,
    Image,
    Switch,
    Alert,
    TextInput,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ThemedText from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/profile";
import { Animated } from "react-native";
import { useRouter } from "expo-router";

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

export default function ProfilePage({ initialData }: ProfileInfoModalProps) {
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    const isLight = theme === Colors.light;

    // States pour les modals
    const [showExportModal, setShowExportModal] = useState(false);
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [showReportsModal, setShowReportsModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showRateModal, setShowRateModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(!isLight);
    const router = useRouter();
    const vola = 5000;
    const userStats = {
        totalTransactions: 245,
        activeBudgets: 5,
        savingsGoal: 75,
        memberSince: "Septembre 2025",
    };

    const [formData, setFormData] = useState<ProfileData>(
        initialData || {
            firstName: "Rakotomalala",
            lastName: "Tahina",
            email: "tahina615@gmail.com",
            phone: "+261 34 12 345 67",
            avatar: "https://ui-avatars.com/api/?name=Rakotomalala+Tahina&size=200&background=6366F1&color=fff&bold=true",
        }
    );


    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnexion",
                    style: "destructive",
                    onPress: () => console.log("Déconnexion..."),
                },
            ]
        );
    };

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation d'entrée
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Animation de rotation continue pour l'icône
        const rotationAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 20000,
                useNativeDriver: true,
            })
        );
        rotationAnimation.start();

        return () => {
            rotationAnimation.stop();
        };
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });


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
                {
                    backgroundColor: isLight ? "#FFF" : "#1F1F1F",
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuLeft}>
                <View
                    style={[
                        styles.menuIcon,
                        {
                            backgroundColor: danger ? "#FF6B6B15" : Colors.primary + "15",
                        },
                    ]}
                >
                    <Ionicons
                        name={icon}
                        size={24}
                        color={danger ? "#FF6B6B" : Colors.primary}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedText style={[styles.menuTitle, { color: danger ? "#FF6B6B" : color }]}>
                        {title}
                    </ThemedText>
                    {subtitle && (
                        <ThemedText style={[styles.menuSubtitle, { color: theme.text, opacity: 0.6 }]}>
                            {subtitle}
                        </ThemedText>
                    )}
                </View>
            </View>
            {rightElement || (
                <Ionicons name="chevron-forward" size={22} color={theme.text} style={{ opacity: 0.4 }} />
            )}
            <View style={[styles.cardIndicator, { backgroundColor: danger ? "#FF6B6B" : Colors.primary }]} />

        </TouchableOpacity>
    );

    // Modal générique réutilisable
    const GenericModal = ({ visible, onClose, title, children }: any) => (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                    <View style={styles.modalHeader}>
                        <ThemedText style={[styles.modalTitle, { color: theme.text }]}>{title}</ThemedText>
                        <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                        {children}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    const openWhatsApp = () => {
        const phoneNumber = "261340751390";
        const message = "Bonjour, je vous contacte depuis l'application Financeo.";

        // lien officiel WhatsApp
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        Linking.openURL(url).catch(() => {
            alert("Impossible d'ouvrir WhatsApp");
        });
    };

    const makeCall = () => {
        const phoneNumber = "0340751390";
        const url = `tel:${phoneNumber}`;

        Linking.openURL(url).catch(() => {
            Alert.alert("Erreur", "Impossible d'ouvrir l'application Téléphone.");
        });
    };

    const sendEmail = () => {
        const email = "rakotomalalaheryniainatahina@gmail.com";
        const subject = "Demande d'information sur Financeo";
        const body = "Bonjour,\n\nJe voudrais avoir plus d'informations concernant ...";

        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(url).catch(() => {
            Alert.alert("Erreur", "Impossible d'ouvrir l'application Email.");
        });
    };


    return (
        <ThemedSafeAreaView style={[styles.container, {  backgroundColor: isLight ? "#F5F5F7" : theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Moderne avec Gradient */}
                <View
                    style={{ position: 'relative', top: 0, left: 0, width: '100%', height: 295, overflow: 'hidden', }}
                >
                    <LinearGradient
                        colors={colorScheme === 'dark'
                            ? ['#1a1a1a', '#2d2d2d', '#1a1a1a']
                            : [Colors.primary, '#4ADE80', '#6366f1']}
                        start={{ x: -0.5, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ zIndex: 0, width: "100%", height: "100%", position: 'absolute' }}>
                        <Animated.View style={[styles.floatingCircle1, { transform: [{ rotate: spin }] }]} />
                        <Animated.View style={[styles.floatingCircle2, { transform: [{ rotate: spin }] }]} />
                    </LinearGradient>
                    <View style={[styles.profileSection, { justifyContent: "space-between", paddingVertical: 24, paddingHorizontal: 20, }]}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: formData.avatar }} style={styles.avatar} />
                            <View style={styles.onlineBadge} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <ThemedText style={styles.userName}>{formData.firstName}</ThemedText>
                            <ThemedText style={styles.userEmail}>{formData.email}</ThemedText>
                            <View style={styles.balanceContainer}>
                                <Ionicons name="wallet" size={20} color="#FFD700" />
                                <ThemedText style={styles.balanceText}>{vola.toLocaleString()} Ar</ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Stats Cards */}
                    <View style={[styles.statsContainer, { justifyContent: "space-between", paddingVertical: 24, paddingHorizontal: 20, }]}>
                        <View style={styles.statCard}>
                            <Ionicons name="swap-horizontal" size={24} color={"#1D61E7"} />
                            <ThemedText style={styles.statValue}>{userStats.totalTransactions}</ThemedText>
                            <ThemedText style={styles.statLabel}>Transactions</ThemedText>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="wallet-outline" size={24} color={Colors.orange} />
                            <ThemedText style={styles.statValue}>{userStats.activeBudgets}</ThemedText>
                            <ThemedText style={styles.statLabel}>Budgets</ThemedText>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="trending-up" size={24} color="#FFD700" />
                            <ThemedText style={styles.statValue}>{userStats.savingsGoal}%</ThemedText>
                            <ThemedText style={styles.statLabel}>Épargne</ThemedText>
                        </View>
                    </View>
                </View>

                {/* Menu Content */}
                <View style={styles.content}>
                    {/* Compte */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="person-circle" size={24} color={Colors.primary} />
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Compte</ThemedText>
                        </View>
                        <MenuItem
                            icon="person-outline"
                            title="Informations personnelles"
                            subtitle="Gérer votre profil"
                            onPress={() => router.push("/screen/information")}

                        />
                        <MenuItem
                            icon="lock-closed-outline"
                            title="Sécurité"
                            subtitle="Mot de passe et authentification"
                            onPress={() => router.push("/screen/security")}
                        />
                    </View>

                    {/* Préférences */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="settings" size={24} color={Colors.primary} />
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Préférences</ThemedText>
                        </View>
                        <MenuItem
                            icon="notifications-outline"
                            title="Notifications"
                            subtitle={notifications ? "Activées" : "Désactivées"}
                            rightElement={
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                    ios_backgroundColor="#767577"
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
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                    ios_backgroundColor="#767577"
                                />
                            }
                        />
                    </View>

                    {/* Données */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="cloud" size={24} color={Colors.primary} />
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Données</ThemedText>
                        </View>
                        <MenuItem
                            icon="download-outline"
                            title="Exporter les données"
                            subtitle="Télécharger vos transactions"
                            onPress={() => setShowExportModal(true)}
                        />
                        <MenuItem
                            icon="cloud-upload-outline"
                            title="Sauvegarde"
                            subtitle="Dernière: Aujourd'hui"
                            onPress={() => setShowBackupModal(true)}
                        />
                        <MenuItem
                            icon="analytics-outline"
                            title="Rapports"
                            subtitle="Statistiques détaillées"
                            onPress={() => setShowReportsModal(true)}
                        />
                    </View>

                    {/* Support */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="help-circle" size={24} color={Colors.primary} />
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Support</ThemedText>
                        </View>
                        <MenuItem
                            icon="help-circle-outline"
                            title="Aide & FAQ"
                            onPress={() => setShowHelpModal(true)}
                        />
                        <MenuItem
                            icon="chatbubble-outline"
                            title="Nous contacter"
                            onPress={() => setShowContactModal(true)}
                        />
                        <MenuItem
                            icon="star-outline"
                            title="Évaluer l'application"
                            onPress={() => setShowRateModal(true)}
                        />
                        <MenuItem
                            icon="document-text-outline"
                            title="Conditions d'utilisation"
                            onPress={() => setShowTermsModal(true)}
                        />
                        <MenuItem
                            icon="shield-checkmark-outline"
                            title="Politique de confidentialité"
                            onPress={() => setShowPrivacyModal(true)}
                        />
                    </View>

                    {/* À propos */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="information-circle" size={24} color={Colors.primary} />
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>À propos</ThemedText>
                        </View>
                        <MenuItem
                            icon="code-slash-outline"
                            title="Version"
                            subtitle="1.0.0 (Build 100)"
                        />
                        <MenuItem
                            icon="heart"
                            title="Développé avec cœur"
                            subtitle={`Par Rakotomalala • ${userStats.memberSince}`}
                        />
                    </View>

                    {/* Déconnexion */}
                    <MenuItem
                        icon="log-out-outline"
                        title="Déconnexion"
                        onPress={handleLogout}
                        danger
                    />

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Modal Export */}
            <GenericModal
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Exporter les données"
            >
                <ThemedText style={[styles.modalDescription, { color: theme.text }]}>
                    Choisissez le format d'export de vos données
                </ThemedText>

                <TouchableOpacity style={styles.exportOption}>
                    <Ionicons name="document-text" size={32} color={Colors.primary} />
                    <View style={{ flex: 1 }}>
                        <ThemedText style={[styles.exportTitle, { color: theme.text }]}>CSV</ThemedText>
                        <ThemedText style={[styles.exportDesc, { color: theme.text }]}>Compatible Excel</ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.exportOption}>
                    <Ionicons name="code-download" size={32} color={Colors.primary} />
                    <View style={{ flex: 1 }}>
                        <ThemedText style={[styles.exportTitle, { color: theme.text }]}>JSON</ThemedText>
                        <ThemedText style={[styles.exportDesc, { color: theme.text }]}>Format développeur</ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.exportOption}>
                    <Ionicons name="document" size={32} color={Colors.primary} />
                    <View style={{ flex: 1 }}>
                        <ThemedText style={[styles.exportTitle, { color: theme.text }]}>PDF</ThemedText>
                        <ThemedText style={[styles.exportDesc, { color: theme.text }]}>Rapport complet</ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.text} />
                </TouchableOpacity>
            </GenericModal>

            {/* Modal Sauvegarde */}
            <GenericModal
                visible={showBackupModal}
                onClose={() => setShowBackupModal(false)}
                title="Sauvegarde"
            >
                <View style={styles.backupInfo}>
                    <Ionicons name="cloud-done" size={48} color={Colors.green} />
                    <ThemedText style={[styles.backupStatus, { color: theme.text }]}>
                        Dernière sauvegarde
                    </ThemedText>
                    <ThemedText style={[styles.backupDate, { color: Colors.green }]}>
                        Aujourd'hui à 14:30
                    </ThemedText>
                </View>

                <View style={styles.backupOptions}>
                    <TouchableOpacity
                        style={[styles.backupButton, { backgroundColor: Colors.primary }]}
                        onPress={() => Alert.alert("Sauvegarde", "Sauvegarde en cours...")}
                    >
                        <Ionicons name="cloud-upload" size={20} color="#FFF" />
                        <ThemedText style={styles.backupButtonText}>Sauvegarder maintenant</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.backupButton, { backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A" }]}
                        onPress={() => Alert.alert("Restauration", "Restaurer depuis la sauvegarde?")}
                    >
                        <Ionicons name="cloud-download" size={20} color={theme.text} />
                        <ThemedText style={[styles.backupButtonText, { color: theme.text }]}>
                            Restaurer
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </GenericModal>

            {/* Modal Rapports */}
            <GenericModal
                visible={showReportsModal}
                onClose={() => setShowReportsModal(false)}
                title="Rapports"
            >
                <ThemedText style={[styles.modalDescription, { color: theme.text }]}>
                    Générez des rapports détaillés de vos finances
                </ThemedText>

                <TouchableOpacity style={styles.reportOption}>
                    <View style={[styles.reportIcon, { backgroundColor: Colors.primary + "20" }]}>
                        <Ionicons name="calendar" size={28} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={[styles.reportTitle, { color: theme.text }]}>Rapport mensuel</ThemedText>
                        <ThemedText style={[styles.reportDesc, { color: theme.text }]}>Résumé du mois en cours</ThemedText>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.reportOption}>
                    <View style={[styles.reportIcon, { backgroundColor: Colors.green + "20" }]}>
                        <Ionicons name="bar-chart" size={28} color={Colors.green} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={[styles.reportTitle, { color: theme.text }]}>Analyse annuelle</ThemedText>
                        <ThemedText style={[styles.reportDesc, { color: theme.text }]}>Vue d'ensemble de l'année</ThemedText>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.reportOption}>
                    <View style={[styles.reportIcon, { backgroundColor: "#FFD700" + "20" }]}>
                        <Ionicons name="pie-chart" size={28} color="#FFD700" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={[styles.reportTitle, { color: theme.text }]}>Catégories</ThemedText>
                        <ThemedText style={[styles.reportDesc, { color: theme.text }]}>Répartition par catégorie</ThemedText>
                    </View>
                </TouchableOpacity>
            </GenericModal>

            {/* Modal Aide */}
            <GenericModal
                visible={showHelpModal}
                onClose={() => setShowHelpModal(false)}
                title="Aide & FAQ"
            >
                <View style={styles.faqItem}>
                    <ThemedText style={[styles.faqQuestion, { color: theme.text }]}>
                        Comment ajouter une transaction?
                    </ThemedText>
                    <ThemedText style={[styles.faqAnswer, { color: theme.text }]}>
                        Appuyez sur le bouton "+" en bas de l'écran principal et remplissez les informations requises.
                    </ThemedText>
                </View>

                <View style={styles.faqItem}>
                    <ThemedText style={[styles.faqQuestion, { color: theme.text }]}>
                        Comment créer un objectif?
                    </ThemedText>
                    <ThemedText style={[styles.faqAnswer, { color: theme.text }]}>
                        Allez dans l'onglet "Épargne" et appuyez sur le bouton "+". Définissez l'objectif avec un nom, un montant et une catégorie.
                    </ThemedText>
                </View>

                <View style={styles.faqItem}>
                    <ThemedText style={[styles.faqQuestion, { color: theme.text }]}>
                        Mes données sont-elles sécurisées?
                    </ThemedText>
                    <ThemedText style={[styles.faqAnswer, { color: theme.text }]}>
                        Oui, toutes vos données sont chiffrées et stockées en toute sécurité. Nous ne partageons jamais vos informations.
                    </ThemedText>
                </View>
            </GenericModal>

            {/* Modal Contact */}
            <GenericModal
                visible={showContactModal}
                onClose={() => setShowContactModal(false)}
                title="Nous contacter"
            >
                <View style={styles.contactSection}>
                    <View
                        style={[styles.modernIconContainer, { backgroundColor: Colors.primary }]}
                    >
                        <Ionicons
                            name={"mail"}
                            size={48}
                            color="#FFF"
                        />
                    </View>
                    <ThemedText style={[styles.contactTitle, { color: theme.text }]}>
                        Envoyez-nous un message
                    </ThemedText>
                    <ThemedText style={[styles.contactDesc, { color: theme.text }]}>
                        Notre équipe vous répondra sous 24h
                    </ThemedText>
                </View>

                <View style={styles.formGroup}>
                    <ThemedText style={[styles.label, { color: theme.text }]}>Sujet</ThemedText>
                    <TextInput
                        style={[styles.input, { backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A", color: isLight ? "#1F1F1F" : "#FFF" }]}
                        placeholder="De quoi souhaitez-vous parler?"
                        placeholderTextColor={isLight ? "#1F1F1F" : "#FFF"}
                    />
                </View>

                <View style={styles.formGroup}>
                    <ThemedText style={[styles.label, { color: theme.text }]}>Message</ThemedText>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A", color: isLight ? "#1F1F1F" : "#FFF" }]}
                        placeholder="Décrivez votre demande..."
                        placeholderTextColor={isLight ? "#1F1F1F" : "#FFF"}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.contactMethods}>
                    <TouchableOpacity style={styles.contactMethod} onPress={openWhatsApp}>
                        <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                        <ThemedText style={[styles.contactMethodText, { color: theme.text }]}>WhatsApp</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactMethod} onPress={makeCall}>
                        <Ionicons name="call" size={24} color={Colors.primary} />
                        <ThemedText style={[styles.contactMethodText, { color: theme.text }]}>Téléphone</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactMethod} onPress={sendEmail}>
                        <Ionicons name="mail" size={24} color="#EA4335" />
                        <ThemedText style={[styles.contactMethodText, { color: theme.text }]}>Email</ThemedText>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: Colors.primary }]}
                    onPress={() => {
                        Alert.alert("Succès", "Votre message a été envoyé!");
                        setShowContactModal(false);
                    }}
                >
                    <Ionicons name="send" size={20} color="#FFF" />
                    <ThemedText style={styles.saveButtonText}>Envoyer</ThemedText>
                </TouchableOpacity>
            </GenericModal>

            {/* Modal Évaluation */}
            <GenericModal
                visible={showRateModal}
                onClose={() => setShowRateModal(false)}
                title="Évaluer l'application"
            >
                <View style={styles.ratingSection}>
                    <Ionicons name="star" size={64} color="#FFD700" />
                    <ThemedText style={[styles.ratingTitle, { color: theme.text }]}>
                        Vous aimez notre application?
                    </ThemedText>
                    <ThemedText style={[styles.ratingDesc, { color: theme.text }]}>
                        Votre avis nous aide à nous améliorer
                    </ThemedText>
                </View>

                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star}>
                            <Ionicons name="star" size={48} color="#FFD700" />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.formGroup}>
                    <ThemedText style={[styles.label, { color: theme.text }]}>Commentaire (optionnel)</ThemedText>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A", color: isLight ? "#1F1F1F" : "#FFF" }]}
                        placeholder="Partagez votre expérience..."
                        placeholderTextColor={isLight ? "#1F1F1F" : "#FFF"}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: Colors.primary }]}
                    onPress={() => {
                        Alert.alert("Merci!", "Votre évaluation a été enregistrée");
                        setShowRateModal(false);
                    }}
                >
                    <Ionicons name="heart" size={20} color="#FFF" />
                    <ThemedText style={styles.saveButtonText}>Envoyer l'évaluation</ThemedText>
                </TouchableOpacity>
            </GenericModal>

            {/* Modal Conditions */}
            <GenericModal
                visible={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                title="Conditions d'utilisation"
            >
                <View style={styles.termsContent}>
                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>1. Acceptation des conditions{"\n"}</ThemedText>
                        En utilisant cette application, vous acceptez d'être lié par ces conditions d'utilisation.
                    </ThemedText>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>2. Utilisation du service{"\n"}</ThemedText>
                        Vous vous engagez à utiliser l'application conformément aux lois applicables et à ne pas l'utiliser à des fins illégales.
                    </ThemedText>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>3. Données personnelles{"\n"}</ThemedText>
                        Vos données sont traitées conformément à notre politique de confidentialité. Nous nous engageons à protéger vos informations.
                    </ThemedText>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>4. Propriété intellectuelle{"\n"}</ThemedText>
                        Tout le contenu de l'application est protégé par les droits d'auteur et appartient à Rakotomalala.
                    </ThemedText>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>5. Limitation de responsabilité{"\n"}</ThemedText>
                        L'application est fournie "en l'état". Nous ne garantissons pas qu'elle sera exempte d'erreurs.
                    </ThemedText>

                    <ThemedText style={[styles.termsUpdate, { color: theme.text }]}>
                        Dernière mise à jour: Septembre 2025
                    </ThemedText>
                </View>
            </GenericModal>

            {/* Modal Confidentialité */}
            <GenericModal
                visible={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                title="Politique de confidentialité"
            >
                <View style={styles.termsContent}>
                    <View style={styles.privacyHeader}>
                        <Ionicons name="shield-checkmark" size={48} color={Colors.green} />
                        <ThemedText style={[styles.privacyTitle, { color: theme.text }]}>
                            Votre vie privée est importante
                        </ThemedText>
                    </View>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>Collecte des données{"\n"}</ThemedText>
                        Nous collectons uniquement les données nécessaires au fonctionnement de l'application: nom, email, transactions financières.
                    </ThemedText>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>Utilisation des données{"\n"}</ThemedText>
                        Vos données sont utilisées exclusivement pour vous fournir nos services. Nous ne vendons jamais vos informations.
                    </ThemedText>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>Sécurité{"\n"}</ThemedText>
                        Toutes vos données sont chiffrées avec les standards les plus élevés (AES-256). Vos mots de passe sont hashés.
                    </ThemedText>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>Vos droits{"\n"}</ThemedText>
                        Vous avez le droit d'accéder, modifier ou supprimer vos données à tout moment. Contactez-nous pour exercer ces droits.
                    </ThemedText>

                    <ThemedText style={[styles.termsSection, { color: theme.text }]}>
                        <ThemedText style={styles.termsBold}>Cookies{"\n"}</ThemedText>
                        Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez les désactiver dans les paramètres.
                    </ThemedText>

                    <View style={styles.privacyBadges}>
                        <View style={styles.privacyBadge}>
                            <Ionicons name="lock-closed" size={20} color={Colors.green} />
                            <ThemedText style={[styles.badgeText, { color: theme.text }]}>Chiffré</ThemedText>
                        </View>
                        <View style={styles.privacyBadge}>
                            <Ionicons name="shield" size={20} color={Colors.green} />
                            <ThemedText style={[styles.badgeText, { color: theme.text }]}>RGPD</ThemedText>
                        </View>
                        <View style={styles.privacyBadge}>
                            <Ionicons name="eye-off" size={20} color={Colors.green} />
                            <ThemedText style={[styles.badgeText, { color: theme.text }]}>Privé</ThemedText>
                        </View>
                    </View>

                    <ThemedText style={[styles.termsUpdate, { color: theme.text }]}>
                        Dernière mise à jour: Septembre 2025
                    </ThemedText>
                </View>
            </GenericModal>
        </ThemedSafeAreaView>
    );
}