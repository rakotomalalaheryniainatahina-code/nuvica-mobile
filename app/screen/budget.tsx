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
import Svg, { Circle } from "react-native-svg";
import styles from "@/styles/budget";
import { budgetService, BudgetResponse } from "@/services/budgetService";
import CustomAlert from "@/common/customAlert";

const CATEGORIES = [
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

const PERIODS = [
    { key: "DAILY", label: "Journalier", icon: "today" },
    { key: "WEEKLY", label: "Hebdomadaire", icon: "calendar-outline" },
    { key: "MONTHLY", label: "Mensuel", icon: "calendar" },
    { key: "YEARLY", label: "Annuel", icon: "calendar-sharp" },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
        style: "currency",
        currency: "MGA",
        minimumFractionDigits: 0,
    }).format(amount);
};

const adjustColorBrightness = (color: string, amount: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

export default function BudgetPage() {
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light;
    const isLight = theme === Colors.light;

    const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);

    // Form states
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [period, setPeriod] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Summary states
    const [summary, setSummary] = useState({
        totalBudget: 0,
        totalSpent: 0,
        totalRemaining: 0,
        overBudget: 0,
        nearLimit: 0,
    });

    // Charger les budgets
    const loadBudgets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await budgetService.getAll();
            setBudgets(data);

            // Charger le résumé
            const summaryData = await budgetService.getSummary();
            setSummary(summaryData);
        } catch (error) {
            console.error("Erreur lors du chargement des budgets:", error);
            Alert.alert("Erreur", "Impossible de charger les budgets");
        } finally {
            setLoading(false);
        }
    }, []);

    // Refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await loadBudgets();
        setRefreshing(false);
    };

    useEffect(() => {
        loadBudgets();
    }, [loadBudgets]);

    // Calculer les dates par défaut selon la période
    const calculateDates = (selectedPeriod: string) => {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        switch (selectedPeriod) {
            case "DAILY":
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
                break;
            case "WEEKLY":
                start = new Date(now.setDate(now.getDate() - now.getDay()));
                end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                break;
            case "MONTHLY":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case "YEARLY":
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
        }

        setStartDate(start);
        setEndDate(end);
    };

    // Ajouter un budget
    const handleAddBudget = async () => {
        if (!category || !amount) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            setSubmitting(true);

            const newBudgetData = {
                category,
                amount: parseFloat(amount),
                period,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };

            await budgetService.create(newBudgetData);
            await loadBudgets();

            setShowAddModal(false);
            setMessage("Budget créé avec succès");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 6000);


            resetForm();
        } catch (error: any) {
            console.error("Erreur lors de l'ajout:", error);
            setMessage(error.response?.data?.message || "Impossible d'ajouter le budget");
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);
        } finally {
            setSubmitting(false);
        }
    };

    // Supprimer un budget
    const handleDeleteBudget = (budgetId: string, categoryName: string) => {
        Alert.alert(
            "Confirmer la suppression",
            `Voulez-vous vraiment supprimer le budget "${categoryName}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await budgetService.delete(budgetId);
                            await loadBudgets();
                            Alert.alert("Succès", "Budget supprimé");
                        } catch (error) {
                            Alert.alert("Erreur", "Impossible de supprimer le budget");
                        }
                    },
                },
            ]
        );
    };

    const resetForm = () => {
        setCategory("");
        setAmount("");
        setPeriod("MONTHLY");
        calculateDates("MONTHLY");
    };

    if (loading && !refreshing) {
        return (
            <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <ThemedText style={{ marginTop: 16, color: theme.text }}>
                        Chargement des budgets...
                    </ThemedText>
                </View>
            </ThemedSafeAreaView>
        );
    }

    return (
        <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
            {/* Header */}
            <View style={{ position: 'absolute' }}>
                {showAlert && (<CustomAlert message={message} title="Succès" />)}
                {showAlertError && (<CustomAlert message={message} title="Un erreur est survenu" />)}
            </View>
            <View style={[styles.header, { backgroundColor: isLight ? "#FFFFFF" : "#151515" }]}>
                <View style={styles.headerTop}>
                    <View>
                        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
                            Mes Budgets
                        </ThemedText>
                        <ThemedText style={[styles.headerSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                            {budgets.length} budget{budgets.length > 1 ? "s" : ""} actif{budgets.length > 1 ? "s" : ""}
                        </ThemedText>
                    </View>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={[styles.summaryCard, { height: 150, flexDirection: "column", justifyContent: "space-between", backgroundColor: isLight ? "#F8F9FF" : "#0D1F1F" }]}>
                        <View style={[styles.summaryIconContainer, { marginTop: 20 }]}>
                            <LinearGradient
                                colors={["#6366F1", "#4F46E5"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.summaryIconGradient}
                            >
                                <Ionicons name="wallet" size={16} color="#FFF" />
                            </LinearGradient>
                        </View>
                        <View style={[styles.summaryInfo, { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }]}>
                            <ThemedText style={[styles.summaryLabel, { color: isLight ? "#4F46E5" : "#A5B4FC" }]}>
                                Budget Total
                            </ThemedText>
                            <ThemedText style={[styles.summaryAmount, { color: isLight ? "#4F46E5" : "#6366F1" }]}>
                                {formatCurrency(summary.totalBudget)}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={{ width: "46%", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
                        <View style={[styles.summaryCard, { height: 70, backgroundColor: isLight ? "#FFF5F5" : "#1F0D0D" }]}>
                            <View style={styles.summaryIconContainer}>
                                <LinearGradient
                                    colors={["#FF6B6B", "#EE5A52"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.summaryIconGradient}
                                >
                                    <Ionicons name="trending-up" size={16} color="#FFF" />
                                </LinearGradient>
                            </View>
                            <View style={styles.summaryInfo}>
                                <ThemedText style={[styles.summaryLabel, { color: isLight ? "#B91C1C" : "#FCA5A5" }]}>
                                    Dépensé
                                </ThemedText>
                                <ThemedText style={[styles.summaryAmount, { color: isLight ? "#B91C1C" : "#FF6B6B" }]}>
                                    {formatCurrency(summary.totalSpent)}
                                </ThemedText>
                            </View>
                        </View>

                        <View style={[styles.summaryCard, { height: 70, backgroundColor: isLight ? "#F0FDF4" : "#0D1F12" }]}>
                            <View style={styles.summaryIconContainer}>
                                <LinearGradient
                                    colors={["#4ADE80", "#22C55E"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.summaryIconGradient}
                                >
                                    <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                                </LinearGradient>
                            </View>
                            <View style={styles.summaryInfo}>
                                <ThemedText style={[styles.summaryLabel, { color: isLight ? "#15803D" : "#86EFAC" }]}>
                                    Restant
                                </ThemedText>
                                <ThemedText style={[styles.summaryAmount, { color: isLight ? "#15803D" : "#4ADE80" }]}>
                                    {formatCurrency(summary.totalRemaining)}
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Warning Cards */}
                {(summary.overBudget > 0 || summary.nearLimit > 0) && (
                    <View style={styles.warningContainer}>
                        {summary.overBudget > 0 && (
                            <View style={[styles.warningCard, { backgroundColor: "#FEE2E2" }]}>
                                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                                <ThemedText style={[styles.warningText, { color: "#DC2626" }]}>
                                    {summary.overBudget} budget{summary.overBudget > 1 ? "s" : ""} dépassé{summary.overBudget > 1 ? "s" : ""}
                                </ThemedText>
                            </View>
                        )}
                        {summary.nearLimit > 0 && (
                            <View style={[styles.warningCard, { backgroundColor: "#FEF3C7" }]}>
                                <Ionicons name="warning" size={16} color="#D97706" />
                                <ThemedText style={[styles.warningText, { color: "#D97706" }]}>
                                    {summary.nearLimit} proche{summary.nearLimit > 1 ? "s" : ""} de la limite
                                </ThemedText>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Budget List */}
            <ScrollView
                style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : theme.background }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }
            >
                {budgets.map((budget) => {
                    const categoryData = CATEGORIES.find((cat) => cat.name === budget.category);
                    const isOverBudget = budget.percentage > 100;
                    const isNearLimit = budget.percentage >= 80 && budget.percentage <= 100;

                    return (
                        <TouchableOpacity
                            key={budget.id}
                            style={[
                                styles.budgetCard,
                                { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                            ]}
                            activeOpacity={0.7}
                            onLongPress={() => handleDeleteBudget(budget.id, budget.category)}
                        >
                            {/* Status Badge */}
                            {isOverBudget && (
                                <View style={[styles.statusBadge, { backgroundColor: "#FEE2E2", alignSelf: "flex-end" }]}>
                                    <Ionicons name="alert-circle" size={12} color="#DC2626" />
                                    <ThemedText style={[styles.statusText, { color: "#DC2626" }]}>
                                        Dépassé
                                    </ThemedText>
                                </View>
                            )}
                            {isNearLimit && !isOverBudget && (
                                <View style={[styles.statusBadge, { backgroundColor: "#FEF3C7", alignSelf: "flex-end" }]}>
                                    <Ionicons name="warning" size={12} color="#D97706" />
                                    <ThemedText style={[styles.statusText, { color: "#D97706" }]}>
                                        Limite proche
                                    </ThemedText>
                                </View>
                            )}

                            {/* Budget Header */}
                            <View style={styles.budgetHeader}>
                                <View style={styles.budgetLeft}>
                                    <LinearGradient
                                        colors={[
                                            categoryData?.color || Colors.primary,
                                            adjustColorBrightness(categoryData?.color || Colors.primary, -20)
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.budgetIconContainer}
                                    >
                                        <Ionicons
                                            name={categoryData?.icon as any || "wallet"}
                                            size={24}
                                            color="#FFF"
                                        />
                                    </LinearGradient>

                                    <View>
                                        <ThemedText style={[styles.budgetCategory, { color: theme.text }]}>
                                            {budget.category}
                                        </ThemedText>
                                        <View style={styles.periodBadge}>
                                            <Ionicons name="calendar-outline" size={12} color={isLight ? "#666" : "#AAA"} />
                                            <ThemedText style={[styles.periodText, { color: isLight ? "#666" : "#AAA" }]}>
                                                {PERIODS.find(p => p.key === budget.period)?.label || budget.period}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>

                                {/* Circular Progress */}
                                <View style={styles.progressContainer}>
                                    <Svg height="70" width="70" viewBox="0 0 120 120">
                                        <Circle
                                            stroke={isLight ? "#F0F0F0" : "#2A2A2A"}
                                            fill="none"
                                            cx="60"
                                            cy="60"
                                            r={50}
                                            strokeWidth={10}
                                        />
                                        <Circle
                                            stroke={
                                                isOverBudget ? "#FF6B6B" :
                                                    isNearLimit ? "#FFA500" :
                                                        "#4ADE80"
                                            }
                                            fill="none"
                                            cx="60"
                                            cy="60"
                                            r={50}
                                            strokeWidth={10}
                                            strokeDasharray={2 * Math.PI * 50}
                                            strokeDashoffset={
                                                (2 * Math.PI * 50) -
                                                ((Math.min(budget.percentage, 100) / 100) * (2 * Math.PI * 50))
                                            }
                                            strokeLinecap="round"
                                            transform="rotate(-90 60 60)"
                                        />
                                    </Svg>
                                    <View style={styles.progressTextContainer}>
                                        <ThemedText style={[styles.progressPercentage, { color: theme.text }]}>
                                            {budget.percentage}
                                        </ThemedText>
                                        <ThemedText style={[styles.progressSymbol, { color: isLight ? "#999" : "#666" }]}>
                                            %
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>

                            {/* Budget Details */}
                            <View style={styles.budgetDetails}>
                                <View style={styles.detailRow}>
                                    <ThemedText style={[styles.detailLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                        Budget
                                    </ThemedText>
                                    <ThemedText style={[styles.detailValue, { color: theme.text }]}>
                                        {formatCurrency(budget.amount)}
                                    </ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={[styles.detailLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                        Dépensé
                                    </ThemedText>
                                    <ThemedText style={[styles.detailValue, { color: isOverBudget ? "#FF6B6B" : theme.text }]}>
                                        {formatCurrency(budget.spent)}
                                    </ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={[styles.detailLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                        Restant
                                    </ThemedText>
                                    <ThemedText style={[styles.detailValue, { color: budget.remaining < 0 ? "#FF6B6B" : "#4ADE80" }]}>
                                        {formatCurrency(Math.abs(budget.remaining))}
                                    </ThemedText>
                                </View>
                            </View>

                            {/* Progress Bar */}
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${Math.min(budget.percentage, 100)}%`,
                                            backgroundColor: isOverBudget ? "#FF6B6B" : isNearLimit ? "#FFA500" : "#4ADE80"
                                        }
                                    ]}
                                />
                            </View>

                            {/* <View style={[styles.cardIndicator, { backgroundColor: categoryData?.color || Colors.primary }]} /> */}
                        </TouchableOpacity>
                    );
                })}

                {budgets.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="wallet-outline" size={64} color={isLight ? "#CCC" : "#444"} />
                        <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
                            Aucun budget
                        </ThemedText>
                        <ThemedText style={[styles.emptyMessage, { color: isLight ? "#666" : "#AAA" }]}>
                            Commencez par créer votre premier budget
                        </ThemedText>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add Button */}
            <TouchableOpacity
                style={styles.addButton}
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

            {/* Add Budget Modal */}
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
                                    Nouveau Budget
                                </ThemedText>
                                <ThemedText style={[styles.modalSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                                    Définissez votre budget par catégorie
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
                            {/* Category Selector */}
                            <View style={styles.inputGroup}>
                                <ThemedText style={[styles.inputLabel, { color: theme.text }]}>
                                    Catégorie
                                </ThemedText>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryScroll}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.name}
                                            style={[
                                                styles.categoryChip,
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
                                                    styles.categoryChipText,
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
                            <View style={styles.inputGroup}>
                                <ThemedText style={[styles.inputLabel, { color: theme.text }]}>
                                    Montant
                                </ThemedText>
                                <View style={[styles.inputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                    <Ionicons name="cash-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <TextInput
                                        style={[styles.input, { color: theme.text }]}
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

                            {/* Period Selector */}
                            <View style={styles.inputGroup}>
                                <ThemedText style={[styles.inputLabel, { color: theme.text }]}>
                                    Période
                                </ThemedText>
                                <View style={styles.periodGrid}>
                                    {PERIODS.map((p) => (
                                        <TouchableOpacity
                                            key={p.key}
                                            style={[
                                                styles.periodButton,
                                                {
                                                    backgroundColor:
                                                        period === p.key
                                                            ? Colors.primary + "20"
                                                            : isLight
                                                                ? "#F5F5F5"
                                                                : "#1F1F1F",
                                                    borderColor:
                                                        period === p.key
                                                            ? Colors.primary
                                                            : "transparent",
                                                },
                                            ]}
                                            onPress={() => {
                                                setPeriod(p.key as any);
                                                calculateDates(p.key);
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={p.icon as any}
                                                size={20}
                                                color={period === p.key ? Colors.primary : (isLight ? "#666" : "#AAA")}
                                            />
                                            <ThemedText
                                                style={[
                                                    styles.periodButtonText,
                                                    {
                                                        color:
                                                            period === p.key
                                                                ? Colors.primary
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {p.label}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Date Range */}
                            <View style={styles.inputGroup}>
                                <ThemedText style={[styles.inputLabel, { color: theme.text }]}>
                                    Période du budget
                                </ThemedText>
                                <View style={styles.dateRangeContainer}>
                                    <TouchableOpacity
                                        style={[styles.dateButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
                                        onPress={() => setShowStartDatePicker(true)}
                                    >
                                        <Ionicons name="calendar-outline" size={20} color={isLight ? "#999" : "#666"} />
                                        <View style={styles.dateTextContainer}>
                                            <ThemedText style={[styles.dateLabel, { color: isLight ? "#999" : "#666" }]}>
                                                Début
                                            </ThemedText>
                                            <ThemedText style={[styles.dateValue, { color: theme.text }]}>
                                                {startDate.toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </ThemedText>
                                        </View>
                                    </TouchableOpacity>

                                    <View style={styles.dateArrow}>
                                        <Ionicons name="arrow-forward" size={20} color={isLight ? "#999" : "#666"} />
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.dateButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
                                        onPress={() => setShowEndDatePicker(true)}
                                    >
                                        <Ionicons name="calendar-outline" size={20} color={isLight ? "#999" : "#666"} />
                                        <View style={styles.dateTextContainer}>
                                            <ThemedText style={[styles.dateLabel, { color: isLight ? "#999" : "#666" }]}>
                                                Fin
                                            </ThemedText>
                                            <ThemedText style={[styles.dateValue, { color: theme.text }]}>
                                                {endDate.toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </ThemedText>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowStartDatePicker(false);
                                        if (selectedDate) setStartDate(selectedDate);
                                    }}
                                />
                            )}

                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowEndDatePicker(false);
                                        if (selectedDate) setEndDate(selectedDate);
                                    }}
                                />
                            )}

                            {/* Info Box */}
                            <View style={[styles.infoBox, { backgroundColor: Colors.primary + "10" }]}>
                                <Ionicons name="information-circle" size={20} color={Colors.primary} />
                                <ThemedText style={[styles.infoText, { color: Colors.primary }]}>
                                    Vous recevrez une alerte lorsque vous atteindrez 80% de votre budget
                                </ThemedText>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    (!category || !amount || submitting) && styles.submitButtonDisabled,
                                ]}
                                onPress={handleAddBudget}
                                disabled={!category || !amount || submitting}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={(!category || !amount || submitting)
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
                                            <ThemedText style={styles.submitButtonText}>
                                                Créer le budget
                                            </ThemedText>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ThemedSafeAreaView>
    );
}