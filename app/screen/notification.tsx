import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    Switch,
    Alert,
    Modal,
    TextInput,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedView from "@/components/ThemedView";
import { ImageBackground } from "react-native";
import Image from "@/constant/Images";
import ThemedScrollView from "@/components/ThemedScrollView";
import { LinearGradient } from "expo-linear-gradient";
import styles from "@/styles/notification";

// Types
interface Notification {
    id: string;
    type: "budget" | "bill" | "goal" | "transaction" | "insight";
    priority: "high" | "medium" | "low";
    title: string;
    message: string;
    time: Date;
    read: boolean;
    actionable: boolean;
    icon: string;
    color: string;
}

interface NotificationSettings {
    budgetAlerts: boolean;
    billReminders: boolean;
    goalUpdates: boolean;
    transactionAlerts: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    billReminderDays: number;
    budgetThreshold: number;
}

// Données d'exemple
const SAMPLE_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "budget",
        priority: "high",
        title: "Budget Alimentation dépassé !",
        message: "Vous avez dépassé votre budget alimentation de 15,000 Ar ce mois-ci.",
        time: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        actionable: true,
        icon: "alert-circle",
        color: "#FF6B6B",
    },
    {
        id: "2",
        type: "bill",
        priority: "high",
        title: "Loyer à payer dans 3 jours",
        message: "N'oubliez pas de payer votre loyer de 150,000 Ar avant le 15 octobre.",
        time: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
        actionable: true,
        icon: "calendar",
        color: "#F59E0B",
    },
    {
        id: "3",
        type: "goal",
        priority: "medium",
        title: "Objectif PC Gamer : 74% atteint !",
        message: "Plus que 650,000 Ar pour atteindre votre objectif. Continuez !",
        time: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: false,
        actionable: false,
        icon: "trophy",
        color: "#4ADE80",
    },
    {
        id: "4",
        type: "transaction",
        priority: "low",
        title: "Nouvelle dépense enregistrée",
        message: "Restaurant - 35,000 Ar ajouté à vos dépenses.",
        time: new Date(Date.now() - 1000 * 60 * 60 * 8),
        read: true,
        actionable: false,
        icon: "receipt",
        color: "#6366F1",
    },
    {
        id: "5",
        type: "insight",
        priority: "medium",
        title: "Conseil financier",
        message: "Vos dépenses de transport ont diminué de 15% ce mois-ci. Excellent travail !",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
        actionable: false,
        icon: "bulb",
        color: "#22D3EE",
    },
    {
        id: "6",
        type: "bill",
        priority: "high",
        title: "Facture d'électricité",
        message: "Échéance dans 5 jours - 45,000 Ar",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        read: true,
        actionable: true,
        icon: "flash",
        color: "#F59E0B",
    },
    {
        id: "7",
        type: "budget",
        priority: "medium",
        title: "Budget Loisirs à 95%",
        message: "Attention, vous avez presque atteint votre limite mensuelle.",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        read: true,
        actionable: false,
        icon: "warning",
        color: "#FFA500",
    },
];

const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

export default function NotificationsPage() {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const isLight = theme === Colors.light;
    const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
    const [showSettings, setShowSettings] = useState(false);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [settings, setSettings] = useState<NotificationSettings>({
        budgetAlerts: true,
        billReminders: true,
        goalUpdates: true,
        transactionAlerts: true,
        weeklyReports: true,
        monthlyReports: true,
        pushNotifications: true,
        emailNotifications: false,
        billReminderDays: 3,
        budgetThreshold: 90,
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [currentSetting, setCurrentSetting] = useState<{ key: keyof NotificationSettings; value: any } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('notificationSettings');
            if (savedSettings !== null) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (e) {
            console.error("Erreur lors du chargement des paramètres :", e);
        }
    };

    const saveSettings = async (newSettings: NotificationSettings) => {
        try {
            await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
        } catch (e) {
            console.error("Erreur lors de la sauvegarde des paramètres :", e);
        }
    };

    const updateSetting = (key: keyof NotificationSettings, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const openModal = (key: keyof NotificationSettings) => {
        setCurrentSetting({ key, value: settings[key] });
        setModalVisible(true);
    };

    const handleSaveModal = (value: any) => {
        if (currentSetting) {
            updateSetting(currentSetting.key, value);
            setModalVisible(false);
            Alert.alert("✓ Enregistré", "Vos préférences ont été mises à jour");
        }
    };

    const filteredNotifications = filterType
        ? notifications.filter((n) => n.type === filterType)
        : notifications;

    const unreadCount = filteredNotifications.filter((n) => !n.read).length;
    const highPriorityCount = filteredNotifications.filter(
        (n) => !n.read && n.priority === "high"
    ).length;

    const markAsRead = (id: string) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        Alert.alert("✓ Succès", "Toutes les notifications ont été marquées comme lues");
    };

    const deleteNotification = (id: string) => {
        Alert.alert(
            "Supprimer",
            "Êtes-vous sûr de vouloir supprimer cette notification ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => {
                        setNotifications(notifications.filter((n) => n.id !== id));
                        Alert.alert("✓ Supprimée", "La notification a été supprimée");
                    },
                },
            ]
        );
    };

    const clearAll = () => {
        Alert.alert(
            "Tout effacer",
            "Êtes-vous sûr de vouloir supprimer toutes les notifications ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Tout effacer",
                    style: "destructive",
                    onPress: () => {
                        setNotifications([]);
                        Alert.alert("✓ Effacé", "Toutes les notifications ont été supprimées");
                    },
                },
            ]
        );
    };

    const handleNotificationAction = (notif: Notification) => {
        switch (notif.type) {
            case "budget":
                Alert.alert(
                    "Action Budget",
                    "Que souhaitez-vous faire ?",
                    [
                        {
                            text: "Voir le budget",
                            onPress: () => Alert.alert("Navigation", "Redirection vers la page Budget..."),
                        },
                        {
                            text: "Ajuster le budget",
                            onPress: () => Alert.alert("Ajustement", "Augmenter le budget de ce mois ?"),
                        },
                        { text: "Annuler", style: "cancel" },
                    ]
                );
                break;
            case "bill":
                Alert.alert(
                    "Payer la facture",
                    `Souhaitez-vous payer ${notif.message.match(/\d+,\d+ Ar/)?.[0] || "cette facture"} maintenant ?`,
                    [
                        {
                            text: "Payer maintenant",
                            onPress: () => {
                                Alert.alert("✓ Paiement effectué", "Paiement réalisé avec succès !");
                                markAsRead(notif.id);
                            },
                        },
                        {
                            text: "Rappeler plus tard",
                            onPress: () => Alert.alert("⏰ Rappel", "Rappel programmé dans 1 jour"),
                        },
                        { text: "Annuler", style: "cancel" },
                    ]
                );
                break;
            case "goal":
                Alert.alert(
                    "Objectif d'épargne",
                    "Ajouter plus à votre épargne ?",
                    [
                        {
                            text: "Ajouter 10,000 Ar",
                            onPress: () => Alert.alert("✓ Épargne", "10,000 Ar ajoutés à votre objectif !"),
                        },
                        {
                            text: "Ajouter 50,000 Ar",
                            onPress: () => Alert.alert("✓ Épargne", "50,000 Ar ajoutés à votre objectif !"),
                        },
                        {
                            text: "Voir l'objectif",
                            onPress: () => Alert.alert("Navigation", "Redirection vers vos objectifs..."),
                        },
                        { text: "Annuler", style: "cancel" },
                    ]
                );
                break;
            case "transaction":
                Alert.alert(
                    "Transaction",
                    "Options de transaction",
                    [
                        {
                            text: "Voir détails",
                            onPress: () => Alert.alert("Détails", "Affichage des détails de la transaction..."),
                        },
                        {
                            text: "Modifier",
                            onPress: () => Alert.alert("Modification", "Modifier la transaction..."),
                        },
                        { text: "Annuler", style: "cancel" },
                    ]
                );
                break;
            case "insight":
                Alert.alert(
                    "Conseil financier",
                    "Voulez-vous voir plus de conseils personnalisés ?",
                    [
                        {
                            text: "Voir les conseils",
                            onPress: () => Alert.alert("Conseils", "Redirection vers vos conseils..."),
                        },
                        { text: "Plus tard", style: "cancel" },
                    ]
                );
                break;
        }
    };

    const snoozeNotification = (id: string) => {
        Alert.alert(
            "Reporter la notification",
            "Quand souhaitez-vous être rappelé ?",
            [
                {
                    text: "Dans 1 heure",
                    onPress: () => {
                        Alert.alert("⏰ Rappel programmé", "Vous serez rappelé dans 1 heure");
                        markAsRead(id);
                    },
                },
                {
                    text: "Demain",
                    onPress: () => {
                        Alert.alert("⏰ Rappel programmé", "Vous serez rappelé demain");
                        markAsRead(id);
                    },
                },
                {
                    text: "Dans 3 jours",
                    onPress: () => {
                        Alert.alert("⏰ Rappel programmé", "Vous serez rappelé dans 3 jours");
                        markAsRead(id);
                    },
                },
                { text: "Annuler", style: "cancel" },
            ]
        );
    };

    const shareNotification = (notif: Notification) => {
        Alert.alert(
            "Partager",
            `Partager "${notif.title}" ?`,
            [
                {
                    text: "Par email",
                    onPress: () => Alert.alert("📧 Email", "Ouverture de l'application email..."),
                },
                {
                    text: "Par SMS",
                    onPress: () => Alert.alert("💬 SMS", "Ouverture de l'application SMS..."),
                },
                {
                    text: "Copier",
                    onPress: () => Alert.alert("✓ Copié", "Texte copié dans le presse-papiers"),
                },
                { text: "Annuler", style: "cancel" },
            ]
        );
    };

    const muteNotificationType = (type: string) => {
        Alert.alert(
            "Désactiver les notifications",
            `Désactiver temporairement les notifications "${type}" ?`,
            [
                {
                    text: "Pour 1 heure",
                    onPress: () => Alert.alert("🔕 Désactivé", "Notifications désactivées pour 1 heure"),
                },
                {
                    text: "Pour 24 heures",
                    onPress: () => Alert.alert("🔕 Désactivé", "Notifications désactivées pour 24 heures"),
                },
                {
                    text: "Définitivement",
                    onPress: () => Alert.alert("🔕 Désactivé", "Vous pouvez réactiver dans les paramètres"),
                },
                { text: "Annuler", style: "cancel" },
            ]
        );
    };

    const groupedNotifications = filteredNotifications.reduce((groups, notif) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let dateKey: string;
        if (notif.time.toDateString() === today.toDateString()) {
            dateKey = "Aujourd'hui";
        } else if (notif.time.toDateString() === yesterday.toDateString()) {
            dateKey = "Hier";
        } else {
            dateKey = "Plus ancien";
        }
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(notif);
        return groups;
    }, {} as Record<string, Notification[]>);

    const filterOptions = [
        { type: null, label: "Toutes", icon: "notifications", color: Colors.primary },
        { type: "budget", label: "Budget", icon: "alert-circle", color: "#FF6B6B" },
        { type: "bill", label: "Factures", icon: "calendar", color: "#F59E0B" },
        { type: "goal", label: "Objectifs", icon: "trophy", color: "#4ADE80" },
        { type: "transaction", label: "Transactions", icon: "receipt", color: "#6366F1" },
        { type: "insight", label: "Conseils", icon: "bulb", color: "#22D3EE" },
    ];

    if (showSettings) {
        return (
            <ThemedSafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.settingsHeader, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                    <TouchableOpacity
                        onPress={() => setShowSettings(false)}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.settingsTitle, { color: theme.text }]}>Paramètres</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* Types de notifications */}
                    <View style={styles.settingsSection}>
                        <View style={styles.sectionHeaderSettings}>
                            <Ionicons name="notifications" size={22} color={Colors.primary} />
                            <Text style={[styles.sectionTitleSettings, { color: theme.text }]}>
                                Types de notifications
                            </Text>
                        </View>
                        <View style={[styles.settingCard, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                            <SettingRow
                                icon="alert-circle"
                                iconColor="#FF6B6B"
                                title="Alertes budget"
                                subtitle="Budget dépassé ou proche"
                                value={settings.budgetAlerts}
                                onValueChange={(v: boolean) => updateSetting("budgetAlerts", v)}
                                theme={theme}
                            />
                            <SettingRow
                                icon="calendar"
                                iconColor="#F59E0B"
                                title="Rappels factures"
                                subtitle="Factures à payer"
                                value={settings.billReminders}
                                onValueChange={(v: boolean) => updateSetting("billReminders", v)}
                                theme={theme}
                            />
                            <SettingRow
                                icon="trophy"
                                iconColor="#4ADE80"
                                title="Objectifs d'épargne"
                                subtitle="Progression et succès"
                                value={settings.goalUpdates}
                                onValueChange={(v: boolean) => updateSetting("goalUpdates", v)}
                                theme={theme}
                            />
                            <SettingRow
                                icon="receipt"
                                iconColor="#6366F1"
                                title="Transactions"
                                subtitle="Nouvelles transactions"
                                value={settings.transactionAlerts}
                                onValueChange={(v: boolean) => updateSetting("transactionAlerts", v)}
                                theme={theme}
                                isLast
                            />
                        </View>
                    </View>

                    {/* Rapports */}
                    <View style={styles.settingsSection}>
                        <View style={styles.sectionHeaderSettings}>
                            <Ionicons name="document-text" size={22} color={Colors.primary} />
                            <Text style={[styles.sectionTitleSettings, { color: theme.text }]}>
                                Rapports périodiques
                            </Text>
                        </View>
                        <View style={[styles.settingCard, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                            <SettingRow
                                icon="calendar-outline"
                                iconColor="#22D3EE"
                                title="Rapport hebdomadaire"
                                subtitle="Tous les lundis"
                                value={settings.weeklyReports}
                                onValueChange={(v: boolean) => updateSetting("weeklyReports", v)}
                                theme={theme}
                            />
                            <SettingRow
                                icon="calendar"
                                iconColor="#A78BFA"
                                title="Rapport mensuel"
                                subtitle="Le 1er de chaque mois"
                                value={settings.monthlyReports}
                                onValueChange={(v: boolean) => updateSetting("monthlyReports", v)}
                                theme={theme}
                                isLast
                            />
                        </View>
                    </View>

                    {/* Canaux */}
                    <View style={styles.settingsSection}>
                        <View style={styles.sectionHeaderSettings}>
                            <Ionicons name="send" size={22} color={Colors.primary} />
                            <Text style={[styles.sectionTitleSettings, { color: theme.text }]}>
                                Canaux de notification
                            </Text>
                        </View>
                        <View style={[styles.settingCard, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                            <SettingRow
                                icon="phone-portrait"
                                iconColor={Colors.primary}
                                title="Notifications push"
                                subtitle="Sur votre appareil"
                                value={settings.pushNotifications}
                                onValueChange={(v: boolean) => updateSetting("pushNotifications", v)}
                                theme={theme}
                            />
                            <SettingRow
                                icon="mail"
                                iconColor={Colors.primary}
                                title="Notifications email"
                                subtitle="Par email"
                                value={settings.emailNotifications}
                                onValueChange={(v: boolean) => updateSetting("emailNotifications", v)}
                                theme={theme}
                                isLast
                            />
                        </View>
                    </View>

                    {/* Préférences */}
                    <View style={styles.settingsSection}>
                        <View style={styles.sectionHeaderSettings}>
                            <Ionicons name="options" size={22} color={Colors.primary} />
                            <Text style={[styles.sectionTitleSettings, { color: theme.text }]}>
                                Préférences avancées
                            </Text>
                        </View>
                        <View style={[styles.settingCard, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                            <TouchableOpacity
                                style={styles.settingRowClickable}
                                onPress={() => openModal('billReminderDays')}
                                activeOpacity={0.7}
                            >
                                <View style={styles.settingLeft}>
                                    <View style={[styles.settingIconContainer, { backgroundColor: Colors.primary + "20" }]}>
                                        <Ionicons name="time" size={22} color={Colors.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Rappel factures
                                        </Text>
                                        <Text style={[styles.settingSubtitle, { color: theme.text }]}>
                                            {settings.billReminderDays} jours avant l'échéance
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.text} style={{ opacity: 0.4 }} />
                            </TouchableOpacity>

                            <View style={[styles.divider, { backgroundColor: theme.text + "15" }]} />

                            <TouchableOpacity
                                style={styles.settingRowClickable}
                                onPress={() => openModal('budgetThreshold')}
                                activeOpacity={0.7}
                            >
                                <View style={styles.settingLeft}>
                                    <View style={[styles.settingIconContainer, { backgroundColor: Colors.primary + "20" }]}>
                                        <Ionicons name="speedometer" size={22} color={Colors.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Seuil d'alerte budget
                                        </Text>
                                        <Text style={[styles.settingSubtitle, { color: theme.text }]}>
                                            Alerter à {settings.budgetThreshold}%
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.text} style={{ opacity: 0.4 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Modal pour modifier les préférences */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalContent, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                            <View style={styles.modalHandle} />
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                {currentSetting?.key === 'billReminderDays'
                                    ? 'Rappel des factures'
                                    : 'Seuil d\'alerte budget'}
                            </Text>
                            <Text style={[styles.modalDescription, { color: theme.text }]}>
                                {currentSetting?.key === 'billReminderDays'
                                    ? 'Nombre de jours avant l\'échéance'
                                    : 'Pourcentage du budget à atteindre'}
                            </Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[styles.modalInput, {
                                        color: theme.text,
                                        backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A"
                                    }]}
                                    keyboardType="numeric"
                                    value={currentSetting?.value.toString()}
                                    onChangeText={(text) => {
                                        const num = parseInt(text, 10) || 0;
                                        if (currentSetting) {
                                            setCurrentSetting({ ...currentSetting, value: num });
                                        }
                                    }}
                                    placeholder={currentSetting?.key === 'billReminderDays' ? "3" : "90"}
                                    placeholderTextColor={theme.text + "60"}
                                />
                                <Text style={[styles.inputSuffix, { color: theme.text }]}>
                                    {currentSetting?.key === 'billReminderDays' ? 'jours' : '%'}
                                </Text>
                            </View>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A" }]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={[styles.modalButtonTextSecondary, { color: theme.text }]}>
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonPrimary]}
                                    onPress={() => handleSaveModal(currentSetting?.value)}
                                >
                                    <Text style={styles.modalButtonTextPrimary}>Enregistrer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ThemedSafeAreaView>
        );
    }

    return (
        <ThemedSafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ThemedScrollView showsVerticalScrollIndicator={false}>
                {/* Header Moderne */}
                <LinearGradient
                    colors={[Colors.primary, '#4ADE80', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} style={styles.headerContainer}>
                    <ImageBackground
                        source={Image.starBG}
                        style={styles.headerBackground}
                    >
                        <View style={styles.headerTop}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.headerTitle}>Notifications</Text>
                                <View style={styles.headerStats}>
                                    <View style={styles.statBadge}>
                                        <Text style={styles.statNumber}>{unreadCount}</Text>
                                        <Text style={styles.statLabel}>non lues</Text>
                                    </View>
                                    {highPriorityCount > 0 && (
                                        <View style={[styles.statBadge, styles.urgentBadge]}>
                                            <Ionicons name="flame" size={14} color="#FF6B6B" />
                                            <Text style={[styles.statNumber, { color: "#FF6B6B" }]}>
                                                {highPriorityCount}
                                            </Text>
                                            <Text style={[styles.statLabel, { color: "#FF6B6B" }]}>urgentes</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => setShowSettings(true)}
                            >
                                <Ionicons name="settings-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Actions rapides */}
                        {unreadCount > 0 && (
                            <View style={styles.quickActions}>
                                <TouchableOpacity
                                    style={styles.quickActionButton}
                                    onPress={markAllAsRead}
                                >
                                    <Ionicons name="checkmark-done" size={18} color="#FFF" />
                                    <Text style={styles.quickActionText}>Tout lire</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickActionButton} onPress={clearAll}>
                                    <Ionicons name="trash-outline" size={18} color="#FFF" />
                                    <Text style={styles.quickActionText}>Effacer</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Bouton Export et Options */}
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={styles.headerActionButton}
                                onPress={() => {
                                    Alert.alert(
                                        "Exporter les notifications",
                                        "Choisissez un format",
                                        [
                                            {
                                                text: "PDF",
                                                onPress: () => Alert.alert("📄 Export", "Export en PDF en cours..."),
                                            },
                                            {
                                                text: "CSV",
                                                onPress: () => Alert.alert("📊 Export", "Export en CSV en cours..."),
                                            },
                                            {
                                                text: "Email",
                                                onPress: () => Alert.alert("📧 Email", "Envoi par email..."),
                                            },
                                            { text: "Annuler", style: "cancel" },
                                        ]
                                    );
                                }}
                            >
                                <Ionicons name="download-outline" size={18} color="#FFF" />
                                <Text style={styles.headerActionText}>Export</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.headerActionButton}
                                onPress={() => {
                                    Alert.alert(
                                        "Options avancées",
                                        "Choisissez une action",
                                        [
                                            {
                                                text: "Archiver les anciennes",
                                                onPress: () => {
                                                    const now = new Date();
                                                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                                                    setNotifications(
                                                        notifications.filter((n) => n.time >= weekAgo)
                                                    );
                                                    Alert.alert("✓ Archivé", "Notifications de plus de 7 jours archivées");
                                                },
                                            },
                                            {
                                                text: "Mode Ne pas déranger",
                                                onPress: () => {
                                                    Alert.alert(
                                                        "Ne pas déranger",
                                                        "Durée ?",
                                                        [
                                                            {
                                                                text: "1 heure",
                                                                onPress: () => Alert.alert("🔕 Activé", "Notifications muettes pour 1h"),
                                                            },
                                                            {
                                                                text: "Jusqu'à demain",
                                                                onPress: () => Alert.alert("🔕 Activé", "Notifications muettes jusqu'à demain"),
                                                            },
                                                            { text: "Annuler", style: "cancel" },
                                                        ]
                                                    );
                                                },
                                            },
                                            {
                                                text: "Statistiques",
                                                onPress: () => {
                                                    const stats = {
                                                        total: notifications.length,
                                                        lues: notifications.filter(n => n.read).length,
                                                        nonLues: notifications.filter(n => !n.read).length,
                                                        urgentes: notifications.filter(n => n.priority === "high").length,
                                                    };
                                                    Alert.alert(
                                                        "📊 Statistiques",
                                                        `Total: ${stats.total}\nLues: ${stats.lues}\nNon lues: ${stats.nonLues}\nUrgentes: ${stats.urgentes}`
                                                    );
                                                },
                                            },
                                            { text: "Annuler", style: "cancel" },
                                        ]
                                    );
                                }}
                            >
                                <Ionicons name="ellipsis-horizontal" size={18} color="#FFF" />
                                <Text style={styles.headerActionText}>Plus</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </LinearGradient>

                {/* Filtres */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filtersContent}
                >
                    {filterOptions.map((option) => (
                        <TouchableOpacity
                            key={option.type || "all"}
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor: filterType === option.type
                                        ? option.color
                                        : isLight ? "#F5F5F5" : "#2A2A2A",
                                },
                            ]}
                            onPress={() => setFilterType(option.type)}
                            onLongPress={() => {
                                if (option.type) {
                                    Alert.alert(
                                        "Options de filtre",
                                        `Gérer les notifications "${option.label}"`,
                                        [
                                            {
                                                text: "Désactiver temporairement",
                                                onPress: () => muteNotificationType(option.label),
                                            },
                                            {
                                                text: "Tout marquer comme lu",
                                                onPress: () => {
                                                    setNotifications(
                                                        notifications.map((n) =>
                                                            n.type === option.type ? { ...n, read: true } : n
                                                        )
                                                    );
                                                    Alert.alert("✓ Succès", `Toutes les notifications "${option.label}" sont marquées comme lues`);
                                                },
                                            },
                                            {
                                                text: "Tout supprimer",
                                                style: "destructive",
                                                onPress: () => {
                                                    Alert.alert(
                                                        "Confirmer",
                                                        `Supprimer toutes les notifications "${option.label}" ?`,
                                                        [
                                                            { text: "Annuler", style: "cancel" },
                                                            {
                                                                text: "Supprimer",
                                                                style: "destructive",
                                                                onPress: () => {
                                                                    setNotifications(
                                                                        notifications.filter((n) => n.type !== option.type)
                                                                    );
                                                                    Alert.alert("✓ Supprimé", `Notifications "${option.label}" supprimées`);
                                                                },
                                                            },
                                                        ]
                                                    );
                                                },
                                            },
                                            { text: "Annuler", style: "cancel" },
                                        ]
                                    );
                                }
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={option.icon as any}
                                size={18}
                                color={filterType === option.type ? "#FFF" : option.color}
                            />
                            <Text
                                style={[
                                    styles.filterText,
                                    {
                                        color: filterType === option.type ? "#FFF" : theme.text,
                                    },
                                ]}
                            >
                                {option.label}
                            </Text>
                            {option.type && (
                                <View style={[
                                    styles.filterBadge,
                                    {
                                        backgroundColor: filterType === option.type
                                            ? "rgba(255, 255, 255, 0.3)"
                                            : option.color + "30"
                                    }
                                ]}>
                                    <Text style={[
                                        styles.filterBadgeText,
                                        { color: filterType === option.type ? "#FFF" : option.color }
                                    ]}>
                                        {notifications.filter(n => n.type === option.type && !n.read).length}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Liste des notifications */}
                <View style={styles.notificationsContent}>
                    {Object.entries(groupedNotifications).map(([dateKey, notifs]) => (
                        <View key={dateKey} style={styles.notificationGroup}>
                            <Text style={[styles.dateHeader, { color: theme.text }]}>
                                {dateKey}
                            </Text>
                            {notifs.map((notif) => (
                                <TouchableOpacity
                                    key={notif.id}
                                    style={[
                                        styles.notificationCard,
                                        {
                                            backgroundColor: isLight ? "#FFF" : "#1F1F1F",
                                            opacity: notif.read ? 0.6 : 1,
                                        },
                                    ]}
                                    onPress={() => markAsRead(notif.id)}
                                    onLongPress={() => {
                                        Alert.alert(
                                            "Options",
                                            `Actions pour "${notif.title}"`,
                                            [
                                                {
                                                    text: "Supprimer",
                                                    style: "destructive",
                                                    onPress: () => deleteNotification(notif.id),
                                                },
                                                {
                                                    text: "Reporter",
                                                    onPress: () => snoozeNotification(notif.id),
                                                },
                                                {
                                                    text: "Partager",
                                                    onPress: () => shareNotification(notif),
                                                },
                                                {
                                                    text: notif.read ? "Marquer non lu" : "Marquer lu",
                                                    onPress: () => {
                                                        setNotifications(
                                                            notifications.map((n) =>
                                                                n.id === notif.id ? { ...n, read: !n.read } : n
                                                            )
                                                        );
                                                    },
                                                },
                                                { text: "Annuler", style: "cancel" },
                                            ]
                                        );
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.notifIcon, { backgroundColor: notif.color + "20" }]}>
                                        <Ionicons name={notif.icon as any} size={24} color={notif.color} />
                                    </View>
                                    <View style={styles.notifContent}>
                                        <View style={styles.notifHeader}>
                                            <Text
                                                style={[
                                                    styles.notifTitle,
                                                    { color: theme.text },
                                                    !notif.read && styles.notifTitleUnread,
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {notif.title}
                                            </Text>
                                            {!notif.read && <View style={styles.unreadDot} />}
                                        </View>
                                        <Text style={[styles.notifMessage, { color: theme.text }]} numberOfLines={2}>
                                            {notif.message}
                                        </Text>
                                        <View style={styles.notifFooter}>
                                            <View style={styles.footerLeft}>
                                                <Ionicons name="time-outline" size={14} color={theme.text} style={{ opacity: 0.6 }} />
                                                <Text style={[styles.notifTime, { color: theme.text }]}>
                                                    {formatTimeAgo(notif.time)}
                                                </Text>
                                            </View>
                                            <View style={styles.footerRight}>
                                                {notif.priority === "high" && (
                                                    <View style={styles.priorityBadge}>
                                                        <Ionicons name="flame" size={12} color="#FF6B6B" />
                                                        <Text style={styles.priorityText}>Urgent</Text>
                                                    </View>
                                                )}
                                                {notif.actionable && (
                                                    <TouchableOpacity
                                                        style={styles.actionButton}
                                                        onPress={() => handleNotificationAction(notif)}
                                                    >
                                                        <Text style={styles.actionButtonText}>Agir</Text>
                                                        <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[styles.cardIndicator, { backgroundColor: notif.color }]} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}

                    {filteredNotifications.length === 0 && (
                        <View style={styles.emptyState}>
                            <View style={[styles.emptyIcon, { backgroundColor: Colors.primary + "20" }]}>
                                <Ionicons name="notifications-off-outline" size={64} color={Colors.primary} />
                            </View>
                            <Text style={[styles.emptyText, { color: theme.text }]}>
                                Aucune notification
                            </Text>
                            <Text style={[styles.emptySubtext, { color: theme.text }]}>
                                Vous êtes à jour ! 🎉
                            </Text>
                        </View>
                    )}
                </View>
            </ThemedScrollView>
        </ThemedSafeAreaView>
    );
}

// Composant pour les lignes de paramètres
const SettingRow = ({ icon, iconColor, title, subtitle, value, onValueChange, theme, isLast = false }: any) => (
    <>
        <View style={styles.settingRowContainer}>
            <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: iconColor + "20" }]}>
                    <Ionicons name={icon as any} size={22} color={iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                        {title}
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: theme.text }]}>
                        {subtitle}
                    </Text>
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: "#767577", true: Colors.primary }}
                thumbColor="#FFF"
                ios_backgroundColor="#767577"
            />
        </View>
        {!isLast && <View style={[styles.divider, { backgroundColor: theme.text + "15" }]} />}
    </>
);