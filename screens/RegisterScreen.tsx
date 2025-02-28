// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from "../navigation/types";

const RegisterScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        if (username && password) {
            // Add registration logic here
            navigation.navigate('Auth'); // Navigate to login after successful registration
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' }}>
            <Card style={{ padding: 20, borderRadius: 10 }}>
                <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 20 }}>
                    Register
                </Text>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                    style={{ marginBottom: 10 }}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    style={{ marginBottom: 20 }}
                />
                <Button mode="contained" onPress={handleRegister}>
                    Register
                </Button>
                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <Text>Already have an account?</Text>
                    <Button mode="text" onPress={() => navigation.navigate('Auth')}>
                        Login
                    </Button>
                </View>
            </Card>
        </View>
    );
};

export default RegisterScreen;
