import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    ScrollView,
    useColorScheme,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { LinearGradient } from "expo-linear-gradient";
import ThemedText from "@/components/ThemedText";
import styles from "@/styles/transaction";
import { TransactionResponse, transactionService } from "@/services/api/transactionService";
import CustomAlert from "@/common/customAlert";

// Types
interface Transaction {
    id: string;
    type: "EXPENSE" | "INCOME";
    title: string;
    category: string;
    amount: number;
    date: Date;
    description?: string;
}

const CATEGORIES_EXPENSE = [
    { name: "Alimentation", icon: "restaurant", color: "#FF6B6B" },
    { name: "Transport", icon: "car", color: "#4ECDC4" },
    { name: "Logement", icon: "home", color: "#45B7D1" },
    { name: "Loisirs", icon: "game-controller", color: "#FFA07A" },
    { name: "Santé", icon: "medical", color: "#98D8C8" },
    { name: "Shopping", icon: "cart", color: "#F7DC6F" },
    { name: "Éducation", icon: "school", color: "#A78BFA" },
    { name: "Salaire", icon: "briefcase", color: "#4ADE80" },
    { name: "Freelance", icon: "laptop", color: "#22D3EE" },
    { name: "Investissement", icon: "trending-up", color: "#FB923C" },
    { name: "Autres", icon: "ellipsis-horizontal", color: "#BDC3C7" },
];

const CATEGORIES_INCOME = [
    { name: "Salaire", icon: "briefcase", color: "#4ADE80" },
    { name: "Freelance", icon: "laptop", color: "#22D3EE" },
    { name: "Investissement", icon: "trending-up", color: "#A78BFA" },
    { name: "Autres", icon: "ellipsis-horizontal", color: "#BDC3C7" },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
        style: "currency",
        currency: "MGA",
        minimumFractionDigits: 0,
    }).format(amount);
};


const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";

    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const adjustColorBrightness = (color: string, amount: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Convertir la réponse API en format local
const convertApiTransaction = (apiTransaction: TransactionResponse): Transaction => ({
    id: apiTransaction.id,
    type: apiTransaction.type,
    title: apiTransaction.title,
    category: apiTransaction.category,
    amount: apiTransaction.amount,
    date: new Date(apiTransaction.date),
    description: apiTransaction.description,
});

export default function TransactionPage() {
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    const isLight = theme === Colors.light;

    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Statistics
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const soldeActuel = totalIncome - totalExpense

    // Form states
    const [transactionType, setTransactionType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Filter states
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterType, setFilterType] = useState<"all" | "EXPENSE" | "INCOME">("all");
    const [filterPeriod, setFilterPeriod] = useState<string>("all");

    // Charger les transactions
    const loadTransactions = useCallback(async () => {
        try {
            // setLoading(true);

            // Préparer les paramètres de filtre
            const params: any = {};
            if (filterType !== "all") params.type = filterType;
            if (filterCategory !== "all") params.category = filterCategory;
            if (searchQuery) params.search = searchQuery;

            // Filtres de période
            if (filterPeriod !== "all") {
                const today = new Date();
                if (filterPeriod === "today") {
                    params.startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
                    params.endDate = new Date(today.setHours(23, 59, 59, 999)).toISOString();
                } else if (filterPeriod === "week") {
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    params.startDate = weekAgo.toISOString();
                    params.endDate = new Date().toISOString();
                } else if (filterPeriod === "month") {
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    params.startDate = firstDay.toISOString();
                    params.endDate = lastDay.toISOString();
                }
            }

            const data = await transactionService.getAll(params);
            const convertedTransactions = data.map(convertApiTransaction);
            setTransactions(convertedTransactions);
        } catch (error) {
            setMessage('Impossible de charger les transactions');
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);
        } finally {
            setLoading(false);
        }
    }, [filterType, filterCategory, filterPeriod, searchQuery]);

    // Charger les statistiques
    const loadStatistics = useCallback(async () => {
        try {
            const stats = await transactionService.getStatistics();
            setTotalIncome(stats.totalIncome);
            setTotalExpense(stats.totalExpense);
        } catch (error) {
            console.error("Erreur lors du chargement des statistiques:", error);
        }
    }, []);

    // Effet initial et quand les filtres changent
    useEffect(() => {
        loadTransactions();
        loadStatistics();
    }, [loadTransactions, loadStatistics]);

    // Refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([loadTransactions(), loadStatistics()]);
        setRefreshing(false);
    };

    // Ajouter une transaction
    const handleAddTransaction = async () => {
        if (!title || !category || !amount) {
            setMessage('Veuillez remplir tous les champs obligatoires');
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);
            return;
        }

        try {
            setSubmitting(true);

            const newTransactionData = {
                type: transactionType,
                title,
                category,
                amount: parseFloat(amount),
                date: date.toISOString(),
                description: description || undefined,
            };

            await transactionService.create(newTransactionData);

            // Rafraîchir les données
            await Promise.all([loadTransactions(), loadStatistics()]);

            setShowAddModal(false);
            setMessage("Transaction ajoutée avec succès");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 6000);
            // return;
            // Reset form
            resetForm();
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Impossible d'ajouter la transaction");
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);
        } finally {
            setSubmitting(false);
        }
    };

    // Supprimer une transaction
    const handleDeleteTransaction = (transactionId: string) => {
        Alert.alert(
            "Confirmer la suppression",
            "Voulez-vous vraiment supprimer cette transaction ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await transactionService.delete(transactionId);
                            await Promise.all([loadTransactions(), loadStatistics()]);
                            setMessage("Transaction supprimée");
                            setShowAlert(true);
                            setTimeout(() => {
                                setShowAlert(false);
                            }, 6000);
                        } catch (error) {
                            Alert.alert("Erreur", "");
                            setMessage("Impossible de supprimer la transaction");
                            setShowAlertError(true);
                            setTimeout(() => {
                                setShowAlertError(false);
                            }, 6000);
                        }
                    },
                },
            ]
        );
    };

    const resetForm = () => {
        setTitle("");
        setCategory("");
        setAmount("");
        setDescription("");
        setDate(new Date());
        setTransactionType("EXPENSE");
    };

    // Grouper les transactions par date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const dateKey = formatDate(transaction.date);
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    const activeFiltersCount = [
        filterCategory !== "all",
        filterType !== "all",
        filterPeriod !== "all",
    ].filter(Boolean).length;

    if (loading && !refreshing) {
        return (
            <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <ThemedText style={{ marginTop: 16, color: theme.text }}>
                        Chargement...
                    </ThemedText>
                </View>
            </ThemedSafeAreaView>
        );
    }

    return (
        <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
            <View style={{ position: 'absolute' }}>
                {showAlert && (<CustomAlert message={message} title="Succès 🎉" />)}
                {showAlertError && (<CustomAlert message={message} title="Un erreur est survenu" />)}
            </View>
            {/* Modern Header */}
            <View style={[styles.modernHeader, { backgroundColor: isLight ? "#FFFFFF" : "#151515" }]}>
                <View style={styles.headerTop}>
                    <View>
                        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Transactions</ThemedText>
                        <ThemedText style={[styles.headerSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                            {transactions.length} transactions
                        </ThemedText>
                    </View>
                    <TouchableOpacity
                        style={styles.headerIconButton}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <Ionicons name="options-outline" size={24} color={theme.text} />
                        {activeFiltersCount > 0 && (
                            <View style={styles.modernFilterBadge}>
                                <ThemedText style={styles.filterBadgeText}>{activeFiltersCount}</ThemedText>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={{ width: "50%", height: 150, flexDirection: "column", justifyContent: "space-between", gap: 13 }}>
                        <View style={[styles.summaryCard, { height: 75, backgroundColor: isLight ? "#F8FFF9" : "#0D1F12" }]}>
                            <View style={styles.summaryIconContainer}>
                                <LinearGradient
                                    colors={["#4ADE80", "#22C55E"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.summaryIconGradient}
                                >
                                    <Ionicons name="arrow-down" size={16} color="#FFF" />
                                </LinearGradient>
                            </View>
                            <View style={styles.summaryInfo}>
                                <ThemedText style={[styles.summaryLabel, { color: isLight ? "#15803D" : "#86EFAC" }]}>
                                    Revenus
                                </ThemedText>
                                <ThemedText style={[styles.summaryAmount, { color: isLight ? "#15803D" : "#4ADE80" }]}>
                                    {formatCurrency(totalIncome)}
                                </ThemedText>
                            </View>
                        </View>

                        <View style={[styles.summaryCard, { height: 75, backgroundColor: isLight ? "#FFF5F5" : "#1F0D0D" }]}>
                            <View style={styles.summaryIconContainer}>
                                <LinearGradient
                                    colors={["#FF6B6B", "#EE5A52"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.summaryIconGradient}
                                >
                                    <Ionicons name="arrow-up" size={16} color="#FFF" />
                                </LinearGradient>
                            </View>
                            <View style={styles.summaryInfo}>
                                <ThemedText style={[styles.summaryLabel, { color: isLight ? "#B91C1C" : "#FCA5A5" }]}>
                                    Dépenses
                                </ThemedText>
                                <ThemedText style={[styles.summaryAmount, { color: isLight ? "#B91C1C" : "#FF6B6B" }]}>
                                    {formatCurrency(totalExpense)}
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: isLight ? "#fcf5f0ff" : "#1f120aff", width: "45%", height: 163, flexDirection: "column", justifyContent: "center", alignItems: "center" }]}>
                        <View style={[styles.summaryIconContainer, { marginTop: 25 }]}>
                            <LinearGradient
                                colors={["#FB923C", "#f17d3fff"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.summaryIconGradient}
                            >
                                <Ionicons name="wallet" size={16} color="#FFF" />
                            </LinearGradient>
                        </View>
                        <View style={[styles.summaryInfo, { alignItems: "center" }]}>
                            <ThemedText style={[styles.summaryLabel, { color: isLight ? "#FB923C" : "#f17d3fff" }]}>
                                Solde actuel
                            </ThemedText>
                            <ThemedText style={[styles.summaryAmount, { color: isLight ? "#FB923C" : "#f17d3fff" }]}>
                                {formatCurrency(soldeActuel)}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Modern Search Bar */}
                <View style={[styles.modernSearchBar, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                    <Ionicons name="search" size={20} color={isLight ? "#999" : "#666"} />
                    <TextInput
                        style={[styles.modernSearchInput, { color: theme.text }]}
                        placeholder="Rechercher une transaction..."
                        placeholderTextColor={isLight ? "#999" : "#666"}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={20} color={isLight ? "#999" : "#666"} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Transaction List */}
            <ScrollView
                style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : theme.background }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }
            >
                {Object.entries(groupedTransactions).map(([dateKey, items]) => (
                    <View key={dateKey} style={styles.dateSection}>
                        {/* Modern Date Header */}
                        <View style={styles.modernDateHeader}>
                            <View style={styles.dateHeaderLeft}>
                                <View style={[styles.dateBadge, { backgroundColor: Colors.primary + "15" }]}>
                                    <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
                                </View>
                                <ThemedText style={[styles.dateHeaderText, { color: theme.text }]}>
                                    {dateKey}
                                </ThemedText>
                            </View>
                            <View style={[styles.transactionCount, { backgroundColor: isLight ? "#F0F0F0" : "#1F1F1F" }]}>
                                <ThemedText style={[styles.countText, { color: isLight ? "#666" : "#AAA" }]}>
                                    {items.length}
                                </ThemedText>
                            </View>
                        </View>

                        {/* Transactions List */}
                        <View style={styles.transactionsList}>
                            {items.map((transaction) => {
                                const categoryData = [...CATEGORIES_EXPENSE, ...CATEGORIES_INCOME].find(
                                    (cat) => cat.name === transaction.category
                                );
                                const isIncome = transaction.type === "INCOME";

                                return (
                                    <TouchableOpacity
                                        key={transaction.id}
                                        style={[
                                            styles.modernTransactionCard,
                                            { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                                        ]}
                                        activeOpacity={0.7}
                                        onLongPress={() => handleDeleteTransaction(transaction.id)}
                                    >
                                        {/* Left Side */}
                                        <View style={styles.transactionLeft}>
                                            <LinearGradient
                                                colors={[
                                                    categoryData?.color || Colors.primary,
                                                    adjustColorBrightness(categoryData?.color || Colors.primary, -20)
                                                ]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={styles.modernIconContainer}
                                            >
                                                <Ionicons
                                                    name={categoryData?.icon as any || "wallet"}
                                                    size={22}
                                                    color="#FFF"
                                                />
                                            </LinearGradient>

                                            <View style={styles.transactionDetails}>
                                                <ThemedText style={[styles.modernTransactionTitle, { color: theme.text }]}>
                                                    {transaction.title}
                                                </ThemedText>
                                                <View style={styles.categoryBadge}>
                                                    <View
                                                        style={[
                                                            styles.categoryDot,
                                                            { backgroundColor: categoryData?.color || Colors.primary }
                                                        ]}
                                                    />
                                                    <ThemedText style={[styles.modernTransactionCategory, { color: isLight ? "#666" : "#AAA" }]}>
                                                        {transaction.category}
                                                    </ThemedText>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Right Side */}
                                        <View style={styles.transactionRight}>
                                            <ThemedText
                                                style={[
                                                    styles.modernTransactionAmount,
                                                    { color: isIncome ? "#4ADE80" : "#FF6B6B" },
                                                ]}
                                            >
                                                {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
                                            </ThemedText>
                                            <View
                                                style={[
                                                    styles.typeBadge,
                                                    { backgroundColor: isIncome ? "#4ADE8015" : "#FF6B6B15" }
                                                ]}
                                            >
                                                <Ionicons
                                                    name={isIncome ? "arrow-down-circle" : "arrow-up-circle"}
                                                    size={12}
                                                    color={isIncome ? "#4ADE80" : "#FF6B6B"}
                                                />
                                                <ThemedText
                                                    style={[
                                                        styles.typeBadgeText,
                                                        { color: isIncome ? "#4ADE80" : "#FF6B6B" }
                                                    ]}
                                                >
                                                    {isIncome ? "Revenu" : "Dépense"}
                                                </ThemedText>
                                            </View>
                                        </View>

                                        {/* Card Indicator */}
                                        <View style={[styles.cardIndicator, { backgroundColor: categoryData?.color || Colors.primary }]} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

                {transactions.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={64} color={isLight ? "#CCC" : "#444"} />
                        <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
                            Aucune transaction
                        </ThemedText>
                        <ThemedText style={[styles.emptyMessage, { color: isLight ? "#666" : "#AAA" }]}>
                            {searchQuery || activeFiltersCount > 0
                                ? "Essayez de modifier vos filtres"
                                : "Commencez par ajouter une transaction"}
                        </ThemedText>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Modern Add Button */}
            <TouchableOpacity
                style={styles.modernAddButton}
                onPress={() => setShowAddModal(true)}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={[Colors.primary, adjustColorBrightness(Colors.primary, -20)]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.addButtonGradient}
                >
                    <Ionicons name="add" size={28} color="#FFF" />
                </LinearGradient>
            </TouchableOpacity>

            {/* Add Transaction Modal */}
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
                            { backgroundColor: isLight ? "#FFF" : "#151515" },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <View>
                                <ThemedText style={[styles.modalTitle, { color: theme.text }]}>
                                    Nouvelle Transaction
                                </ThemedText>
                                <ThemedText style={[styles.modalSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                                    Ajoutez vos revenus ou dépenses
                                </ThemedText>
                            </View>
                            <TouchableOpacity
                                style={[styles.closeButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
                                onPress={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                            >
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Type Selector */}
                            <View style={styles.modernTypeSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.modernTypeButton,
                                        transactionType === "EXPENSE" && styles.typeButtonExpenseActive,
                                        { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }
                                    ]}
                                    onPress={() => setTransactionType("EXPENSE")}
                                    activeOpacity={0.7}
                                >
                                    {transactionType === "EXPENSE" && (
                                        <LinearGradient
                                            colors={["#FF6B6B", "#EE5A52"]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.typeButtonGradient}
                                        />
                                    )}
                                    <View style={styles.typeButtonContent}>
                                        <Ionicons
                                            name="arrow-up-circle"
                                            size={24}
                                            color={transactionType === "EXPENSE" ? "#FFF" : (isLight ? "#666" : "#AAA")}
                                        />
                                        <ThemedText
                                            style={[
                                                styles.modernTypeButtonText,
                                                { color: transactionType === "EXPENSE" ? "#FFF" : (isLight ? "#666" : "#AAA") }
                                            ]}
                                        >
                                            Dépense
                                        </ThemedText>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.modernTypeButton,
                                        transactionType === "INCOME" && styles.typeButtonIncomeActive,
                                        { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }
                                    ]}
                                    onPress={() => setTransactionType("INCOME")}
                                    activeOpacity={0.7}
                                >
                                    {transactionType === "INCOME" && (
                                        <LinearGradient
                                            colors={["#4ADE80", "#22C55E"]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.typeButtonGradient}
                                        />
                                    )}
                                    <View style={styles.typeButtonContent}>
                                        <Ionicons
                                            name="arrow-down-circle"
                                            size={24}
                                            color={transactionType === "INCOME" ? "#FFF" : (isLight ? "#666" : "#AAA")}
                                        />
                                        <ThemedText
                                            style={[
                                                styles.modernTypeButtonText,
                                                { color: transactionType === "INCOME" ? "#FFF" : (isLight ? "#666" : "#AAA") }
                                            ]}
                                        >
                                            Revenu
                                        </ThemedText>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Title Input */}
                            <View style={styles.modernInputGroup}>
                                <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Titre
                                </ThemedText>
                                <View style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                    <Ionicons name="pencil-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <TextInput
                                        style={[styles.modernInput, { color: theme.text }]}
                                        placeholder="Ex: Courses, Salaire..."
                                        placeholderTextColor={isLight ? "#999" : "#666"}
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                </View>
                            </View>

                            {/* Category Selector */}
                            <View style={styles.modernInputGroup}>
                                <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Catégorie
                                </ThemedText>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryScroll}
                                >
                                    {(transactionType === "EXPENSE"
                                        ? CATEGORIES_EXPENSE
                                        : CATEGORIES_INCOME
                                    ).map((cat) => (
                                        <TouchableOpacity
                                            key={cat.name}
                                            style={[
                                                styles.modernCategoryChip,
                                                {
                                                    backgroundColor:
                                                        category === cat.name
                                                            ? cat.color + "20"
                                                            : isLight
                                                                ? "#F5F5F5"
                                                                : "#1F1F1F",
                                                    borderColor:
                                                        category === cat.name
                                                            ? cat.color
                                                            : "transparent",
                                                },
                                            ]}
                                            onPress={() => setCategory(cat.name)}
                                            activeOpacity={0.7}
                                        >
                                            <View
                                                style={[
                                                    styles.categoryChipIcon,
                                                    { backgroundColor: category === cat.name ? cat.color + "30" : (isLight ? "#E5E5E5" : "#2A2A2A") }
                                                ]}
                                            >
                                                <Ionicons
                                                    name={cat.icon as any}
                                                    size={18}
                                                    color={category === cat.name ? cat.color : (isLight ? "#666" : "#AAA")}
                                                />
                                            </View>
                                            <ThemedText
                                                style={[
                                                    styles.modernCategoryChipText,
                                                    {
                                                        color:
                                                            category === cat.name
                                                                ? cat.color
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {cat.name}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Amount Input */}
                            <View style={styles.modernInputGroup}>
                                <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Montant
                                </ThemedText>
                                <View style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                    <Ionicons name="cash-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <TextInput
                                        style={[styles.modernInput, { color: theme.text }]}
                                        placeholder="0"
                                        placeholderTextColor={isLight ? "#999" : "#666"}
                                        keyboardType="numeric"
                                        value={amount}
                                        onChangeText={setAmount}
                                    />
                                    <ThemedText style={[styles.currencyLabel, { color: isLight ? "#999" : "#666" }]}>
                                        Ar
                                    </ThemedText>
                                </View>
                            </View>

                            {/* Date Picker */}
                            <View style={styles.modernInputGroup}>
                                <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Date
                                </ThemedText>
                                <TouchableOpacity
                                    style={[
                                        styles.modernInputContainer,
                                        { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }
                                    ]}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <ThemedText style={[styles.modernInput, { color: theme.text }]}>
                                        {date.toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </ThemedText>
                                    <Ionicons name="chevron-down" size={20} color={isLight ? "#999" : "#666"} />
                                </TouchableOpacity>
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) setDate(selectedDate);
                                    }}
                                />
                            )}

                            {/* Description Input */}
                            <View style={styles.modernInputGroup}>
                                <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Description (optionnel)
                                </ThemedText>
                                <View style={[styles.modernTextAreaContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                    <Ionicons name="document-text-outline" size={20} color={isLight ? "#999" : "#666"} style={styles.textAreaIcon} />
                                    <TextInput
                                        style={[styles.modernTextArea, { color: theme.text }]}
                                        placeholder="Ajouter une note..."
                                        placeholderTextColor={isLight ? "#999" : "#666"}
                                        multiline
                                        numberOfLines={3}
                                        value={description}
                                        onChangeText={setDescription}
                                    />
                                </View>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[
                                    styles.modernSubmitButton,
                                    (!title || !category || !amount || submitting) && styles.submitButtonDisabled,
                                ]}
                                onPress={handleAddTransaction}
                                disabled={!title || !category || !amount || submitting}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={(!title || !category || !amount || submitting)
                                        ? ["#CCC", "#AAA"]
                                        : [Colors.primary, adjustColorBrightness(Colors.primary, -20)]
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.submitButtonGradient}
                                >
                                    {submitting ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                            <ThemedText style={styles.modernSubmitButtonText}>
                                                Ajouter la transaction
                                            </ThemedText>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            styles.filterModal,
                            { backgroundColor: isLight ? "#FFF" : "#151515" },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <View>
                                <ThemedText style={[styles.modalTitle, { color: theme.text }]}>
                                    Filtres
                                </ThemedText>
                                <ThemedText style={[styles.modalSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                                    Affinez votre recherche
                                </ThemedText>
                            </View>
                            <TouchableOpacity
                                style={[styles.closeButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
                                onPress={() => setShowFilterModal(false)}
                            >
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Type Filter */}
                            <View style={styles.modernFilterSection}>
                                <View style={styles.filterSectionHeader}>
                                    <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
                                    <ThemedText style={[styles.modernFilterSectionTitle, { color: theme.text }]}>
                                        Type de transaction
                                    </ThemedText>
                                </View>
                                <View style={styles.modernFilterOptions}>
                                    {[
                                        { key: "all", label: "Toutes", icon: "list" },
                                        { key: "EXPENSE", label: "Dépenses", icon: "arrow-up-circle" },
                                        { key: "INCOME", label: "Revenus", icon: "arrow-down-circle" }
                                    ].map((type) => (
                                        <TouchableOpacity
                                            key={type.key}
                                            style={[
                                                styles.modernFilterOption,
                                                {
                                                    backgroundColor:
                                                        filterType === type.key
                                                            ? Colors.primary + "15"
                                                            : isLight
                                                                ? "#F5F5F5"
                                                                : "#1F1F1F",
                                                    borderColor:
                                                        filterType === type.key
                                                            ? Colors.primary
                                                            : "transparent",
                                                },
                                            ]}
                                            onPress={() => setFilterType(type.key as any)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={type.icon as any}
                                                size={20}
                                                color={filterType === type.key ? Colors.primary : (isLight ? "#666" : "#AAA")}
                                            />
                                            <ThemedText
                                                style={[
                                                    styles.modernFilterOptionText,
                                                    {
                                                        color:
                                                            filterType === type.key
                                                                ? Colors.primary
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {type.label}
                                            </ThemedText>
                                            {filterType === type.key && (
                                                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Period Filter */}
                            <View style={styles.modernFilterSection}>
                                <View style={styles.filterSectionHeader}>
                                    <Ionicons name="calendar" size={20} color={Colors.primary} />
                                    <ThemedText style={[styles.modernFilterSectionTitle, { color: theme.text }]}>
                                        Période
                                    </ThemedText>
                                </View>
                                <View style={styles.modernFilterOptions}>
                                    {[
                                        { key: "all", label: "Toutes", icon: "infinite" },
                                        { key: "today", label: "Aujourd'hui", icon: "today" },
                                        { key: "week", label: "Cette semaine", icon: "calendar-outline" },
                                        { key: "month", label: "Ce mois", icon: "calendar" },
                                    ].map((period) => (
                                        <TouchableOpacity
                                            key={period.key}
                                            style={[
                                                styles.modernFilterOption,
                                                {
                                                    backgroundColor:
                                                        filterPeriod === period.key
                                                            ? Colors.primary + "15"
                                                            : isLight
                                                                ? "#F5F5F5"
                                                                : "#1F1F1F",
                                                    borderColor:
                                                        filterPeriod === period.key
                                                            ? Colors.primary
                                                            : "transparent",
                                                },
                                            ]}
                                            onPress={() => setFilterPeriod(period.key)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={period.icon as any}
                                                size={20}
                                                color={filterPeriod === period.key ? Colors.primary : (isLight ? "#666" : "#AAA")}
                                            />
                                            <ThemedText
                                                style={[
                                                    styles.modernFilterOptionText,
                                                    {
                                                        color:
                                                            filterPeriod === period.key
                                                                ? Colors.primary
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {period.label}
                                            </ThemedText>
                                            {filterPeriod === period.key && (
                                                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.filterActions}>
                                <TouchableOpacity
                                    style={[styles.modernResetButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
                                    onPress={() => {
                                        setFilterType("all");
                                        setFilterPeriod("all");
                                        setFilterCategory("all");
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="refresh" size={20} color={theme.text} />
                                    <ThemedText style={[styles.modernResetButtonText, { color: theme.text }]}>
                                        Réinitialiser
                                    </ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modernApplyButton}
                                    onPress={() => setShowFilterModal(false)}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={[Colors.primary, adjustColorBrightness(Colors.primary, -20)]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.applyButtonGradient}
                                    >
                                        <Ionicons name="checkmark" size={20} color="#FFF" />
                                        <ThemedText style={styles.modernApplyButtonText}>
                                            Appliquer
                                        </ThemedText>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ThemedSafeAreaView>
    );
}


// import React, { useState } from "react";
// import {
//     View,
//     ScrollView,
//     useColorScheme,
//     TouchableOpacity,
//     TextInput,
//     Modal,
//     Dimensions,
// } from "react-native";
// import { Colors } from "@/constant/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
// import { LinearGradient } from "expo-linear-gradient";
// import ThemedText from "@/components/ThemedText";
// import styles from "@/styles/transaction";

// // Types
// interface Transaction {
//     id: string;
//     type: "expense" | "income";
//     title: string;
//     category: string;
//     amount: number;
//     date: Date;
//     description?: string;
// }

// // Données d'exemple
// const SAMPLE_TRANSACTIONS: Transaction[] = [
//     {
//         id: "1",
//         type: "expense",
//         title: "Courses Shoprite",
//         category: "Alimentation",
//         amount: 45000,
//         date: new Date(2025, 9, 10),
//         description: "Courses hebdomadaires",
//     },
//     {
//         id: "2",
//         type: "income",
//         title: "Salaire",
//         category: "Salaire",
//         amount: 500000,
//         date: new Date(2025, 9, 5),
//     },
//     {
//         id: "3",
//         type: "expense",
//         title: "Taxi",
//         category: "Transport",
//         amount: 8000,
//         date: new Date(2025, 9, 9),
//     },
//     {
//         id: "4",
//         type: "expense",
//         title: "Restaurant",
//         category: "Alimentation",
//         amount: 35000,
//         date: new Date(2025, 9, 8),
//     },
//     {
//         id: "5",
//         type: "income",
//         title: "Freelance",
//         category: "Travail",
//         amount: 150000,
//         date: new Date(2025, 9, 7),
//     },
// ];

// const CATEGORIES_EXPENSE = [
//     { name: "Alimentation", icon: "restaurant", color: "#FF6B6B" },
//     { name: "Transport", icon: "car", color: "#4ECDC4" },
//     { name: "Logement", icon: "home", color: "#45B7D1" },
//     { name: "Loisirs", icon: "game-controller", color: "#FFA07A" },
//     { name: "Santé", icon: "medical", color: "#98D8C8" },
//     { name: "Shopping", icon: "cart", color: "#F7DC6F" },
//     { name: "Autres", icon: "ellipsis-horizontal", color: "#BDC3C7" },
// ];

// const CATEGORIES_INCOME = [
//     { name: "Salaire", icon: "briefcase", color: "#4ADE80" },
//     { name: "Freelance", icon: "laptop", color: "#22D3EE" },
//     { name: "Investissement", icon: "trending-up", color: "#A78BFA" },
//     { name: "Autres", icon: "ellipsis-horizontal", color: "#BDC3C7" },
// ];

// const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("fr-MG", {
//         style: "currency",
//         currency: "MGA",
//         minimumFractionDigits: 0,
//     }).format(amount);
// };

// const formatDate = (date: Date) => {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
//     if (date.toDateString() === yesterday.toDateString()) return "Hier";

//     return date.toLocaleDateString("fr-FR", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//     });
// };

// const adjustColorBrightness = (color: string, amount: number): string => {
//     const num = parseInt(color.replace("#", ""), 16);
//     const r = Math.max(0, Math.min(255, (num >> 16) + amount));
//     const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
//     const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
//     return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
// };

// export default function TransactionPage() {
//     const colorScheme = useColorScheme();
//     const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
//     const isLight = theme === Colors.light;

//     const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showFilterModal, setShowFilterModal] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");

//     // Form states
//     const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
//     const [title, setTitle] = useState("");
//     const [category, setCategory] = useState("");
//     const [amount, setAmount] = useState("");
//     const [date, setDate] = useState(new Date());
//     const [description, setDescription] = useState("");
//     const [showDatePicker, setShowDatePicker] = useState(false);

//     // Filter states
//     const [filterCategory, setFilterCategory] = useState<string>("all");
//     const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
//     const [filterPeriod, setFilterPeriod] = useState<string>("all");

//     const handleAddTransaction = () => {
//         const newTransaction: Transaction = {
//             id: Date.now().toString(),
//             type: transactionType,
//             title,
//             category,
//             amount: parseFloat(amount),
//             date,
//             description,
//         };

//         setTransactions([newTransaction, ...transactions]);
//         setShowAddModal(false);

//         // Reset form
//         setTitle("");
//         setCategory("");
//         setAmount("");
//         setDescription("");
//         setDate(new Date());
//     };

//     const filteredTransactions = transactions.filter((transaction) => {
//         const matchesSearch =
//             transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

//         const matchesCategory =
//             filterCategory === "all" || transaction.category === filterCategory;

//         const matchesType = filterType === "all" || transaction.type === filterType;

//         let matchesPeriod = true;
//         if (filterPeriod !== "all") {
//             const today = new Date();
//             const transactionDate = transaction.date;

//             if (filterPeriod === "today") {
//                 matchesPeriod = transactionDate.toDateString() === today.toDateString();
//             } else if (filterPeriod === "week") {
//                 const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
//                 matchesPeriod = transactionDate >= weekAgo;
//             } else if (filterPeriod === "month") {
//                 matchesPeriod = transactionDate.getMonth() === today.getMonth();
//             }
//         }

//         return matchesSearch && matchesCategory && matchesType && matchesPeriod;
//     });

//     // Group transactions by date
//     const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
//         const dateKey = formatDate(transaction.date);
//         if (!groups[dateKey]) {
//             groups[dateKey] = [];
//         }
//         groups[dateKey].push(transaction);
//         return groups;
//     }, {} as Record<string, Transaction[]>);

//     const activeFiltersCount = [
//         filterCategory !== "all",
//         filterType !== "all",
//         filterPeriod !== "all",
//     ].filter(Boolean).length;

//     // Calculate totals
//     const totalIncome = transactions
//         .filter(t => t.type === "income")
//         .reduce((sum, t) => sum + t.amount, 0);
//     const totalExpense = transactions
//         .filter(t => t.type === "expense")
//         .reduce((sum, t) => sum + t.amount, 0);

//     return (
//         <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
//             {/* Modern Header */}
//             <View style={[styles.modernHeader, { backgroundColor: isLight ? "#FFFFFF" : "#151515" }]}>
//                 <View style={styles.headerTop}>
//                     <View>
//                         <ThemedText style={[styles.headerTitle, { color: theme.text }]}>Transactions</ThemedText>
//                         <ThemedText style={[styles.headerSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
//                             {filteredTransactions.length} transactions
//                         </ThemedText>
//                     </View>
//                     <TouchableOpacity
//                         style={styles.headerIconButton}
//                         onPress={() => setShowFilterModal(true)}
//                     >
//                         <Ionicons name="options-outline" size={24} color={theme.text} />
//                         {activeFiltersCount > 0 && (
//                             <View style={styles.modernFilterBadge}>
//                                 <ThemedText style={styles.filterBadgeText}>{activeFiltersCount}</ThemedText>
//                             </View>
//                         )}
//                     </TouchableOpacity>
//                 </View>

//                 {/* Summary Cards */}
//                 <View style={styles.summaryContainer}>
//                     <View style={[styles.summaryCard, { backgroundColor: isLight ? "#F8FFF9" : "#0D1F12" }]}>
//                         <View style={styles.summaryIconContainer}>
//                             <LinearGradient
//                                 colors={["#4ADE80", "#22C55E"]}
//                                 start={{ x: 0, y: 0 }}
//                                 end={{ x: 1, y: 1 }}
//                                 style={styles.summaryIconGradient}
//                             >
//                                 <Ionicons name="arrow-down" size={16} color="#FFF" />
//                             </LinearGradient>
//                         </View>
//                         <View style={styles.summaryInfo}>
//                             <ThemedText style={[styles.summaryLabel, { color: isLight ? "#15803D" : "#86EFAC" }]}>
//                                 Revenus
//                             </ThemedText>
//                             <ThemedText style={[styles.summaryAmount, { color: isLight ? "#15803D" : "#4ADE80" }]}>
//                                 {formatCurrency(totalIncome)}
//                             </ThemedText>
//                         </View>
//                     </View>

//                     <View style={[styles.summaryCard, { backgroundColor: isLight ? "#FFF5F5" : "#1F0D0D" }]}>
//                         <View style={styles.summaryIconContainer}>
//                             <LinearGradient
//                                 colors={["#FF6B6B", "#EE5A52"]}
//                                 start={{ x: 0, y: 0 }}
//                                 end={{ x: 1, y: 1 }}
//                                 style={styles.summaryIconGradient}
//                             >
//                                 <Ionicons name="arrow-up" size={16} color="#FFF" />
//                             </LinearGradient>
//                         </View>
//                         <View style={styles.summaryInfo}>
//                             <ThemedText style={[styles.summaryLabel, { color: isLight ? "#B91C1C" : "#FCA5A5" }]}>
//                                 Dépenses
//                             </ThemedText>
//                             <ThemedText style={[styles.summaryAmount, { color: isLight ? "#B91C1C" : "#FF6B6B" }]}>
//                                 {formatCurrency(totalExpense)}
//                             </ThemedText>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Modern Search Bar */}
//                 <View style={[styles.modernSearchBar, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
//                     <Ionicons name="search" size={20} color={isLight ? "#999" : "#666"} />
//                     <TextInput
//                         style={[styles.modernSearchInput, { color: theme.text }]}
//                         placeholder="Rechercher une transaction..."
//                         placeholderTextColor={isLight ? "#999" : "#666"}
//                         value={searchQuery}
//                         onChangeText={setSearchQuery}
//                     />
//                     {searchQuery.length > 0 && (
//                         <TouchableOpacity onPress={() => setSearchQuery("")}>
//                             <Ionicons name="close-circle" size={20} color={isLight ? "#999" : "#666"} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>

//             {/* Transaction List */}
//             <ScrollView
//                 style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : theme.background }]}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {Object.entries(groupedTransactions).map(([dateKey, items]) => (
//                     <View key={dateKey} style={styles.dateSection}>
//                         {/* Modern Date Header */}
//                         <View style={styles.modernDateHeader}>
//                             <View style={styles.dateHeaderLeft}>
//                                 <View style={[styles.dateBadge, { backgroundColor: Colors.primary + "15" }]}>
//                                     <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
//                                 </View>
//                                 <ThemedText style={[styles.dateHeaderText, { color: theme.text }]}>
//                                     {dateKey}
//                                 </ThemedText>
//                             </View>
//                             <View style={[styles.transactionCount, { backgroundColor: isLight ? "#F0F0F0" : "#1F1F1F" }]}>
//                                 <ThemedText style={[styles.countText, { color: isLight ? "#666" : "#AAA" }]}>
//                                     {items.length}
//                                 </ThemedText>
//                             </View>
//                         </View>

//                         {/* Transactions List */}
//                         <View style={styles.transactionsList}>
//                             {items.map((transaction, index) => {
//                                 const categoryData = [...CATEGORIES_EXPENSE, ...CATEGORIES_INCOME].find(
//                                     (cat) => cat.name === transaction.category
//                                 );
//                                 const isIncome = transaction.type === "income";

//                                 return (
//                                     <TouchableOpacity
//                                         key={transaction.id}
//                                         style={[
//                                             styles.modernTransactionCard,
//                                             { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
//                                         ]}
//                                         activeOpacity={0.7}
//                                     >
//                                         {/* Left Side */}
//                                         <View style={styles.transactionLeft}>
//                                             <LinearGradient
//                                                 colors={[
//                                                     categoryData?.color || Colors.primary,
//                                                     adjustColorBrightness(categoryData?.color || Colors.primary, -20)
//                                                 ]}
//                                                 start={{ x: 0, y: 0 }}
//                                                 end={{ x: 1, y: 1 }}
//                                                 style={styles.modernIconContainer}
//                                             >
//                                                 <Ionicons
//                                                     name={categoryData?.icon as any || "wallet"}
//                                                     size={22}
//                                                     color="#FFF"
//                                                 />
//                                             </LinearGradient>

//                                             <View style={styles.transactionDetails}>
//                                                 <ThemedText style={[styles.modernTransactionTitle, { color: theme.text }]}>
//                                                     {transaction.title}
//                                                 </ThemedText>
//                                                 <View style={styles.categoryBadge}>
//                                                     <View
//                                                         style={[
//                                                             styles.categoryDot,
//                                                             { backgroundColor: categoryData?.color || Colors.primary }
//                                                         ]}
//                                                     />
//                                                     <ThemedText style={[styles.modernTransactionCategory, { color: isLight ? "#666" : "#AAA" }]}>
//                                                         {transaction.category}
//                                                     </ThemedText>
//                                                 </View>
//                                             </View>
//                                         </View>

//                                         {/* Right Side */}
//                                         <View style={styles.transactionRight}>
//                                             <ThemedText
//                                                 style={[
//                                                     styles.modernTransactionAmount,
//                                                     { color: isIncome ? "#4ADE80" : "#FF6B6B" },
//                                                 ]}
//                                             >
//                                                 {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
//                                             </ThemedText>
//                                             <View
//                                                 style={[
//                                                     styles.typeBadge,
//                                                     { backgroundColor: isIncome ? "#4ADE8015" : "#FF6B6B15" }
//                                                 ]}
//                                             >
//                                                 <Ionicons
//                                                     name={isIncome ? "arrow-down-circle" : "arrow-up-circle"}
//                                                     size={12}
//                                                     color={isIncome ? "#4ADE80" : "#FF6B6B"}
//                                                 />
//                                                 <ThemedText
//                                                     style={[
//                                                         styles.typeBadgeText,
//                                                         { color: isIncome ? "#4ADE80" : "#FF6B6B" }
//                                                     ]}
//                                                 >
//                                                     {isIncome ? "Revenu" : "Dépense"}
//                                                 </ThemedText>
//                                             </View>
//                                         </View>

//                                         {/* Card Indicator */}
//                                         <View style={[styles.cardIndicator, { backgroundColor: categoryData?.color || Colors.primary }]} />
//                                     </TouchableOpacity>
//                                 );
//                             })}
//                         </View>
//                     </View>
//                 ))}

//                 {filteredTransactions.length === 0 && (
//                     <View style={styles.emptyState}>
//                         <Ionicons name="receipt-outline" size={64} color={isLight ? "#CCC" : "#444"} />
//                         <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
//                             Aucune transaction
//                         </ThemedText>
//                         <ThemedText style={[styles.emptyMessage, { color: isLight ? "#666" : "#AAA" }]}>
//                             {searchQuery || activeFiltersCount > 0
//                                 ? "Essayez de modifier vos filtres"
//                                 : "Commencez par ajouter une transaction"}
//                         </ThemedText>
//                     </View>
//                 )}

//                 <View style={{ height: 100 }} />
//             </ScrollView>

//             {/* Modern Add Button */}
//             <TouchableOpacity
//                 style={styles.modernAddButton}
//                 onPress={() => setShowAddModal(true)}
//                 activeOpacity={0.9}
//             >
//                 <LinearGradient
//                     colors={[Colors.primary, adjustColorBrightness(Colors.primary, -20)]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.addButtonGradient}
//                 >
//                     <Ionicons name="add" size={28} color="#FFF" />
//                 </LinearGradient>
//             </TouchableOpacity>

//             {/* Add Transaction Modal */}
//             <Modal
//                 visible={showAddModal}
//                 animationType="slide"
//                 transparent
//                 onRequestClose={() => setShowAddModal(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View
//                         style={[
//                             styles.modalContent,
//                             { backgroundColor: isLight ? "#FFF" : "#151515" },
//                         ]}
//                     >
//                         <View style={styles.modalHeader}>
//                             <View>
//                                 <ThemedText style={[styles.modalTitle, { color: theme.text }]}>
//                                     Nouvelle Transaction
//                                 </ThemedText>
//                                 <ThemedText style={[styles.modalSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
//                                     Ajoutez vos revenus ou dépenses
//                                 </ThemedText>
//                             </View>
//                             <TouchableOpacity
//                                 style={[styles.closeButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
//                                 onPress={() => setShowAddModal(false)}
//                             >
//                                 <Ionicons name="close" size={24} color={theme.text} />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             {/* Type Selector */}
//                             <View style={styles.modernTypeSelector}>
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.modernTypeButton,
//                                         transactionType === "expense" && styles.typeButtonExpenseActive,
//                                         { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }
//                                     ]}
//                                     onPress={() => setTransactionType("expense")}
//                                     activeOpacity={0.7}
//                                 >
//                                     {transactionType === "expense" && (
//                                         <LinearGradient
//                                             colors={["#FF6B6B", "#EE5A52"]}
//                                             start={{ x: 0, y: 0 }}
//                                             end={{ x: 1, y: 1 }}
//                                             style={styles.typeButtonGradient}
//                                         />
//                                     )}
//                                     <View style={styles.typeButtonContent}>
//                                         <Ionicons
//                                             name="arrow-up-circle"
//                                             size={24}
//                                             color={transactionType === "expense" ? "#FFF" : (isLight ? "#666" : "#AAA")}
//                                         />
//                                         <ThemedText
//                                             style={[
//                                                 styles.modernTypeButtonText,
//                                                 { color: transactionType === "expense" ? "#FFF" : (isLight ? "#666" : "#AAA") }
//                                             ]}
//                                         >
//                                             Dépense
//                                         </ThemedText>
//                                     </View>
//                                 </TouchableOpacity>

//                                 <TouchableOpacity
//                                     style={[
//                                         styles.modernTypeButton,
//                                         transactionType === "income" && styles.typeButtonIncomeActive,
//                                         { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }
//                                     ]}
//                                     onPress={() => setTransactionType("income")}
//                                     activeOpacity={0.7}
//                                 >
//                                     {transactionType === "income" && (
//                                         <LinearGradient
//                                             colors={["#4ADE80", "#22C55E"]}
//                                             start={{ x: 0, y: 0 }}
//                                             end={{ x: 1, y: 1 }}
//                                             style={styles.typeButtonGradient}
//                                         />
//                                     )}
//                                     <View style={styles.typeButtonContent}>
//                                         <Ionicons
//                                             name="arrow-down-circle"
//                                             size={24}
//                                             color={transactionType === "income" ? "#FFF" : (isLight ? "#666" : "#AAA")}
//                                         />
//                                         <ThemedText
//                                             style={[
//                                                 styles.modernTypeButtonText,
//                                                 { color: transactionType === "income" ? "#FFF" : (isLight ? "#666" : "#AAA") }
//                                             ]}
//                                         >
//                                             Revenu
//                                         </ThemedText>
//                                     </View>
//                                 </TouchableOpacity>
//                             </View>

//                             {/* Title Input */}
//                             <View style={styles.modernInputGroup}>
//                                 <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
//                                     Titre
//                                 </ThemedText>
//                                 <View style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
//                                     <Ionicons name="pencil-outline" size={20} color={isLight ? "#999" : "#666"} />
//                                     <TextInput
//                                         style={[styles.modernInput, { color: theme.text }]}
//                                         placeholder="Ex: Courses, Salaire..."
//                                         placeholderTextColor={isLight ? "#999" : "#666"}
//                                         value={title}
//                                         onChangeText={setTitle}
//                                     />
//                                 </View>
//                             </View>

//                             {/* Category Selector */}
//                             <View style={styles.modernInputGroup}>
//                                 <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
//                                     Catégorie
//                                 </ThemedText>
//                                 <ScrollView
//                                     horizontal
//                                     showsHorizontalScrollIndicator={false}
//                                     style={styles.categoryScroll}
//                                 >
//                                     {(transactionType === "expense"
//                                         ? CATEGORIES_EXPENSE
//                                         : CATEGORIES_INCOME
//                                     ).map((cat) => (
//                                         <TouchableOpacity
//                                             key={cat.name}
//                                             style={[
//                                                 styles.modernCategoryChip,
//                                                 {
//                                                     backgroundColor:
//                                                         category === cat.name
//                                                             ? cat.color + "20"
//                                                             : isLight
//                                                                 ? "#F5F5F5"
//                                                                 : "#1F1F1F",
//                                                     borderColor:
//                                                         category === cat.name
//                                                             ? cat.color
//                                                             : "transparent",
//                                                 },
//                                             ]}
//                                             onPress={() => setCategory(cat.name)}
//                                             activeOpacity={0.7}
//                                         >
//                                             <View
//                                                 style={[
//                                                     styles.categoryChipIcon,
//                                                     { backgroundColor: category === cat.name ? cat.color + "30" : (isLight ? "#E5E5E5" : "#2A2A2A") }
//                                                 ]}
//                                             >
//                                                 <Ionicons
//                                                     name={cat.icon as any}
//                                                     size={18}
//                                                     color={category === cat.name ? cat.color : (isLight ? "#666" : "#AAA")}
//                                                 />
//                                             </View>
//                                             <ThemedText
//                                                 style={[
//                                                     styles.modernCategoryChipText,
//                                                     {
//                                                         color:
//                                                             category === cat.name
//                                                                 ? cat.color
//                                                                 : theme.text,
//                                                     },
//                                                 ]}
//                                             >
//                                                 {cat.name}
//                                             </ThemedText>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </ScrollView>
//                             </View>

//                             {/* Amount Input */}
//                             <View style={styles.modernInputGroup}>
//                                 <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
//                                     Montant
//                                 </ThemedText>
//                                 <View style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
//                                     <Ionicons name="cash-outline" size={20} color={isLight ? "#999" : "#666"} />
//                                     <TextInput
//                                         style={[styles.modernInput, { color: theme.text }]}
//                                         placeholder="0"
//                                         placeholderTextColor={isLight ? "#999" : "#666"}
//                                         keyboardType="numeric"
//                                         value={amount}
//                                         onChangeText={setAmount}
//                                     />
//                                     <ThemedText style={[styles.currencyLabel, { color: isLight ? "#999" : "#666" }]}>
//                                         Ar
//                                     </ThemedText>
//                                 </View>
//                             </View>

//                             {/* Date Picker */}
//                             <View style={styles.modernInputGroup}>
//                                 <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
//                                     Date
//                                 </ThemedText>
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.modernInputContainer,
//                                         { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }
//                                     ]}
//                                     onPress={() => setShowDatePicker(true)}
//                                 >
//                                     <Ionicons name="calendar-outline" size={20} color={isLight ? "#999" : "#666"} />
//                                     <ThemedText style={[styles.modernInput, { color: theme.text }]}>
//                                         {date.toLocaleDateString("fr-FR", {
//                                             day: "numeric",
//                                             month: "long",
//                                             year: "numeric",
//                                         })}
//                                     </ThemedText>
//                                     <Ionicons name="chevron-down" size={20} color={isLight ? "#999" : "#666"} />
//                                 </TouchableOpacity>
//                             </View>

//                             {showDatePicker && (
//                                 <DateTimePicker
//                                     value={date}
//                                     mode="date"
//                                     display="default"
//                                     onChange={(event, selectedDate) => {
//                                         setShowDatePicker(false);
//                                         if (selectedDate) setDate(selectedDate);
//                                     }}
//                                 />
//                             )}

//                             {/* Description Input */}
//                             <View style={styles.modernInputGroup}>
//                                 <ThemedText style={[styles.modernInputLabel, { color: theme.text }]}>
//                                     Description (optionnel)
//                                 </ThemedText>
//                                 <View style={[styles.modernTextAreaContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
//                                     <Ionicons name="document-text-outline" size={20} color={isLight ? "#999" : "#666"} style={styles.textAreaIcon} />
//                                     <TextInput
//                                         style={[styles.modernTextArea, { color: theme.text }]}
//                                         placeholder="Ajouter une note..."
//                                         placeholderTextColor={isLight ? "#999" : "#666"}
//                                         multiline
//                                         numberOfLines={3}
//                                         value={description}
//                                         onChangeText={setDescription}
//                                     />
//                                 </View>
//                             </View>

//                             {/* Submit Button */}
//                             <TouchableOpacity
//                                 style={[
//                                     styles.modernSubmitButton,
//                                     (!title || !category || !amount) && styles.submitButtonDisabled,
//                                 ]}
//                                 onPress={handleAddTransaction}
//                                 disabled={!title || !category || !amount}
//                                 activeOpacity={0.8}
//                             >
//                                 <LinearGradient
//                                     colors={(!title || !category || !amount)
//                                         ? ["#CCC", "#AAA"]
//                                         : [Colors.primary, adjustColorBrightness(Colors.primary, -20)]
//                                     }
//                                     start={{ x: 0, y: 0 }}
//                                     end={{ x: 1, y: 1 }}
//                                     style={styles.submitButtonGradient}
//                                 >
//                                     <Ionicons name="checkmark-circle" size={24} color="#FFF" />
//                                     <ThemedText style={styles.modernSubmitButtonText}>
//                                         Ajouter la transaction
//                                     </ThemedText>
//                                 </LinearGradient>
//                             </TouchableOpacity>
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>

//             {/* Filter Modal */}
//             <Modal
//                 visible={showFilterModal}
//                 animationType="slide"
//                 transparent
//                 onRequestClose={() => setShowFilterModal(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View
//                         style={[
//                             styles.modalContent,
//                             styles.filterModal,
//                             { backgroundColor: isLight ? "#FFF" : "#151515" },
//                         ]}
//                     >
//                         <View style={styles.modalHeader}>
//                             <View>
//                                 <ThemedText style={[styles.modalTitle, { color: theme.text }]}>
//                                     Filtres
//                                 </ThemedText>
//                                 <ThemedText style={[styles.modalSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
//                                     Affinez votre recherche
//                                 </ThemedText>
//                             </View>
//                             <TouchableOpacity
//                                 style={[styles.closeButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
//                                 onPress={() => setShowFilterModal(false)}
//                             >
//                                 <Ionicons name="close" size={24} color={theme.text} />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             {/* Type Filter */}
//                             <View style={styles.modernFilterSection}>
//                                 <View style={styles.filterSectionHeader}>
//                                     <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
//                                     <ThemedText style={[styles.modernFilterSectionTitle, { color: theme.text }]}>
//                                         Type de transaction
//                                     </ThemedText>
//                                 </View>
//                                 <View style={styles.modernFilterOptions}>
//                                     {[
//                                         { key: "all", label: "Toutes", icon: "list" },
//                                         { key: "expense", label: "Dépenses", icon: "arrow-up-circle" },
//                                         { key: "income", label: "Revenus", icon: "arrow-down-circle" }
//                                     ].map((type) => (
//                                         <TouchableOpacity
//                                             key={type.key}
//                                             style={[
//                                                 styles.modernFilterOption,
//                                                 {
//                                                     backgroundColor:
//                                                         filterType === type.key
//                                                             ? Colors.primary + "15"
//                                                             : isLight
//                                                                 ? "#F5F5F5"
//                                                                 : "#1F1F1F",
//                                                     borderColor:
//                                                         filterType === type.key
//                                                             ? Colors.primary
//                                                             : "transparent",
//                                                 },
//                                             ]}
//                                             onPress={() => setFilterType(type.key as any)}
//                                             activeOpacity={0.7}
//                                         >
//                                             <Ionicons
//                                                 name={type.icon as any}
//                                                 size={20}
//                                                 color={filterType === type.key ? Colors.primary : (isLight ? "#666" : "#AAA")}
//                                             />
//                                             <ThemedText
//                                                 style={[
//                                                     styles.modernFilterOptionText,
//                                                     {
//                                                         color:
//                                                             filterType === type.key
//                                                                 ? Colors.primary
//                                                                 : theme.text,
//                                                     },
//                                                 ]}
//                                             >
//                                                 {type.label}
//                                             </ThemedText>
//                                             {filterType === type.key && (
//                                                 <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
//                                             )}
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>
//                             </View>

//                             {/* Period Filter */}
//                             <View style={styles.modernFilterSection}>
//                                 <View style={styles.filterSectionHeader}>
//                                     <Ionicons name="calendar" size={20} color={Colors.primary} />
//                                     <ThemedText style={[styles.modernFilterSectionTitle, { color: theme.text }]}>
//                                         Période
//                                     </ThemedText>
//                                 </View>
//                                 <View style={styles.modernFilterOptions}>
//                                     {[
//                                         { key: "all", label: "Toutes", icon: "infinite" },
//                                         { key: "today", label: "Aujourd'hui", icon: "today" },
//                                         { key: "week", label: "Cette semaine", icon: "calendar-outline" },
//                                         { key: "month", label: "Ce mois", icon: "calendar" },
//                                     ].map((period) => (
//                                         <TouchableOpacity
//                                             key={period.key}
//                                             style={[
//                                                 styles.modernFilterOption,
//                                                 {
//                                                     backgroundColor:
//                                                         filterPeriod === period.key
//                                                             ? Colors.primary + "15"
//                                                             : isLight
//                                                                 ? "#F5F5F5"
//                                                                 : "#1F1F1F",
//                                                     borderColor:
//                                                         filterPeriod === period.key
//                                                             ? Colors.primary
//                                                             : "transparent",
//                                                 },
//                                             ]}
//                                             onPress={() => setFilterPeriod(period.key)}
//                                             activeOpacity={0.7}
//                                         >
//                                             <Ionicons
//                                                 name={period.icon as any}
//                                                 size={20}
//                                                 color={filterPeriod === period.key ? Colors.primary : (isLight ? "#666" : "#AAA")}
//                                             />
//                                             <ThemedText
//                                                 style={[
//                                                     styles.modernFilterOptionText,
//                                                     {
//                                                         color:
//                                                             filterPeriod === period.key
//                                                                 ? Colors.primary
//                                                                 : theme.text,
//                                                     },
//                                                 ]}
//                                             >
//                                                 {period.label}
//                                             </ThemedText>
//                                             {filterPeriod === period.key && (
//                                                 <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
//                                             )}
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>
//                             </View>

//                             {/* Action Buttons */}
//                             <View style={styles.filterActions}>
//                                 <TouchableOpacity
//                                     style={[styles.modernResetButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
//                                     onPress={() => {
//                                         setFilterType("all");
//                                         setFilterPeriod("all");
//                                         setFilterCategory("all");
//                                     }}
//                                     activeOpacity={0.7}
//                                 >
//                                     <Ionicons name="refresh" size={20} color={theme.text} />
//                                     <ThemedText style={[styles.modernResetButtonText, { color: theme.text }]}>
//                                         Réinitialiser
//                                     </ThemedText>
//                                 </TouchableOpacity>

//                                 <TouchableOpacity
//                                     style={styles.modernApplyButton}
//                                     onPress={() => setShowFilterModal(false)}
//                                     activeOpacity={0.8}
//                                 >
//                                     <LinearGradient
//                                         colors={[Colors.primary, adjustColorBrightness(Colors.primary, -20)]}
//                                         start={{ x: 0, y: 0 }}
//                                         end={{ x: 1, y: 1 }}
//                                         style={styles.applyButtonGradient}
//                                     >
//                                         <Ionicons name="checkmark" size={20} color="#FFF" />
//                                         <ThemedText style={styles.modernApplyButtonText}>
//                                             Appliquer
//                                         </ThemedText>
//                                     </LinearGradient>
//                                 </TouchableOpacity>
//                             </View>
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>
//         </ThemedSafeAreaView>
//     );
// }