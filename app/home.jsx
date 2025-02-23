import React, {useState } from 'react';
import {View, StyleSheet } from 'react-native';
import { Client, Account } from 'appwrite'; 
import { useFocusEffect } from '@react-navigation/native';


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
                setUser(null); 
            }
        };

        fetchUser();
    });


    //view
    return (
        <View style={styles.container}>
          <View style={styles.content}>
            
          </View>
        </View>
      );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF4F1',
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
