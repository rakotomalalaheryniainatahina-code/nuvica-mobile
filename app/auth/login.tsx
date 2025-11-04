import CustomAlert from '@/common/customAlert';
import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { Colors } from '@/constant/Colors';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image } from 'react-native';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    useColorScheme,
} from 'react-native';

export default function LoginScreen({ navigation }: { navigation: NavigationProp<any, any> }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light;
    const [message, setMessage] = useState('');
    const [showAlertError, setShowAlertError] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage('Veuillez remplir tous les champs.');
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);
            return;
        }

        setLoading(true);
        try {
            const result = await authService.login(email, password);
            router.replace("/dashboard/wallet");
        } catch (error: any) {
            setMessage(error.toString());
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);
        } finally {
            setLoading(false);
        }
    };

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ThemedSafeAreaView style={{ position: "relative", flex: 1, justifyContent: "space-between" }}>
                <ThemedView style={{ zIndex: 2, position: "absolute", flex: 1, gap: 20, marginHorizontal: "auto", width: "100%", height: "100%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                    <View style={styles.header}>
                        <ThemedText style={styles.title}>Bienvenue de retour</ThemedText>
                        <ThemedText style={styles.subtitle}>
                            Connectez-vous pour continuer votre aventure ✨
                        </ThemedText>
                    </View>

                    <View style={[styles.form, { backgroundColor: theme.bgSecondary, }]}>
                        <View style={styles.inputContainer}>
                            <ThemedText style={[styles.label, { color: theme.text }]}>Email</ThemedText>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.inputBackground || (colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5'),
                                    borderColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'),
                                    color: theme.text
                                }]}
                                placeholder="votre@email.com"
                                placeholderTextColor={theme.placeholder || (colorScheme === 'dark' ? '#888' : '#999')}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <ThemedText style={[styles.label, { color: theme.text }]}>Mot de passe</ThemedText>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.inputBackground || (colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5'),
                                    borderColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'),
                                    color: theme.text
                                }]}
                                placeholder="••••••••"
                                placeholderTextColor={theme.placeholder || (colorScheme === 'dark' ? '#888' : '#999')}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="password"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <ThemedText style={styles.buttonText}>Se connecter</ThemedText>
                            )}
                        </TouchableOpacity>

                        <View style={styles.linkButton}>
                            <ThemedText style={{ color: theme.text, fontSize: 14 }}>
                                Vous n'avez pas de compte ? <Link style={{ color: Colors.primary, fontSize: 14 }} href="/auth/regitre">S'inscrire</Link>
                            </ThemedText>
                        </View>
                    </View>

                    {/* Features badges */}
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureBadge}>
                            <Ionicons name="shield-checkmark" size={16} color="#4ADE80" />
                            <ThemedText style={styles.featureText}>100% Sécurisé</ThemedText>
                        </View>
                        <View style={styles.featureBadge}>
                            <Ionicons name="flash" size={16} color="#FBBF24" />
                            <ThemedText style={styles.featureText}>Connexion rapide</ThemedText>
                        </View>
                    </View>
                </ThemedView>

                <LinearGradient
                    colors={colorScheme === 'dark'
                        ? ['#1a1a1a', '#2d2d2d', '#1a1a1a']
                        : [Colors.primary, '#4ADE80', '#6366f1']}
                    start={{ x: -0.5, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ zIndex: 1, width: "100%", height: "100%", }}>
                    <Animated.View style={[styles.floatingCircle1, { transform: [{ rotate: spin }] }]} />
                    <Animated.View style={[styles.floatingCircle2, { transform: [{ rotate: spin }] }]} />
                    <View style={{ position: 'absolute' }}>
                        {showAlertError && (<CustomAlert message={message} title="Un erreur est survenu" />)}
                    </View>
                </LinearGradient>
            </ThemedSafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    floatingCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.1)',
        top: -100,
        right: -50,
    },
    title: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    floatingCircle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.08)',
        bottom: 50,
        left: -50,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 40,
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
    },
    form: {
        width: "88%",
        padding: 20,
        paddingVertical: 24,
        height: "auto",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        marginBottom: 20,
        width: "100%",
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderRadius: 6,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 6,
        padding: 16,
        width: "100%",
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
    },
    linkTextBold: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    featuresContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    featureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    featureText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});



// import CustomAlert from '@/common/customAlert';
// import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
// import ThemedText from '@/components/ThemedText';
// import ThemedView from '@/components/ThemedView';
// import { Colors } from '@/constant/Colors';
// import { authService } from '@/services/authService';
// import { NavigationProp } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Link, useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import {
//     View,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     ActivityIndicator,
//     KeyboardA
// voidingView,
//     Platform,
//     useColorScheme,
//     Image,
// } from 'react-native';

// export default function LoginScreen({ navigation }: { navigation: NavigationProp<any, any> }) {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const router = useRouter()
//     const colorScheme = useColorScheme();
//     const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
//     const [message, setMessage] = useState('');
//     const [showAlertError, setShowAlertError] = useState(false);

//     const handleLogin = async () => {
//         if (!email || !password) {
//             setMessage('Veuillez remplir tous les champs.');
//             setShowAlertError(true);
//             setTimeout(() => {
//                 setShowAlertError(false);
//             }, 6000);
//             return;
//         }

//         setLoading(true);
//         try {
//             const result = await authService.login(email, password);
//             router.replace("/dashboard/wallet")
//         } catch (error: any) {
//             setMessage(error.toString());
//             setShowAlertError(true);
//             setTimeout(() => {
//                 setShowAlertError(false);
//             }, 6000);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.container}
//         >

//             <ThemedSafeAreaView style={{ position: "relative", flex: 1, justifyContent: "space-between" }}>
//                 <ThemedView style={{ zIndex: 2, position: "absolute", flex: 1, gap: 20, marginHorizontal: "auto", width: "100%", height: "100%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
//                     <View style={styles.header}>
//                         <Image source={require("@/assets/images/logo_white.png")} style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 10 }} />
//                         <ThemedText style={{ color: "#fff", textAlign: "center", fontSize: 30, }}>Se connecter</ThemedText>
//                     </View>

//                     <View style={[styles.form, { backgroundColor: theme.bgSecondary, }]}>
//                         <View style={styles.inputContainer}>
//                             <ThemedText style={styles.label}>Email</ThemedText>
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="votre@email.com"
//                                 value={email}
//                                 onChangeText={setEmail}
//                                 keyboardType="email-address"
//                                 autoCapitalize="none"
//                                 autoComplete="email"
//                             />
//                         </View>

//                         <View style={styles.inputContainer}>
//                             <ThemedText style={styles.label}>Mot de passe</ThemedText>
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="••••••••"
//                                 value={password}
//                                 onChangeText={setPassword}
//                                 secureTextEntry
//                                 autoComplete="password"
//                             />
//                         </View>

//                         <TouchableOpacity
//                             style={[styles.button, loading && styles.buttonDisabled]}
//                             onPress={handleLogin}
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <ActivityIndicator color="#fff" />
//                             ) : (
//                                 <ThemedText style={styles.buttonText}>Se connecter</ThemedText>
//                             )}
//                         </TouchableOpacity>

//                         <View style={styles.linkButton}>
//                             <ThemedText style={{ color: theme.text, fontSize: 14 }}>Vous n’avez pas de compte ? <Link style={{ color: Colors.primary, fontSize: 14 }} href="/auth/regitre">S'inscrire</Link></ThemedText>
//                         </View>
//                     </View>
//                 </ThemedView>
//                 <LinearGradient
//                     colors={[Colors.primary, '#4ADE80', '#6366f1']}
//                     start={{ x: -0.5, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={{ zIndex: 1, width: "100%", height: "50%", }}>
//                     <Image source={require("@/assets/images/star.png")} style={{ width: "100%", height: "100%" }} />
//                 </LinearGradient>
//             </ThemedSafeAreaView>
//             <View style={{ position: 'absolute' }}>
//                 {showAlertError && (<CustomAlert message={message} title="Un erreur est survenu" />)}
//             </View>
//         </KeyboardAvoidingView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     content: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 20,
//     },
//     header: {
//         marginBottom: 40,
//         flexDirection: 'column',
//         gap: 10,
//         alignItems: 'center',
//     },
//     form: {
//         width: "88%", padding: 20, paddingVertical: 24, height: "auto", borderRadius: 6, justifyContent: "center", alignItems: "center",
//     },
//     inputContainer: {
//         marginBottom: 20,
//         width: "100%",
//     },
//     label: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 8,
//     },
//     input: {
//         backgroundColor: '#f5f5f5',
//         borderRadius: 6,
//         padding: 15,
//         fontSize: 16,
//         borderWidth: 1,
//         borderColor: '#e0e0e0',
//     },
//     button: {
//         backgroundColor: Colors.primary,
//         borderRadius: 6,
//         padding: 16,
//         width: "100%",
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     buttonDisabled: {
//         opacity: 0.6,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     linkButton: {
//         marginTop: 20,
//         alignItems: 'center',
//     },
//     linkText: {
//         color: '#666',
//         fontSize: 14,
//     },
//     linkTextBold: {
//         color: Colors.primary,
//         fontWeight: 'bold',
//     },
// });