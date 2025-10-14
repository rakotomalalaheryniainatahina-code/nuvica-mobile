import React, { useState } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import ThemedView from "@/components/ThemedView";
import Images from '@/constant/Images';
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import TopHeros from "@/components/Topheros";
import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedText from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import styles from "@/styles/wallet";
const { width } = Dimensions.get("window");

// Types
interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
    savings: number;
}

interface CategorySpending {
    category: string;
    amount: number;
    percentage: number;
    change: number;
    color: string;
    icon: string;
}

interface FinancialInsight {
    id: string;
    type: "warning" | "success" | "info" | "tip";
    title: string;
    message: string;
    icon: string;
    color: string;
}

// Données d'exemple
const MONTHLY_DATA: MonthlyData[] = [
    { month: "Avr", income: 450000, expenses: 380000, savings: 70000 },
    { month: "Mai", income: 480000, expenses: 420000, savings: 60000 },
    { month: "Jui", income: 500000, expenses: 390000, savings: 110000 },
    { month: "Jul", income: 520000, expenses: 450000, savings: 70000 },
    { month: "Aoû", income: 500000, expenses: 410000, savings: 90000 },
    { month: "Sep", income: 530000, expenses: 440000, savings: 90000 },
    { month: "Oct", income: 550000, expenses: 480000, savings: 70000 },
];

const CATEGORY_SPENDING: CategorySpending[] = [
    {
        category: "Alimentation",
        amount: 120000,
        percentage: 25,
        change: 20,
        color: "#FF6B6B",
        icon: "restaurant",
    },
    {
        category: "Transport",
        amount: 85000,
        percentage: 18,
        change: -5,
        color: "#4ECDC4",
        icon: "car",
    },
    {
        category: "Logement",
        amount: 150000,
        percentage: 31,
        change: 4,
        color: "#45B7D1",
        icon: "home",
    },
    {
        category: "Loisirs",
        amount: 65000,
        percentage: 14,
        change: 15,
        color: "#FFA07A",
        icon: "game-controller",
    },
    {
        category: "Santé",
        amount: 35000,
        percentage: 7,
        change: -10,
        color: "#98D8C8",
        icon: "medical",
    },
    {
        category: "Autres",
        amount: 25000,
        percentage: 5,
        change: 5,
        color: "#BDC3C7",
        icon: "ellipsis-horizontal",
    },
];

const FINANCIAL_INSIGHTS: FinancialInsight[] = [
    {
        id: "1",
        type: "warning",
        title: "Alimentation en hausse",
        message:
            "Vous dépensez +20% en alimentation par rapport au mois dernier. Essayez de cuisiner plus souvent à la maison.",
        icon: "trending-up",
        color: "#FF6B6B",
    },
    {
        id: "2",
        type: "success",
        title: "Excellente épargne !",
        message:
            "Vous avez épargné 90,000 Ar ce mois-ci, soit 16% de vos revenus. Continuez comme ça !",
        icon: "trophy",
        color: "#4ADE80",
    },
    {
        id: "3",
        type: "info",
        title: "Transport optimisé",
        message:
            "Vos dépenses de transport ont diminué de 5%. Bon travail sur la réduction des coûts !",
        icon: "car",
        color: "#22D3EE",
    },
    {
        id: "4",
        type: "tip",
        title: "Conseil du mois",
        message:
            "Vos loisirs représentent 14% de vos dépenses. Envisagez un budget fixe pour mieux contrôler ces dépenses.",
        icon: "bulb",
        color: "#F59E0B",
    },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
        style: "currency",
        currency: "MGA",
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function ReportsAnalyticsPage() {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const isLight = theme === Colors.light;

    const router = useRouter();
    // Calculs
    const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
    const previousMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
    const totalExpenses = CATEGORY_SPENDING.reduce((sum, cat) => sum + cat.amount, 0);
    const averageMonthlyExpenses =
        MONTHLY_DATA.reduce((sum, m) => sum + m.expenses, 0) / MONTHLY_DATA.length;
    const averageMonthlySavings =
        MONTHLY_DATA.reduce((sum, m) => sum + m.savings, 0) / MONTHLY_DATA.length;

    const expenseChange = previousMonth
        ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
        : 0;
    const incomeChange = previousMonth
        ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100
        : 0;
    const savingsRate = (currentMonth.savings / currentMonth.income) * 100;

    const chartConfig = {
        backgroundColor: "transparent",
        backgroundGradientFrom: isLight ? "#FAFAFA" : "#1A1A1A",
        backgroundGradientTo: isLight ? "#FAFAFA" : "#1A1A1A",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        labelColor: (opacity = 1) =>
            isLight ? `rgba(30, 30, 30, ${opacity * 0.7})` : `rgba(255, 255, 255, ${opacity * 0.8})`,
        style: {
            borderRadius: 20,
        },
        propsForDots: {
            r: "5",
            strokeWidth: "2",
        },
        propsForBackgroundLines: {
            strokeDasharray: "5,5",
            stroke: isLight ? "#E0E0E0" : "#2A2A2A",
            strokeWidth: 1,
        },
    };

    return (
        <ThemedSafeAreaView style={{ backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" }}>
            <ThemedScrollView stickyHeaderIndices={[0]}>
                <TopHeros />

                {/* Header modernisé avec gradient */}
                <LinearGradient
                    colors={[Colors.primary, '#4ADE80', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} style={styles.header}>
                    <ImageBackground
                        source={Images.starBG}
                        style={styles.headerBackground}
                    >
                        <View style={styles.headerGradient}>
                            <View style={styles.headerTop}>
                                <View>
                                    <ThemedText style={styles.headerSubtitle}>Octobre 2025</ThemedText>
                                    <ThemedText style={styles.headerTitle}>Rapports & Analyses</ThemedText>
                                </View>
                                <TouchableOpacity style={styles.headerButton}>
                                    <Image source={require("@/assets/images/logo.png")} style={{ width: 30, height: 30, objectFit: "contain" }} />
                                </TouchableOpacity>
                            </View>

                            {/* Quick Stats avec glassmorphism */}
                            <View style={styles.quickStatsContainer}>
                                <View style={styles.quickStatCard}>
                                    <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.66)' }]}>
                                        <Ionicons name="trending-up" size={18} color="#4ADE80" />
                                    </View>
                                    <ThemedText style={styles.quickStatValue}>
                                        {incomeChange >= 0 ? "+" : ""}
                                        {incomeChange.toFixed(1)}%
                                    </ThemedText>
                                    <ThemedText style={styles.quickStatLabel}>Revenus</ThemedText>
                                </View>

                                <View style={styles.quickStatCard}>
                                    <View style={[styles.statIconContainer, { backgroundColor: expenseChange > 0 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(74, 222, 128, 0.15)' }]}>
                                        <Ionicons
                                            name={expenseChange > 0 ? "trending-up" : "trending-down"}
                                            size={18}
                                            color={expenseChange > 0 ? "#FF6B6B" : "#4ADE80"}
                                        />
                                    </View>
                                    <ThemedText style={styles.quickStatValue}>
                                        {expenseChange >= 0 ? "+" : ""}
                                        {expenseChange.toFixed(1)}%
                                    </ThemedText>
                                    <ThemedText style={styles.quickStatLabel}>Dépenses</ThemedText>
                                </View>

                                <View style={styles.quickStatCard}>
                                    <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 165, 0, 0.15)' }]}>
                                        <Ionicons name="wallet" size={18} color="#FFA500" />
                                    </View>
                                    <ThemedText style={styles.quickStatValue}>{savingsRate.toFixed(0)}%</ThemedText>
                                    <ThemedText style={styles.quickStatLabel}>Épargne</ThemedText>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </LinearGradient>

                <ThemedView style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" }]}>
                    {/* Conseils avec design moderne */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                                Analyses & Conseils
                            </ThemedText>
                            <TouchableOpacity onPress={() => router.push("/screen/AnalyseConseils")} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <ThemedText style={[styles.seeAllText, { color: Colors.primary }]}>Tout voir</ThemedText>
                                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>

                        {FINANCIAL_INSIGHTS.map((insight, index) => (
                            <View
                                key={insight.id}
                                style={[
                                    styles.modernInsightCard,
                                    {
                                        backgroundColor: isLight ? "#FFFFFF" : "#151515",
                                    },
                                ]}
                            >
                                <View style={styles.insightHeader}>
                                    <View
                                        style={[
                                            styles.modernInsightIcon,
                                            { backgroundColor: insight.color + "15" },
                                        ]}
                                    >
                                        <Ionicons
                                            name={insight.icon as any}
                                            size={20}
                                            color={insight.color}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <ThemedText style={[styles.insightTitle, { color: theme.text }]}>
                                            {insight.title}
                                        </ThemedText>
                                        <ThemedText style={[styles.modernInsightMessage, { color: isLight ? "#666" : "#AAA" }]}>
                                            {insight.message}
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={[styles.cardIndicator, { backgroundColor: insight.color }]} />
                            </View>
                        ))}
                    </View>

                    {/* Graphique d'évolution avec design épuré */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                                Évolution Mensuelle
                            </ThemedText>
                        </View>

                        <View
                            style={[
                                styles.modernChartCard,
                                { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                            ]}
                        >
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <LineChart
                                    data={{
                                        labels: MONTHLY_DATA.map((m) => m.month),
                                        datasets: [
                                            {
                                                data: MONTHLY_DATA.map((m) => m.income),
                                                color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
                                                strokeWidth: 3,
                                            },
                                            {
                                                data: MONTHLY_DATA.map((m) => m.expenses),
                                                color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                                                strokeWidth: 3,
                                            },
                                            {
                                                data: MONTHLY_DATA.map((m) => m.savings),
                                                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                                                strokeWidth: 3,
                                            },
                                        ],
                                    }}
                                    width={width - 32}
                                    height={240}
                                    chartConfig={chartConfig}
                                    bezier
                                    style={styles.chart}
                                    withShadow={false}
                                    withInnerLines={true}
                                    withOuterLines={false}
                                />
                            </ScrollView>

                            <View style={styles.modernChartLegend}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: "#4ADE80" }]} />
                                    <ThemedText style={[styles.legendText, { color: theme.text }]}>Revenus</ThemedText>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: "#FF6B6B" }]} />
                                    <ThemedText style={[styles.legendText, { color: theme.text }]}>Dépenses</ThemedText>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: "#6366F1" }]} />
                                    <ThemedText style={[styles.legendText, { color: theme.text }]}>Épargne</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Catégories avec cartes modernes */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                                Dépenses par Catégorie
                            </ThemedText>
                        </View>

                        <View style={styles.categoriesGrid}>
                            {CATEGORY_SPENDING.map((category, index) => (
                                <View
                                    key={category.category}
                                    style={[
                                        styles.modernCategoryCard,
                                        { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                                    ]}
                                >
                                    <View style={styles.categoryCardTop}>
                                        <View
                                            style={[
                                                styles.modernCategoryIcon,
                                                { backgroundColor: category.color + "15" },
                                            ]}
                                        >
                                            <Ionicons
                                                name={category.icon as any}
                                                size={24}
                                                color={category.color}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                styles.modernCategoryChange,
                                                {
                                                    backgroundColor:
                                                        category.change > 0
                                                            ? "#FF6B6B15"
                                                            : category.change < 0
                                                                ? "#4ADE8015"
                                                                : isLight ? "#F0F0F0" : "#2A2A2A",
                                                },
                                            ]}
                                        >
                                            <Ionicons
                                                name={
                                                    category.change > 0
                                                        ? "trending-up"
                                                        : category.change < 0
                                                            ? "trending-down"
                                                            : "remove"
                                                }
                                                size={12}
                                                color={
                                                    category.change > 0
                                                        ? "#FF6B6B"
                                                        : category.change < 0
                                                            ? "#4ADE80"
                                                            : theme.text
                                                }
                                            />
                                            <ThemedText
                                                style={[
                                                    styles.modernCategoryChangeText,
                                                    {
                                                        color:
                                                            category.change > 0
                                                                ? "#FF6B6B"
                                                                : category.change < 0
                                                                    ? "#4ADE80"
                                                                    : theme.text,
                                                    },
                                                ]}
                                            >
                                                {category.change > 0 ? "+" : ""}
                                                {category.change}%
                                            </ThemedText>
                                        </View>
                                    </View>

                                    <ThemedText style={[styles.modernCategoryName, { color: theme.text }]}>
                                        {category.category}
                                    </ThemedText>

                                    <View style={styles.categoryCardBottom}>
                                        <ThemedText style={[styles.modernCategoryAmount, { color: theme.text }]}>
                                            {formatCurrency(category.amount)}
                                        </ThemedText>
                                        <ThemedText style={[styles.modernCategoryPercentage, { color: isLight ? "#666" : "#AAA" }]}>
                                            {category.percentage}% du total
                                        </ThemedText>
                                    </View>

                                    {/* Barre de progression */}
                                    <View style={[styles.progressBar, { backgroundColor: isLight ? "#F0F0F0" : "#2A2A2A" }]}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: `${category.percentage}%`,
                                                    backgroundColor: category.color
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Stats détaillées modernisées */}
                    <View style={styles.section}>
                        <ThemedText style={[styles.sectionTitle, { color: theme.text, marginBottom: 20 }]}>
                            Statistiques Détaillées
                        </ThemedText>

                        <View style={styles.statsGrid}>
                            <View style={[styles.modernStatCard, { backgroundColor: isLight ? "#FFFFFF" : "#151515" }]}>
                                <View style={[styles.statCardIcon, { backgroundColor: "#6366F115" }]}>
                                    <Ionicons name="wallet" size={20} color="#6366F1" />
                                </View>
                                <ThemedText style={[styles.statCardLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                    Dépenses totales
                                </ThemedText>
                                <ThemedText style={[styles.statCardValue, { color: theme.text }]}>
                                    {formatCurrency(totalExpenses)}
                                </ThemedText>
                            </View>

                            <View style={[styles.modernStatCard, { backgroundColor: isLight ? "#FFFFFF" : "#151515" }]}>
                                <View style={[styles.statCardIcon, { backgroundColor: "#4ADE8015" }]}>
                                    <Ionicons name="trending-up" size={20} color="#4ADE80" />
                                </View>
                                <ThemedText style={[styles.statCardLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                    Épargne moyenne
                                </ThemedText>
                                <ThemedText style={[styles.statCardValue, { color: theme.text }]}>
                                    {formatCurrency(averageMonthlySavings)}
                                </ThemedText>
                            </View>

                            <View style={[styles.modernStatCard, { backgroundColor: isLight ? "#FFFFFF" : "#151515" }]}>
                                <View style={[styles.statCardIcon, { backgroundColor: "#22D3EE15" }]}>
                                    <Ionicons name="pie-chart" size={20} color="#22D3EE" />
                                </View>
                                <ThemedText style={[styles.statCardLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                    Taux d'épargne
                                </ThemedText>
                                <ThemedText style={[styles.statCardValue, { color: theme.text }]}>
                                    {savingsRate.toFixed(1)}%
                                </ThemedText>
                            </View>

                            <View style={[styles.modernStatCard, { backgroundColor: isLight ? "#FFFFFF" : "#151515" }]}>
                                <View style={[styles.statCardIcon, { backgroundColor: "#F59E0B15" }]}>
                                    <Ionicons name="analytics" size={20} color="#F59E0B" />
                                </View>
                                <ThemedText style={[styles.statCardLabel, { color: isLight ? "#666" : "#AAA" }]}>
                                    Moyenne mensuelle
                                </ThemedText>
                                <ThemedText style={[styles.statCardValue, { color: theme.text }]}>
                                    {formatCurrency(averageMonthlyExpenses)}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Actions rapides */}
                    <View style={styles.section}>
                        <ThemedText style={[styles.sectionTitle, { color: theme.text, marginBottom: 20 }]}>
                            Actions Rapides
                        </ThemedText>

                        <View style={styles.actionsGrid}>
                            <TouchableOpacity
                                style={[
                                    styles.modernActionCard,
                                    { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                                ]}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: "#6366F115" }]}>
                                    <Ionicons name="download-outline" size={24} color="#6366F1" />
                                </View>
                                <ThemedText style={[styles.actionText, { color: theme.text }]}>
                                    Télécharger PDF
                                </ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.modernActionCard,
                                    { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                                ]}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: "#4ADE8015" }]}>
                                    <Ionicons name="share-social-outline" size={24} color="#4ADE80" />
                                </View>
                                <ThemedText style={[styles.actionText, { color: theme.text }]}>
                                    Partager
                                </ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.modernActionCard,
                                    { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                                ]}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: "#22D3EE15" }]}>
                                    <Ionicons name="calendar-outline" size={24} color="#22D3EE" />
                                </View>
                                <ThemedText style={[styles.actionText, { color: theme.text }]}>
                                    Planifier
                                </ThemedText>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: "100%", height: 100 }} />
                    </View>
                </ThemedView>
            </ThemedScrollView>
        </ThemedSafeAreaView>
    );
}
