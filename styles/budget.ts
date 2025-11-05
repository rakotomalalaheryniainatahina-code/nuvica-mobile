// styles/budget.ts

import { Colors } from '@/constant/Colors';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTop: {
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
    },

    // Summary Cards
    summaryContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    summaryCard: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    summaryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        overflow: 'hidden',
    },
    summaryIconGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryInfo: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    summaryAmount: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Warning Cards
    warningContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    warningCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 10,
        borderRadius: 6,
    },
    warningText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Content
    content: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 20
    },

    // Budget Card
    budgetCard: {
        // marginHorizontal: 20,
        // marginBottom: 16,
        // padding: 16,
        // borderRadius: 6,
        // position: 'relative',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 3,
        padding: 20,
        borderRadius: 6,
        marginBottom: 16,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: "rgba(126, 124, 124, 0.2)",
        position: "relative",
        overflow: "hidden",
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    budgetLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    budgetIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    budgetCategory: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    periodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    periodText: {
        fontSize: 12,
    },

    // Progress Circle
    progressContainer: {
        position: 'relative',
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressTextContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    progressPercentage: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressSymbol: {
        fontSize: 12,
        marginLeft: 2,
    },

    // Budget Details
    budgetDetails: {
        gap: 8,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 13,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
    },

    // Progress Bar
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },

    // Card Indicator
    cardIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },

    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 14,
        textAlign: 'center',
    },

    // Add Button
    addButton: {
        position: 'absolute',
        bottom: 50,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
        overflow: 'hidden',
    },
    addButtonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Form Inputs
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 6,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
    },
    currencyLabel: {
        fontSize: 14,
        fontWeight: '600',
    },

    // Category Chips
    categoryScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 2,
        marginRight: 10,
    },
    categoryChipIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '600',
    },

    // Period Grid
    periodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    periodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 6,
        borderWidth: 2,
        minWidth: (width - 60) / 2,
    },
    periodButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },

    // Date Range
    dateRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        borderRadius: 14,
    },
    dateTextContainer: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 11,
        marginBottom: 2,
    },
    dateValue: {
        fontSize: 13,
        fontWeight: '600',
    },
    dateArrow: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Info Box
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        borderRadius: 14,
        marginBottom: 24,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },

    // Submit Button
    submitButton: {
        borderRadius: 6,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;