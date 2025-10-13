// GetStartedScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constant/Colors';
import GoogleImage from "@/assets/icons/google.svg";
import { useRouter } from 'expo-router';


const { width, height } = Dimensions.get('window');

const GetStartedScreen = () => {
    const router = useRouter();
    const handleEmailLogin = () => {
        router.push('/auth/login');
    };

    const handleGoogleLogin = () => {
        console.log('Continue with Google');
    };

    const handleSignUp = () => {
        router.push('/auth/regitre');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
                <View style={styles.orbitContainer}>
                    {/* Central Circle with orbits */}
                    <View style={styles.centralOrbit}>
                        <View style={styles.orbitLine1} />
                        <View style={styles.orbitLine2} />
                        <View style={styles.orbitLine3} />
                    </View>

                    {/* Cardano/Crypto Icon - Top Left */}
                    <View style={[styles.investmentIcon, styles.cardanoPosition]}>
                        <View style={[styles.iconCircle, styles.blueCircle]}>
                            <Text style={styles.iconText}>₳</Text>
                        </View>
                        <View style={styles.textLines}>
                            <View style={styles.line} />
                            <View style={[styles.line, styles.shortLine]} />
                        </View>
                    </View>

                    {/* Airbnb Icon - Middle Left */}
                    <View style={[styles.investmentIcon, styles.airbnbPosition]}>
                        <View style={[styles.iconCircle, styles.pinkCircle]}>
                            <Text style={styles.iconText}>A</Text>
                        </View>
                        <View style={styles.textLines}>
                            <View style={styles.line} />
                            <View style={[styles.line, styles.shortLine]} />
                        </View>
                    </View>

                    {/* Gold/Diamond Icon - Bottom Left */}
                    <View style={[styles.investmentIcon, styles.goldPosition]}>
                        <View style={[styles.iconCircle, styles.yellowCircle]}>
                            <Text style={styles.iconText}>◆</Text>
                        </View>
                        <View style={styles.textLines}>
                            <View style={styles.line} />
                            <View style={[styles.line, styles.shortLine]} />
                        </View>
                    </View>

                    {/* Purple Floating Cards - Right Side */}
                    <View style={[styles.purpleCard, styles.card1]} />
                    <View style={[styles.purpleCard, styles.card2]} />
                    <View style={[styles.purpleCard, styles.card3]} />
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Commencer</Text>
                <Text style={styles.subtitle}>Une application complète pour une meilleure gestion de votre argent, des économies et de vos finances</Text>

                {/* Auth Buttons */}
                <View style={styles.buttonContainer}>
                    {/* Email Button */}
                    <TouchableOpacity
                        style={styles.emailButton}
                        onPress={handleEmailLogin}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#7C3AED', '#6D28D9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.emailGradient}
                        >
                            <Text style={styles.emailButtonText}>Continuer avec l'e-mail</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Google Button */}
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={handleGoogleLogin}
                        activeOpacity={0.8}
                    >
                        <GoogleImage width={30} height={30} />
                        <Text style={styles.socialButtonText}>Continuer avec Google</Text>
                    </TouchableOpacity>
                </View>

                {/* Sign Up Link */}
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Vous n'avez pas de compte ? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={styles.signUpLink}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Indicator */}
            <View style={styles.bottomIndicator} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    illustrationContainer: {
        height: height * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    orbitContainer: {
        width: 300,
        height: 300,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centralOrbit: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        position: 'absolute',
    },
    orbitLine1: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: '#F3F4F6',
        top: '50%',
        transform: [{ rotate: '30deg' }],
    },
    orbitLine2: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: '#F3F4F6',
        top: '50%',
        transform: [{ rotate: '90deg' }],
    },
    orbitLine3: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: '#F3F4F6',
        top: '50%',
        transform: [{ rotate: '150deg' }],
    },
    investmentIcon: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardanoPosition: {
        top: 30,
        left: 20,
    },
    airbnbPosition: {
        top: 130,
        left: 10,
    },
    goldPosition: {
        top: 230,
        left: 30,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    blueCircle: {
        backgroundColor: '#3B82F6',
    },
    pinkCircle: {
        backgroundColor: '#FF6B9D',
    },
    yellowCircle: {
        backgroundColor: '#FBBF24',
    },
    iconText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    textLines: {
        gap: 4,
    },
    line: {
        width: 80,
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
    },
    shortLine: {
        width: 50,
    },
    purpleCard: {
        position: 'absolute',
        width: 60,
        height: 20,
        backgroundColor: '#7C3AED',
        borderRadius: 10,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    card1: {
        top: 40,
        right: 20,
        transform: [{ rotate: '-5deg' }],
    },
    card2: {
        top: 130,
        right: 10,
        transform: [{ rotate: '5deg' }],
    },
    card3: {
        top: 220,
        right: 30,
        transform: [{ rotate: '-3deg' }],
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        gap: 16,
        marginBottom: 24,
    },
    emailButton: {
        height: 56,
        borderRadius: 6,
        overflow: 'hidden',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    emailGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    socialButton: {
        height: 56,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 0.05,
        elevation: 0.5,
    },
    socialButtonText: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: '600',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    signUpText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    signUpLink: {
        color: '#7C3AED',
        fontSize: 14,
        fontWeight: '600',
    },
    bottomIndicator: {
        width: 134,
        height: 5,
        backgroundColor: '#1F2937',
        borderRadius: 100,
        alignSelf: 'center',
        marginBottom: 12,
    },
});

export default GetStartedScreen;