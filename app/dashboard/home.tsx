import Topheros from "@/components/Topheros"
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView"
import ThemedScrollView from "@/components/ThemedScrollView"
import { ImageBackground, Text, useColorScheme, View } from "react-native"
import ThemedView from '@/components/ThemedView';
import { Colors } from "@/constant/Colors";
import Image from "@/constant/Images";
import { Theme } from "@/types/ColorType";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import ThemedText from "@/components/ThemedText";

const Home = () => {
    const colorScheme = useColorScheme();
    const theme: Theme = (Colors[colorScheme as keyof typeof Colors] as Theme) ?? Colors.light;
    const vola: number = 5000;
    const pourcent: number = 50;
    return (
        <ThemedSafeAreaView>
            <ThemedScrollView stickyHeaderIndices={[0]}>
                <Topheros />
                <ThemedView style={{ width: "100%", height: 190, backgroundColor: Colors.primary, }}>
                    <ImageBackground source={Image.starBG} style={{ width: "100%", height: "100%", justifyContent: "center", }}>
                        <ThemedView style={{ width: "90%", marginHorizontal: "auto", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", backgroundColor: "transparent" }}>
                            <ThemedView style={{ flexDirection: "column", justifyContent: "flex-end", backgroundColor: "transparent", gap: 5, marginTop: -25 }}>
                                <ThemedText style={{ color: "#d4ceceb4", fontSize: 20, }}>Solde Total</ThemedText>
                                <ThemedText style={{ color: "#fff", fontSize: 35, marginBottom: -9 }}>{vola.toFixed(2)} Ar</ThemedText>
                            </ThemedView>
                            <ThemedView style={{ width: "auto", padding: 10, paddingHorizontal: 10, borderRadius: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#23CF5F" }}>
                                <EvilIcons name="arrow-up" size={24} color="white" />
                                <ThemedText style={{ color: "#fff", fontSize: 13, }}> {pourcent.toFixed(2)} %</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ImageBackground>
                </ThemedView>
                <ThemedView style={{ width: "90%", marginHorizontal: "auto", height: 100, borderRadius: 15, backgroundColor: theme.bgSecondary, marginTop: -50 }}>
                    {/* Eto zareo */}
                </ThemedView>
                <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque distinctio officia eligendi non aut tempora eaque blanditiis, fuga odio, praesentium consequatur quod dolorum, sequi quibusdam. Nihil cupiditate quibusdam dolore aspernatur.
                    Ab, rem magni deserunt, ipsum similique voluptatem tenetur excepturi cum ut quisquam, consequuntur itaque quibusdam. Nesciunt quasi ipsam vitae, natus officia repellat. Accusamus, magnam. Delectus cumque ipsam necessitatibus? Aspernatur, necessitatibus.
                    Similique ut asperiores officia maxime quas numquam mollitia, suscipit aliquam laborum impedit, temporibus minima. Consectetur, illo provident exercitationem aut sit animi. Expedita impedit ut dolores dolorum sed! Repudiandae, fuga! Quos.
                    Consequuntur praesentium quidem tenetur vero porro ipsam ipsa sequi deleniti itaque, aliquam modi accusamus officiis aspernatur voluptatum quam? Consectetur necessitatibus ducimus quasi optio ipsam perspiciatis asperiores facilis mollitia vitae tempore!
                    Suscipit exercitationem sed quisquam? Placeat sit dignissimos quae atque laborum, repellendus alias. Quos tenetur libero eos, aut, illo consectetur ipsam minus a in ab odio dolorum magni temporibus nesciunt perferendis?
                    Ipsam nostrum possimus dignissimos et nam consectetur minima debitis reprehenderit blanditiis, minus, totam necessitatibus dolorem temporibus numquam officia? Sint exercitationem vero consectetur repellat perspiciatis odio quibusdam architecto similique quos laudantium.
                    In nam sequi dignissimos ad commodi sit cupiditate amet, ducimus libero reiciendis earum a ipsam voluptas facilis officiis illo repudiandae at ex? Molestias doloribus debitis reiciendis necessitatibus, alias beatae omnis.
                    Quas minus rerum cupiditate quibusdam iste. Voluptates fugit odio quo explicabo maiores ipsam quos earum, cupiditate praesentium optio nihil velit soluta amet enim. Necessitatibus provident ab modi aperiam facilis aliquid?
                    Neque dolorem atque voluptate? Corporis, minus! Perspiciatis ratione modi deserunt expedita, repudiandae maxime libero deleniti aliquid quibusdam officia voluptatibus debitis at iste, accusamus nisi iure quasi et eum facere dolor.
                    Facilis beatae asperiores alias ullam, aperiam consequuntur nemo maxime, laborum ab mollitia optio consectetur. Fugit deleniti voluptates, cum in ducimus veniam quam sint quod, officiis obcaecati aliquam enim quibusdam at.
                    Veniam doloremque doloribus illo eaque voluptatem magnam possimus optio expedita nesciunt iure, voluptates error odit dolorum sapiente tenetur non, architecto quisquam ea! Illum sunt, necessitatibus vel quas explicabo voluptate facilis?
                    Earum ratione quam, autem, quis, quas facere sed dignissimos consectetur maxime incidunt porro tenetur pariatur vitae aliquid illo aut obcaecati sunt deleniti possimus numquam fugit sapiente. Debitis ad nemo nobis.
                    Tempore officia voluptatum veritatis? In natus quod similique, dicta blanditiis delectus voluptatibus odio laboriosam quis recusandae sint? Hic ad beatae earum temporibus atque soluta distinctio quisquam dignissimos praesentium? Dolorem, commodi!
                    Corporis voluptatem suscipit incidunt nihil iste nostrum adipisci tenetur quo ea consequuntur debitis, nisi molestias temporibus nulla eveniet minus reprehenderit consequatur illo autem deleniti optio eum similique. Facilis, non sit!
                    Officia impedit ex tempora rerum corporis quibusdam quia, culpa nam fugit? Saepe suscipit, impedit, necessitatibus quaerat magnam rerum vel qui ipsa magni quod voluptate architecto deserunt, blanditiis quia quam deleniti.
                </Text>
            </ThemedScrollView>
        </ThemedSafeAreaView>
    )

}

export default Home