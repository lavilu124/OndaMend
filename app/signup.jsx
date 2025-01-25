import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { Client, Account } from 'react-native-appwrite';
import { useRouter } from 'expo-router';
import DyInput from '../components/Input';

//client of auth
const client = new Client()
  .setProject('675f19af00004a6f0bf8') 
  .setEndpoint('https://cloud.appwrite.io/v1'); 


//account of the current user
const account = new Account(client);

const Signup = () => {
  //data needed to sign up
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  //function to handle the sign up
  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await account.create('unique()', email, password, name);
      Alert.alert('Success', 'Account created successfully!');
      await account.createEmailPasswordSession(email, password);
      router.push('/home');

    } catch (error) {
      Alert.alert('Signup Failed', error.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  //the page view
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>


      <DyInput placeholder={"name"} value={name} onChangeText={setName}></DyInput>

      <DyInput placeholder={"Email"} value={email} onChangeText={setEmail} keyboardType={"email-address"}></DyInput>

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
              style={[styles.button, styles.signinButton]}
              onPress={() => router.push('/signin')}
            >
              <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;


//the style
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
  signinButton: {
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