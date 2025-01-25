import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { Client, Account } from 'react-native-appwrite';
import { useRouter } from 'expo-router';
import DyInput from '../components/Input';

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
      router.push('/home');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // The page
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <DyInput placeholder={"Email"} value={email} onChangeText={setEmail} keyboardType={"email-address"}></DyInput>

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

      <TouchableOpacity
        style={[styles.button, styles.signupButton]}
        onPress={() => router.push('/signup')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
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
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: '#3498db',
    width: '50%',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
