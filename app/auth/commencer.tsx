import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '@/styles/commencer';



const GetStartedScreen = () => {
    const router = useRouter();
    const handleEmailLogin = () => {
        router.push('/auth/login');
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
                        <View
                            style={styles.emailGradient}
                        >
                            <Text style={styles.emailButtonText}>Continuer avec l'e-mail</Text>
                        </View>
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

export default GetStartedScreen;