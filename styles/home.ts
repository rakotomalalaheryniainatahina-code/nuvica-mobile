import { Colors } from "@/constant/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
     unreadBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FF6B6B',
        borderRadius: 20,
        width: 10,
        height: 10,
        zIndex: 10,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF6B6B',
    },

    // Styles pour les états de chargement
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },

    // Amélioration des cartes d'alertes
    alertCardWrapper: {
        position: 'relative',
    },
    
    // Badge de statut amélioré
    statusBadgeContainer: {
        flexDirection: 'row',
        gap: 8,
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
    },

    // Animation des alertes
    alertCardAnimated: {
        transform: [{ scale: 1 }],
    },
    
    alertCardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.8,
    },

    // Indicateur de refresh
    refreshIndicator: {
        paddingVertical: 10,
        alignItems: 'center',
    },

    // Message de statut
    statusMessage: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },

    // Zone d'action rapide
    quickActionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    quickActionText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
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
    headerContent: {
        position: "relative",
        flex: 1,
        zIndex: 1,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: "space-between",
    },
    balanceContainer: {
        gap: 12,
    },
    balanceTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    balanceLabel: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.85)",
        fontWeight: "600",
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    balanceAmount: {
        fontSize: 38,
        color: "#FFF",
        fontWeight: "800",
        letterSpacing: -1,
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
    percentBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        gap: 6,
        borderWidth: 1,
        borderColor: "rgba(74, 222, 128, 0.3)",
    },
    percentText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700",
    },
    balanceInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    balanceSubtext: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.7)",
        fontWeight: "500",
    },
    quickStatsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20
    },
    statCard: {
        width: "30%",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        borderRadius: 6,
        padding: 16,
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    statIconGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    statInfo: {
        flex: 1,
    },
    statLabel: {
        fontSize: 11,
        color: "rgba(255, 255, 255, 0.85)",
        fontWeight: "600",
        marginBottom: 2,
    },
    statValue: {
        fontSize: 13,
        color: "#FFF",
        fontWeight: "700",
    },
    contentContainer: {
        flex: 1,
        paddingTop: 24,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "800",
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 13,
        fontWeight: "500",
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    viewAllText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: "600",
    },
    alertsGrid: {
        gap: 16,
    },
    modernAlertCard: {
        borderRadius: 6,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(126, 124, 124, 0.2)",
    },
    alertCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    alertLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    alertIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    alertCategory: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 4,
    },
    alertBudgetText: {
        fontSize: 12,
        fontWeight: "500",
    },
    progressContainer: {
        position: "relative",
    },
    progressTextContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    progressPercentage: {
        fontSize: 16,
        fontWeight: "800",
    },
    progressSymbol: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 2,
    },
    alertFooter: {
        gap: 8,
    },
    spendingBar: {
        height: 6,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 3,
        overflow: "hidden",
    },
    spendingBarFill: {
        height: "100%",
        borderRadius: 3,
    },
    spendingInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    spentAmount: {
        fontSize: 16,
        fontWeight: "700",
    },
    spendingStatus: {
        fontSize: 13,
        fontWeight: "600",
    },
    overBudgetBadge: {
        marginBottom: 12,
        width: 80,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF6B6B15",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    overBudgetText: {
        fontSize: 11,
        color: "#FF6B6B",
        fontWeight: "700",
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 60,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: "700",
    },
    emptyMessage: {
        fontSize: 14,
        textAlign: "center",
    },
});

export default styles;