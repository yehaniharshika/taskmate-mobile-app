import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainTabParamList } from "../navigation/types";

const AddTaskScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<MainTabParamList>>();
    const route = useRoute<RouteProp<MainTabParamList, 'AddTask'>>();
    const selectedDateFromHome = route.params?.selectedDate;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(selectedDateFromHome || '');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (!selectedDate) {
            const currentDate = new Date().toISOString().split('T')[0];
            setSelectedDate(currentDate);
        }
    }, [selectedDate]);

    const handleAddTask = async () => {
        if (title && description && selectedDate && time) {
            const newTask = {
                id: uuidv4(),
                date: selectedDate,
                description,
                time
            };

            try {
                await AsyncStorage.setItem(selectedDate, JSON.stringify(newTask));
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
                    Add New Task
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
                    value={selectedDate}
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
    container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 30, backgroundColor: '#f5f5f5' },
    card: { padding: 20, borderRadius: 10, elevation: 4, backgroundColor: '#fff' },
    heading: { textAlign: 'center', marginBottom: 20, fontWeight: 'bold', color: '#333' },
    input: { marginBottom: 15 },
    textArea: { height: 100, textAlignVertical: 'top' },
    button: { marginTop: 10, paddingVertical: 8, borderRadius: 5 }
});

export default AddTaskScreen;
