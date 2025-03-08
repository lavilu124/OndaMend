import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Client, Account, Databases, Query } from 'react-native-appwrite';

const client = new Client()
  .setProject('675f19af00004a6f0bf8')
  .setEndpoint('https://cloud.appwrite.io/v1');

const account = new Account(client);
const databases = new Databases(client);
const databaseId = '679f922800130bce0002';
const usersCollectionId = '67a8d6a5002264920113';

const ChatSelection = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchCurrentUser = async () => {
        try {
          const userData = await account.get();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error fetching current user:', error);
          setCurrentUser(null);
        }
      };

      fetchCurrentUser();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        if (!currentUser) return;

        try {
          const response = await databases.listDocuments(databaseId, usersCollectionId, [Query.limit(50)]);
          const filteredUsers = response.documents.filter(user => user.userId !== currentUser?.$id && user.userType !== 'mentalHealthProf');
          setUsers(filteredUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }, [currentUser])
  );

  const startChat = (user) => {
    router.push({ pathname: '/Chat', params: { userId: user.userId, username: user.name } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a User to Chat</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => startChat(item)}>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.userType}>Is {item.age} Years old</Text>
            {item.userType !== "other"? 
            (<Text style={styles.userType}>Is a {item.userType} user</Text>) 
            : (<Text style={styles.userType}>Is an unspecified user</Text>)}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,  
    shadowColor: '#000',  
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  username: {
    fontSize: 18,
    color: '#333',
  },
  userType: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});
