import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AuthProvider, AuthScreen, useAuth } from 'ja-auth-sdk';

// Configure your Firebase credentials here
const authConfig = {
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  providers: {
    emailPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    google: {
      enabled: true,
      webClientId:
        'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
    },
    apple: {
      enabled: true,
    },
  },
  ui: {
    theme: 'light',
    primaryColor: '#007AFF',
  },
};

function AuthenticatedScreen() {
  const { user, authState, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome! 🎉</Text>

        <View style={styles.userCard}>
          <Text style={styles.label}>Auth State:</Text>
          <Text style={styles.value}>{authState}</Text>

          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{user?.uid}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || 'N/A'}</Text>

          <Text style={styles.label}>Display Name:</Text>
          <Text style={styles.value}>{user?.displayName || 'N/A'}</Text>

          <Text style={styles.label}>Provider:</Text>
          <Text style={styles.value}>{user?.providerId}</Text>

          <Text style={styles.label}>Email Verified:</Text>
          <Text style={styles.value}>
            {user?.emailVerified ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Text
            style={[styles.button, styles.signOutButton]}
            onPress={() => {
              signOut();
              Alert.alert('Success', 'Signed out successfully');
            }}
          >
            Sign Out
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>✅ SDK Features Demonstrated:</Text>
          <Text style={styles.infoBullet}>
            • State Management (Authenticated state active)
          </Text>
          <Text style={styles.infoBullet}>• User data persistence</Text>
          <Text style={styles.infoBullet}>• Sign out functionality</Text>
          <Text style={styles.infoBullet}>• Pre-built UI component</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UnauthenticatedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>ja-auth-sdk Demo</Text>
        <Text style={styles.subtitle}>
          Firebase Authentication Example App
        </Text>

        <AuthScreen
          onAuthSuccess={(user) => {
            Alert.alert(
              'Success',
              `Signed in as ${user?.email || user?.displayName || 'User'}`
            );
          }}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📚 SDK Features:</Text>
          <Text style={styles.infoBullet}>✅ Email/Password authentication</Text>
          <Text style={styles.infoBullet}>✅ Google Sign-In</Text>
          <Text style={styles.infoBullet}>✅ Apple Sign-In</Text>
          <Text style={styles.infoBullet}>✅ Pre-built UI component</Text>
          <Text style={styles.infoBullet}>✅ State management</Text>
          <Text style={styles.infoBullet}>✅ Error handling</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AppContent() {
  const { authState } = useAuth();

  if (authState === 'Loading') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return authState === 'Authenticated' ? (
    <AuthenticatedScreen />
  ) : (
    <UnauthenticatedScreen />
  );
}

export default function App() {
  return (
    <AuthProvider config={authConfig}>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Courier New',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    overflow: 'hidden',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  infoBullet: {
    fontSize: 14,
    color: '#1B5E20',
    marginBottom: 8,
    lineHeight: 20,
  },
});
