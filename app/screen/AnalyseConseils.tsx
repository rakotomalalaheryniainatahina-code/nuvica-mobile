import React, { useState } from "react";
import {
    View,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedText from "@/components/ThemedText";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { useRouter } from "expo-router";
const { width } = Dimensions.get("window");

interface FinancialInsight {
    id: string;
    type: "warning" | "success" | "info" | "tip";
    title: string;
    message: string;
    icon: string;
    color: string;
}

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


const AnalyseConseils = () => {


    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const isLight = theme === Colors.light;
    const router = useRouter();
    return (
        <ThemedSafeAreaView style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" }]}>
            {/* Conseils avec design moderne */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="chevron-back" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                        Analyses & Conseils
                    </ThemedText>
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
        </ThemedSafeAreaView>
    );
};


export default AnalyseConseils

const styles = StyleSheet.create({
    header: {
        height: 240,
        overflow: 'hidden',
        backgroundColor: Colors.primary,
    },
    headerBackground: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
    },
    headerGradient: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'space-between',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
        marginBottom: 4,
        fontWeight: "500",
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FFF",
        letterSpacing: -0.5,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    quickStatsContainer: {
        flexDirection: "row",
        gap: 12,
    },
    quickStatCard: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: 'blur(10px)',
        borderRadius: 6,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    quickStatValue: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FFF",
        marginBottom: 2,
    },
    quickStatLabel: {
        fontSize: 11,
        color: "rgba(255, 255, 255, 0.9)",
        fontWeight: "500",
    },
    content: {
        flex: 1,
        paddingTop: 24,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: -0.3,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: "600",
    },
    modernInsightCard: {
        padding: 20,
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: "rgba(126, 124, 124, 0.2)",
    },
    insightHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 14,
    },
    modernInsightIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
    },
    modernInsightMessage: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "400",
    },
    cardIndicator: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    modernChartCard: {
        padding: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(126, 124, 124, 0.2)",
    },
    chart: {
        marginVertical: 8,
        borderRadius: 6,
    },
    modernChartLegend: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 24,
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.05)",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 13,
        fontWeight: "600",
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    modernCategoryCard: {
        width: (width - 52) / 2,
        padding: 16,
        borderRadius: 6,
        borderTopWidth: 1,
        borderWidth: 1,
        borderColor: "rgba(126, 124, 124, 0.2)",
    },
    categoryCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    modernCategoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    modernCategoryChange: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    modernCategoryChangeText: {
        fontSize: 11,
        fontWeight: "700",
    },
    modernCategoryName: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 8,
    },
    categoryCardBottom: {
        marginBottom: 12,
    },
    modernCategoryAmount: {
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 4,
    },
    modernCategoryPercentage: {
        fontSize: 12,
        fontWeight: "500",
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    modernStatCard: {
        width: (width - 52) / 2,
        padding: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(126, 124, 124, 0.2)",
    },
    statCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    statCardLabel: {
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 8,
    },
    statCardValue: {
        fontSize: 18,
        fontWeight: "800",
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    modernActionCard: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(126, 124, 124, 0.2)",
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    actionText: {
        fontSize: 13,
        fontWeight: "700",
        textAlign: 'center',
    },
});
