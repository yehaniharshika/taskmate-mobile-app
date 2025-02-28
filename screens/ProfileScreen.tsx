import React from 'react';
import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { Text, Card, Button } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainTabParamList } from "../navigation/types"; // Import MainTabParamList instead

const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp<MainTabParamList>>(); // Correct the navigation type
    const tasks = useSelector((state: any) => state.tasks.items);

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#f8f9fa' }}>
            <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 20 }}>
                Task List
            </Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={{ marginBottom: 10, padding: 15 }}>
                        <Text variant="titleMedium">{item.title}</Text>
                        <Text>{item.description}</Text>
                    </Card>
                )}
            />
            <Button
                mode="contained"
                onPress={() => navigation.navigate('AddTask')} // This is now correctly typed
                style={{ marginTop: 20 }}
            >
                Add New Task
            </Button>
        </View>
    );
};

export default ProfileScreen;
