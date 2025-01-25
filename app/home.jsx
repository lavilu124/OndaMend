import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Client, Account } from 'appwrite'; 
import { useFocusEffect } from '@react-navigation/native';
import DyButton from '../components/button';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('675f19af00004a6f0bf8');
const account = new Account(client);

export default function App() {
    const [user, setUser] = useState(null);

    //get the user on page load
    useFocusEffect (() => {
        const fetchUser = async () => {
            try {
                const userData = await account.get();
                setUser(userData);
            } catch (error) {
                setUser(null); // Handle the case where the user is not logged in
            }
        };

        fetchUser();
    });


    //view
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Home Page</Text>
                {user && <Text>Welcome, {user.name}</Text>}
                <DyButton text="pls click me!!!!" onPress={() => alert('Wow what a press!')} backgroundColor="green" textColor="white"></DyButton>
            </View>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        paddingTop: 70,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 30,
    },
});
