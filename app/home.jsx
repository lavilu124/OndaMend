import React, {useState } from 'react';
import {View, StyleSheet } from 'react-native';
import { Client, Account } from 'appwrite'; 
import { useFocusEffect } from '@react-navigation/native';
import MapView from 'react-native-maps';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('675f19af00004a6f0bf8');
const account = new Account(client);

const ISREAL = {
    latitude: 31.0461,
    longitude: 34.8516,
    latitudeDelta: 2,
    longitudeDelta: 2,
}

export default function App() {
    const [user, setUser] = useState(null);


    //get the user on page load
    useFocusEffect (() => {
        const fetchUser = async () => {
            try {
                const userData = await account.get();
                setUser(userData);
            } catch (error) {
                setUser(null); 
            }
        };

        fetchUser();
    });


    //view
    return (
        <MapView 
            style={StyleSheet.absoluteFill}
            initialRegion={ISREAL}
             />
      );
}

// Styles
const styles = StyleSheet.create({
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
