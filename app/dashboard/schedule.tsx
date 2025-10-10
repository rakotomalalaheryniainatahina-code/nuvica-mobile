import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    Dimensions,
    ImageBackground,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Progress from "react-native-progress";
import { PieChart } from "react-native-chart-kit";
import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import TopHeros from "@/components/Topheros";
import Image from "@/constant/Images";
import ThemedView from "@/components/ThemedView";

const { width } = Dimensions.get("window");

// Types
interface SavingsGoal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    category: string;
    icon: string;
    color: string;
    monthlyContribution?: number;
}

// Données d'exemple
const SAMPLE_GOALS: SavingsGoal[] = [
    {
        id: "1",
        title: "Nouveau PC Gamer",
        targetAmount: 2500000,
        currentAmount: 1850000,
        deadline: new Date(2025, 11, 31),
        category: "Technologie",
        icon: "laptop",
        color: "#6366F1",
        monthlyContribution: 250000,
    },
    {
        id: "2",
        title: "Voyage à Nosy Be",
        targetAmount: 1200000,
        currentAmount: 450000,
        deadline: new Date(2026, 2, 15),
        category: "Voyage",
        icon: "airplane",
        color: "#22D3EE",
        monthlyContribution: 150000,
    },
    {
        id: "3",
        title: "Fonds d'urgence",
        targetAmount: 3000000,
        currentAmount: 2100000,
        deadline: new Date(2026, 5, 30),
        category: "Sécurité",
        icon: "shield-checkmark",
        color: "#4ADE80",
        monthlyContribution: 150000,
    },
    {
        id: "4",
        title: "Nouvelle voiture",
        targetAmount: 15000000,
        currentAmount: 4500000,
        deadline: new Date(2027, 0, 1),
        category: "Transport",
        icon: "car-sport",
        color: "#F59E0B",
        monthlyContribution: 500000,
    },
];

const GOAL_CATEGORIES = [
    { name: "Technologie", icon: "laptop", color: "#6366F1" },
    { name: "Voyage", icon: "airplane", color: "#22D3EE" },
    { name: "Sécurité", icon: "shield-checkmark", color: "#4ADE80" },
    { name: "Transport", icon: "car-sport", color: "#F59E0B" },
    { name: "Immobilier", icon: "home", color: "#EC4899" },
    { name: "Éducation", icon: "school", color: "#A78BFA" },
    { name: "Santé", icon: "medical", color: "#10B981" },
    { name: "Autre", icon: "ellipsis-horizontal", color: "#94A3B8" },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
        style: "currency",
        currency: "MGA",
        minimumFractionDigits: 0,
    }).format(amount);
};

const calculateMonthsRemaining = (deadline: Date) => {
    const now = new Date();
    const months = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return Math.max(0, months);
};

const calculateSuggestion = (targetAmount: number, currentAmount: number, deadline: Date) => {
    const remaining = targetAmount - currentAmount;
    const monthsLeft = calculateMonthsRemaining(deadline);
    if (monthsLeft === 0) return null;
    const monthlyAmount = Math.ceil(remaining / monthsLeft);
    return { monthlyAmount, monthsLeft };
};

export default function SavingsGoalsPage() {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const isLight = theme === Colors.light;

    const [goals, setGoals] = useState<SavingsGoal[]>(SAMPLE_GOALS);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [deadline, setDeadline] = useState(new Date());
    const [category, setCategory] = useState("");
    const [contributionAmount, setContributionAmount] = useState("");

    // Statistiques
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = (totalSaved / totalTarget) * 100;
    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;

    const handleAddGoal = () => {
        if (!title || !targetAmount || !category) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        const categoryData = GOAL_CATEGORIES.find(cat => cat.name === category);
        const newGoal: SavingsGoal = {
            id: Date.now().toString(),
            title,
            targetAmount: parseFloat(targetAmount),
            currentAmount: 0,
            deadline,
            category,
            icon: categoryData?.icon || "star",
            color: categoryData?.color || Colors.primary,
        };

        setGoals([...goals, newGoal]);
        setShowAddModal(false);
        resetForm();
    };

    const handleContribute = () => {
        if (!selectedGoal || !contributionAmount) return;

        const amount = parseFloat(contributionAmount);
        setGoals(
            goals.map(g =>
                g.id === selectedGoal.id
                    ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
                    : g
            )
        );

        setShowContributeModal(false);
        setSelectedGoal(null);
        setContributionAmount("");

        Alert.alert("Succès", `Vous avez ajouté ${formatCurrency(amount)} à votre objectif !`);
    };

    const handleDeleteGoal = (id: string) => {
        Alert.alert(
            "Supprimer l'objectif",
            "Êtes-vous sûr de vouloir supprimer cet objectif ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => setGoals(goals.filter(g => g.id !== id)),
                },
            ]
        );
    };

    const resetForm = () => {
        setTitle("");
        setTargetAmount("");
        setCategory("");
        setDeadline(new Date());
    };

    const openContributeModal = (goal: SavingsGoal) => {
        setSelectedGoal(goal);
        setShowContributeModal(true);
    };

    return (
        <ThemedSafeAreaView>
            <View style={{ width: "100%", height: "auto", zIndex: 2 }}>
                <TopHeros />
            </View>
            {/* Header */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <ThemedView style={{ width: "100%", height: "auto", backgroundColor: Colors.primary, }}>

                    <ImageBackground source={Image.starBG}
                        style={styles.header}
                    >

                        {/* Vue d'ensemble */}
                        <View style={styles.overviewCard}>
                            <View style={styles.overviewRow}>
                                <View style={styles.overviewItem}>
                                    <Text style={styles.overviewLabel}>Total épargné</Text>
                                    <Text style={styles.overviewValue}>{formatCurrency(totalSaved)}</Text>
                                </View>
                                <View style={styles.overviewItem}>
                                    <Text style={styles.overviewLabel}>Objectif total</Text>
                                    <Text style={styles.overviewValue}>{formatCurrency(totalTarget)}</Text>
                                </View>
                            </View>

                            <View style={styles.progressContainer}>
                                <Progress.Bar
                                    progress={Math.min(overallProgress / 100, 1)}
                                    width={null}
                                    height={12}
                                    color="#4ADE80"
                                    unfilledColor="rgba(255, 255, 255, 0.2)"
                                    borderWidth={0}
                                    borderRadius={6}
                                />
                                <Text style={styles.progressText}>
                                    {overallProgress.toFixed(0)}% accompli
                                </Text>
                            </View>

                            <View style={styles.statsRow}>
                                <View style={styles.statBadge}>
                                    <Ionicons name="trophy" size={16} color="#FFD700" />
                                    <Text style={styles.statBadgeText}>
                                        {completedGoals} objectifs atteints
                                    </Text>
                                </View>
                                <View style={styles.statBadge}>
                                    <Ionicons name="flag" size={16} color="#22D3EE" />
                                    <Text style={styles.statBadgeText}>
                                        {goals.length} objectifs actifs
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>

                </ThemedView>
                {/* Objectifs */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Mes Objectifs
                        </Text>
                    </View>

                    {goals.map(goal => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const remaining = goal.targetAmount - goal.currentAmount;
                        const isCompleted = progress >= 100;
                        const suggestion = calculateSuggestion(
                            goal.targetAmount,
                            goal.currentAmount,
                            goal.deadline
                        );

                        return (
                            <TouchableOpacity
                                key={goal.id}
                                style={[
                                    styles.goalCard,
                                    {
                                        backgroundColor: isLight ? "#FFF" : "#1F1F1F",
                                        borderLeftColor: goal.color,
                                    },
                                ]}
                                onPress={() => openContributeModal(goal)}
                                onLongPress={() => handleDeleteGoal(goal.id)}
                            >
                                <View style={styles.goalHeader}>
                                    <View style={styles.goalLeft}>
                                        <View
                                            style={[
                                                styles.goalIcon,
                                                { backgroundColor: goal.color + "20" },
                                            ]}
                                        >
                                            <Ionicons
                                                name={goal.icon as any}
                                                size={28}
                                                color={goal.color}
                                            />
                                        </View>
                                        <View>
                                            <Text style={[styles.goalTitle, { color: theme.text }]}>
                                                {goal.title}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.goalCategory,
                                                    { color: theme.text },
                                                ]}
                                            >
                                                {goal.category}
                                            </Text>
                                        </View>
                                    </View>

                                    {isCompleted && (
                                        <View style={styles.completedBadge}>
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={24}
                                                color="#4ADE80"
                                            />
                                        </View>
                                    )}
                                </View>

                                {/* Montants */}
                                <View style={styles.amountsContainer}>
                                    <View>
                                        <Text style={[styles.amountLabel, { color: theme.text }]}>
                                            Épargné
                                        </Text>
                                        <Text style={[styles.amountValue, { color: goal.color }]}>
                                            {formatCurrency(goal.currentAmount)}
                                        </Text>
                                    </View>
                                    <View style={styles.amountDivider} />
                                    <View>
                                        <Text style={[styles.amountLabel, { color: theme.text }]}>
                                            Objectif
                                        </Text>
                                        <Text style={[styles.amountValue, { color: theme.text }]}>
                                            {formatCurrency(goal.targetAmount)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Progression */}
                                <View style={styles.goalProgressContainer}>
                                    <Progress.Bar
                                        progress={Math.min(progress / 100, 1)}
                                        width={null}
                                        height={10}
                                        color={isCompleted ? "#4ADE80" : goal.color}
                                        unfilledColor={isLight ? "#E5E7EB" : "#374151"}
                                        borderWidth={0}
                                        borderRadius={5}
                                    />
                                    <View style={styles.goalProgressInfo}>
                                        <Text style={[styles.goalProgressText, { color: goal.color }]}>
                                            {progress.toFixed(0)}%
                                        </Text>
                                        <Text
                                            style={[
                                                styles.goalRemainingText,
                                                { color: theme.text },
                                            ]}
                                        >
                                            {isCompleted
                                                ? "✨ Objectif atteint !"
                                                : `Reste ${formatCurrency(remaining)}`}
                                        </Text>
                                    </View>
                                </View>

                                {/* Suggestion d'épargne */}
                                {!isCompleted && suggestion && (
                                    <View
                                        style={[
                                            styles.suggestionCard,
                                            { backgroundColor: goal.color + "10" },
                                        ]}
                                    >
                                        <View style={styles.suggestionHeader}>
                                            <Ionicons
                                                name="bulb"
                                                size={20}
                                                color={goal.color}
                                            />
                                            <Text
                                                style={[
                                                    styles.suggestionTitle,
                                                    { color: goal.color },
                                                ]}
                                            >
                                                Suggestion d'épargne
                                            </Text>
                                        </View>
                                        <Text style={[styles.suggestionText, { color: theme.text }]}>
                                            Épargnez{" "}
                                            <Text style={{ fontWeight: "700", color: goal.color }}>
                                                {formatCurrency(suggestion.monthlyAmount)}
                                            </Text>{" "}
                                            par mois pour atteindre votre objectif en{" "}
                                            <Text style={{ fontWeight: "700" }}>
                                                {suggestion.monthsLeft} mois
                                            </Text>
                                            .
                                        </Text>
                                        <View style={styles.deadlineContainer}>
                                            <Ionicons
                                                name="calendar"
                                                size={14}
                                                color={theme.text}
                                            />
                                            <Text
                                                style={[
                                                    styles.deadlineText,
                                                    { color: theme.text },
                                                ]}
                                            >
                                                Échéance:{" "}
                                                {goal.deadline.toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}

                    {goals.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="rocket-outline" size={64} color={theme.text} />
                            <Text style={[styles.emptyText, { color: theme.text }]}>
                                Aucun objectif d'épargne
                            </Text>
                            <Text style={[styles.emptySubtext, { color: theme.text }]}>
                                Créez votre premier objectif pour commencer à épargner
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </TouchableOpacity>
            {/* Modal Ajouter Objectif */}
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
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                Nouvel Objectif
                            </Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Ionicons name="close" size={28} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Titre */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>
                                    Nom de l'objectif
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                            color: theme.text,
                                        },
                                    ]}
                                    placeholder="Ex: Nouveau PC, Voyage..."
                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>

                            {/* Catégorie */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>
                                    Catégorie
                                </Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryScroll}
                                >
                                    {GOAL_CATEGORIES.map(cat => (
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
                                                                : "#2A2A2A",
                                                    borderColor:
                                                        category === cat.name
                                                            ? cat.color
                                                            : "transparent",
                                                },
                                            ]}
                                            onPress={() => setCategory(cat.name)}
                                        >
                                            <Ionicons
                                                name={cat.icon as any}
                                                size={20}
                                                color={
                                                    category === cat.name
                                                        ? cat.color
                                                        : theme.text
                                                }
                                            />
                                            <Text
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
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Montant */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>
                                    Montant objectif (Ar)
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                            color: theme.text,
                                        },
                                    ]}
                                    placeholder="Ex: 2500000"
                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                    keyboardType="numeric"
                                    value={targetAmount}
                                    onChangeText={setTargetAmount}
                                />
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    (!title || !category || !targetAmount) &&
                                    styles.submitButtonDisabled,
                                ]}
                                onPress={handleAddGoal}
                                disabled={!title || !category || !targetAmount}
                            >
                                <Text style={styles.submitButtonText}>Créer l'objectif</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal Contribuer */}
            <Modal
                visible={showContributeModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowContributeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            styles.contributeModal,
                            { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                Ajouter une épargne
                            </Text>
                            <TouchableOpacity onPress={() => setShowContributeModal(false)}>
                                <Ionicons name="close" size={28} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        {selectedGoal && (
                            <>
                                <View style={styles.goalPreview}>
                                    <View
                                        style={[
                                            styles.goalPreviewIcon,
                                            { backgroundColor: selectedGoal.color + "20" },
                                        ]}
                                    >
                                        <Ionicons
                                            name={selectedGoal.icon as any}
                                            size={32}
                                            color={selectedGoal.color}
                                        />
                                    </View>
                                    <Text style={[styles.goalPreviewTitle, { color: theme.text }]}>
                                        {selectedGoal.title}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.goalPreviewProgress,
                                            { color: theme.text },
                                        ]}
                                    >
                                        {formatCurrency(selectedGoal.currentAmount)} /{" "}
                                        {formatCurrency(selectedGoal.targetAmount)}
                                    </Text>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: theme.text }]}>
                                        Montant à ajouter (Ar)
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.amountInput,
                                            {
                                                backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                                color: theme.text,
                                            },
                                        ]}
                                        placeholder="0"
                                        placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                        keyboardType="numeric"
                                        value={contributionAmount}
                                        onChangeText={setContributionAmount}
                                    />
                                </View>

                                {/* Montants rapides */}
                                <View style={styles.quickAmounts}>
                                    {[10000, 50000, 100000, 250000].map(amount => (
                                        <TouchableOpacity
                                            key={amount}
                                            style={[
                                                styles.quickAmountButton,
                                                {
                                                    backgroundColor:
                                                        isLight ? "#F5F5F5" : "#2A2A2A",
                                                },
                                            ]}
                                            onPress={() =>
                                                setContributionAmount(amount.toString())
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.quickAmountText,
                                                    { color: theme.text },
                                                ]}
                                            >
                                                +{formatCurrency(amount)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        !contributionAmount && styles.submitButtonDisabled,
                                    ]}
                                    onPress={handleContribute}
                                    disabled={!contributionAmount}
                                >
                                    <Text style={styles.submitButtonText}>Ajouter</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 24,
    },
    overviewCard: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 6,
        padding: 20,
        backdropFilter: "blur(10px)",
    },
    overviewRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    overviewItem: {
        flex: 1,
    },
    overviewLabel: {
        fontSize: 12,
        color: "#FFF",
        opacity: 0.8,
        marginBottom: 4,
    },
    overviewValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFF",
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressText: {
        fontSize: 12,
        color: "#FFF",
        marginTop: 8,
        textAlign: "center",
        fontWeight: "600",
    },
    statsRow: {
        flexDirection: "row",
        gap: 8,
    },
    statBadge: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 8,
        borderRadius: 6,
    },
    statBadgeText: {
        fontSize: 11,
        color: "#FFF",
        fontWeight: "600",
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
    },
    addButton: {
        position: "absolute",
        bottom: 120,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    goalCard: {
        padding: 20,
        borderRadius: 6,
        marginBottom: 16,
    },
    goalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    goalLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    goalIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
    },
    goalCategory: {
        fontSize: 13,
    },
    completedBadge: {
        marginLeft: 12,
    },
    amountsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    amountLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    amountValue: {
        fontSize: 18,
        fontWeight: "700",
    },
    amountDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#E5E7EB",
        marginHorizontal: 20,
    },
    goalProgressContainer: {
        marginBottom: 16,
    },
    goalProgressInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    goalProgressText: {
        fontSize: 14,
        fontWeight: "700",
    },
    goalRemainingText: {
        fontSize: 13,
        fontWeight: "500",
    },
    suggestionCard: {
        padding: 16,
        borderRadius: 6,
        marginTop: 4,
    },
    suggestionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    suggestionTitle: {
        fontSize: 14,
        fontWeight: "700",
    },
    suggestionText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    deadlineContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 4,
    },
    deadlineText: {
        fontSize: 12,
    },
    chartCard: {
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        alignItems: "center",
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 60,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 6,
        fontSize: 16,
    },
    amountInput: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
    },
    categoryScroll: {
        marginTop: 8,
    },
    categoryChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        gap: 8,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: "500",
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 24,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
    contributeModal: {
        maxHeight: "70%",
    },
    goalPreview: {
        alignItems: "center",
        marginBottom: 24,
    },
    goalPreviewIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    goalPreviewTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },
    goalPreviewProgress: {
        fontSize: 14,
    },
    quickAmounts: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
    },
    quickAmountButton: {
        flex: 1,
        minWidth: "45%",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    quickAmountText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
