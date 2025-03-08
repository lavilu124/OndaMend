import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Client, Account, Databases, ID } from 'react-native-appwrite';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

// client of auth
const client = new Client()
  .setProject('675f19af00004a6f0bf8') 
  .setEndpoint('https://cloud.appwrite.io/v1'); 

// account of the current user
const account = new Account(client);
const databases = new Databases(client);
const databaseId = '679f922800130bce0002';
const collectionId = '67c9fbdf000f28b47fa8';

export default function Track() {
    const [ratings, setRatings] = useState({
        mood: 1,
        sleep: 1,
        eating: 1,
        activity: 1,
    });
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    useFocusEffect(() => {
        const getUser = async () => {
            try {
                const user = await account.get();
                setUserId(user.$id);
            } catch (error) {
                setUserId(null);
            }
        };
        getUser();
    });

    const handleRating = (category, value) => {
        setRatings({ ...ratings, [category]: value });
    };

    const uploadFeedback = async () => {
        if (!userId) {
            alert('User not logged in');
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        try {
            const response = await databases.createDocument(
                databaseId,
                collectionId,
                ID.unique(),
                {
                    userId: userId,
                    mood: ratings.mood,
                    sleep: ratings.sleep,
                    eating: ratings.eating,
                    activity: ratings.activity,
                    date: today,
                }
            );
            router.push('/TrackCalander');

        } catch (error) {
            alert('Failed to save feedback. Please try again.');
        }
    };

    const goSignIn = () => {
        router.push('/signin');
    }

    return (
        <View style={styles.container}>
            {userId? 
            (<>
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
                
                <TouchableOpacity style={styles.saveButton} onPress={uploadFeedback}>
                    <Text style={styles.saveText}>Submit Feedback</Text>
                </TouchableOpacity>
            </ScrollView>
            </>) 
            : 
            (<>
                <Text style={styles.title}>User not signed in</Text>
                <Text style={styles.subtitle}>Please sign in to use this feature</Text>
                <TouchableOpacity style={styles.saveButton} onPress={goSignIn}>
                    <Text style={styles.saveText}>Go to sign in</Text>
                </TouchableOpacity>
            </>)}
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
