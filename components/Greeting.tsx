import { Colors } from "@/constant/Colors";
import { Theme } from "@/types/ColorType";
import React from "react";
import { Text, useColorScheme } from "react-native";

const Greeting = () => {
  const currentHour = new Date().getHours();
  const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
  let greeting = "";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Bonjour 👋"; // matin
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Bon après-midi 🌞"; // après-midi
  } else if (currentHour >= 18 && currentHour < 22) {
    greeting = "Bonsoir 🌆"; // soir
  } else {
    greeting = "Bonne nuit 🌙"; // nuit
  }

  return (
    <Text style={{fontSize: 15, fontWeight: "medium", color: theme.text }}>{greeting}</Text>
  );
};

export default Greeting;
