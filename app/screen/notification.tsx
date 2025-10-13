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
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedView from "@/components/ThemedView";
import { ImageBackground } from "react-native";
import Image from "@/constant/Images";
import ThemedScrollView from "@/components/ThemedScrollView";

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

    // Charger les paramètres au démarrage
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
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;
    const highPriorityCount = notifications.filter(
        (n) => !n.read && n.priority === "high"
    ).length;

    const markAsRead = (id: string) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        Alert.alert(
            "Supprimer la notification",
            "Êtes-vous sûr de vouloir supprimer cette notification ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => setNotifications(notifications.filter((n) => n.id !== id)),
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
                    onPress: () => setNotifications([]),
                },
            ]
        );
    };

    const groupedNotifications = notifications.reduce((groups, notif) => {
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

    if (showSettings) {
        return (
            <ThemedSafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Settings Header */}
                <View style={styles.settingsHeader}>
                    <TouchableOpacity onPress={() => setShowSettings(false)}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Paramètres</Text>
                    <View style={{ width: 24 }} />
                </View>
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {/* Types de notifications */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Types de notifications
                        </Text>
                        <View
                            style={[
                                styles.settingCard,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Ionicons
                                        name="alert-circle"
                                        size={22}
                                        color="#FF6B6B"
                                    />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Alertes budget
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Budget dépassé ou proche
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.budgetAlerts}
                                    onValueChange={(v) => updateSetting("budgetAlerts", v)}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                />
                            </View>
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="calendar" size={22} color="#F59E0B" />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Rappels factures
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Factures à payer
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.billReminders}
                                    onValueChange={(v) => updateSetting("billReminders", v)}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                />
                            </View>
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="trophy" size={22} color="#4ADE80" />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Objectifs d'épargne
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Progression et succès
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.goalUpdates}
                                    onValueChange={(v) => updateSetting("goalUpdates", v)}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                />
                            </View>
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="receipt" size={22} color="#6366F1" />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Transactions
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Nouvelles transactions
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.transactionAlerts}
                                    onValueChange={(v) => updateSetting("transactionAlerts", v)}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                />
                            </View>
                        </View>
                    </View>
                    {/* Rapports */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Rapports périodiques
                        </Text>
                        <View
                            style={[
                                styles.settingCard,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="document-text" size={22} color="#22D3EE" />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Rapport hebdomadaire
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Tous les lundis
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.weeklyReports}
                                    onValueChange={(v) => updateSetting("weeklyReports", v)}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                />
                            </View>
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="calendar" size={22} color="#A78BFA" />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Rapport mensuel
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Le 1er de chaque mois
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.monthlyReports}
                                    onValueChange={(v) => updateSetting("monthlyReports", v)}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                />
                            </View>
                        </View>
                    </View>
                    {/* Canaux */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Canaux de notification
                        </Text>
                        <View
                            style={[
                                styles.settingCard,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="notifications" size={22} color={Colors.primary} />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Notifications push
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Sur votre appareil
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.pushNotifications}
                                    onValueChange={(v) => updateSetting("pushNotifications", v)}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                />
                            </View>
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="mail" size={22} color={Colors.primary} />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Notifications email
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Par email
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.emailNotifications}
                                    onValueChange={(v) => updateSetting("emailNotifications", v)}
                                    trackColor={{ false: "#767577", true: Colors.primary }}
                                    thumbColor="#FFF"
                                />
                            </View>
                        </View>
                    </View>
                    {/* Préférences */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Préférences
                        </Text>
                        <View
                            style={[
                                styles.settingCard,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('billReminderDays')}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="time" size={22} color={Colors.primary} />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Rappel factures
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            {settings.billReminderDays} jours avant l'échéance
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={theme.text}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('budgetThreshold')}>
                                <View style={styles.settingLeft}>
                                    <Ionicons name="speedometer" size={22} color={Colors.primary} />
                                    <View>
                                        <Text style={[styles.settingTitle, { color: theme.text }]}>
                                            Seuil d'alerte budget
                                        </Text>
                                        <Text
                                            style={[
                                                styles.settingSubtitle,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Alerter à {settings.budgetThreshold}%
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={theme.text}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {/* Modale pour modifier les préférences */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalContent, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                Modifier {currentSetting?.key === 'billReminderDays' ? 'le rappel des factures' : 'le seuil d\'alerte'}
                            </Text>
                            <TextInput
                                style={[styles.modalInput, { color: theme.text, borderColor: theme.text }]}
                                keyboardType="numeric"
                                value={currentSetting?.value.toString()}
                                onChangeText={(text) => {
                                    const num = parseInt(text, 10) || 0;
                                    if (currentSetting) {
                                        setCurrentSetting({ ...currentSetting, value: num });
                                    }
                                }}
                            />
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => handleSaveModal(currentSetting?.value)}
                            >
                                <Text style={styles.modalButtonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ThemedSafeAreaView>
        );
    }

    return (
        <ThemedSafeAreaView>
            {/* Header */}
            <ThemedScrollView >
                <ThemedView style={{ paddingHorizontal: 20, width: "100%", height: 180, backgroundColor: Colors.primary, }}>
                    <ImageBackground source={Image.starBG} style={{ width: "100%", height: "100%", justifyContent: "center", }}>
                        <View style={styles.headerTop}>
                            <View>
                                <Text style={styles.headerTitle}>Notifications</Text>
                                <Text style={styles.headerSubtitle}>
                                    {unreadCount} non {unreadCount > 1 ? "lues" : "lue"}
                                    {highPriorityCount > 0 && ` • ${highPriorityCount} urgente(s)`}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => setShowSettings(true)}
                            >
                                <Ionicons name="settings" size={24} color="#FFF" />
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
                                    <Text style={styles.quickActionText}>Tout marquer lu</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.quickActionButton} onPress={clearAll}>
                                    <Ionicons name="trash" size={18} color="#FFF" />
                                    <Text style={styles.quickActionText}>Tout effacer</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ImageBackground>
                </ThemedView>
                <View
                    style={styles.content}
                >
                    {Object.entries(groupedNotifications).map(([dateKey, notifs]) => (
                        <View key={dateKey} style={styles.section}>
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
                                            opacity: notif.read ? 0.7 : 1,
                                        },
                                    ]}
                                    onPress={() => markAsRead(notif.id)}
                                    onLongPress={() => deleteNotification(notif.id)}
                                >
                                    <View
                                        style={[
                                            styles.notifIcon,
                                            { backgroundColor: notif.color + "20" },
                                        ]}
                                    >
                                        <Ionicons
                                            name={notif.icon as any}
                                            size={24}
                                            color={notif.color}
                                        />
                                    </View>
                                    <View style={styles.notifContent}>
                                        <View style={styles.notifHeader}>
                                            <Text
                                                style={[
                                                    styles.notifTitle,
                                                    { color: theme.text },
                                                    !notif.read && styles.notifTitleUnread,
                                                ]}
                                            >
                                                {notif.title}
                                            </Text>
                                            {!notif.read && <View style={styles.unreadDot} />}
                                        </View>
                                        <Text
                                            style={[styles.notifMessage, { color: theme.text }]}
                                        >
                                            {notif.message}
                                        </Text>
                                        <View style={styles.notifFooter}>
                                            <Text style={[styles.notifTime, { color: theme.text }]}>
                                                {formatTimeAgo(notif.time)}
                                            </Text>
                                            {notif.priority === "high" && (
                                                <View style={styles.priorityBadge}>
                                                    <Ionicons name="flame" size={12} color="#FF6B6B" />
                                                    <Text style={styles.priorityText}>Urgent</Text>
                                                </View>
                                            )}
                                            {notif.actionable && (
                                                <TouchableOpacity style={styles.actionButton}>
                                                    <Text style={styles.actionButtonText}>Agir</Text>
                                                    <Ionicons
                                                        name="arrow-forward"
                                                        size={14}
                                                        color={Colors.primary}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                    {notifications.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="notifications-off-outline"
                                size={64}
                                color={theme.text}
                            />
                            <Text style={[styles.emptyText, { color: theme.text }]}>
                                Aucune notification
                            </Text>
                            <Text style={[styles.emptySubtext, { color: theme.text }]}>
                                Vous êtes à jour !
                            </Text>
                        </View>
                    )}
                </View>
            </ThemedScrollView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#FFF",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#FFF",
        opacity: 0.9,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    quickActions: {
        flexDirection: "row",
        gap: 12,
    },
    quickActionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 12,
        borderRadius: 6,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFF",
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 12,
        textTransform: "uppercase",
    },
    notificationCard: {
        flexDirection: "row",
        padding: 16,
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderLeftWidth: 1,
        borderColor: "rgba(153, 153, 153, 0.2)",
    },
    notifIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    notifContent: {
        flex: 1,
    },
    notifHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    notifTitle: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
    },
    notifTitleUnread: {
        fontWeight: "700",
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginLeft: 8,
    },
    notifMessage: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    notifFooter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
    },
    notifTime: {
        fontSize: 12,
    },
    priorityBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#FF6B6B20",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priorityText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#FF6B6B",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: Colors.primary + "20",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginLeft: "auto",
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.primary,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: "center",
    },
    settingsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 24
    },
    settingCard: {
        borderRadius: 6,
        borderWidth: 1,
        borderLeftWidth: 1,
        borderColor: "#99999933",
        overflow: "hidden",
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#99999933",
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
