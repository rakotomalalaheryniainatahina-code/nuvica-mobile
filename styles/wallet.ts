import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");


const styles = StyleSheet.create({
    floatingCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.1)',
        top: -100,
        right: -50,
    },
    floatingCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.08)',
        bottom: 50,
        left: -50,
    },
    header: {
        height: 240,
        overflow: 'hidden',
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
        backgroundColor: "#fff",
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

export default styles