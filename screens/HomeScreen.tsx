import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, IconButton } from 'react-native-paper';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const [savedEntries, setSavedEntries] = useState<{ date: string; title: string; description: string; time: string }[]>([]);
    const [markedDates, setMarkedDates] = useState<any>({});

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'My Diary',
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
            const formattedEntries = entries
                .map(([date, value]) => {
                    const parsedValue = value ? JSON.parse(value) : {};
                    return {
                        date,
                        title: parsedValue.title || '',
                        description: parsedValue.description || '',
                        time: parsedValue.time || ''
                    };
                })
                .filter(entry => entry.date);

            setSavedEntries(formattedEntries);

            const marks: any = {};
            formattedEntries.forEach((entry) => {
                marks[entry.date] = {
                    marked: true,
                    dotColor: 'red',
                    textColor: 'pink',
                };
            });
            setMarkedDates(marks);
        } catch (error) {
            console.error('Error loading saved entries:', error);
        }
    };

    // Navigate to Add Task screen with selected date
    const onDayPress = (day: DateData) => {
        navigation.navigate('AddTask', { selectedDate: day.dateString });
    };

    // Navigate to Add Task with the current date
    const onAddTaskPress = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        navigation.navigate('AddTask', { selectedDate: currentDate });
    };

    return (
        <View style={[styles.container, { backgroundColor: 'pink' }]}>
            <Text style={styles.screenTitle}>Welcome to Your Diary</Text>

            <Card style={[styles.card, { backgroundColor: '#FFF9F9' }]}>
                <Calendar
                    onDayPress={onDayPress}
                    style={styles.calendar}
                    theme={{ todayTextColor: '#00adf5' }}
                    markedDates={markedDates}
                />
            </Card>

            <FlatList
                data={savedEntries}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                    <Card style={styles.entryCard}>
                        <Text style={styles.entryText}>Date: {item.date}</Text>
                        <Text style={styles.entryText}>Title: {item.title}</Text>
                        <Text style={styles.entryText}>Description: {item.description}</Text>
                        <Text style={styles.entryText}>Time: {item.time}</Text>
                    </Card>
                )}
            />

            <IconButton
                icon="plus-circle"
                size={50}
                color="blue"
                style={styles.addButton}
                onPress={onAddTaskPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    screenTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
    card: { marginBottom: 20, borderRadius: 10, elevation: 3, padding: 10 },
    calendar: { width: '100%' },
    entryCard: { padding: 15, borderRadius: 10, marginVertical: 5, backgroundColor: 'white' },
    entryText: { fontSize: 16 },
    addButton: { position: 'absolute', bottom: 20, right: 20 }
});

export default HomeScreen;
