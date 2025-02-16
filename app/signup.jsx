import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { Client, Account, Databases, ID } from 'react-native-appwrite';
import { useRouter } from 'expo-router';
import DyInput from '../components/Input';
import { Picker } from '@react-native-picker/picker';

// client of auth
const client = new Client()
  .setProject('675f19af00004a6f0bf8') 
  .setEndpoint('https://cloud.appwrite.io/v1'); 

// account of the current user
const account = new Account(client);
const databases = new Databases(client);
const databaseId = '679f922800130bce0002';
const collectionId = '67a8d6a5002264920113';

const Signup = () => {
  // data needed to sign up
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(12);
  const [userType, setUserType] = useState('other'); 
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !age || !userType) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const user = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        userId: user.$id,
        name,
        email,
        age,  
        userType,
      });
      Alert.alert('Success', 'Account created successfully!');
      router.push('/home');
    } catch (error) {
      Alert.alert('Signup Failed', error.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // the page view
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <DyInput placeholder={"Name"} value={name} onChangeText={setName}></DyInput>
      <DyInput placeholder={"Email"} value={email} onChangeText={setEmail} keyboardType={"email-address"}></DyInput>

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={(text) => setAge(Number(text) || 0)}
        keyboardType="numeric"
      />

      
      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Diagnosed" value="Diagnosed" />
        <Picker.Item label="mental Health Profficnal" value="mentalHealthProf" />
        <Picker.Item label="learning" value="learning" />
        <Picker.Item label="other" value="other" />
      </Picker>

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
  picker: {
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
