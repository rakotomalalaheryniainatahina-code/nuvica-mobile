import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import ThemedText from "./ThemedText";
import { Colors } from "@/constant/Colors";
import NotificationIcon from "@/assets/icons/notification_1.svg";
import NotificationSelectedIcon from "@/assets/icons/notification_2.svg";
import { Theme } from "@/types/ColorType";
import { useRouter } from "expo-router";
import Greeting from "./Greeting";

interface TopHerosProps {
    focused?: boolean; 
}

const TopHeros: React.FC<TopHerosProps> = ({ focused = false }) => {
    const Icon = focused ? NotificationSelectedIcon : NotificationIcon;
    const colorScheme = useColorScheme();
    const router = useRouter();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
const onNotificationPress = () => {
    router.push("/screen/notification")
}
    return (
        <View style={[styles.container, { backgroundColor: theme.background}]}>
            <TouchableOpacity onPress={()=> router.push("/dashboard/profile")} style={styles.leftSection}>
                <Image
                    source={require("@/assets/icons/avatar.jpg")}
                    style={styles.avatar}
                />
                <View>
                    <Greeting />
                    <ThemedText style={[styles.title, { color: theme.text }]}>Rakotomalala</ThemedText>
                </View>
            </TouchableOpacity>

            <View style={styles.rightSection}>
                <TouchableOpacity onPress={onNotificationPress} style={styles.iconContainer}>
                    <Icon width={24} height={24} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
    },
    iconContainer: {
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: -3,
        right: -3,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "red",
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1.5,
        borderColor: "#48D850",
    },
});

export default TopHeros;
