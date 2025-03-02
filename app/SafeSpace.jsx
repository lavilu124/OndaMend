import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Client, Account } from 'react-native-appwrite';
import { useFocusEffect } from '@react-navigation/native';
import { Linking } from 'react-native'; 

// Connect to Appwrite
const client = new Client()
  .setProject('675f19af00004a6f0bf8')
  .setEndpoint('https://cloud.appwrite.io/v1');

const account = new Account(client);

const SafeSpace = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useFocusEffect(() => {
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

  // Function to open YouTube
  const openYouTube = () => {
    Linking.openURL('https://www.youtube.com').catch(err => console.error('Failed to open YouTube', err));
  };

  // Function to open Spotify
  const openSpotify = () => {
    Linking.openURL('https://www.spotify.com').catch(err => console.error('Failed to open Spotify', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safe Space</Text>
      <Text style={styles.definition}>Relax by watching a video or listening to your favorite music!</Text>

      <TouchableOpacity onPress={openYouTube}>
        <Image 
          source={require('../assets/youtube.png')} 
          style={styles.image}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={openSpotify}>
        <Image 
          source={require('../assets/spotify.png')} 
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SafeSpace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    position: 'relative',
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
    marginTop: 80, 
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  image: {
    width: 340, 
    height: 100, 
    margin: 10,
  },
});
