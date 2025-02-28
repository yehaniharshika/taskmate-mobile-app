import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainTabParamList } from "../navigation/types"; // Adjust import if needed

const AddTaskScreen = () => {
    const navigation = useNavigation<NavigationProp<MainTabParamList>>();
    const route = useRoute<RouteProp<MainTabParamList, 'AddTask'>>();
    const { selectedDate, description: initialDescription, time: initialTime } = route.params || {
        selectedDate: '',
        description: '',
        time: '',
    };

    const [description, setDescription] = useState<string>(initialDescription || '');
    const [selectedDateState, setSelectedDate] = useState<string>(selectedDate || '');
    const [time, setTime] = useState<string>(initialTime || '');

    useEffect(() => {
        if (!selectedDateState) {
            const currentDate = new Date().toISOString().split('T')[0];
            setSelectedDate(currentDate);
        }
    }, [selectedDateState]);

    const handleAddTask = async () => {
        if (description && selectedDateState && time) {
            const newTask = {
                id: uuidv4(),
                date: selectedDateState,
                description,
                time,
                completed: false,
            };

            try {
                const existingTasksJson = await AsyncStorage.getItem(selectedDateState);
                let existingTasks: any[] = [];
                if (existingTasksJson) {
                    const parsed = JSON.parse(existingTasksJson);
                    // If parsed data is not an array, wrap it in an array.
                    existingTasks = Array.isArray(parsed) ? parsed : [parsed];
                }
                const updatedTasks = [...existingTasks, newTask];
                await AsyncStorage.setItem(selectedDateState, JSON.stringify(updatedTasks));
                navigation.navigate('Home');
            } catch (error) {
                console.error('Error saving task:', error);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Text variant="headlineMedium" style={styles.heading}>
                    What are your planning😇
                </Text>
                <TextInput
                    label="Add your task here..."
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={[styles.input, styles.textArea]}
                />
                <TextInput
                    label="Date"
                    value={selectedDateState}
                    mode="outlined"
                    style={styles.input}
                    disabled
                />
                <TextInput
                    label="Time"
                    value={time}
                    onChangeText={setTime}
                    mode="outlined"
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleAddTask} style={styles.button}>
                    Add Task
                </Button>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: 'pink',
    },

    card: {
        padding: 20,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: '#fff',
    },

    heading: {
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
        fontSize: 18
    },

    input: {
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
        borderRadius: 5,
    },
});

export default AddTaskScreen;
