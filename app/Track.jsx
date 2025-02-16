import React, {useState } from 'react';
import {View } from 'react-native';
import { Client, Account } from 'appwrite'; 
import { useFocusEffect } from '@react-navigation/native';


const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('675f19af00004a6f0bf8');
const account = new Account(client);

export default function Track() {
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
        <View>
            <View>
                
            </View>
        </View>
    );
}