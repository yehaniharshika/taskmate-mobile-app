import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [name, setName] = useState<string>('John Doe');
    const [bio, setBio] = useState<string>('JohnDoe @example.com');
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState<string>('');
    const [newBio, setNewBio] = useState<string>('');

    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('theme');
            if (storedTheme === 'dark') {
                setDarkMode(true);
            }
        };

        const loadProfilePic = async () => {
            const storedPic = await AsyncStorage.getItem('profilePic');
            if (storedPic) {
                setProfilePic(storedPic);
            }
        };

        loadTheme();
        loadProfilePic();
    }, []);

    const toggleTheme = async () => {
        const newTheme = darkMode ? 'light' : 'dark';
        setDarkMode(!darkMode);
        await AsyncStorage.setItem('theme', newTheme);
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Denied", "You need to allow access to the gallery.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
            await AsyncStorage.setItem('profilePic', result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Denied", "You need to allow access to the camera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
            await AsyncStorage.setItem('profilePic', result.assets[0].uri);
        }
    };

    const removeProfilePic = async () => {
        setProfilePic(null);
        await AsyncStorage.removeItem('profilePic');
    };

    const handleSaveProfile = async () => {
        setName(newName);
        setBio(newBio);
        setModalVisible(false);
    };

    const handleCancelEdit = () => {
        setModalVisible(false);
        setNewName(name);
        setNewBio(bio);
    };

    return (
        <View style={[styles.container, darkMode ? styles.darkContainer : {}]}>
            <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
                {profilePic ? (
                    <Image source={{ uri: profilePic }} style={styles.avatar} />
                ) : (
                    <Image source={require('../assets/cute.jpg')} style={styles.avatar} />
                )}
                <View style={styles.iconContainer}>
                    <Ionicons name="camera" size={25} color="#fff" />
                </View>
            </TouchableOpacity>

            <Text style={[styles.userName, darkMode ? styles.darkText : {}]}>{name}</Text>
            <Text style={[styles.email, darkMode ? styles.darkText : {}]}>{bio}</Text>

            {profilePic && (
                <TouchableOpacity style={styles.removeButton} onPress={removeProfilePic}>
                    <Text style={styles.removeText}>Remove Profile Picture</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cameraButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="create-outline" size={26} color="white" />
            </TouchableOpacity>

            {/* Modal for editing profile */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Your Data</Text>
                        <TextInput
                            label="Name"
                            value={newName}
                            onChangeText={setNewName}
                            mode="outlined"
                            style={styles.input}
                        />
                        <TextInput
                            label="Bio"
                            value={newBio}
                            onChangeText={setNewBio}
                            mode="outlined"
                            multiline
                            style={[styles.input, styles.textArea]}
                        />
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity onPress={handleSaveProfile} style={styles.circularButton}>
                                <Ionicons name="checkmark" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelEdit} style={[styles.circularButton, styles.cancelButton]}>
                                <Ionicons name="close" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                <Ionicons name={darkMode ? "sunny-outline" : "moon-outline"} size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20 },
    darkContainer: { backgroundColor: '#121212' },
    profileContainer: { position: 'relative', marginBottom: 10, padding: 15, borderRadius: 100, borderWidth: 2, borderColor: '#fff' },
    avatar: { width: 240, height: 240, borderRadius: 120, borderWidth: 2, borderColor: '#fff' },
    iconContainer: { position: 'absolute', bottom: 25, right: 24, backgroundColor: '#6D214F', borderRadius: 50, padding: 10 },
    userName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    email: { fontSize: 16, color: '#777', marginBottom: 20 },
    darkText: { color: '#FBC02D' },
    removeButton: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 5, marginTop: 10 },
    removeText: { color: '#fff', fontSize: 16 },
    cameraButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6D214F', padding: 10, borderRadius: 50, marginTop: 10 },
    input: { width: '100%', marginBottom: 10 },
    textArea: { height: 100, textAlignVertical: 'top' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    modalButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    circularButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6D214F',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    cancelButton: { backgroundColor: '#ccc' },
    button: { marginTop: 20, width: '100%', paddingVertical: 8, borderRadius: 5 },
    themeToggle: { position: 'absolute', top: 20, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#6D214F', padding: 10, borderRadius: 50 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
});

export default ProfileScreen;
