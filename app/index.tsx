import { Link } from "expo-router";
import { Text, View } from "react-native";
import Logo from "../assets/icons/google.svg";
import Separator from "@/components/Separator";
import { Image } from "react-native";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>hello it's me</Text>
           <Logo width={120} height={40} />
                <Image source={require("@/assets/images/logo.png")} style={{ width: 60, height: 60, objectFit: "contain" }} />

      <Link style={{ color: "blue" , fontSize: 20 }} href="/auth/login">Login</Link>
      <Separator/>
      <Link style={{ color: "blue" , fontSize: 20 }} href="/dashboard/wallet">Home</Link>
      <Separator/>
      <Link style={{ color: "blue" , fontSize: 20 }} href="/onboarding/onboarding">Onboarding</Link>

    </View>
  );
}
