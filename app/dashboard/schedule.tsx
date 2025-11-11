import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    useColorScheme,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import TopHeros from "@/components/Topheros";
import styles from "@/styles/schedule";
import { Animated } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GoalResponse, goalService, GoalStatistics } from "@/services/goalService";

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

const calculateMonthsRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const months = Math.ceil(
        (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return Math.max(0, months);
};

const calculateSuggestion = (targetAmount: number, currentAmount: number, deadline: string) => {
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
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    const isLight = theme === Colors.light;

    const [goals, setGoals] = useState<GoalResponse[]>([]);
    const [statistics, setStatistics] = useState<GoalStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<GoalResponse | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [deadline, setDeadline] = useState(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    const [category, setCategory] = useState("");
    const [contributionAmount, setContributionAmount] = useState("");

    // Charger les objectifs et statistiques
    const loadGoals = useCallback(async () => {
        try {
            setLoading(true);
            const [goalsData, statsData] = await Promise.all([
                goalService.getAll(),
                goalService.getStatistics(),
            ]);
            setGoals(goalsData);
            setStatistics(statsData);
        } catch (error) {
            console.error("Erreur lors du chargement des objectifs:", error);
            Alert.alert("Erreur", "Impossible de charger les objectifs");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGoals();
    }, [loadGoals]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadGoals();
        setRefreshing(false);
    };

    const handleAddGoal = async () => {
        if (!title || !targetAmount || !category) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            setSubmitting(true);
            const categoryData = GOAL_CATEGORIES.find(cat => cat.name === category);

            const newGoalData = {
                title,
                description: description || undefined,
                targetAmount: parseFloat(targetAmount),
                currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
                deadline: deadline.toISOString(),
                category,
                icon: categoryData?.icon || "star",
                color: categoryData?.color || Colors.primary,
                priority: 'MEDIUM' as const,
            };

            await goalService.create(newGoalData);
            await loadGoals();

            setShowAddModal(false);
            Alert.alert("Succès", "Objectif créé avec succès");
            resetForm();
        } catch (error: any) {
            console.error("Erreur lors de l'ajout:", error);
            Alert.alert(
                "Erreur",
                error.response?.data?.message || "Impossible de créer l'objectif"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleContribute = async () => {
        if (!selectedGoal || !contributionAmount) {
            Alert.alert("Erreur", "Veuillez entrer un montant");
            return;
        }

        try {
            setSubmitting(true);
            const amount = parseFloat(contributionAmount);

            await goalService.addContribution(
                selectedGoal.id,
                amount,
                `Contribution du ${new Date().toLocaleDateString()}`
            );

            await loadGoals();
            setShowContributeModal(false);
            setSelectedGoal(null);
            setContributionAmount("");

            Alert.alert("Succès", `Vous avez ajouté ${formatCurrency(amount)} à votre objectif !`);
        } catch (error: any) {
            console.error("Erreur:", error);
            Alert.alert(
                "Erreur",
                error.response?.data?.message || "Impossible d'ajouter la contribution"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteGoal = (id: string, title: string) => {
        Alert.alert(
            "Supprimer l'objectif",
            `Êtes-vous sûr de vouloir supprimer "${title}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await goalService.delete(id);
                            await loadGoals();
                            Alert.alert("Succès", "Objectif supprimé");
                        } catch (error) {
                            Alert.alert("Erreur", "Impossible de supprimer l'objectif");
                        }
                    },
                },
            ]
        );
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setTargetAmount("");
        setCurrentAmount("");
        setCategory("");
        setDeadline(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    };

    const openContributeModal = (goal: GoalResponse) => {
        setSelectedGoal(goal);
        setShowContributeModal(true);
    };

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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

    if (loading && !refreshing) {
        return (
            <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={{ marginTop: 16, color: theme.text }}>
                        Chargement des objectifs...
                    </Text>
                </View>
            </ThemedSafeAreaView>
        );
    }

    const totalTarget = statistics?.totalTargetAmount || 0;
    const totalSaved = statistics?.totalCurrentAmount || 0;
    const overallProgress = statistics?.overallProgress || 0;
    const completedGoals = statistics?.completedGoals || 0;

    return (
        <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
            <View style={{ width: "100%", height: "auto", zIndex: 2 }}>
                <TopHeros />
            </View>

            <ScrollView
                style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : theme.background }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                }
            >
                {/* Modern Header */}
                <View style={{ position: 'relative', top: 0, left: 0, width: '100%', height: 'auto', overflow: 'hidden' }}>
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
                                            {overallProgress.toFixed(1)}%
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
                </View>

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
                        const isCompleted = goal.isCompleted;
                        const suggestion = calculateSuggestion(
                            goal.targetAmount,
                            goal.currentAmount as number,
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
                                onLongPress={() => handleDeleteGoal(goal.id, goal.title)}
                                activeOpacity={0.7}
                            >
                                {/* Card Header */}
                                <View style={styles.modernGoalHeader}>
                                    <View style={styles.goalHeaderLeft}>
                                        <LinearGradient
                                            colors={[
                                                goal.color || Colors.primary,
                                                adjustColorBrightness(goal.color || Colors.primary, -20)
                                            ]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.modernGoalIcon}
                                        >
                                            <Ionicons
                                                name={goal.icon as any || "star"}
                                                size={28}
                                                color="#FFF"
                                            />
                                        </LinearGradient>
                                        <View style={styles.goalHeaderInfo}>
                                            <Text style={[styles.modernGoalTitle, { color: theme.text }]}>
                                                {goal.title}
                                            </Text>
                                            <View style={styles.categoryBadge}>
                                                <View style={[styles.categoryDot, { backgroundColor: goal.color || Colors.primary }]} />
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
                                        <Text style={[styles.modernAmountValue, { color: goal.color || Colors.primary }]}>
                                            {formatCurrency(goal.currentAmount as number)}
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
                                        <Text style={[styles.progressLabel, { color: goal.color || Colors.primary }]}>
                                            {goal.percentage}% complété
                                        </Text>
                                        <Text style={[styles.remainingLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                            {isCompleted
                                                ? "Objectif atteint! 🎉"
                                                : `Reste ${formatCurrency(goal.remaining)}`}
                                        </Text>
                                    </View>
                                    <View style={[styles.modernProgressBar, { backgroundColor: isLight ? "#F0F0F0" : "#2A2A2A" }]}>
                                        <LinearGradient
                                            colors={[
                                                isCompleted ? "#4ADE80" : (goal.color || Colors.primary),
                                                isCompleted ? "#22C55E" : adjustColorBrightness(goal.color || Colors.primary, -20)
                                            ]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[
                                                styles.modernProgressFill,
                                                { width: `${Math.min(goal.percentage, 100)}%` }
                                            ]}
                                        />
                                    </View>
                                </View>

                                {/* Suggestion Card */}
                                {!isCompleted && suggestion && (
                                    <View style={[styles.modernSuggestionCard, { backgroundColor: (goal.color || Colors.primary) + "10" }]}>
                                        <View style={styles.suggestionHeader}>
                                            <View style={[styles.suggestionIcon, { backgroundColor: (goal.color || Colors.primary) + "20" }]}>
                                                <Ionicons name="bulb" size={18} color={goal.color || Colors.primary} />
                                            </View>
                                            <Text style={[styles.modernSuggestionTitle, { color: goal.color || Colors.primary }]}>
                                                Plan d'épargne suggéré
                                            </Text>
                                        </View>
                                        <Text style={[styles.modernSuggestionText, { color: theme.text }]}>
                                            Épargnez{" "}
                                            <Text style={{ fontWeight: "800", color: goal.color || Colors.primary }}>
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
                                                Échéance: {new Date(goal.deadline).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })} ({goal.daysLeft} jours restants)
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Color Indicator */}
                                {/* <View style={[styles.goalColorIndicator, { backgroundColor: goal.color || Colors.primary }]} /> */}
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
                style={{ position: 'absolute', top: 0, left: 0, flex: 1 }}
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
                                onPress={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
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

                            {/* Description Input */}
                            <View style={styles.modernInputGroup}>
                                <Text style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Description (optionnelle)
                                </Text>
                                <View style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                    <Ionicons name="document-text-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <TextInput
                                        style={[styles.modernInput, { color: theme.text }]}
                                        placeholder="Ex: Pour le gaming et le développement..."
                                        placeholderTextColor={isLight ? "#999" : "#666"}
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                    />
                                </View>
                            </View>

                            {/* Target Amount Input */}
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

                            {/* Current Amount Input */}
                            <View style={styles.modernInputGroup}>
                                <Text style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Montant initial (optionnel)
                                </Text>
                                <View style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}>
                                    <Ionicons name="wallet-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <TextInput
                                        style={[styles.modernInput, { color: theme.text }]}
                                        placeholder="Ex: 500000"
                                        placeholderTextColor={isLight ? "#999" : "#666"}
                                        keyboardType="numeric"
                                        value={currentAmount}
                                        onChangeText={setCurrentAmount}
                                    />
                                    <Text style={[styles.currencyLabel, { color: isLight ? "#999" : "#666" }]}>
                                        Ar
                                    </Text>
                                </View>
                            </View>

                            {/* Deadline Input */}
                            <View style={styles.modernInputGroup}>
                                <Text style={[styles.modernInputLabel, { color: theme.text }]}>
                                    Date d'échéance
                                </Text>
                                <TouchableOpacity
                                    style={[styles.modernInputContainer, { backgroundColor: isLight ? "#F5F5F5" : "#1F1F1F" }]}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={isLight ? "#999" : "#666"} />
                                    <Text style={[styles.modernInput, { color: theme.text }]}>
                                        {deadline.toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color={isLight ? "#999" : "#666"} />
                                </TouchableOpacity>
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={deadline}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setDeadline(selectedDate);
                                        }
                                    }}
                                    minimumDate={new Date()}
                                />
                            )}

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[
                                    styles.modernSubmitButton,
                                    (!title || !category || !targetAmount || submitting) && styles.submitButtonDisabled,
                                ]}
                                onPress={handleAddGoal}
                                disabled={!title || !category || !targetAmount || submitting}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={(!title || !category || !targetAmount || submitting)
                                        ? ["#CCC", "#AAA"]
                                        : [Colors.primary, adjustColorBrightness(Colors.primary, -20)]
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.submitButtonGradient}
                                >
                                    {submitting ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                            <Text style={styles.modernSubmitButtonText}>
                                                Créer l'objectif
                                            </Text>
                                        </>
                                    )}
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
                onRequestClose={() => {
                    setShowContributeModal(false);
                    setSelectedGoal(null);
                    setContributionAmount("");
                }}
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
                                onPress={() => {
                                    setShowContributeModal(false);
                                    setSelectedGoal(null);
                                    setContributionAmount("");
                                }}
                            >
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ height: "100%" }} showsVerticalScrollIndicator={false}>
                            {selectedGoal && (
                                <>
                                    {/* Goal Preview */}
                                    <View style={styles.modernGoalPreview}>
                                        <LinearGradient
                                            colors={[
                                                selectedGoal.color || Colors.primary,
                                                adjustColorBrightness(selectedGoal.color || Colors.primary, -20)
                                            ]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.modernGoalPreviewIcon}
                                        >
                                            <Ionicons
                                                name={selectedGoal.icon as any || "star"}
                                                size={36}
                                                color="#FFF"
                                            />
                                        </LinearGradient>
                                        <Text style={[styles.modernGoalPreviewTitle, { color: theme.text }]}>
                                            {selectedGoal.title}
                                        </Text>
                                        <View style={styles.goalPreviewProgress}>
                                            <Text style={[styles.goalPreviewAmount, { color: selectedGoal.color || Colors.primary }]}>
                                                {formatCurrency(selectedGoal.currentAmount as number)}
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
                                                        width: `${Math.min(selectedGoal.percentage, 100)}%`,
                                                        backgroundColor: selectedGoal.color || Colors.primary
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
                                            <Ionicons name="add-circle-outline" size={24} color={selectedGoal.color || Colors.primary} />
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
                                                                ? (selectedGoal.color || Colors.primary)
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
                                                            ? (selectedGoal.color || Colors.primary)
                                                            : (isLight ? "#666" : "#AAA")
                                                        }
                                                    />
                                                    <Text
                                                        style={[
                                                            styles.modernQuickAmountText,
                                                            {
                                                                color: contributionAmount === amount.toString()
                                                                    ? (selectedGoal.color || Colors.primary)
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
                                            (!contributionAmount || submitting) && styles.submitButtonDisabled,
                                        ]}
                                        onPress={handleContribute}
                                        disabled={!contributionAmount || submitting}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={(!contributionAmount || submitting)
                                                ? ["#CCC", "#AAA"]
                                                : [selectedGoal.color || Colors.primary, adjustColorBrightness(selectedGoal.color || Colors.primary, -20)]
                                            }
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.submitButtonGradient}
                                        >
                                            {submitting ? (
                                                <ActivityIndicator size="small" color="#FFF" />
                                            ) : (
                                                <>
                                                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                                    <Text style={styles.modernSubmitButtonText}>
                                                        Confirmer l'ajout
                                                    </Text>
                                                </>
                                            )}
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