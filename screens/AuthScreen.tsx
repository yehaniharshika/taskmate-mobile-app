import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { TextInput, Button, Text, Card } from 'react-native-paper';
import { login } from "../reducers/AuthSlice";
import { RootStackParamList } from "../navigation/types";

const AuthScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username && password) {
            dispatch(login(username));
            navigation.navigate('Main'); // Redirect to Main (which contains the tab navigator)
        } else {
            alert('Please enter both username and password');
        }
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' }}>
            <Card style={{ padding: 20, borderRadius: 10 }}>
                <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 20 }}>
                    Login
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
                <Button mode="contained" onPress={handleLogin}>
                    Login
                </Button>

                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <Text>Don't have an account?</Text>
                    <Button mode="text" onPress={() => navigation.navigate('Register')}>
                        Register
                    </Button>
                </View>
            </Card>
        </View>
    );
};

export default AuthScreen;
