
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.111.124.137:3000/auth'; // Changez selon votre configuration

export const authService = {
    // Inscription
    async register(email: string, phone: string, password: string) {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                email,
                phone,
                password,
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw error.response?.data?.message || 'Erreur lors de l\'inscription';
            } else {
                throw error;
            }
        }
    },

    // Vérification du code
    async verifyCode(email: string, code: string) {
        try {
            const response = await axios.post(`${API_URL}/verify`, {
                email,
                code,
            });

            // Sauvegarder le token
            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw error.response?.data?.message || 'Code invalide';
            } else {
                throw error;
            }
        }
    },

    // Renvoyer le code
    async resendCode(email: string) {
        try {
            const response = await axios.post(`${API_URL}/resend-code`, { email });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw error.response?.data?.message || 'Erreur lors de l\'envoi du code';
            } else {
                throw error;
            }
        }
    },

    // Connexion
    async login(email: string, password: string) {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });

            // Sauvegarder le token
            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw error.response?.data?.message || 'Erreur lors de la connexion';
            } else {
                throw error;
            }
        }
    },

    // Déconnexion
    async logout() {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    },

    // Récupérer le token
    async getToken() {
        return await AsyncStorage.getItem('token');
    },

    // Récupérer l'utilisateur
    async getUser() {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};