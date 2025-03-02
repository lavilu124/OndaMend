import {Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(12);
  const [userType, setUserType] = useState('other'); 
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !age || !userType) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    setLoading(true);
    try {
      const user = await account.create(ID.unique(), email, password, fullName);
      await account.createEmailPasswordSession(email, password);
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        userId: user.$id,
        name: fullName,
        email,
        age,  
        userType,
      });
      Alert.alert('Success', 'Account created successfully!');
      router.push('/Home');
    } catch (error) {
      Alert.alert('Signup Failed', error.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // the page view
  return (
    <View style={styles.container}>

      <Image source={require('../assets/clean.png')} style={styles.logo} />
      <Image source={require('../assets/signupText.png')} style={styles.title} />

      <View style={styles.nameContainer}>
        <DyInput placeholder={"First Name"} value={firstName} onChangeText={setFirstName} style={styles.nameInput} />
        <DyInput placeholder={"Last Name"} value={lastName} onChangeText={setLastName} style={styles.nameInput} />
      </View>

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

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={(text) => setAge(Number(text) || 0)}
        keyboardType="numeric"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userType}
          onValueChange={(itemValue) => setUserType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Diagnosed" value="Diagnosed" />
          <Picker.Item label="Mental Health Professional" value="mentalHealthProf" />
          <Picker.Item label="Learning" value="learning" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>


      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signin')}>
          <Text style={styles.linkText}>Sign in here</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Signup;

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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',  
    width: '40%',  
    marginBottom: 15,  
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#bac0c7',
    borderColor: '#000000', 
    borderWidth: 1, 
    padding: 6, 
    borderRadius: 8, 
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
  pickerContainer: {
    width: '80%',
    height: 55, 
    borderRadius: 8,
    borderColor: '#000000',
    borderWidth: 1,
    overflow: 'hidden', 
    backgroundColor: '#bac0c7',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: '100%',
    padding: 4,
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

