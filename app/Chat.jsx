// Chat.jsx
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Client, Account, Databases, ID, Query } from 'react-native-appwrite';
import { useFocusEffect } from '@react-navigation/native';

const client = new Client()
  .setProject('675f19af00004a6f0bf8')
  .setEndpoint('https://cloud.appwrite.io/v1');

const account = new Account(client);
const databases = new Databases(client);
const databaseId = '679f922800130bce0002';
const messagesCollectionId = '67caf2c2001e5372ffe4';

const Chat = () => {
  const router = useRouter();
  const { userId, username } = useLocalSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useFocusEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setCurrentUser(userData);
      } catch (error) {
        setCurrentUser(null);
      }
    };
    fetchUser();
    fetchMessages();
  });

  const fetchMessages = async () => {
    try {
      if (!currentUser) return; 
  
      const response = await databases.listDocuments(
        databaseId,
        messagesCollectionId,
        [
          Query.or([
            Query.and([Query.equal('senderId', currentUser.$id), Query.equal('receiverId', userId)]),
            Query.and([Query.equal('senderId', userId), Query.equal('receiverId', currentUser.$id)])
          ]),
          Query.orderAsc('$createdAt'),
        ]
      );
  
      setMessages(response.documents);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await databases.createDocument(databaseId, messagesCollectionId, ID.unique(), {
        text: message,
        senderId: currentUser?.$id,
        receiverId: userId,
      });
      setMessage('');
      fetchMessages();
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text style={styles.title}>Chat with {username}</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={[styles.messageItem, item.senderId === currentUser?.$id ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        onContentSizeChange={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  messageItem: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '75%',
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 0,
    color: '#fff',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 0,
    color: '#000',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
