import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constant/Colors";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import ThemedText from "@/components/ThemedText";
import styles from "@/styles/analyseConseils";
import reportsService, { ReportPeriod } from "@/services/reportsService";

interface FinancialInsight {
  id: string;
  type: "warning" | "success" | "info" | "tip";
  title: string;
  message: string;
  icon: string;
  color: string;
}

const AnalyseConseils = () => {
  const colorScheme = useColorScheme();
  const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light;
  const isLight = theme === Colors.light;
  const router = useRouter();

  // 🔹 États
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>(
    ReportPeriod.LAST_7_DAYS
  );

  // 🔹 Charger les analyses selon la période
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await reportsService.getReportsAnalytics({
          period: selectedPeriod,
        });

        setInsights(response.financialInsights || []);
      } catch (err: any) {
        console.error("Erreur de chargement des analyses :", err);
        setError("Impossible de charger les analyses financières.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [selectedPeriod]); // 👈 recharge à chaque changement de période

  return (
    <ThemedSafeAreaView
      style={[
        styles.content,
        { backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" },
      ]}
    >
      <View style={styles.section}>
        {/* En-tête */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          >
            <Ionicons name="chevron-back" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
            Analyses & Conseils
          </ThemedText>
        </View>

        {/* 🔹 Sélecteur de période */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            {[
              { label: "7 jours", value: ReportPeriod.LAST_7_DAYS },
              { label: "30 jours", value: ReportPeriod.LAST_30_DAYS },
              { label: "3 mois", value: ReportPeriod.LAST_3_MONTHS },
              { label: "6 mois", value: ReportPeriod.LAST_6_MONTHS },
              { label: "1 an", value: ReportPeriod.LAST_YEAR },
            ].map((period) => (
              <TouchableOpacity
                key={period.value}
                onPress={() => setSelectedPeriod(period.value)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginRight: 10,
                  backgroundColor:
                    selectedPeriod === period.value
                      ? Colors.primary
                      : isLight
                        ? "#FFF"
                        : "#151515",
                }}
              >
                <ThemedText
                  style={{
                    color:
                      selectedPeriod === period.value ? "#FFF" : theme.text,
                    fontWeight: selectedPeriod === period.value ? "600" : "400",
                  }}
                >
                  {period.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Loader */}
        {loading && (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 20 }}
          />
        )}

        {/* Erreur */}
        {error && (
          <ThemedText
            style={{ color: "red", textAlign: "center", marginTop: 20 }}
          >
            {error}
          </ThemedText>
        )}

        {/* Liste des insights */}
        {!loading && !error && insights.length > 0 ? (
          insights.map((insight) => (
            <View
              key={insight.id}
              style={[
                styles.modernInsightCard,
                { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
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
                  <ThemedText
                    style={[
                      styles.modernInsightMessage,
                      { color: isLight ? "#666" : "#AAA" },
                    ]}
                  >
                    {insight.message}
                  </ThemedText>
                </View>
              </View>
              {/* <View
                style={[styles.cardIndicator, { backgroundColor: insight.color }]}
              /> */}
            </View>
          ))
        ) : (
          !loading &&
          !error && (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: Colors.primary + "20" }]}>
                <Ionicons name="bulb" size={64} color={Colors.primary} />
              </View>
              <ThemedText>Aucun conseil disponible pour cette période.</ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: theme.text }]}>
                Vous êtes à jour ! 🎉
              </ThemedText>
            </View>
          )
        )}
      </View>
    </ThemedSafeAreaView>
  );
};

export default AnalyseConseils;






// import React, { useEffect, useState } from "react";
// import {
//     View,
//     TouchableOpacity,
//     ActivityIndicator,
//     useColorScheme,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { Colors } from "@/constant/Colors";
// import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
// import ThemedText from "@/components/ThemedText";
// import styles from "@/styles/analyseConseils";
// import reportsService from "@/services/reportsService";

// interface FinancialInsight {
//     id: string;
//     type: "warning" | "success" | "info" | "tip";
//     title: string;
//     message: string;
//     icon: string;
//     color: string;
// }

// const AnalyseConseils = () => {
//     const colorScheme = useColorScheme();
//     const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light;
//     const isLight = theme === Colors.light;
//     const router = useRouter();

//     // 🔹 États
//     const [insights, setInsights] = useState<FinancialInsight[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // 🔹 Charger les analyses depuis l’API
//     useEffect(() => {
//         const fetchInsights = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 // Appel à ton backend via le service
//                 const response = await reportsService.getReportsAnalytics({
//                     period: "last_year" as any, // ou "last_month", selon ton backend
//                 });

//                 // On récupère uniquement les financialInsights de la réponse
//                 setInsights(response.financialInsights || []);
//             } catch (err: any) {
//                 console.error("Erreur de chargement des analyses :", err);
//                 setError("Impossible de charger les analyses financières.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInsights();
//     }, []);

//     {/* Loader */ }

//     if (loading) {
//         return (
//             <ThemedSafeAreaView style={{ backgroundColor: theme.background }}>
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <ActivityIndicator size="large" color={Colors.primary} />
//                 </View>
//             </ThemedSafeAreaView>
//         );
//     }

//     return (
//         <ThemedSafeAreaView
//             style={[
//                 styles.content,
//                 { backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" },
//             ]}
//         >
//             {/* En-tête */}
//             <View style={styles.section}>
//                 <View style={styles.sectionHeader}>
//                     <TouchableOpacity
//                         onPress={() => router.back()}
//                         style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
//                     >
//                         <Ionicons name="chevron-back" size={18} color={Colors.primary} />
//                     </TouchableOpacity>
//                     <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
//                         Analyses & Conseils
//                     </ThemedText>
//                 </View>

//                 {/* Erreur */}
//                 {error && (
//                     <ThemedText style={{ color: "red", textAlign: "center", marginTop: 20 }}>
//                         {error}
//                     </ThemedText>
//                 )}

//                 {/* Liste des insights */}
//                 {!loading && !error && insights.length > 0 ? (
//                     insights.map((insight) => (
//                         <View
//                             key={insight.id}
//                             style={[
//                                 styles.modernInsightCard,
//                                 { backgroundColor: isLight ? "#FFFFFF" : "#151515" },
//                             ]}
//                         >
//                             <View style={styles.insightHeader}>
//                                 <View
//                                     style={[
//                                         styles.modernInsightIcon,
//                                         { backgroundColor: insight.color + "15" },
//                                     ]}
//                                 >
//                                     <Ionicons
//                                         name={insight.icon as any}
//                                         size={20}
//                                         color={insight.color}
//                                     />
//                                 </View>
//                                 <View style={{ flex: 1 }}>
//                                     <ThemedText style={[styles.insightTitle, { color: theme.text }]}>
//                                         {insight.title}
//                                     </ThemedText>
//                                     <ThemedText
//                                         style={[
//                                             styles.modernInsightMessage,
//                                             { color: isLight ? "#666" : "#AAA" },
//                                         ]}
//                                     >
//                                         {insight.message}
//                                     </ThemedText>
//                                 </View>
//                             </View>
//                             <View
//                                 style={[styles.cardIndicator, { backgroundColor: insight.color }]}
//                             />
//                         </View>
//                     ))
//                 ) : (
//                     !loading &&
//                     !error && (
//                         <ThemedText
//                             style={{ textAlign: "center", color: theme.text, marginTop: 20 }}
//                         >
//                             Aucune donnée disponible.
//                         </ThemedText>
//                     )
//                 )}
//             </View>
//         </ThemedSafeAreaView>
//     );
// };

// export default AnalyseConseils;


// import React, { useState } from "react";
// import {
//     View,
//     StyleSheet,
//     useColorScheme,
//     TouchableOpacity,
//     Dimensions,
// } from "react-native";
// import { Colors } from "@/constant/Colors";
// import { Theme } from "@/types/ColorType";
// import { Ionicons } from "@expo/vector-icons";
// import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
// import ThemedScrollView from "@/components/ThemedScrollView";
// import ThemedText from "@/components/ThemedText";
// import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
// import { useRouter } from "expo-router";
// import styles from "@/styles/analyseConseils";

// interface FinancialInsight {
//     id: string;
//     type: "warning" | "success" | "info" | "tip";
//     title: string;
//     message: string;
//     icon: string;
//     color: string;
// }

// const FINANCIAL_INSIGHTS: FinancialInsight[] = [
//     {
//         id: "1",
//         type: "warning",
//         title: "Alimentation en hausse",
//         message:
//             "Vous dépensez +20% en alimentation par rapport au mois dernier. Essayez de cuisiner plus souvent à la maison.",
//         icon: "trending-up",
//         color: "#FF6B6B",
//     },
//     {
//         id: "2",
//         type: "success",
//         title: "Excellente épargne !",
//         message:
//             "Vous avez épargné 90,000 Ar ce mois-ci, soit 16% de vos revenus. Continuez comme ça !",
//         icon: "trophy",
//         color: "#4ADE80",
//     },
//     {
//         id: "3",
//         type: "info",
//         title: "Transport optimisé",
//         message:
//             "Vos dépenses de transport ont diminué de 5%. Bon travail sur la réduction des coûts !",
//         icon: "car",
//         color: "#22D3EE",
//     },
//     {
//         id: "4",
//         type: "tip",
//         title: "Conseil du mois",
//         message:
//             "Vos loisirs représentent 14% de vos dépenses. Envisagez un budget fixe pour mieux contrôler ces dépenses.",
//         icon: "bulb",
//         color: "#F59E0B",
//     },
// ];


// const AnalyseConseils = () => {
//     const colorScheme = useColorScheme();
//     const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
//     const isLight = theme === Colors.light;
//     const router = useRouter();
//     return (
//         <ThemedSafeAreaView style={[styles.content, { backgroundColor: isLight ? "#F5F5F7" : "#0A0A0A" }]}>
//             {/* Conseils avec design moderne */}
//             <View style={styles.section}>
//                 <View style={styles.sectionHeader}>
//                     <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
//                         <Ionicons name="chevron-back" size={18} color={Colors.primary} />
//                     </TouchableOpacity>
//                     <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
//                         Analyses & Conseils
//                     </ThemedText>
//                 </View>

//                 {FINANCIAL_INSIGHTS.map((insight, index) => (
//                     <View
//                         key={insight.id}
//                         style={[
//                             styles.modernInsightCard,
//                             {
//                                 backgroundColor: isLight ? "#FFFFFF" : "#151515",
//                             },
//                         ]}
//                     >
//                         <View style={styles.insightHeader}>
//                             <View
//                                 style={[
//                                     styles.modernInsightIcon,
//                                     { backgroundColor: insight.color + "15" },
//                                 ]}
//                             >
//                                 <Ionicons
//                                     name={insight.icon as any}
//                                     size={20}
//                                     color={insight.color}
//                                 />
//                             </View>
//                             <View style={{ flex: 1 }}>
//                                 <ThemedText style={[styles.insightTitle, { color: theme.text }]}>
//                                     {insight.title}
//                                 </ThemedText>
//                                 <ThemedText style={[styles.modernInsightMessage, { color: isLight ? "#666" : "#AAA" }]}>
//                                     {insight.message}
//                                 </ThemedText>
//                             </View>
//                         </View>
//                         <View style={[styles.cardIndicator, { backgroundColor: insight.color }]} />
//                     </View>
//                 ))}
//             </View>
//         </ThemedSafeAreaView>
//     );
// };


// export default AnalyseConseils
