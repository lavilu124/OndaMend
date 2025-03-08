import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Client, Account } from 'react-native-appwrite';
import { useRouter } from 'expo-router';

// Initialize Appwrite Client
const client = new Client()
  .setProject('675f19af00004a6f0bf8') 
  .setEndpoint('https://cloud.appwrite.io/v1'); 

const account = new Account(client);

const Communication = () => {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const userData = await account.get();
          setUserId(userData.$id);
        } catch (error) {
          setUserId(null);
        }
      };

      fetchUser();
    }, [])
  );

  const goSignIn = () => router.push('/signin');
  const goChat = () => router.push('/ChatSelection');
  const goPorfessional = () => router.push('/Professional');

  return (
    <View style={styles.container}>
      {userId ? (
        <>
          <Text style={styles.title}>Communication</Text>
          <Text style={styles.definition}>
            Choose between talking to a therapist or other people in a group setting.
          </Text>

          <TouchableOpacity style={styles.goButton} onPress={goPorfessional}>
            <Text style={styles.ButtonText}>Go Talk to a porfessional</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goButton} onPress={goChat}>
            <Text style={styles.ButtonText}>Go to chat</Text>
          </TouchableOpacity>

          
        </>
      ) : (
        <>
          <Text style={styles.title}>User not signed in</Text>
          <Text style={styles.subtitle}>Please sign in to use this feature</Text>
          <TouchableOpacity style={styles.goButton} onPress={goSignIn}>
            <Text style={styles.ButtonText}>Go to sign in</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Communication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: 20,  
    left: 20, 
    fontSize: 32, 
    fontWeight: 'bold', 
  },
  definition: {
    fontSize: 18, 
    marginTop: 20, 
    alignSelf: 'flex-start',
  },
  goButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  ButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
