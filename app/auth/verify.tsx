import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Animated } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { authService } from '@/services/authService';
import { Colors } from '@/constant/Colors';
import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import ThemedView from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import ThemedText from '@/components/ThemedText';
import { useColorScheme } from 'react-native';
import Separator from '@/components/Separator';
import CustomAlert from '@/common/customAlert';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    // ✅ Vérification du code
    const handleVerify = async () => {
        if (code.length !== 4) {
            setMessage('Veuillez entrer le code à 4 chiffres.');
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);
            return;
        }

        setLoading(true);
        try {
            const result = await authService.verifyCode(email, code);
            setMessage(result.message);
            setShowAlert(true);
            router.replace('/auth/login')
        } catch (error: any) {
            setMessage(error?.message || 'Code invalide');
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);

        } finally {
            setLoading(false);
        }
    };

    // ✅ Renvoyer le code
    const handleResendCode = async () => {
        setResending(true);
        try {
            const result = await authService.resendCode(email);
            setMessage(result.message);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 6000);
            setCode('');
        } catch (error: any) {
            setMessage(error?.message || 'Échec de renvoi du code');
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 6000);
        } finally {
            setResending(false);
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
        <ThemedSafeAreaView style={{ position: "relative", flex: 1, justifyContent: "space-between" }}>
            <ThemedView style={{ zIndex: 2, position: "absolute", flex: 1, gap: 20, marginHorizontal: "auto", width: "100%", height: "100%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
                <View style={styles.header}>
                    <ThemedText style={styles.title}>Vérification du compte</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Entrez le code que nous avons envoyé à votre adresse email 📩
                    </ThemedText>
                </View>
                <View style={[styles.container, { backgroundColor: theme.bgSecondary, }]}>
                    <ThemedText style={{ color: theme.text, textAlign: "center", fontSize: 13 }}>Nous avons envoyé le code à votre adresse e-mail</ThemedText>
                    <Separator style={{ height: 20 }} />
                    <ThemedText style={styles.email}>{email}</ThemedText>
                    <Separator style={{ height: 30 }} />

                    {/* ✅ Champ OTPTextInput */}
                    <OTPTextInput
                        inputCount={4}
                        handleTextChange={setCode}
                        tintColor={Colors.primary}
                        offTintColor="#ccc"
                        style={[styles.input, {
                            backgroundColor: theme.inputBackground || (colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5'),
                            borderColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'),
                            color: theme.text
                        }]}
                    />
                    <Separator style={{ height: 40 }} />

                    {/* ✅ Bouton Vérifier */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleVerify}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText style={styles.buttonText}>Vérifier</ThemedText>
                        )}
                    </TouchableOpacity>
                    <Separator style={{ height: 30 }} />

                    {/* ✅ Renvoyer le code */}
                    <TouchableOpacity
                        style={[styles.resendButton, { backgroundColor: theme.inputBorder || (colorScheme === 'dark' ? '#404040' : '#e0e0e0'), }]}
                        onPress={handleResendCode}
                        disabled={resending}
                    >
                        {resending ? (
                            <ActivityIndicator color="#4CAF50" />
                        ) : (
                            <ThemedText style={[styles.resendText, { color: theme.text, }]}>Envoyer à nouveau</ThemedText>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.featuresContainer}>
                    <View style={styles.featureBadge}>
                        <Ionicons name="mail-unread-outline" size={18} color="#3B82F6" />
                        <ThemedText style={styles.featureText}>Code envoyé par email</ThemedText>
                    </View>

                    <View style={styles.featureBadge}>
                        <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" />
                        <ThemedText style={styles.featureText}>Vérification sécurisée</ThemedText>
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
                    {showAlert && (<CustomAlert message={message} title="Vérification reussie" />)}
                    {showAlertError && (<CustomAlert message={message} title="Un erreur est survenu" />)}
                </View>
            </LinearGradient>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    featuresContainer: {
        flexDirection: 'row',
        gap: 12,
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
    alertContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
    },
    floatingCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.1)',
        top: -100,
        right: -50,
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
        width: "88%", padding: 20, height: "auto", borderRadius: 6, justifyContent: "center", alignItems: "center",
    },
    header: {
        alignItems: 'center',
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
    email: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 12,
        width: 60,
        height: 60,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 6,
        shadowRadius: 4,
    },
    codeInput: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginHorizontal: 8,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        padding: 16,
        width: "100%", borderRadius: 6, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center"
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    resendButton: {
        width: "100%", borderRadius: 6, justifyContent: "center", alignItems: "center",
        padding: 16,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
    },
});



// import React, { useState } from 'react';
// import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
// import OTPTextInput from 'react-native-otp-textinput';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { authService } from '@/services/authService';
// import { Colors } from '@/constant/Colors';
// import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
// import ThemedView from '@/components/ThemedView';
// import { LinearGradient } from 'expo-linear-gradient';
// import ThemedText from '@/components/ThemedText';
// import { useColorScheme } from 'react-native';
// import Separator from '@/components/Separator';
// import CustomAlert from '@/common/customAlert';

// export default function VerifyScreen() {
//     const { email } = useLocalSearchParams<{ email: string }>();
//     const router = useRouter();
//     const colorScheme = useColorScheme();
//     const theme: any = Colors[colorScheme as keyof typeof Colors] ?? Colors.light
//     const [code, setCode] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [resending, setResending] = useState(false);
//     const [message, setMessage] = useState('');
//     const [showAlert, setShowAlert] = useState(false);
//     const [showAlertError, setShowAlertError] = useState(false);
//     // ✅ Vérification du code
//     const handleVerify = async () => {
//         if (code.length !== 4) {
//             setMessage('Veuillez entrer le code à 4 chiffres.');
//             setShowAlertError(true);
//             setTimeout(() => {
//                 setShowAlertError(false);
//             }, 6000);
//             return;
//         }

//         setLoading(true);
//         try {
//             const result = await authService.verifyCode(email, code);
//             setMessage(result.message);
//             setShowAlert(true);
//             router.replace('/auth/login')
//         } catch (error: any) {
//             setMessage(error?.message || 'Code invalide');
//             setShowAlertError(true);
//             setTimeout(() => {
//                 setShowAlertError(false);
//             }, 6000);

//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Renvoyer le code
//     const handleResendCode = async () => {
//         setResending(true);
//         try {
//             const result = await authService.resendCode(email);
//             setMessage(result.message);
//             setShowAlert(true);
//             setTimeout(() => {
//                 setShowAlert(false);
//             }, 6000);
//             setCode('');
//         } catch (error: any) {
//             setMessage(error?.message || 'Échec de renvoi du code');
//             setShowAlertError(true);
//             setTimeout(() => {
//                 setShowAlertError(false);
//             }, 6000);
//         } finally {
//             setResending(false);
//         }
//     };

//     return (
//         <ThemedSafeAreaView style={{ position: "relative", flex: 1, justifyContent: "space-between" }}>
//             <ThemedView style={{ zIndex: 2, position: "absolute", flex: 1, gap: 20, marginHorizontal: "auto", width: "100%", height: "100%", backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
//                 <Image source={require("@/assets/images/logo_white.png")} style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 10 }} />
//                 <ThemedText style={{ color: "#fff", textAlign: "center", fontSize: 30, }}>Vérifier l'e-mail</ThemedText>
//                 <View style={[styles.container, { backgroundColor: theme.bgSecondary, }]}>
//                     <ThemedText style={{ color: theme.text, textAlign: "center", fontSize: 13 }}>Nous avons envoyé le code à votre adresse e-mail</ThemedText>
//                     <Separator style={{ height: 20 }} />
//                     <ThemedText style={styles.email}>{email}</ThemedText>
//                     <Separator style={{ height: 30 }} />

//                     {/* ✅ Champ OTPTextInput */}
//                     <OTPTextInput
//                         inputCount={4}
//                         handleTextChange={setCode}
//                         tintColor={Colors.primary}
//                         offTintColor="#ccc"
//                         style={{ borderRadius: 6, borderColor: theme.coloborder, borderWidth: 1, paddingHorizontal: 16, color: theme.text, marginHorizontal: 10, marginBottom: 10, borderBottomWidth: 1, width: 50, height: 50 }}
//                     />
//                     <Separator style={{ height: 40 }} />

//                     {/* ✅ Bouton Vérifier */}
//                     <TouchableOpacity
//                         style={[styles.button, loading && styles.buttonDisabled]}
//                         onPress={handleVerify}
//                         disabled={loading}
//                     >
//                         {loading ? (
//                             <ActivityIndicator color="#fff" />
//                         ) : (
//                             <ThemedText style={styles.buttonText}>Vérifier</ThemedText>
//                         )}
//                     </TouchableOpacity>
//                     <Separator style={{ height: 30 }} />

//                     {/* ✅ Renvoyer le code */}
//                     <TouchableOpacity
//                         style={[styles.resendButton, { backgroundColor: theme.background }]}
//                         onPress={handleResendCode}
//                         disabled={resending}
//                     >
//                         {resending ? (
//                             <ActivityIndicator color="#4CAF50" />
//                         ) : (
//                             <ThemedText style={[styles.resendText, { color: theme.text, }]}>Envoyer à nouveau</ThemedText>
//                         )}
//                     </TouchableOpacity>
//                 </View>
//             </ThemedView>
//             <LinearGradient
//                 colors={[Colors.primary, '#4ADE80', '#6366f1']}
//                 start={{ x: -0.5, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={{ zIndex: 1, width: "100%", height: "50%", }}>
//                 <Image source={require("@/assets/images/star.png")} style={{ width: "100%", height: "100%" }} />
//             </LinearGradient>
//             <View style={{ position: 'absolute' }}>
//                 {showAlert && (<CustomAlert message={message} title="Vérification reussie" />)}
//                 {showAlertError && (<CustomAlert message={message} title="Un erreur est survenu" />)}
//             </View>
//         </ThemedSafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         width: "88%", padding: 20, height: "auto", borderRadius: 6, justifyContent: "center", alignItems: "center",
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: 40,
//     },
//     title: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 8,
//     },
//     subtitle: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 4,
//     },
//     email: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: Colors.primary,
//     },
//     codeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginBottom: 30,
//     },
//     codeInput: {
//         width: 60,
//         height: 60,
//         borderWidth: 2,
//         borderColor: '#e0e0e0',
//         borderRadius: 10,
//         marginHorizontal: 8,
//         textAlign: 'center',
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     button: {
//         padding: 16,
//         width: "100%", borderRadius: 6, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center"
//     },
//     buttonDisabled: {
//         opacity: 0.6,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     resendButton: {
//         width: "100%", borderRadius: 6, justifyContent: "center", alignItems: "center",
//         padding: 16,
//     },
//     resendText: {
//         fontSize: 14,
//         fontWeight: '600',
//     },
// });