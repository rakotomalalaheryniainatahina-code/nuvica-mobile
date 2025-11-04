import { Colors } from '@/constant/Colors';
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAlertProps {
    title: string;
    message: string;
}


export default function CustomAlert({ title, message}: CustomAlertProps) {
    const [visible, setVisible] = useState(true);
    const hideAlert = () => {
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <Modal transparent visible={visible} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.alertBox}>
                        <Text style={[styles.title, { color: Colors.primary }]}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={[styles.okButton, { backgroundColor: Colors.primary }]} onPress={hideAlert}>
                                <Text style={styles.okText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8 },
    buttonText: { color: 'white', fontWeight: 'bold' },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertBox: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 6,
        padding: 24,
        alignItems: 'flex-start',
        elevation: 8,
    },
    title: { fontSize: 20, fontWeight: 'medium', marginBottom: 8 },
    message: { fontSize: 16, textAlign: 'left', marginBottom: 20 },
    okButton: { borderRadius: 5, paddingVertical: 10, paddingHorizontal: 30 },
    okText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
