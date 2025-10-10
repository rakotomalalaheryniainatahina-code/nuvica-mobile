import { Tabs, useRouter } from "expo-router";
import WalletIcon from "@/assets/icons/wallet.svg";
import UserIcon from "@/assets/icons/user_1.svg";
import UserSelectedIcon from "@/assets/icons/user_2.svg";
import ScheduleIcon from "@/assets/icons/schedule_1.svg";
import ScheduleSelectedIcon from "@/assets/icons/schedule_2.svg";
import HomeSelectedIcon from "@/assets/icons/home_2.svg";
import HomeIcon from "@/assets/icons/home_1.svg";
import TransactionIcon from "@/assets/icons/transaction_1.svg";
import TransactionSelectedIcon from "@/assets/icons/transaction_2.svg";
import { StatusBar, useColorScheme, View, Animated, Platform } from "react-native";
import { Colors } from "@/constant/Colors";
import { useEffect, useRef } from "react";
import { Theme } from "@/types/ColorType";
import { Ionicons } from "@expo/vector-icons";

const AnimatedTabIcon = ({ focused, Icon, size }: any) => {
    const scale = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: focused ? 1.15 : 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: focused ? -2 : 0,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, [focused]);

    return (
        <Animated.View
            style={{
                transform: [{ scale }, { translateY }],
            }}
        >
            <Icon width={size} height={size} fill="transparent" />
        </Animated.View>
    );
};

const CentralWalletButton = ({ theme }: { theme: Theme }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={{
                transform: [{ scale }],
                marginTop: -8,
            }}
            onTouchStart={handlePressIn}
            onTouchEnd={handlePressOut}
        >
            <View
                style={{
                    backgroundColor: Colors.primary,
                    width: 62,
                    height: 62,
                    borderRadius: 31,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 12,
                    borderWidth: 4,
                    borderColor: theme === Colors.light ? "#f5f5f5" : theme.background,
                }}
            >
                <WalletIcon width={28} height={28} fill="transparent" />
            </View>
        </Animated.View>
    );
};

export default function DashboardLayout() {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/home");
    }, []);

    const isLightMode = theme === Colors.light;

    return (
        <>
            <StatusBar
                barStyle={isLightMode ? "dark-content" : "light-content"}
                backgroundColor="transparent"
                translucent
            />
            <Tabs
                initialRouteName="wallet"
                screenOptions={{
                    tabBarActiveTintColor: Colors.primary,
                    tabBarInactiveTintColor: "#8E8E93",
                    tabBarStyle: {
                        position: "absolute",
                        backgroundColor: isLightMode
                            ? "rgba(255, 255, 255, 0.85)"
                            : "rgba(28, 28, 30, 0.85)",
                        backdropFilter: "blur(20px)",
                        paddingVertical: 16,
                        height: 110,
                        paddingBottom: 16,
                        borderTopWidth: 0.5,
                        borderTopColor: isLightMode
                            ? "rgba(0, 0, 0, 0.08)"
                            : "rgba(255, 255, 255, 0.08)",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: isLightMode ? 0.06 : 0.15,
                        shadowRadius: 16,
                        elevation: 16,
                    },
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontFamily: "Manrope-Medium",
                        fontWeight: "600",
                        marginTop: 4,
                    },
                    tabBarItemStyle: {
                        paddingVertical: 4,
                    },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ focused, size }) => (
                            <AnimatedTabIcon
                                focused={focused}
                                Icon={focused ? HomeSelectedIcon : HomeIcon}
                                size={size}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="transaction"
                    options={{
                        title: "Transactions",
                        tabBarIcon: ({ focused, size }) => (
                            <AnimatedTabIcon
                                focused={focused}
                                Icon={focused ? TransactionSelectedIcon : TransactionIcon}
                                size={size}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="wallet"
                    options={{
                        title: "",
                        tabBarIcon: () => <CentralWalletButton theme={theme} />,
                    }}
                />
                <Tabs.Screen
                    name="schedule"
                    options={{
                        title: "Épargne",
                        tabBarIcon: ({ focused, size }) => (
                            <Ionicons
                                name={focused ? "rocket" : "rocket-outline"}
                                size={size}
                                color={focused ? "#292d329a" : "#292D32"}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ focused, size }) => (
                            <AnimatedTabIcon
                                focused={focused}
                                Icon={focused ? UserSelectedIcon : UserIcon}
                                size={size}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}