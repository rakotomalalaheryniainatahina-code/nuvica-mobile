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
    Animated,
    FlatList,
} from "react-native";
import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import ThemedView from "@/components/ThemedView";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";

// Types
interface Transaction {
    id: string;
    type: "expense" | "income";
    title: string;
    category: string;
    amount: number;
    date: Date;
    description?: string;
}

// Données d'exemple
const SAMPLE_TRANSACTIONS: Transaction[] = [
    {
        id: "1",
        type: "expense",
        title: "Courses Shoprite",
        category: "Alimentation",
        amount: 45000,
        date: new Date(2025, 9, 10),
        description: "Courses hebdomadaires",
    },
    {
        id: "2",
        type: "income",
        title: "Salaire",
        category: "Salaire",
        amount: 500000,
        date: new Date(2025, 9, 5),
    },
    {
        id: "3",
        type: "expense",
        title: "Taxi",
        category: "Transport",
        amount: 8000,
        date: new Date(2025, 9, 9),
    },
    {
        id: "4",
        type: "expense",
        title: "Restaurant",
        category: "Alimentation",
        amount: 35000,
        date: new Date(2025, 9, 8),
    },
    {
        id: "5",
        type: "income",
        title: "Freelance",
        category: "Travail",
        amount: 150000,
        date: new Date(2025, 9, 7),
    },
];

const CATEGORIES_EXPENSE = [
    { name: "Alimentation", icon: "restaurant", color: "#FF6B6B" },
    { name: "Transport", icon: "car", color: "#4ECDC4" },
    { name: "Logement", icon: "home", color: "#45B7D1" },
    { name: "Loisirs", icon: "game-controller", color: "#FFA07A" },
    { name: "Santé", icon: "medical", color: "#98D8C8" },
    { name: "Shopping", icon: "cart", color: "#F7DC6F" },
    { name: "Autres", icon: "ellipsis-horizontal", color: "#BDC3C7" },
];

const CATEGORIES_INCOME = [
    { name: "Salaire", icon: "briefcase", color: "#4ADE80" },
    { name: "Freelance", icon: "laptop", color: "#22D3EE" },
    { name: "Investissement", icon: "trending-up", color: "#A78BFA" },
    { name: "Autres", icon: "ellipsis-horizontal", color: "#BDC3C7" },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MG", {
        style: "currency",
        currency: "MGA",
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";

    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export default function TransactionPage() {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const isLight = theme === Colors.light;

    const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form states
    const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Filter states
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
    const [filterPeriod, setFilterPeriod] = useState<string>("all");

    const handleAddTransaction = () => {
        const newTransaction: Transaction = {
            id: Date.now().toString(),
            type: transactionType,
            title,
            category,
            amount: parseFloat(amount),
            date,
            description,
        };

        setTransactions([newTransaction, ...transactions]);
        setShowAddModal(false);

        // Reset form
        setTitle("");
        setCategory("");
        setAmount("");
        setDescription("");
        setDate(new Date());
    };

    const filteredTransactions = transactions.filter((transaction) => {
        // Search filter
        const matchesSearch =
            transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
            filterCategory === "all" || transaction.category === filterCategory;

        // Type filter
        const matchesType = filterType === "all" || transaction.type === filterType;

        // Period filter
        let matchesPeriod = true;
        if (filterPeriod !== "all") {
            const today = new Date();
            const transactionDate = transaction.date;

            if (filterPeriod === "today") {
                matchesPeriod = transactionDate.toDateString() === today.toDateString();
            } else if (filterPeriod === "week") {
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesPeriod = transactionDate >= weekAgo;
            } else if (filterPeriod === "month") {
                matchesPeriod = transactionDate.getMonth() === today.getMonth();
            }
        }

        return matchesSearch && matchesCategory && matchesType && matchesPeriod;
    });

    // Group transactions by date
    const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
        const dateKey = formatDate(transaction.date);
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    const activeFiltersCount = [
        filterCategory !== "all",
        filterType !== "all",
        filterPeriod !== "all",
    ].filter(Boolean).length;

    return (
        <ThemedSafeAreaView>
            {/* Header */}
            
            <View style={[styles.header, { backgroundColor: isLight ? "#FFF" : "#1F1F1F" }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Transactions</Text>

                <ThemedView style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "transparent", gap: 10 }}>
                    {/* Search Bar */}
                    <View style={[styles.searchBar, { backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A" }]}>
                        <Ionicons name="search" size={20} color={isLight ? "#A0A0A0" : "#808080"} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.text }]}
                            placeholder="Rechercher une transaction..."
                            placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Filter Button */}
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <Ionicons name="filter" size={20} color={Colors.primary} />
                        {activeFiltersCount > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </ThemedView>
            </View>

            {/* Transaction List */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {Object.entries(groupedTransactions).map(([dateKey, items]) => (
                    <View key={dateKey} style={styles.dateGroup}>
                        <Text style={[styles.dateHeader, { color: theme.text }]}>
                            {dateKey}
                        </Text>
                        {items.map((transaction) => {
                            const categoryData = [...CATEGORIES_EXPENSE, ...CATEGORIES_INCOME].find(
                                (cat) => cat.name === transaction.category
                            );

                            return (
                                <TouchableOpacity
                                    key={transaction.id}
                                    style={[
                                        styles.transactionCard,
                                        { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            {
                                                backgroundColor:
                                                    (categoryData?.color || Colors.primary) + "20",
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={categoryData?.icon as any || "wallet"}
                                            size={24}
                                            color={categoryData?.color || Colors.primary}
                                        />
                                    </View>

                                    <View style={styles.transactionInfo}>
                                        <Text style={[styles.transactionTitle, { color: theme.text }]}>
                                            {transaction.title}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.transactionCategory,
                                                { color: theme.text },
                                            ]}
                                        >
                                            {transaction.category}
                                        </Text>
                                    </View>

                                    <Text
                                        style={[
                                            styles.transactionAmount,
                                            {
                                                color:
                                                    transaction.type === "income"
                                                        ? "#4ADE80"
                                                        : "#FF6B6B",
                                            },
                                        ]}
                                    >
                                        {transaction.type === "income" ? "+" : "-"}
                                        {formatCurrency(transaction.amount)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
                activeOpacity={0.8}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </TouchableOpacity>

            {/* Add Transaction Modal */}
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
                                Nouvelle Transaction
                            </Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <Ionicons name="close" size={28} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Type Selector */}
                            <View style={styles.typeSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        transactionType === "expense" && styles.typeButtonActive,
                                        {
                                            borderColor:
                                                transactionType === "expense"
                                                    ? "#FF6B6B"
                                                    : theme.text,
                                        },
                                    ]}
                                    onPress={() => setTransactionType("expense")}
                                >
                                    <Text
                                        style={[
                                            styles.typeButtonText,
                                            {
                                                color:
                                                    transactionType === "expense"
                                                        ? "#FF6B6B"
                                                        : theme.text,
                                            },
                                        ]}
                                    >
                                        Dépense
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        transactionType === "income" && styles.typeButtonActive,
                                        {
                                            borderColor:
                                                transactionType === "income"
                                                    ? "#4ADE80"
                                                    : theme.text,
                                        },
                                    ]}
                                    onPress={() => setTransactionType("income")}
                                >
                                    <Text
                                        style={[
                                            styles.typeButtonText,
                                            {
                                                color:
                                                    transactionType === "income"
                                                        ? "#4ADE80"
                                                        : theme.text,
                                            },
                                        ]}
                                    >
                                        Revenu
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Title Input */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>Titre</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                            color: theme.text,
                                        },
                                    ]}
                                    placeholder="Ex: Courses, Salaire..."
                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>

                            {/* Category Selector */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>
                                    Catégorie
                                </Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryScroll}
                                >
                                    {(transactionType === "expense"
                                        ? CATEGORIES_EXPENSE
                                        : CATEGORIES_INCOME
                                    ).map((cat) => (
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

                            {/* Amount Input */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>
                                    Montant (Ar)
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                            color: theme.text,
                                        },
                                    ]}
                                    placeholder="0"
                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                            </View>

                            {/* Date Picker */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>Date</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                            justifyContent: "center",
                                        },
                                    ]}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={{ color: theme.text }}>
                                        {date.toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) setDate(selectedDate);
                                    }}
                                />
                            )}

                            {/* Description Input */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>
                                    Description (optionnel)
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.textArea,
                                        {
                                            backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                                            color: theme.text,
                                        },
                                    ]}
                                    placeholder="Ajouter une note..."
                                    placeholderTextColor={isLight ? "#2A2A2A" : "#F5F5F5"}
                                    multiline
                                    numberOfLines={3}
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    (!title || !category || !amount) && styles.submitButtonDisabled,
                                ]}
                                onPress={handleAddTransaction}
                                disabled={!title || !category || !amount}
                            >
                                <Text style={styles.submitButtonText}>Ajouter la transaction</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            styles.filterModal,
                            { backgroundColor: isLight ? "#FFF" : "#1F1F1F" },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Filtres</Text>
                            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                                <Ionicons name="close" size={28} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Type Filter */}
                            <View style={styles.filterSection}>
                                <Text style={[styles.filterSectionTitle, { color: theme.text }]}>
                                    Type
                                </Text>
                                <View style={styles.filterOptions}>
                                    {["all", "expense", "income"].map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.filterOption,
                                                {
                                                    backgroundColor:
                                                        filterType === type
                                                            ? Colors.primary + "20"
                                                            : isLight
                                                                ? "#F5F5F5"
                                                                : "#2A2A2A",
                                                    borderColor:
                                                        filterType === type
                                                            ? Colors.primary
                                                            : "transparent",
                                                },
                                            ]}
                                            onPress={() => setFilterType(type as any)}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterOptionText,
                                                    {
                                                        color:
                                                            filterType === type
                                                                ? Colors.primary
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {type === "all"
                                                    ? "Tous"
                                                    : type === "expense"
                                                        ? "Dépenses"
                                                        : "Revenus"}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Period Filter */}
                            <View style={styles.filterSection}>
                                <Text style={[styles.filterSectionTitle, { color: theme.text }]}>
                                    Période
                                </Text>
                                <View style={styles.filterOptions}>
                                    {[
                                        { key: "all", label: "Tout" },
                                        { key: "today", label: "Aujourd'hui" },
                                        { key: "week", label: "Cette semaine" },
                                        { key: "month", label: "Ce mois" },
                                    ].map((period) => (
                                        <TouchableOpacity
                                            key={period.key}
                                            style={[
                                                styles.filterOption,
                                                {
                                                    backgroundColor:
                                                        filterPeriod === period.key
                                                            ? Colors.primary + "20"
                                                            : isLight
                                                                ? "#F5F5F5"
                                                                : "#2A2A2A",
                                                    borderColor:
                                                        filterPeriod === period.key
                                                            ? Colors.primary
                                                            : "transparent",
                                                },
                                            ]}
                                            onPress={() => setFilterPeriod(period.key)}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterOptionText,
                                                    {
                                                        color:
                                                            filterPeriod === period.key
                                                                ? Colors.primary
                                                                : theme.text,
                                                    },
                                                ]}
                                            >
                                                {period.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Reset Button */}
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={() => {
                                    setFilterType("all");
                                    setFilterPeriod("all");
                                    setFilterCategory("all");
                                }}
                            >
                                <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 20,
        paddingHorizontal: 16
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginVertical: 16,
    },
    searchBar: {
        width: "85%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderRadius: 5,
        gap: 12,
    },
    searchInput: {
        fontSize: 16,
    },
    filterButton: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: Colors.primary + "20",
    },
    filterBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#FF6B6B",
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
    },
    filterBadgeText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    dateGroup: {
        marginTop: 20,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 12,
        textTransform: "uppercase",
    },
    transactionCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 6,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.01,
        shadowRadius: 8,
        elevation: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    transactionCategory: {
        fontSize: 13,
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: "700",
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
        maxHeight: "90%",
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
    typeSelector: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: "center",
    },
    typeButtonActive: {
        borderWidth: 2,
    },
    typeButtonText: {
        fontSize: 16,
        fontWeight: "600",
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
    textArea: {
        height: 80,
        textAlignVertical: "top",
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
    filterModal: {
        maxHeight: "70%",
    },
    filterSection: {
        marginBottom: 24,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },
    filterOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    filterOption: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
        borderWidth: 1,
    },
    filterOptionText: {
        fontSize: 14,
        fontWeight: "500",
    },
    resetButton: {
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.primary,
        marginTop: 12,
    },
    resetButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: "600",
    },
});