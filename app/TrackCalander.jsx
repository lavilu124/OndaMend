import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Client, Account, Databases, Query } from 'react-native-appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setProject('675f19af00004a6f0bf8') 
  .setEndpoint('https://cloud.appwrite.io/v1'); 

const account = new Account(client);
const databases = new Databases(client);
const databaseId = '679f922800130bce0002';
const collectionId = '67c9fbdf000f28b47fa8';

const TrackCalander = () => {
  const [userId, setUserId] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUserId(userData.$id);
      } catch (error) {
        setUserId(null);
      }
    };
  
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWeeklyReport();
    }
  }, [userId]);

  const fetchWeeklyReport = async () => {
    const today = new Date();
    const pastWeek = new Date();
    pastWeek.setDate(today.getDate() - 6); 

    try {
      const response = await databases.listDocuments(databaseId, collectionId, [
        Query.equal('userId', userId),
        Query.greaterThanEqual('date', pastWeek.toISOString().split('T')[0]),
        Query.lessThanEqual('date', today.toISOString().split('T')[0]),
        Query.orderDesc('date'),
      ]);

      setWeeklyData(response.documents);
    } catch (error) {
      console.error('Failed to fetch weekly data:', error);
    }
  };

  const calculateAverages = () => {
    if (weeklyData.length === 0) return null;

    const total = { mood: 0, sleep: 0, eating: 0, activity: 0 };
    weeklyData.forEach((entry) => {
      total.mood += entry.mood;
      total.sleep += entry.sleep;
      total.eating += entry.eating;
      total.activity += entry.activity;
    });

    return {
      mood: (total.mood / weeklyData.length).toFixed(1),
      sleep: (total.sleep / weeklyData.length).toFixed(1),
      eating: (total.eating / weeklyData.length).toFixed(1),
      activity: (total.activity / weeklyData.length).toFixed(1),
    };
  };

  const averages = calculateAverages();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Report</Text>
      
      {weeklyData.length > 0 ? (
        <>
          <FlatList
            data={weeklyData}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <View style={styles.entry}>
                <Text style={styles.entryDate}>{item.date}</Text>
                <Text>Mood: {item.mood}</Text>
                <Text>Sleep: {item.sleep}</Text>
                <Text>Eating: {item.eating}</Text>
                <Text>Activity: {item.activity}</Text>
              </View>
            )}
          />
          
          <View style={styles.averagesContainer}>
            <Text style={styles.averageTitle}>Weekly Averages</Text>
            {averages && (
              <>
                <Text>Mood: {averages.mood}</Text>
                <Text>Sleep: {averages.sleep}</Text>
                <Text>Eating: {averages.eating}</Text>
                <Text>Activity: {averages.activity}</Text>
              </>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No data available for the past week.</Text>
      )}
    </View>
  );
};

export default TrackCalander;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  entry: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  entryDate: {
    fontWeight: 'bold',
  },
  averagesContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#dfe6e9',
    borderRadius: 10,
  },
  averageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});
