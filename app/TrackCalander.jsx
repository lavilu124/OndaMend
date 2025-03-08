import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Client, Account, Databases, Query } from 'react-native-appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setProject('675f19af00004a6f0bf8') 
  .setEndpoint('https://cloud.appwrite.io/v1'); 

const account = new Account(client);
const databases = new Databases(client);
const databaseId = '679f922800130bce0002';
const collectionId = '67c9fbdf000f28b47fa8';

const TrackCalendar = () => {
  const [userId, setUserId] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true; 

      const fetchUser = async () => {
        try {
          const userData = await account.get();
          if (isActive) {
            setUserId(userData.$id);
          }
        } catch (error) {
          if (isActive) {
            setUserId(null);
          }
        }
      };

      const fetchWeeklyReport = async (userId) => {
        if (!userId) return;

        const today = new Date();
        const pastWeek = new Date();
        pastWeek.setDate(today.getDate() - 6);

        try {
          const response = await databases.listDocuments(databaseId, collectionId, [
            Query.equal('userId', userId),
            Query.greaterThanEqual('date', pastWeek.toISOString().split('T')[0]),
            Query.lessThanEqual('date', today.toISOString().split('T')[0]),
            Query.orderAsc('date'),
          ]);

          if (isActive) {
            setWeeklyData(formatData(response.documents));
          }
        } catch (error) {
          console.error('Failed to fetch weekly data:', error);
        }
      };

      fetchUser().then(() => {
        if (userId) {
          fetchWeeklyReport(userId);
        }
      });

      return () => {
        isActive = false; // Cleanup function to prevent state updates if unmounted
      };
    }, [userId])
  );

  const formatData = (data) => {
    const today = new Date();
    const pastWeek = new Date();
    pastWeek.setDate(today.getDate() - 6);

    let weekMap = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(pastWeek);
      date.setDate(pastWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      weekMap[dateStr] = {
        mood: '-',
        sleep: '-',
        eating: '-',
        activity: '-',
        date: dateStr,
      };
    }

    data.forEach((entry) => {
      if (weekMap[entry.date]) {
        weekMap[entry.date] = {
          mood: entry.mood,
          sleep: entry.sleep,
          eating: entry.eating,
          activity: entry.activity,
          date: entry.date,
        };
      }
    });

    return Object.values(weekMap);
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Tracker</Text>

      <View style={styles.calendar}>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Day</Text>
          <Text style={styles.headerCell}>Mood</Text>
          <Text style={styles.headerCell}>Sleep</Text>
          <Text style={styles.headerCell}>Eating</Text>
          <Text style={styles.headerCell}>Activity</Text>
        </View>

        {weeklyData.map((day) => (
          <View key={day.date} style={[styles.row, day.date === todayDate && styles.todayRow]}>
            <Text style={[styles.cell, styles.dayCell]}>{getDayName(day.date)}</Text>
            <Text style={styles.cell}>{day.mood}</Text>
            <Text style={styles.cell}>{day.sleep}</Text>
            <Text style={styles.cell}>{day.eating}</Text>
            <Text style={styles.cell}>{day.activity}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TrackCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  todayRow: {
    backgroundColor: '#e3f2fd',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#4A90E2',
    color: '#fff',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
  },
  dayCell: {
    fontWeight: 'bold',
  },
});
