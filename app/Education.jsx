//importing 
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Client, Account} from 'react-native-appwrite';
import { useFocusEffect } from '@react-navigation/native';

//connect to PPWRITE
const client = new Client()
  .setProject('675f19af00004a6f0bf8') 
  .setEndpoint('https://cloud.appwrite.io/v1'); 

const account = new Account(client);


const Education = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

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


  return (
    
    <View style={styles.container}>
    </View>
  );
};

export default Education;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    position: 'absolute',
    top: 20,  
    left: 20, 
    fontSize: 32, 
    fontWeight: 'bold', 
  },
});
