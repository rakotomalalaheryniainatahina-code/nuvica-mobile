import { Colors } from "@/constant/Colors";
import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get('window');

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
        backgroundColor: Colors.primary,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: "rgba(126, 124, 124, 0.2)",
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

export default styles