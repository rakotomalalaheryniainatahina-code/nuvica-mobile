import React from 'react';
import { Alert, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui",
          onPress: async () => {
            await authService.logout();  // supprime le token et l'utilisateur
            router.replace("/auth/login"); // redirige vers la page de login
          },
        },
      ]
    );
  };

  return <Button title="Se déconnecter" color="#E53935" onPress={handleLogout} />;
}



// import { Button, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router'; // ou ton navigation hook

// const LogoutButton = () => {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       // Supprime le token JWT
//       await AsyncStorage.removeItem('token');

//       // Redirige vers la page de login
//       router.push('/auth/login');

//       Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès.');
//     } catch (error: any) {
//       Alert.alert('Erreur', error.message || 'Impossible de se déconnecter.');
//     }
//   };

//   return <Button title="Déconnexion" onPress={handleLogout} />;
// };

// export default LogoutButton;
