import Topheros from "@/components/Topheros"
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView"
import ThemedScrollView from "@/components/ThemedScrollView"
import { TouchableOpacity, useColorScheme, View, Animated, ActivityIndicator, RefreshControl, Alert } from "react-native"
import ThemedView from '@/components/ThemedView';
import { Colors } from "@/constant/Colors";
import ThemedText from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useRouter } from "expo-router";
import styles from "@/styles/home";
import { useEffect, useRef, useState, useCallback } from "react";
import { dashboardService, DashboardStats, AlertData } from "@/services/dashboardService";

const Home = () => {
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    const isLight = theme === Colors.light;
    const router = useRouter();

    // États
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("fr-MG", {
            style: "currency",
            currency: "MGA",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Charger les données du dashboard
    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getDashboard();
            setStats(data.stats);
            setAlerts(data.alerts);
            setUnreadCount(data.unreadAlertsCount);
        } catch (error) {
            console.error('Erreur lors du chargement du dashboard:', error);
            Alert.alert('Erreur', 'Impossible de charger les données du dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    // Rafraîchir les données
    const onRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    };

    // Marquer une alerte comme lue
    const handleMarkAlertAsRead = async (alertId: string) => {
        try {
            await dashboardService.markAlertAsRead(alertId);
            // Mettre à jour l'état local
            setAlerts(prev => prev.map(alert => 
                alert.id === alertId ? { ...alert, isRead: true } : alert
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erreur lors du marquage de l\'alerte:', error);
        }
    };

    // Supprimer une alerte
    const handleDeleteAlert = (alertId: string) => {
        Alert.alert(
            'Supprimer l\'alerte',
            'Voulez-vous vraiment supprimer cette alerte ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dashboardService.deleteAlert(alertId);
                            setAlerts(prev => prev.filter(alert => alert.id !== alertId));
                            Alert.alert('Succès', 'Alerte supprimée');
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de supprimer l\'alerte');
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        loadDashboardData();

        // Animation d'entrée
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

        // Animation de rotation continue pour l'icône
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
                </View>
            </ThemedSafeAreaView>
        );
    }

    return (
        <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
            <ThemedScrollView 
                stickyHeaderIndices={[0]}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor={Colors.primary}
                    />
                }
            >
                <View style={{ width: "100%", height: "auto", zIndex: 2 }}>
                    <Topheros />
                </View>

                {/* Header Premium */}
                <View
                    style={{ position: 'relative', top: 0, left: 0, width: '100%', height: 'auto', overflow: 'hidden' }}
                >
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
                        {/* Solde Principal */}
                        <View style={styles.balanceContainer}>
                            <View style={styles.balanceTop}>
                                <View>
                                    <ThemedText style={styles.balanceLabel}>
                                        Solde actuel
                                    </ThemedText>
                                    <ThemedText style={styles.balanceAmount}>
                                        {formatCurrency(stats?.currentBalance || 0)}
                                    </ThemedText>
                                </View>
                                <TouchableOpacity style={styles.percentBadge}>
                                    <Ionicons 
                                        name={stats?.percentageChange && stats.percentageChange >= 0 ? "trending-up" : "trending-down"} 
                                        size={18} 
                                        color="#FFF" 
                                    />
                                    <ThemedText style={styles.percentText}>
                                        {stats?.percentageChange ? 
                                            `${stats.percentageChange >= 0 ? '+' : ''}${stats.percentageChange.toFixed(1)}%` 
                                            : '0%'}
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.balanceInfo}>
                                <Ionicons name="wallet-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
                                <ThemedText style={styles.balanceSubtext}>
                                    Mis à jour il y a {stats?.lastUpdated ? 
                                        Math.round((Date.now() - new Date(stats.lastUpdated).getTime()) / 60000) : 0} min
                                </ThemedText>
                            </View>
                        </View>

                        {/* Quick Stats Modernes */}
                        <View style={styles.quickStatsContainer}>
                            <View style={styles.statCard}>
                                    <View style={[styles.statIconGradient, {
                                    backgroundColor:'#fb923c23'
                                }]}>
                                    <Ionicons name="wallet" size={20} color="#FB923C" />
                                    </View>
                                <View>
                                    <ThemedText style={styles.statLabel}>Budget</ThemedText>
                                    <ThemedText style={styles.statValue}>
                                        {formatCurrency(stats?.totalBudget || 0)}
                                    </ThemedText>
                                </View>
                            </View>

                            <View style={styles.statCard}>
                                <View style={[styles.statIconGradient, {
                                    backgroundColor:'rgba(74, 222, 128, 0.15)'
                                }]}>
                                    <Ionicons name="arrow-down-circle" size={20} color="#4ADE80" />
                                    
                                </View>
                                <View>
                                    <ThemedText style={styles.statLabel}>Revenus</ThemedText>
                                    <ThemedText style={styles.statValue}>
                                        {formatCurrency(stats?.totalIncome || 0)}
                                    </ThemedText>
                                </View>
                            </View>

                            <View style={styles.statCard}>
                                 <View style={[styles.statIconGradient, {
                                    backgroundColor:'#f8717128'
                                }]}>
                                    <Ionicons name="arrow-up-circle" size={20} color="#F87171" />
                                    
                                </View>
                                <View>
                                    <ThemedText style={styles.statLabel}>Dépenses</ThemedText>
                                    <ThemedText style={styles.statValue}>
                                        {formatCurrency(stats?.totalExpense || 0)}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content Section */}
                <ThemedView style={[styles.contentContainer, { backgroundColor: isLight ? "#F5F5F7" : theme.background }]}>
                    {/* Section Header */}
                    <View style={styles.sectionHeader}>
                        <View>
                            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
                                Alertes Budget
                            </ThemedText>
                            <ThemedText style={[styles.sectionSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
                                {alerts.length} notifications actives
                                {unreadCount > 0 && ` • ${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
                            </ThemedText>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/screen/budget')} style={[styles.viewAllButton, { marginTop: 5 }]}>
                            <ThemedText style={styles.viewAllText}>Tout voir</ThemedText>
                            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Alertes Grid */}
                    {alerts.length > 0 && (
                        <View style={styles.alertsGrid}>
                            {alerts.map((alert) => {
                                const isOverBudget = alert.percentage > 100;
                                const alertColor = alert.type === 'DANGER' ? '#FF6B6B' : '#FFA500';

                                return (
                                    <TouchableOpacity
                                        key={alert.id}
                                        style={[
                                            styles.modernAlertCard,
                                            { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
                                        ]}
                                        activeOpacity={0.7}
                                        onPress={() => handleMarkAlertAsRead(alert.id)}
                                        onLongPress={() => handleDeleteAlert(alert.id)}
                                    >
                                        {/* Unread Badge */}
                                        {!alert.isRead && (
                                            <View style={[styles.unreadBadge, { alignSelf: "flex-end" }]}>
                                                <View style={styles.unreadDot} />
                                            </View>
                                        )}

                                        {/* Status Badge */}
                                        {isOverBudget && (
                                            <View style={[styles.overBudgetBadge, { alignSelf: "flex-end", marginTop: !alert.isRead ? 25 : 0 }]}>
                                                <Ionicons name="alert-circle" size={12} color="#FF6B6B" />
                                                <ThemedText style={styles.overBudgetText}>Dépassé</ThemedText>
                                            </View>
                                        )}

                                        {/* Header de la carte */}
                                        <View style={styles.alertCardHeader}>
                                            <View style={styles.alertLeft}>
                                                <LinearGradient
                                                    colors={
                                                        alert.type === "DANGER"
                                                            ? ["#FF6B6B", "#EE5A52"]
                                                            : ["#FFA500", "#FF8C00"]
                                                    }
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.alertIconContainer}
                                                >
                                                    <Ionicons
                                                        name={
                                                            alert.type === "DANGER"
                                                                ? "alert-circle"
                                                                : "warning"
                                                        }
                                                        size={22}
                                                        color="#FFF"
                                                    />
                                                </LinearGradient>
                                                <View>
                                                    <ThemedText style={[styles.alertCategory, { color: theme.text }]}>
                                                        {alert.category}
                                                    </ThemedText>
                                                    <ThemedText style={[styles.alertBudgetText, { color: isLight ? "#666" : "#AAA" }]}>
                                                        Budget: {formatCurrency(alert.budget)}
                                                    </ThemedText>
                                                </View>
                                            </View>

                                            {/* Circular Progress */}
                                            <View style={styles.progressContainer}>
                                                <Svg height="56" width="56" viewBox="0 0 120 120">
                                                    <Circle
                                                        stroke={isLight ? "#F0F0F0" : "#2A2A2A"}
                                                        fill="none"
                                                        cx="60"
                                                        cy="60"
                                                        r={50}
                                                        strokeWidth={8}
                                                    />
                                                    <Circle
                                                        stroke={alertColor}
                                                        fill="none"
                                                        cx="60"
                                                        cy="60"
                                                        r={50}
                                                        strokeWidth={8}
                                                        strokeDasharray={2 * Math.PI * 50}
                                                        strokeDashoffset={
                                                            (2 * Math.PI * 50) -
                                                            ((alert.percentage / 100) * (2 * Math.PI * 50))
                                                        }
                                                        strokeLinecap="round"
                                                        transform="rotate(-90 60 60)"
                                                    />
                                                </Svg>
                                                <View style={styles.progressTextContainer}>
                                                    <ThemedText style={[styles.progressPercentage, { color: theme.text }]}>
                                                        {alert.percentage}
                                                    </ThemedText>
                                                    <ThemedText style={[styles.progressSymbol, { color: isLight ? "#999" : "#666" }]}>
                                                        %
                                                    </ThemedText>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Spending Info */}
                                        <View style={styles.alertFooter}>
                                            <View style={styles.spendingBar}>
                                                <View
                                                    style={[
                                                        styles.spendingBarFill,
                                                        {
                                                            width: `${Math.min(alert.percentage, 100)}%`,
                                                            backgroundColor: alertColor
                                                        }
                                                    ]}
                                                />
                                            </View>
                                            <View style={styles.spendingInfo}>
                                                <ThemedText style={[styles.spentAmount, { color: theme.text }]}>
                                                    {formatCurrency(alert.spent)}
                                                </ThemedText>
                                                <ThemedText style={[styles.spendingStatus, {
                                                    color: isOverBudget ? "#FF6B6B" : (isLight ? "#666" : "#AAA")
                                                }]}>
                                                    {isOverBudget
                                                        ? `+${formatCurrency(alert.spent - alert.budget)} dépassé`
                                                        : `${formatCurrency(alert.budget - alert.spent)} restant`
                                                    }
                                                </ThemedText>
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {/* Empty State */}
                    {alerts.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
                            <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
                                Tout va bien !
                            </ThemedText>
                            <ThemedText style={[styles.emptyMessage, { color: isLight ? "#666" : "#AAA" }]}>
                                Aucune alerte budget pour le moment
                            </ThemedText>
                        </View>
                    )}

                    <View style={{ height: 100 }} />

                </ThemedView>

            </ThemedScrollView>

        </ThemedSafeAreaView>
    );
};

export default Home;





// import Topheros from "@/components/Topheros"
// import ThemedSafeAreaView from "@/components/ThemedSafeAreaView"
// import ThemedScrollView from "@/components/ThemedScrollView"
// import { ImageBackground, StyleSheet, Text, TouchableOpacity, useColorScheme, View, Dimensions, Animated } from "react-native"
// import ThemedView from '@/components/ThemedView';
// import { Colors } from "@/constant/Colors";
// import Image from "@/constant/Images";
// import { Theme } from "@/types/ColorType";
// import ThemedText from "@/components/ThemedText";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import Svg, { Circle } from "react-native-svg";
// import { useRouter } from "expo-router";
// import styles from "@/styles/home";
// import LogoutButton from "@/common/logoutButton";
// import { useEffect, useRef } from "react";

// const { width } = Dimensions.get("window");

// const SAMPLE_DATA = {
//     alerts: [
//         {
//             id: 1,
//             type: "warning",
//             category: "Alimentation",
//             message: "Budget alimentation dépassé de 500 Ar",
//             budget: 1000,
//             spent: 400,
//         },
//         {
//             id: 2,
//             type: "danger",
//             category: "Loisirs",
//             message: "Budget loisirs atteint à 95%",
//             budget: 1600,
//             spent: 1520,
//         },
//         {
//             id: 3,
//             type: "warning",
//             category: "Transport",
//             message: "Budget transport dépassé",
//             budget: 100,
//             spent: 150,
//         },
//         {
//             id: 4,
//             type: "danger",
//             category: "Shopping",
//             message: "Limite de dépenses atteinte",
//             budget: 1600,
//             spent: 1520,
//         },
//         {
//             id: 5,
//             type: "danger",
//             category: "Santé",
//             message: "Budget santé dépassé",
//             budget: 200,
//             spent: 1520,
//         },
//         {
//             id: 6,
//             type: "warning",
//             category: "Éducation",
//             message: "Attention aux dépenses",
//             budget: 100,
//             spent: 85,
//         },
//     ],
// };

// const Home = () => {
//     const colorScheme = useColorScheme();
//     const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
//     const isLight = theme === Colors.light;
//     const vola: number = 5000;
//     const pourcent: number = 50;
//     const router = useRouter();
//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat("fr-MG", {
//             style: "currency",
//             currency: "MGA",
//             minimumFractionDigits: 0,
//         }).format(amount);
//     };

//     // Animations
//     const fadeAnim = useRef(new Animated.Value(0)).current;
//     const slideAnim = useRef(new Animated.Value(50)).current;
//     const scaleAnim = useRef(new Animated.Value(0.9)).current;
//     const rotateAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         // Animation d'entrée
//         Animated.parallel([
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 800,
//                 useNativeDriver: true,
//             }),
//             Animated.spring(slideAnim, {
//                 toValue: 0,
//                 tension: 50,
//                 friction: 7,
//                 useNativeDriver: true,
//             }),
//             Animated.spring(scaleAnim, {
//                 toValue: 1,
//                 tension: 50,
//                 friction: 7,
//                 useNativeDriver: true,
//             }),
//         ]).start();

//         // Animation de rotation continue pour l'icône
//         const rotationAnimation = Animated.loop(
//             Animated.timing(rotateAnim, {
//                 toValue: 1,
//                 duration: 20000,
//                 useNativeDriver: true,
//             })
//         );
//         rotationAnimation.start();

//         return () => {
//             rotationAnimation.stop();
//         };
//     }, []);

//     const spin = rotateAnim.interpolate({
//         inputRange: [0, 1],
//         outputRange: ['0deg', '360deg'],
//     });

//     return (
//         <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>

//             <ThemedScrollView stickyHeaderIndices={[0]}>
//                 <View style={{ width: "100%", height: "auto", zIndex: 2 }}>
//                     <Topheros />
//                 </View>

//                 <LogoutButton />

//                 {/* Header Premium */}

//                 <View
//                     style={{ position: 'relative', top: 0, left: 0, width: '100%', height: 295, overflow: 'hidden' }}
//                 >
//                     <LinearGradient
//                         colors={colorScheme === 'dark'
//                             ? ['#1a1a1a', '#2d2d2d', '#1a1a1a']
//                             : [Colors.primary, '#4ADE80', '#6366f1']}
//                         start={{ x: -0.5, y: 0 }}
//                         end={{ x: 1, y: 1 }}
//                         style={{ zIndex: 0, width: "100%", height: "100%", position: 'absolute' }}>
//                         <Animated.View style={[styles.floatingCircle1, { transform: [{ rotate: spin }] }]} />
//                         <Animated.View style={[styles.floatingCircle2, { transform: [{ rotate: spin }] }]} />
//                     </LinearGradient>
//                     <View style={styles.headerContent}>
//                         {/* Solde Principal */}
//                         <View style={styles.balanceContainer}>
//                             <View style={styles.balanceTop}>
//                                 <View>
//                                     <ThemedText style={styles.balanceLabel}>
//                                         Solde actuel
//                                     </ThemedText>
//                                     <ThemedText style={styles.balanceAmount}>
//                                         {formatCurrency(vola)}
//                                     </ThemedText>
//                                 </View>
//                                 <TouchableOpacity style={styles.percentBadge}>
//                                     <Ionicons name="trending-up" size={18} color="#FFF" />
//                                     <ThemedText style={styles.percentText}>
//                                         +{pourcent.toFixed(1)}%
//                                     </ThemedText>
//                                 </TouchableOpacity>
//                             </View>

//                             <View style={styles.balanceInfo}>
//                                 <Ionicons name="wallet-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
//                                 <ThemedText style={styles.balanceSubtext}>
//                                     Mis à jour il y a 5 min
//                                 </ThemedText>
//                             </View>
//                         </View>

//                         {/* Quick Stats Modernes */}
//                         <View style={styles.quickStatsContainer}>
//                             <View style={styles.statCard}>
//                                 <LinearGradient
//                                     colors={["#FB923C", "#EA580C"]}
//                                     start={{ x: 0, y: 0 }}
//                                     end={{ x: 1, y: 1 }}
//                                     style={styles.statIconGradient}
//                                 >
//                                     <Ionicons name="trending-up" size={20} color="#FFF" />
//                                 </LinearGradient>
//                                 <View>
//                                     <ThemedText style={styles.statLabel}>Total</ThemedText>
//                                     <ThemedText style={styles.statValue}>
//                                         {formatCurrency(vola)}
//                                     </ThemedText>
//                                 </View>
//                             </View>

//                             <View style={styles.statCard}>
//                                 <LinearGradient
//                                     colors={["#4ADE80", "#16A34A"]}
//                                     start={{ x: 0, y: 0 }}
//                                     end={{ x: 1, y: 1 }}
//                                     style={styles.statIconGradient}
//                                 >
//                                     <Ionicons name="arrow-up-circle" size={20} color="#FFF" />
//                                 </LinearGradient>
//                                 <View>
//                                     <ThemedText style={styles.statLabel}>Revenus</ThemedText>
//                                     <ThemedText style={styles.statValue}>
//                                         {formatCurrency(vola)}
//                                     </ThemedText>
//                                 </View>
//                             </View>

//                             <View style={styles.statCard}>
//                                 <LinearGradient
//                                     colors={["#F87171", "#DC2626"]}
//                                     start={{ x: 0, y: 0 }}
//                                     end={{ x: 1, y: 1 }}
//                                     style={styles.statIconGradient}
//                                 >
//                                     <Ionicons name="arrow-down-circle" size={20} color="#FFF" />
//                                 </LinearGradient>
//                                 <View>
//                                     <ThemedText style={styles.statLabel}>Dépenses</ThemedText>
//                                     <ThemedText style={styles.statValue}>
//                                         {formatCurrency(vola)}
//                                     </ThemedText>
//                                 </View>
//                             </View>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Content Section */}
//                 <ThemedView style={[styles.contentContainer, { backgroundColor: isLight ? "#F5F5F7" : theme.background }]}>
//                     {/* Section Header */}
//                     <View style={styles.sectionHeader}>
//                         <View>
//                             <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
//                                 Alertes Budget
//                             </ThemedText>
//                             <ThemedText style={[styles.sectionSubtitle, { color: isLight ? "#666" : "#AAA" }]}>
//                                 {SAMPLE_DATA.alerts.length} notifications actives
//                             </ThemedText>
//                         </View>
//                         <TouchableOpacity onPress={() => router.push('/screen/notification')} style={[styles.viewAllButton, { marginTop: 5 }]}>
//                             <ThemedText style={styles.viewAllText}>Tout voir</ThemedText>
//                             <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
//                         </TouchableOpacity>
//                     </View>

//                     {/* Alertes Grid */}
//                     {SAMPLE_DATA.alerts.length > 0 && (
//                         <View style={styles.alertsGrid}>
//                             {SAMPLE_DATA.alerts.map((alert) => {
//                                 const percentage = Math.round((alert.spent / alert.budget) * 100);
//                                 const isOverBudget = percentage > 100;

//                                 return (
//                                     <TouchableOpacity
//                                         key={alert.id}
//                                         style={[
//                                             styles.modernAlertCard,
//                                             { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
//                                         ]}
//                                         activeOpacity={0.7}
//                                     >
//                                         {/* Status Badge */}
//                                         {isOverBudget && (
//                                             <View style={[styles.overBudgetBadge, { alignSelf: "flex-end" }]}>
//                                                 <Ionicons name="alert-circle" size={12} color="#FF6B6B" />
//                                                 <ThemedText style={styles.overBudgetText}>Dépassé</ThemedText>
//                                             </View>
//                                         )}
//                                         {/* Header de la carte */}
//                                         <View style={styles.alertCardHeader}>
//                                             <View style={styles.alertLeft}>
//                                                 <LinearGradient
//                                                     colors={
//                                                         alert.type === "danger"
//                                                             ? ["#FF6B6B", "#EE5A52"]
//                                                             : ["#FFA500", "#FF8C00"]
//                                                     }
//                                                     start={{ x: 0, y: 0 }}
//                                                     end={{ x: 1, y: 1 }}
//                                                     style={styles.alertIconContainer}
//                                                 >
//                                                     <Ionicons
//                                                         name={
//                                                             alert.type === "danger"
//                                                                 ? "alert-circle"
//                                                                 : "warning"
//                                                         }
//                                                         size={22}
//                                                         color="#FFF"
//                                                     />
//                                                 </LinearGradient>
//                                                 <View>
//                                                     <ThemedText style={[styles.alertCategory, { color: theme.text }]}>
//                                                         {alert.category}
//                                                     </ThemedText>
//                                                     <ThemedText style={[styles.alertBudgetText, { color: isLight ? "#666" : "#AAA" }]}>
//                                                         Budget: {formatCurrency(alert.budget)}
//                                                     </ThemedText>
//                                                 </View>
//                                             </View>

//                                             {/* Circular Progress */}
//                                             <View style={styles.progressContainer}>
//                                                 <Svg height="56" width="56" viewBox="0 0 120 120">
//                                                     <Circle
//                                                         stroke={isLight ? "#F0F0F0" : "#2A2A2A"}
//                                                         fill="none"
//                                                         cx="60"
//                                                         cy="60"
//                                                         r={50}
//                                                         strokeWidth={8}
//                                                     />
//                                                     <Circle
//                                                         stroke={alert.type === "danger" ? "#FF6B6B" : "#FFA500"}
//                                                         fill="none"
//                                                         cx="60"
//                                                         cy="60"
//                                                         r={50}
//                                                         strokeWidth={8}
//                                                         strokeDasharray={2 * Math.PI * 50}
//                                                         strokeDashoffset={
//                                                             (2 * Math.PI * 50) -
//                                                             ((percentage / 100) * (2 * Math.PI * 50))
//                                                         }
//                                                         strokeLinecap="round"
//                                                         transform="rotate(-90 60 60)"
//                                                     />
//                                                 </Svg>
//                                                 <View style={styles.progressTextContainer}>
//                                                     <ThemedText style={[styles.progressPercentage, { color: theme.text }]}>
//                                                         {percentage}
//                                                     </ThemedText>
//                                                     <ThemedText style={[styles.progressSymbol, { color: isLight ? "#999" : "#666" }]}>
//                                                         %
//                                                     </ThemedText>
//                                                 </View>
//                                             </View>
//                                         </View>

//                                         {/* Spending Info */}
//                                         <View style={styles.alertFooter}>
//                                             <View style={styles.spendingBar}>
//                                                 <View
//                                                     style={[
//                                                         styles.spendingBarFill,
//                                                         {
//                                                             width: `${Math.min(percentage, 100)}%`,
//                                                             backgroundColor: alert.type === "danger" ? "#FF6B6B" : "#FFA500"
//                                                         }
//                                                     ]}
//                                                 />
//                                             </View>
//                                             <View style={styles.spendingInfo}>
//                                                 <ThemedText style={[styles.spentAmount, { color: theme.text }]}>
//                                                     {formatCurrency(alert.spent)}
//                                                 </ThemedText>
//                                                 <ThemedText style={[styles.spendingStatus, {
//                                                     color: isOverBudget ? "#FF6B6B" : (isLight ? "#666" : "#AAA")
//                                                 }]}>
//                                                     {isOverBudget
//                                                         ? `+${formatCurrency(alert.spent - alert.budget)} dépassé`
//                                                         : `${formatCurrency(alert.budget - alert.spent)} restant`
//                                                     }
//                                                 </ThemedText>
//                                             </View>
//                                         </View>

//                                         <View style={[styles.cardIndicator, { backgroundColor: alert.type === "danger" ? "#FF6B6B" : "#FFA500" }]} />
//                                     </TouchableOpacity>
//                                 );
//                             })}
//                         </View>
//                     )}

//                     {/* Empty State */}
//                     {SAMPLE_DATA.alerts.length === 0 && (
//                         <View style={styles.emptyState}>
//                             <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
//                             <ThemedText style={[styles.emptyTitle, { color: theme.text }]}>
//                                 Tout va bien !
//                             </ThemedText>
//                             <ThemedText style={[styles.emptyMessage, { color: isLight ? "#666" : "#AAA" }]}>
//                                 Aucune alerte budget pour le moment
//                             </ThemedText>
//                         </View>
//                     )}

//                     <View style={{ height: 100 }} />

//                 </ThemedView>

//             </ThemedScrollView>

//         </ThemedSafeAreaView>
//     );
// };

// export default Home;