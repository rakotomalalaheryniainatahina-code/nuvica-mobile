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
import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import TopHeros from "@/components/Topheros";
import Image from "@/constant/Images";
import ThemedView from "@/components/ThemedView";
import styles from "@/styles/schedule";

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

const adjustColorBrightness = (color: string, amount: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
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

    function formatNumber(num: number): string {
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
        }
        return num.toString();
    }

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
        <ThemedSafeAreaView style={{ backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" }}>
            <View style={{ width: "100%", height: "auto", zIndex: 2 }}>
                <TopHeros />
            </View>

            <ScrollView
                style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Modern Header */}
                <LinearGradient
                    colors={[Colors.primary, '#4ADE80', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} style={styles.headerContainer}>
                    <ImageBackground
                        source={Image.starBG}
                        style={styles.headerBackground}
                    >
                        <View style={styles.headerContent}>
                            <View style={styles.headerTop}>
                                <View>
                                    <Text style={styles.headerTitle}>Objectifs d'Épargne</Text>
                                    <Text style={styles.headerSubtitle}>
                                        Suivez vos progrès
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.headerIconButton}>
                                    <Ionicons name="analytics" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            {/* Modern Overview Card */}
                            <View style={styles.modernOverviewCard}>
                                <View style={styles.overviewMainInfo}>
                                    <View style={styles.overviewLeft}>
                                        <Text style={styles.overviewLabel}>Total épargné</Text>
                                        <Text style={styles.overviewValue}>
                                            {formatCurrency(totalSaved)}
                                        </Text>
                                        <View style={styles.overviewProgress}>
                                            <View style={styles.progressBarContainer}>
                                                <View
                                                    style={[
                                                        styles.progressBarFill,
                                                        { width: `${Math.min(overallProgress, 100)}%` }
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.progressPercentage}>
                                                {overallProgress.toFixed(2)}%
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.overviewDivider} />
                                    <View style={styles.overviewRight}>
                                        <Text style={styles.overviewLabel}>Objectif total</Text>
                                        <Text style={styles.overviewValue}>
                                            {formatCurrency(totalTarget)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.statsContainer}>
                                    <View style={styles.modernStatBadge}>
                                        <LinearGradient
                                            colors={["#FFD700", "#FFA500"]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.statBadgeIcon}
                                        >
                                            <Ionicons name="trophy" size={16} color="#FFF" />
                                        </LinearGradient>
                                        <Text style={styles.statBadgeText}>
                                            {completedGoals} atteints
                                        </Text>
                                    </View>
                                    <View style={styles.modernStatBadge}>
                                        <LinearGradient
                                            colors={["#22D3EE", "#0EA5E9"]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.statBadgeIcon}
                                        >
                                            <Ionicons name="flag" size={16} color="#FFF" />
                                        </LinearGradient>
                                        <Text style={styles.statBadgeText}>
                                            {goals.length} actifs
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </LinearGradient>

                {/* Goals Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                Mes Objectifs
                            </Text>
                            <Text style={[styles.sectionSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                                {goals.length} objectif{goals.length > 1 ? 's' : ''} en cours
                            </Text>
                        </View>
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
                                    styles.modernGoalCard,
                                    { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                                ]}
                                onPress={() => openContributeModal(goal)}
                                onLongPress={() => handleDeleteGoal(goal.id)}
                                activeOpacity={0.7}
                            >
                                {/* Card Header */}
                                <View style={styles.modernGoalHeader}>
                                    <View style={styles.goalHeaderLeft}>
                                        <LinearGradient
                                            colors={[
                                                goal.color,
                                                adjustColorBrightness(goal.color, -20)
                                            ]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.modernGoalIcon}
                                        >
                                            <Ionicons
                                                name={goal.icon as any}
                                                size={28}
                                                color="#FFF"
                                            />
                                        </LinearGradient>
                                        <View style={styles.goalHeaderInfo}>
                                            <Text style={[styles.modernGoalTitle, { color: theme.text }]}>
                                                {goal.title}
                                            </Text>
                                            <View style={styles.categoryBadge}>
                                                <View style={[styles.categoryDot, { backgroundColor: goal.color }]} />
                                                <Text style={[styles.modernGoalCategory, { color: isLight ? "#666" : "#AAA" }]}>
                                                    {goal.category}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {isCompleted && (
                                        <View style={styles.modernCompletedBadge}>
                                            <LinearGradient
                                                colors={["#4ADE80", "#22C55E"]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={styles.completedBadgeGradient}
                                            >
                                                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                            </LinearGradient>
                                        </View>
                                    )}
                                </View>

                                {/* Amounts Section */}
                                <View style={styles.modernAmountsContainer}>
                                    <View style={styles.amountBox}>
                                        <Text style={[styles.modernAmountLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                            Épargné
                                        </Text>
                                        <Text style={[styles.modernAmountValue, { color: goal.color }]}>
                                            {formatCurrency(goal.currentAmount)}
                                        </Text>
                                    </View>
                                    <View style={[styles.modernAmountDivider, { backgroundColor: isLight ? "#E5E5E5" : "#2A2A2A" }]} />
                                    <View style={styles.amountBox}>
                                        <Text style={[styles.modernAmountLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                            Objectif
                                        </Text>
                                        <Text style={[styles.modernAmountValue, { color: theme.text }]}>
                                            {formatCurrency(goal.targetAmount)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Section */}
                                <View style={styles.modernProgressContainer}>
                                    <View style={styles.progressHeader}>
                                        <Text style={[styles.progressLabel, { color: goal.color }]}>
                                            {progress.toFixed(0)}% complété
                                        </Text>
                                        <Text style={[styles.remainingLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                            {isCompleted
                                                ? "Objectif atteint! 🎉"
                                                : `Reste ${formatCurrency(remaining)}`}
                                        </Text>
                                    </View>
                                    <View style={[styles.modernProgressBar, { backgroundColor: isLight ? "#F0F0F0" : "#2A2A2A" }]}>
                                        <LinearGradient
                                            colors={[
                                                isCompleted ? "#4ADE80" : goal.color,
                                                isCompleted ? "#22C55E" : adjustColorBrightness(goal.color, -20)
                                            ]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[
                                                styles.modernProgressFill,
                                                { width: `${Math.min(progress, 100)}%` }
                                            ]}
                                        />
                                    </View>
                                </View>

                                {/* Suggestion Card */}
                                {!isCompleted && suggestion && (
                                    <View style={[styles.modernSuggestionCard, { backgroundColor: goal.color + "10" }]}>
                                        <View style={styles.suggestionHeader}>
                                            <View style={[styles.suggestionIcon, { backgroundColor: goal.color + "20" }]}>
                                                <Ionicons name="bulb" size={18} color={goal.color} />
                                            </View>
                                            <Text style={[styles.modernSuggestionTitle, { color: goal.color }]}>
                                                Plan d'épargne suggéré
                                            </Text>
                                        </View>
                                        <Text style={[styles.modernSuggestionText, { color: theme.text }]}>
                                            Épargnez{" "}
                                            <Text style={{ fontWeight: "800", color: goal.color }}>
                                                {formatCurrency(suggestion.monthlyAmount)}/mois
                                            </Text>{" "}
                                            pour atteindre votre objectif en{" "}
                                            <Text style={{ fontWeight: "700" }}>
                                                {suggestion.monthsLeft} mois
                                            </Text>
                                        </Text>
                                        <View style={styles.modernDeadlineContainer}>
                                            <Ionicons name="calendar-outline" size={14} color={isLight ? "#666" : "#AAA"} />
                                            <Text style={[styles.modernDeadlineText, { color: isLight ? "#666" : "#AAA" }]}>
                                                Échéance: {goal.deadline.toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Color Indicator */}
                                <View style={[styles.goalColorIndicator, { backgroundColor: goal.color }]} />
                            </TouchableOpacity>
                        );
                    })}

                    {goals.length === 0 && (
                        <View style={styles.modernEmptyState}>
                            <View style={styles.emptyStateIcon}>
                                <Ionicons name="rocket-outline" size={64} color={isLight ? "#CCC" : "#444"} />
                            </View>
                            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                                Aucun objectif d'épargne
                            </Text>
                            <Text style={[styles.emptySubtext, { color: isLight ? "#666" : "#AAA" }]}>
                                Créez votre premier objectif pour commencer à épargner intelligemment
                            </Text>
                            <TouchableOpacity
                                style={styles.emptyStateButton}
                                onPress={() => setShowAddModal(true)}
                            >
                                <LinearGradient
                                    colors={[Colors.primary, adjustColorBrightness(Colors.primary, -20)]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.emptyStateButtonGradient}
                                >
                                    <Ionicons name="add-circle" size={20} color="#FFF" />
                                    <Text style={styles.emptyStateButtonText}>
                                        Créer un objectif
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
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

            {/* Add Goal Modal */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isLight ? "#FFF" : "#151515" }]}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>
                                    Nouvel Objectif
                                </Text>
                                <Text style={[styles.modalSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                                    Définissez votre objectif d'épargne
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.modalCloseButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
                                onPress={() => setShowAddModal(false)}
                            >
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Title Input */}
                            <View style={styles.modernInputGroup}>
                                <Text style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Nom de l'objectif
                                </Text>
                                <View style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                    <Ionicons name="flag-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <TextInput
                                        style={[styles.modernInput, { color: theme.text }]}
                                        placeholder="Ex: Nouveau PC, Voyage..."
                                        placeholderTextColor={isLight ? "#999" : "#666"}
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                </View>
                            </View>

                            {/* Category Selector */}
                            <View style={styles.modernInputGroup}>
                                <Text style={[styles.modernInputLabel, { color: theme.text }]}>
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
                                                    styles.categoryChipIconContainer,
                                                    { backgroundColor: category === cat.name ? cat.color + "30" : (isLight ? "#E5E5E5" : "#2A2A2A") }
                                                ]}
                                            >
                                                <Ionicons
                                                    name={cat.icon as any}
                                                    size={18}
                                                    color={category === cat.name ? cat.color : (isLight ? "#666" : "#AAA")}
                                                />
                                            </View>
                                            <Text
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
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Amount Input */}
                            <View style={styles.modernInputGroup}>
                                <Text style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Montant objectif
                                </Text>
                                <View style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                    <Ionicons name="cash-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <TextInput
                                        style={[styles.modernInput, { color: theme.text }]}
                                        placeholder="Ex: 2500000"
                                        placeholderTextColor={isLight ? "#999" : "#666"}
                                        keyboardType="numeric"
                                        value={targetAmount}
                                        onChangeText={setTargetAmount}
                                    />
                                    <Text style={[styles.currencyLabel, { color: isLight ? "#999" : "#666" }]}>
                                        Ar
                                    </Text>
                                </View>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[
                                    styles.modernSubmitButton,
                                    (!title || !category || !targetAmount) && styles.submitButtonDisabled,
                                ]}
                                onPress={handleAddGoal}
                                disabled={!title || !category || !targetAmount}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={(!title || !category || !targetAmount)
                                        ? ["#CCC", "#AAA"]
                                        : [Colors.primary, adjustColorBrightness(Colors.primary, -20)]
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.submitButtonGradient}
                                >
                                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                    <Text style={styles.modernSubmitButtonText}>
                                        Créer l'objectif
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Contribute Modal */}
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
                            { backgroundColor: isLight ? "#FFF" : "#151515", paddingBottom: 0 },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>
                                    Ajouter une épargne
                                </Text>
                                <Text style={[styles.modalSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                                    Contribuez à votre objectif
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.modalCloseButton, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
                                onPress={() => setShowContributeModal(false)}
                            >
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ height: "100%" }} showsVerticalScrollIndicator={false} >

                            {selectedGoal && (
                                <>
                                    {/* Goal Preview */}
                                    <View style={styles.modernGoalPreview}>
                                        <LinearGradient
                                            colors={[
                                                selectedGoal.color,
                                                adjustColorBrightness(selectedGoal.color, -20)
                                            ]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.modernGoalPreviewIcon}
                                        >
                                            <Ionicons
                                                name={selectedGoal.icon as any}
                                                size={36}
                                                color="#FFF"
                                            />
                                        </LinearGradient>
                                        <Text style={[styles.modernGoalPreviewTitle, { color: theme.text }]}>
                                            {selectedGoal.title}
                                        </Text>
                                        <View style={styles.goalPreviewProgress}>
                                            <Text style={[styles.goalPreviewAmount, { color: selectedGoal.color }]}>
                                                {formatCurrency(selectedGoal.currentAmount)}
                                            </Text>
                                            <Text style={[styles.goalPreviewSeparator, { color: isLight ? "#999" : "#666" }]}>
                                                /
                                            </Text>
                                            <Text style={[styles.goalPreviewTarget, { color: isLight ? "#666" : "#AAA" }]}>
                                                {formatCurrency(selectedGoal.targetAmount)}
                                            </Text>
                                        </View>

                                        {/* Progress Bar */}
                                        <View style={[styles.previewProgressBar, { backgroundColor: isLight ? "#F0F0F0" : "#2A2A2A" }]}>
                                            <View
                                                style={[
                                                    styles.previewProgressFill,
                                                    {
                                                        width: `${Math.min((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100, 100)}%`,
                                                        backgroundColor: selectedGoal.color
                                                    }
                                                ]}
                                            />
                                        </View>
                                    </View>

                                    {/* Amount Input */}
                                    <View style={styles.modernInputGroup}>
                                        <Text style={[styles.modernInputLabel, { color: theme.text }]}>
                                            Montant à ajouter
                                        </Text>
                                        <View style={[styles.modernAmountInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                            <Ionicons name="add-circle-outline" size={24} color={selectedGoal.color} />
                                            <TextInput
                                                style={[styles.modernAmountInput, { color: theme.text }]}
                                                placeholder="0"
                                                placeholderTextColor={isLight ? "#CCC" : "#444"}
                                                keyboardType="numeric"
                                                value={contributionAmount}
                                                onChangeText={setContributionAmount}
                                            />
                                            <Text style={[styles.amountCurrency, { color: isLight ? "#999" : "#666" }]}>
                                                Ar
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Quick Amounts */}
                                    <View style={styles.modernQuickAmounts}>
                                        <Text style={[styles.quickAmountsLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                            Montants rapides
                                        </Text>
                                        <View style={styles.quickAmountsGrid}>
                                            {[10000, 50000, 100000, 250000].map(amount => (
                                                <TouchableOpacity
                                                    key={amount}
                                                    style={[
                                                        styles.modernQuickAmountButton,
                                                        {
                                                            backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F",
                                                            borderColor: contributionAmount === amount.toString()
                                                                ? selectedGoal.color
                                                                : "transparent"
                                                        },
                                                    ]}
                                                    onPress={() => setContributionAmount(amount.toString())}
                                                    activeOpacity={0.7}
                                                >
                                                    <Ionicons
                                                        name="add"
                                                        size={16}
                                                        color={contributionAmount === amount.toString()
                                                            ? selectedGoal.color
                                                            : (isLight ? "#666" : "#AAA")
                                                        }
                                                    />
                                                    <Text
                                                        style={[
                                                            styles.modernQuickAmountText,
                                                            {
                                                                color: contributionAmount === amount.toString()
                                                                    ? selectedGoal.color
                                                                    : theme.text
                                                            },
                                                        ]}
                                                    >
                                                        {formatCurrency(amount)}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Submit Button */}
                                    <TouchableOpacity
                                        style={[
                                            styles.modernSubmitButton,
                                            !contributionAmount && styles.submitButtonDisabled,
                                        ]}
                                        onPress={handleContribute}
                                        disabled={!contributionAmount}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={!contributionAmount
                                                ? ["#CCC", "#AAA"]
                                                : [selectedGoal.color, adjustColorBrightness(selectedGoal.color, -20)]
                                            }
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.submitButtonGradient}
                                        >
                                            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                            <Text style={styles.modernSubmitButtonText}>
                                                Confirmer l'ajout
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>

                    </View>
                </View>
            </Modal>
        </ThemedSafeAreaView>
    );
}