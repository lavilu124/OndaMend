import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Client, Databases, Query, Account, ID } from 'react-native-appwrite';

const client = new Client()
  .setProject('675f19af00004a6f0bf8')
  .setEndpoint('https://cloud.appwrite.io/v1');

const account = new Account(client);
const databases = new Databases(client);
const databaseId = '679f922800130bce0002';
const usersCollectionId = '67a8d6a5002264920113';
const messagesCollectionId = '67caf2c2001e5372ffe4';

const Professional = () => {
    const [assignedProf, setAssignedProf] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserDoc, setCurrentUserDoc] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await account.get();
                setCurrentUser(userData);

                // Find the user document in the database
                const response = await databases.listDocuments(databaseId, usersCollectionId, [
                    Query.equal("userId", userData.$id)
                ]);

                if (response.documents.length > 0) {
                    setCurrentUserDoc(response.documents[0]); // Store the user's document
                }
            } catch (error) {
                setCurrentUser(null);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!currentUserDoc) {
                return;
            }
            
            if (!currentUserDoc.assignedProf) {
                try {
                    const response = await databases.listDocuments(databaseId, usersCollectionId, [Query.equal("userType", "mentalHealthProf")]);

                    if (response.documents.length > 0) {
                        const randomIndex = Math.floor(Math.random() * response.documents.length);
                        const selectedProf = response.documents[randomIndex];

                        await databases.updateDocument(databaseId, usersCollectionId, currentUserDoc.$id, {
                            assignedProf: selectedProf.$id,
                        });

                        setAssignedProf(selectedProf);
                    }
                } catch (error) {
                    console.error('Error fetching professionals:', error);
                }
            } else {
                try {
                    const response = await databases.getDocument(databaseId, usersCollectionId, currentUserDoc.assignedProf);
                    console.log(response);
                    setAssignedProf(response);
                } catch (error) {
                    console.error('Error fetching assigned professional:', error);
                }
            }
        };

        fetchUsers();
    }, [currentUserDoc]);

    useEffect(() => {
        if (assignedProf) {
            fetchMessages();
        }
    }, [assignedProf]);

    const fetchMessages = async () => {
        try {
            if (!currentUser || !assignedProf) return;

            const response = await databases.listDocuments(
                databaseId,
                messagesCollectionId,
                [
                    Query.or([
                        Query.and([Query.equal('senderId', currentUser.$id), Query.equal('receiverId', assignedProf.$id)]),
                        Query.and([Query.equal('senderId', assignedProf.$id), Query.equal('receiverId', currentUser.$id)])
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
                receiverId: assignedProf.$id,
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
            <Text style={styles.title}>Chat with {assignedProf ? assignedProf.name : 'Professional'}</Text>

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

export default Professional;

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
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
        borderBottomLeftRadius: 0,
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
