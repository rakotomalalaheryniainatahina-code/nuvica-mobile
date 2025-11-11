import { Alert } from 'react-native';
import { AxiosError } from 'axios';

export const handleApiError = (error: any, customMessage?: string) => {
    let errorMessage = customMessage || 'Une erreur est survenue';

    if (error.response) {
        // Erreur de réponse du serveur
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
            case 400:
                errorMessage = data.message || 'Requête invalide';
                break;
            case 401:
                errorMessage = 'Session expirée. Veuillez vous reconnecter.';
                break;
            case 403:
                errorMessage = 'Accès refusé';
                break;
            case 404:
                errorMessage = 'Ressource introuvable';
                break;
            case 500:
                errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                break;
            default:
                errorMessage = data.message || errorMessage;
        }
    } else if (error.request) {
        // Pas de réponse du serveur
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }

    Alert.alert('Erreur', errorMessage, [{ text: 'OK' }]);
    return errorMessage;
};

export const showSuccess = (message: string) => {
    Alert.alert('Succès', message, [{ text: 'OK' }]);
};

export const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Annuler',
                style: 'cancel',
                onPress: onCancel,
            },
            {
                text: 'Confirmer',
                onPress: onConfirm,
            },
        ]
    );
};