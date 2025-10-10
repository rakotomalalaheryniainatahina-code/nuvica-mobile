import Topheros from "@/components/Topheros"
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView"
import ThemedScrollView from "@/components/ThemedScrollView"
import { ImageBackground, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native"
import ThemedView from '@/components/ThemedView';
import { Colors } from "@/constant/Colors";
import Image from "@/constant/Images";
import { Theme } from "@/types/ColorType";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import ThemedText from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

const SAMPLE_DATA = {
    alerts: [
        {
            id: 1,
            type: "warning",
            category: "Alimentation",
            message: "Budget alimentation dépassé de 500 Ar",
            budget: 1000,
            spent: 400,
        },
        {
            id: 2,
            type: "danger",
            category: "Loisirs",
            message: "Budget loisirs atteint à 95%",
            budget: 1600,
            spent: 1520,
        },
        {
            id: 3,
            type: "warning",
            category: "Loisirs",
            message: "Budget loisirs atteint à 95%",
            budget: 100,
            spent: 150,
        },
        {
            id: 4,
            type: "danger",
            category: "Loisirs",
            message: "Budget loisirs atteint à 95%",
            budget: 1600,
            spent: 1520,
        },
        {
            id: 5,
            type: "danger",
            category: "Loisirs",
            message: "Budget loisirs atteint à 95%",
            budget: 200,
            spent: 1520,
        },
        {
            id: 6,
            type: "danger",
            category: "Loisirs",
            message: "Budget loisirs atteint à 95%",
            budget: 100,
            spent: 1420,
        },
    ],
};


const Home = () => {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const isLight = theme === Colors.light;
    const vola: number = 5000;
    const pourcent: number = 50;

    return (
        <ThemedSafeAreaView>
            <ThemedScrollView stickyHeaderIndices={[0]}>
                <View style={{ width: "100%", height: "auto", zIndex:2 }}>
                    <Topheros />
                </View>
                <ThemedView style={{ width: "100%", height: 220, backgroundColor: Colors.primary, }}>
                    <ImageBackground source={Image.starBG} style={{ width: "100%", height: "100%", justifyContent: "center", }}>
                        <ThemedView style={{ width: "90%", marginTop: -100, marginHorizontal: "auto", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", backgroundColor: "transparent" }}>
                            <ThemedView style={{ flexDirection: "column", justifyContent: "flex-end", backgroundColor: "transparent", gap: 1, }}>
                                <ThemedText style={{ color: Colors.green, fontSize: 20, }}>Solde actuel <Ionicons name="wallet" size={25} color={Colors.green} /></ThemedText>
                                <ThemedText style={{ color: "#fff", fontSize: 35, marginBottom: -9 }}>{vola.toFixed(2)} Ar</ThemedText>
                            </ThemedView>
                            <ThemedView style={{ width: "auto", padding: 10, paddingHorizontal: 10, borderRadius: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: Colors.green }}>
                                <EvilIcons name="arrow-up" size={24} color="white" />
                                <ThemedText style={{ color: "#fff", fontSize: 13, }}> {pourcent.toFixed(2)} %</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ImageBackground>
                </ThemedView>
                <ThemedView style={{ width: "90%", marginHorizontal: "auto", borderRadius: 7, height: 100, marginTop: -110, backgroundColor: "transparent", flexDirection: "column", zIndex: 1 }}>
                    <ThemedView style={{ width: "100%", marginHorizontal: "auto", borderRadius: 7, height: "auto", flexDirection: "row", backgroundColor: theme.bgSecondary, marginTop: 15, justifyContent: "center", padding: 6, }}>
                        <ThemedText style={{ textAlign: "center", fontSize: 15 }}>Ce mois-ci</ThemedText>
                    </ThemedView>
                    <ThemedView style={{ backgroundColor: "transparent", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 30 }}>
                        <ThemedView style={{ width: 10, height: 10, backgroundColor: theme.bgSecondary }}></ThemedView>
                        <ThemedView style={{ width: 10, height: 10, backgroundColor: theme.bgSecondary }}></ThemedView>
                    </ThemedView>
                    <ThemedView style={{ flexDirection: "row", borderRadius: 7, backgroundColor: theme.bgSecondary, justifyContent: "space-between", padding: 20, }}>
                        <ThemedView style={{ width: 90, backgroundColor: "transparent", flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                            <LinearGradient
                                colors={["#fb923c", "#ea580c"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ width: 40, height: 40, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 50, }}
                            >
                                <Ionicons name="trending-up-outline" size={25} color={"#fff"} />
                            </LinearGradient>
                            <ThemedText style={{ textAlign: "center" }}>{vola.toFixed(2)} Ar</ThemedText>
                        </ThemedView>
                        <ThemedView style={{ width: 90, backgroundColor: "transparent", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <LinearGradient
                                colors={["#4ade80", "#16a34a"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ width: 40, height: 40, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 50, }}
                            >
                                <Ionicons name="arrow-up-circle-outline" size={25} color={"#fff"} />
                            </LinearGradient>
                            <ThemedText >{vola.toFixed(2)} Ar</ThemedText>
                        </ThemedView>
                        <ThemedView style={{ width: 90, backgroundColor: "transparent", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <LinearGradient
                                colors={["#f87171", "#dc2626"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ width: 40, height: 40, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 50, }}
                            >
                                <Ionicons name="arrow-down-circle-outline" size={25} color={"#fff"} />
                            </LinearGradient>
                            <ThemedText>-{vola.toFixed(2)} Ar</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={{ paddingHorizontal: 20, paddingTop: 80, flexDirection: "column", gap: 10 }}>
                    <ThemedText style={{ fontSize: 20 }}>Alertes Budget</ThemedText>
                    {SAMPLE_DATA.alerts.length > 0 && (
                        <View style={styles.section}>
                            {SAMPLE_DATA.alerts.map((alert) => (
                                <TouchableOpacity
                                    key={alert.id}
                                    style={[
                                        styles.alertCard,
                                        { backgroundColor: theme.bgSecondary },
                                    ]}
                                >
                                    <ThemedView style={{ backgroundColor: "transparent", flexDirection: "row", gap: 10, justifyContent: "flex-end", alignItems: "flex-end", marginTop: 6, marginLeft: 6 }}>
                                        <View style={styles.alertHeader}>
                                            <Ionicons
                                                name={
                                                    alert.type === "danger"
                                                        ? "alert-circle"
                                                        : "warning"
                                                }
                                                size={30}
                                                color={alert.type === "danger" ? "#FF6B6B" : "#FFA500"}
                                                style={{ backgroundColor: alert.type === "danger" ? "#ff6b6b23" : "#ffa60027", padding: 8,borderRadius: 6, }}
                                            />

                                        </View>
                                        <ThemedView style={{ backgroundColor: "transparent", flexDirection: "column", justifyContent: "flex-end", gap: 5 }}>
                                            <Text style={[styles.alertCategory, { color: theme.text }]}>
                                                {alert.category}
                                            </Text>
                                            <Text style={[styles.alertMessage, { color: theme.text }]}>
                                                {alert.message.split(" ").slice(0, 2).join(" ")}...
                                            </Text>
                                        </ThemedView>
                                    </ThemedView>
                                    <ThemedView style={{ backgroundColor: "transparent" }}>
                                        <Svg height="60" width="60" viewBox="0 0 120 120">
                                            {/* Cercle de fond */}
                                            <Circle
                                                stroke="#e6e6e6"
                                                fill="none"
                                                cx="60"
                                                cy="60"
                                                r={50}
                                                strokeWidth={10}
                                            />
                                            <Circle
                                                stroke={alert.type === "danger" ? "#FF6B6B" : "#FFA500"}
                                                fill="none"
                                                cx="60"
                                                cy="60"
                                                r={50}
                                                strokeWidth={10}
                                                strokeDasharray={2 * Math.PI * 50}
                                                strokeDashoffset={(2 * Math.PI * 50) - (((alert.spent / alert.budget) * 100) / 100) * (2 * Math.PI * 50)}
                                                strokeLinecap="round"
                                                transform="rotate(-90 60 60)"
                                            />
                                        </Svg>
                                        <ThemedText style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                            {Math.round((alert.spent / alert.budget) * 100)} %
                                        </ThemedText>
                                    </ThemedView>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ThemedView>
            </ThemedScrollView>
        </ThemedSafeAreaView>
    )
}

export default Home


const styles = StyleSheet.create({
    section: {
        width: "100%",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    alertCard: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.01,
        shadowRadius: 8,
        elevation: 1,
        padding: 9,
        borderRadius: 6,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    alertHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
    },
    alertCategory: {
        fontSize: 16,
        fontWeight: "600",
    },
    alertMessage: {
        fontSize: 14,
        marginBottom: 12,
    },
});