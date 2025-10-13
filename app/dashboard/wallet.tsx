import React, { useState } from "react";
import {
    View,
    Text,
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
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import ThemedView from "@/components/ThemedView";
import Images from '@/constant/Images';
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import TopHeros from "@/components/Topheros";
import ThemedScrollView from "@/components/ThemedScrollView";
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
    change: number; // % change from last month
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

    const [selectedPeriod, setSelectedPeriod] = useState<"month" | "quarter" | "year">("month");

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
        backgroundGradientFrom: isLight ? "#FFF" : "#1F1F1F",
        backgroundGradientTo: isLight ? "#FFF" : "#1F1F1F",
        decimalPlaces: 0,
        color: (opacity = 1) => Colors.primary,
        labelColor: (opacity = 1) =>
            isLight ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: isLight ? "#E5E7EB" : "#374151",
            strokeWidth: 1,
        },
    };

    return (
        <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
            <ThemedScrollView stickyHeaderIndices={[0]}>
                <TopHeros />

                <ThemedView
                    style={styles.header}
                >
                    <ImageBackground source={Images.starBG} style={{ width: "100%", height: "100%", justifyContent: "center", paddingVertical: 15, paddingHorizontal: 24, }}>

                        <Text style={styles.headerTitle}>Rapports & Analyses</Text>

                        {/* Quick Stats */}
                        <View style={styles.quickStats}>
                            <View style={styles.quickStatItem}>
                                <Ionicons name="trending-up" size={20} color="#4ADE80" />
                                <Text style={styles.quickStatValue}>
                                    {incomeChange >= 0 ? "+" : ""}
                                    {incomeChange.toFixed(1)}%
                                </Text>
                                <Text style={styles.quickStatLabel}>Revenus</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.quickStatItem}>
                                <Ionicons
                                    name={expenseChange > 0 ? "trending-up" : "trending-down"}
                                    size={20}
                                    color={expenseChange > 0 ? "#FF6B6B" : "#4ADE80"}
                                />
                                <Text style={styles.quickStatValue}>
                                    {expenseChange >= 0 ? "+" : ""}
                                    {expenseChange.toFixed(1)}%
                                </Text>
                                <Text style={styles.quickStatLabel}>Dépenses</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.quickStatItem}>
                                <Ionicons name="wallet" size={20} color="#FFA500" />
                                <Text style={styles.quickStatValue}>{savingsRate.toFixed(0)}%</Text>
                                <Text style={styles.quickStatLabel}>Épargne</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </ThemedView>

                <ThemedView
                    style={styles.content}
                >
                    {/* Conseils Financiers */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Analyses & Conseils
                        </Text>
                        {FINANCIAL_INSIGHTS.map((insight) => (
                            <View
                                key={insight.id}
                                style={[
                                    styles.insightCard,
                                    {
                                        backgroundColor: isLight ? "#FFF" : "#1F1F1F",
                                    },
                                ]}
                            >
                                <View style={styles.insightHeader}>
                                    <View
                                        style={[
                                            styles.insightIcon,
                                            { backgroundColor: insight.color + "20" },
                                        ]}
                                    >
                                        <Ionicons
                                            name={insight.icon as any}
                                            size={22}
                                            color={insight.color}
                                        />
                                    </View>
                                    <Text style={[styles.insightTitle, { color: theme.text }]}>
                                        {insight.title}
                                    </Text>
                                </View>
                                <Text style={[styles.insightMessage, { color: theme.text }]}>
                                    {insight.message}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Évolution Mensuelle */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Évolution Mensuelle
                        </Text>
                        <View
                            style={[
                                styles.chartCard,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
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
                                                color: (opacity = 1) => Colors.primary,
                                                strokeWidth: 3,
                                            },
                                        ],
                                        legend: ["Revenus", "Dépenses", "Épargne"],
                                    }}
                                    width={width - 48}
                                    height={250}
                                    chartConfig={chartConfig}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                    }}
                                />
                            </ScrollView>
                            <View style={styles.chartLegend}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: "#4ADE80" }]} />
                                    <Text style={[styles.legendText, { color: theme.text }]}>
                                        Revenus
                                    </Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: "#FF6B6B" }]} />
                                    <Text style={[styles.legendText, { color: theme.text }]}>
                                        Dépenses
                                    </Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View
                                        style={[styles.legendDot, { backgroundColor: Colors.primary }]}
                                    />
                                    <Text style={[styles.legendText, { color: theme.text }]}>
                                        Épargne
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Comparaison Mensuelle */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Comparaison Mois à Mois
                        </Text>
                        <View
                            style={[
                                styles.chartCard,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                                <BarChart
                                    data={{
                                        labels: MONTHLY_DATA.slice(-4).map((m) => m.month),
                                        datasets: [
                                            {
                                                data: MONTHLY_DATA.slice(-4).map((m) => m.expenses),
                                            },
                                        ],
                                    }}
                                    width={width - 48}
                                    height={220}
                                    chartConfig={{
                                        ...chartConfig,
                                        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                                    }}
                                    style={{
                                        marginVertical: 8,
                                    }}
                                    showValuesOnTopOfBars
                                    fromZero
                                />
                            </ScrollView>
                            <View style={styles.comparisonStats}>
                                <View style={styles.comparisonStatItem}>
                                    <Text style={[styles.comparisonLabel, { color: theme.text }]}>
                                        Moyenne mensuelle
                                    </Text>
                                    <Text style={[styles.comparisonValue, { color: theme.text }]}>
                                        {formatCurrency(averageMonthlyExpenses)}
                                    </Text>
                                </View>
                                <View style={styles.comparisonStatItem}>
                                    <Text style={[styles.comparisonLabel, { color: theme.text }]}>
                                        Ce mois
                                    </Text>
                                    <Text
                                        style={[
                                            styles.comparisonValue,
                                            {
                                                color:
                                                    currentMonth.expenses > averageMonthlyExpenses
                                                        ? "#FF6B6B"
                                                        : "#4ADE80",
                                            },
                                        ]}
                                    >
                                        {formatCurrency(currentMonth.expenses)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Dépenses par Catégorie */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Dépenses par Catégorie
                        </Text>
                        <View
                            style={[
                                styles.chartCard,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                                <PieChart
                                    data={CATEGORY_SPENDING.map((cat) => ({
                                        name: cat.category,
                                        population: cat.amount,
                                        color: cat.color,
                                        legendFontColor: isLight ? "#333" : "#CCC",
                                        legendFontSize: 12,
                                    }))}
                                    width={width - 48}
                                    height={220}
                                    chartConfig={chartConfig}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                            </ScrollView>
                        </View>

                        {/* Détails par catégorie */}
                        <View style={styles.categoryDetails}>
                            {CATEGORY_SPENDING.map((category) => (
                                <View
                                    key={category.category}
                                    style={[
                                        styles.categoryCard,
                                        { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                                    ]}
                                >
                                    <View style={styles.categoryLeft}>
                                        <View
                                            style={[
                                                styles.categoryIcon,
                                                { backgroundColor: category.color + "20" },
                                            ]}
                                        >
                                            <Ionicons
                                                name={category.icon as any}
                                                size={22}
                                                color={category.color}
                                            />
                                        </View>
                                        <View>
                                            <Text style={[styles.categoryName, { color: theme.text }]}>
                                                {category.category}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.categoryPercentage,
                                                    { color: theme.text },
                                                ]}
                                            >
                                                {category.percentage}% du total
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.categoryRight}>
                                        <Text style={[styles.categoryAmount, { color: theme.text }]}>
                                            {formatCurrency(category.amount)}
                                        </Text>
                                        <View
                                            style={[
                                                styles.categoryChange,
                                                {
                                                    backgroundColor:
                                                        category.change > 0
                                                            ? "#FF6B6B20"
                                                            : category.change < 0
                                                                ? "#4ADE8020"
                                                                : theme.text + "20",
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
                                                size={14}
                                                color={
                                                    category.change > 0
                                                        ? "#FF6B6B"
                                                        : category.change < 0
                                                            ? "#4ADE80"
                                                            : theme.text
                                                }
                                            />
                                            <Text
                                                style={[
                                                    styles.categoryChangeText,
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
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Statistiques Détaillées */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Statistiques Détaillées
                        </Text>
                        <View
                            style={[
                                styles.statsCard,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: theme.text }]}>
                                        Dépenses totales (Oct)
                                    </Text>
                                    <Text style={[styles.statValue, { color: theme.text }]}>
                                        {formatCurrency(totalExpenses)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: theme.text }]}>
                                        Moyenne mensuelle
                                    </Text>
                                    <Text style={[styles.statValue, { color: theme.text }]}>
                                        {formatCurrency(averageMonthlyExpenses)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: theme.text }]}>
                                        Épargne moyenne
                                    </Text>
                                    <Text style={[styles.statValue, { color: "#4ADE80" }]}>
                                        {formatCurrency(averageMonthlySavings)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: theme.text }]}>
                                        Taux d'épargne
                                    </Text>
                                    <Text style={[styles.statValue, { color: "#22D3EE" }]}>
                                        {savingsRate.toFixed(1)}%
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statLabel, { color: theme.text }]}>
                                        Plus grosse dépense
                                    </Text>
                                    <Text style={[styles.statValue, { color: theme.text }]}>
                                        {CATEGORY_SPENDING[0].category} -{" "}
                                        {formatCurrency(CATEGORY_SPENDING[0].amount)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Export Options */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Export & Partage
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.exportButton,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <Ionicons name="download" size={24} color={Colors.primary} />
                            <Text style={[styles.exportButtonText, { color: theme.text }]}>
                                Télécharger le rapport PDF
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.text} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.exportButton,
                                { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                            ]}
                        >
                            <Ionicons name="share-social" size={24} color={Colors.primary} />
                            <Text style={[styles.exportButtonText, { color: theme.text }]}>
                                Partager les analyses
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.text} />
                        </TouchableOpacity>
                        <View style={{width: "100%", height: 100}}/>
                    </View>
                </ThemedView>
            </ThemedScrollView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 200,
        backgroundColor: Colors.primary,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 20,
    },
    quickStats: {
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 6,
        padding: 16,
        alignItems: "center",
    },
    quickStatItem: {
        flex: 1,
        alignItems: "center",
    },
    quickStatValue: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FFF",
        marginTop: 8,
        marginBottom: 4,
    },
    quickStatLabel: {
        fontSize: 11,
        color: "#FFF",
        opacity: 0.9,
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        marginHorizontal: 12,
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 16,
    },
    insightCard: {
        padding: 16,
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderLeftWidth: 1,
        borderColor: "rgba(153, 153, 153, 0.2)",
    },
    insightHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
    },
    insightIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
    },
    insightMessage: {
        fontSize: 14,
        lineHeight: 20,
    },
    chartCard: {
        padding: 16,
        borderRadius: 6,
    },
    chartLegend: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginBottom: 16,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: 12,
        fontWeight: "500",
    },
    comparisonStats: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },
    comparisonStatItem: {
        alignItems: "center",
    },
    comparisonLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    comparisonValue: {
        fontSize: 16,
        fontWeight: "700",
    },
    categoryDetails: {
        marginTop: 16,
        gap: 12,
    },
    categoryCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderLeftWidth: 1,
        borderColor: "rgba(153, 153, 153, 0.2)",
    },
    categoryLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    categoryPercentage: {
        fontSize: 12,
    },
    categoryRight: {
        alignItems: "flex-end",
    },
    categoryAmount: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
    },
    categoryChange: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryChangeText: {
        fontSize: 12,
        fontWeight: "600",
    },
    statsCard: {
        padding: 20,
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderLeftWidth: 1,
        borderColor: "rgba(153, 153, 153, 0.2)",
    },
    statRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    statItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statLabel: {
        fontSize: 14,
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: "700",
    },
    exportButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 6,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    exportButtonText: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        marginLeft: 12,
    },
});


// import ThemedSafeAreaView from "@/components/ThemedSafeAreaView"
// import TopHeros from "@/components/Topheros"
// import { Text } from "react-native"

// const Wallet = () => {
//     return (
//         <ThemedSafeAreaView>
//             <TopHeros />
//             <Text>Wallet</Text>
//         </ThemedSafeAreaView>
//     )
// }

// export default Wallet