import React, { useState, useEffect } from 'react';
import { Image,  View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Client, Account } from 'appwrite';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('675f19af00004a6f0bf8');
const account = new Account(client);


//root layer contains the header and the tabs 
const RootLayout = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const pathname = usePathname(); 

  // Fetch user data on route change
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        setUser(null); 
      }
    };

    fetchUser();
  }, [pathname]); // Runs when the pathname changes

  // Redirect to home on initial load
  useEffect(() => {
    router.push('/Home');
  }, []);

  // Handle profile navigation
  const handleProfileNavigation = () => {
    if (user) {
      router.push('/profile');
    } else {
      router.push('/signin');
    }
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleProfileNavigation}>
          {user ? (
            <Ionicons name="person-circle" size={50} color="#fff" />
          ) : (
            <Ionicons name="person-circle-outline" size={50} color="#fff" />
          )}
        </TouchableOpacity>

        <Image source={require('../assets/clean.png')} style={styles.logo} />
      </View>

      {/* Tabs */}
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          }}
        />

        <Tabs.Screen
          name="Track"
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="body" color={color} size={size} />,
          }}
        />

        <Tabs.Screen
          name="Communication"
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="chatbox" color={color} size={size} />,
          }}
        />

        <Tabs.Screen
          name="Education"
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
          }}
        />

        <Tabs.Screen
          name="SafeSpace"
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
          }}
        />

        {/* invisable Tabs */}
        <Tabs.Screen name="signin" options={{ href: null }} />
        <Tabs.Screen name="signup" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="TrackCalander" options={{ href: null }} />
        <Tabs.Screen name="Chat" options={{ href: null }} />
        <Tabs.Screen name="ChatSelection" options={{ href: null }} />
        <Tabs.Screen name="Professional" options={{ href: null }} />
      </Tabs>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#BAC0C7',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logo: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
});

export default RootLayout;
