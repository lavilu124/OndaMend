import {Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { Client, Account } from 'react-native-appwrite';
import { useRouter } from 'expo-router';


// Create the client to connect to the auth
const client = new Client()
  .setProject('675f19af00004a6f0bf8') 
  .setEndpoint('https://cloud.appwrite.io/v1'); 

// Create the account of the current user
const account = new Account(client);

const Signin = () => {
  // Data for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Function for login is async to update
  const handleLogin = async () => {
    // Check if the user entered a password and email
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    // Try to connect
    setLoading(true);
    try {
      const response = await account.createEmailPasswordSession(email, password); 
      console.log('Login successful:', response);
      router.push('/Home');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // The page
  return (
    <View style={styles.container}>
      <Image source={require('../assets/clean.png')} style={styles.logo} />
      <Image source={require('../assets/signinText.png')} style={styles.title} />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.linkText}>Sign up here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signin;

// Design for the Signin Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  title: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  input: {
    width: '80%',
    padding: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    backgroundColor: '#bac0c7',
  },
  picker: {
    width: '80%',
    height: '10%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#6699cc', 
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
});
