import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Track() {
    const [ratings, setRatings] = useState({
        mood: 1,
        sleep: 1,
        eating: 1,
        activity: 1,
    });

    const handleRating = (category, value) => {
        setRatings({ ...ratings, [category]: value });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Personal Tracker</Text>
            <Text style={styles.subtitle}>Keep track of your day</Text>
            
            <ScrollView>
                {[
                    { key: 'mood', label: 'Mood', icon: 'smile-o' },
                    { key: 'sleep', label: 'Sleep Quality', icon: 'moon-o' },
                    { key: 'eating', label: 'Eating', icon: 'cutlery' },
                    { key: 'activity', label: 'Physical Activity', icon: 'bicycle' },
                ].map((item) => (
                    <View key={item.key} style={styles.trackerItem}>
                        <View style={styles.iconLabel}>
                            <Icon name={item.icon} size={24} color="#4A90E2" />
                            <Text style={styles.trackerText}>{item.label}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <TouchableOpacity key={num} onPress={() => handleRating(item.key, num)}>
                                    <Icon 
                                        name="star" 
                                        size={24} 
                                        color={ratings[item.key] >= num ? '#FFD700' : '#ccc'} 
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
                
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveText}>FeedBack</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 14,
        color: '#777',
        marginBottom: 20,
    },
    trackerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    iconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trackerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    saveButton: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});