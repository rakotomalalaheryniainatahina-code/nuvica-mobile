import ThemedSafeAreaView from "@/components/ThemedSafeAreaView"
import TopHeros from "@/components/Topheros"
import { Text } from "react-native"

const Wallet = () => {
    return (
        <ThemedSafeAreaView>
            <TopHeros />
            <Text>Wallet</Text>
        </ThemedSafeAreaView>
    )
}

export default Wallet