import { Tabs } from "expo-router";
import HomeIcon from "@/assets/icons/home_1.svg";
import WalletIcon from "@/assets/icons/wallet.svg";
import UserIcon from "@/assets/icons/user_1.svg";
import UserSelectedIcon from "@/assets/icons/user_2.svg";
import HomeSelectedIcon from "@/assets/icons/home_2.svg";
import TransactionIcon from "@/assets/icons/transaction_1.svg";
import TransactionSelectedIcon from "@/assets/icons/transaction_2.svg";
import { View } from "react-native";
import { Colors } from "@/constant/Colors";

export default function DashboardLayout() {
    return (
        <Tabs
            initialRouteName="home"

            screenOptions={{
                tabBarActiveTintColor: "transparent",
                tabBarInactiveTintColor: "transparent",
                tabBarStyle: {
                    backgroundColor: "#f5f5f5",
                    paddingVertical: 10,
                    height: 70,
                    alignItems: "center",
                    paddingTop: 7
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                headerShown: false
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused, color, size }) => {
                        const Icon = focused ? HomeSelectedIcon : HomeIcon;
                        return <Icon width={size} height={size} fill={color} />;
                    },
                }}
            />
            <Tabs.Screen
                name="transaction"
                options={{
                    title: "Transactions",
                    tabBarIcon: ({ focused, color, size }) => {
                        const Icon = focused ? TransactionSelectedIcon : TransactionIcon;
                        return <Icon width={size} height={size} fill={color} />;
                    },
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: "",
                    tabBarIcon: () => {
                        const Icon = WalletIcon;
                        return (
                            <View
                                style={{
                                    backgroundColor: Colors.primary,
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 23
                                }}
                            >
                                <Icon width={24} height={24} fill={"transparent"} />
                            </View>
                        );
                    },
                }}
            />
            {/* <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused, size }) => {
                        const Icon = focused ? UserSelectedIcon : UserIcon;
                        return <Icon width={size} height={size} fill={"transparent"} />;
                    },
                }}
            /> */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused, size }) => {
                        const Icon = focused ? UserSelectedIcon : UserIcon;
                        return <Icon width={size} height={size} fill={"transparent"} />;
                    },
                }}
            />
        </Tabs>
    );
}
