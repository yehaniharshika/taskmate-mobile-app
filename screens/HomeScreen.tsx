import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your navigation parameter types
type RootStackParamList = {
    Home: undefined;
    AddTask: { selectedDate: string; description?: string; time?: string; updateMode?: boolean };
};

type Task = {
    id: string;
    date: string;
    description: string;
    time: string;
    completed: boolean;
};

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [savedEntries, setSavedEntries] = useState<{ [date: string]: Task[] }>({});
    const [markedDates, setMarkedDates] = useState<any>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentEntry, setCurrentEntry] = useState<Task>({
        id: '',
        date: '',
        description: '',
        time: '',
        completed: false,
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: 'pink' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        });
    }, [navigation]);

    useEffect(() => {
        loadSavedEntries();
    }, []);

    const loadSavedEntries = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const entries = await AsyncStorage.multiGet(keys);
            const groupedEntries: { [date: string]: Task[] } = {};

            entries.forEach(([key, value]) => {
                if (value) {
                    try {
                        const tasks = JSON.parse(value);
                        if (Array.isArray(tasks)) {
                            groupedEntries[key] = tasks;
                        } else if (tasks && typeof tasks === 'object') {
                            // For backward compatibility if stored as a single task
                            groupedEntries[key] = [tasks];
                        }
                    } catch (error) {
                        console.error(`Error parsing value for key ${key}:`, error);
                    }
                }
            });

            setSavedEntries(groupedEntries);

            // Mark dates that have tasks
            const marks: any = {};
            Object.keys(groupedEntries).forEach((date) => {
                marks[date] = { marked: true, dotColor: 'red', textColor: 'pink' };
            });
            setMarkedDates(marks);
        } catch (error) {
            console.error('Error loading saved entries:', error);
        }
    };


    // When a calendar date is pressed, navigate to AddTask with that date.
    const onDayPress = (day: DateData) => {
        navigation.navigate('AddTask', { selectedDate: day.dateString });
    };

    // When the + icon is pressed, navigate to AddTask with the current date.
    const onAddTaskPress = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        navigation.navigate('AddTask', { selectedDate: currentDate });
    };

    // Toggle the completed status of a task
    const toggleTaskCompleted = async (date: string, taskId: string) => {
        const tasksForDate = savedEntries[date];
        if (!tasksForDate) return;
        const updatedTasks = tasksForDate.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const updatedEntries = { ...savedEntries, [date]: updatedTasks };
        setSavedEntries(updatedEntries);
        await AsyncStorage.setItem(date, JSON.stringify(updatedTasks));
    };

    // Open modal for updating a task row
    const onUpdatePress = (task: Task) => {
        setCurrentEntry(task);
        setIsModalVisible(true);
    };

    // Update the task in AsyncStorage and state
    const handleUpdate = async () => {
        const tasksForDate = savedEntries[currentEntry.date];
        if (!tasksForDate) return;
        const updatedTasks = tasksForDate.map((task) =>
            task.id === currentEntry.id ? currentEntry : task
        );
        const updatedEntries = { ...savedEntries, [currentEntry.date]: updatedTasks };
        setSavedEntries(updatedEntries);
        await AsyncStorage.setItem(currentEntry.date, JSON.stringify(updatedTasks));
        setIsModalVisible(false);
    };

    // Delete a task from AsyncStorage and state
    const handleDelete = async (date: string, taskId: string) => {
        const tasksForDate = savedEntries[date];
        if (!tasksForDate) return;
        const updatedTasks = tasksForDate.filter((task) => task.id !== taskId);
        const updatedEntries = { ...savedEntries };
        if (updatedTasks.length > 0) {
            updatedEntries[date] = updatedTasks;
            await AsyncStorage.setItem(date, JSON.stringify(updatedTasks));
        } else {
            delete updatedEntries[date];
            await AsyncStorage.removeItem(date);
        }
        setSavedEntries(updatedEntries);
    };

    return (
        <View style={[styles.container, { backgroundColor: 'pink' }]}>
            <Text style={styles.screenTitle}>Welcome to TaskMate😍</Text>
            {/* Calendar Card */}
            <Card style={[styles.card, { backgroundColor: '#FFF9F9' }]}>
                <Calendar
                    onDayPress={onDayPress}
                    style={styles.calendar}
                    theme={{ todayTextColor: '#00adf5' }}
                    markedDates={markedDates}
                />
            </Card>

            {/* Group tasks by date */}
            <ScrollView>
                {Object.entries(savedEntries).map(([date, tasks]) => (
                    <Card style={styles.entryCard} key={date}>
                        <Text style={styles.dateText}>{date}</Text>
                        {tasks.map((task) => (
                            <Card style={styles.miniCard} key={task.id}>
                                <View style={styles.taskRow}>
                                    <TouchableOpacity onPress={() => toggleTaskCompleted(date, task.id)}>
                                        <Ionicons
                                            name={task.completed ? 'checkbox' : 'square-outline'}
                                            size={24}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                    <Text style={[styles.taskText, task.completed && styles.taskCompleted]}>
                                        {task.description} at {task.time}
                                    </Text>
                                    <View style={styles.taskActions}>
                                        <TouchableOpacity onPress={() => onUpdatePress(task)} style={styles.iconButton}>
                                            <Ionicons name="pencil" size={20} color="white" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(date, task.id)} style={styles.iconButton}>
                                            <Ionicons name="trash" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Card>
                        ))}
                    </Card>
                ))}
            </ScrollView>

            {/* Add Task Button - centered at bottom */}
            <TouchableOpacity onPress={onAddTaskPress} style={styles.addButton}>
                <Ionicons name="add-circle" size={60} color="blue" />
            </TouchableOpacity>

            {/* Modal for updating task */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            value={currentEntry.description}
                            onChangeText={(text) => setCurrentEntry({ ...currentEntry, description: text })}
                            placeholder="Description"
                        />
                        <TextInput
                            style={styles.input}
                            value={currentEntry.time}
                            onChangeText={(text) => setCurrentEntry({ ...currentEntry, time: text })}
                            placeholder="Time"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={handleUpdate} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    card: { marginBottom: 20, borderRadius: 10, elevation: 3, padding: 10 },
    calendar: { width: '100%' },
    entryCard: {
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: '#FFEBEE',
        elevation: 5,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    miniCard: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
        elevation: 2,
        backgroundColor: '#FFF',
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
        flex: 1,
    },
    taskCompleted: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    taskActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconButton: {
        borderRadius: 30,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6D214F',
        elevation: 3,
        marginLeft: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        marginLeft: -25,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        width: '48%',
    },
    modalButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default HomeScreen;
