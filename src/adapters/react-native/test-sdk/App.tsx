import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { AuthProvider, useAuth, AuthWidget } from 'ja-auth-sdk/react-native';
import { AuthConfig, AuthState } from 'ja-auth-sdk';

const authConfig: AuthConfig = {
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  },
  providers: {
    emailPassword: true,
    google: true,
    apple: true  // Only works on iOS with proper setup
  },
  ui: {
    theme: 'light',
    brandName: 'My Awesome App',
    logo: 'https://your-logo-url.com/logo.png'
  }
};

/**
 * Example 1: Using Pre-built AuthWidget
 */
function ExampleWithWidget() {
  return (
    <View style={styles.exampleContainer}>
      <AuthWidget 
        config={authConfig}
        onAuthSuccess={(user) => {
          console.log('Logged in!', user);
        }}
        onAuthError={(error) => {
          console.error('Auth error:', error);
        }}
      />
    </View>
  );
}

/**
 * Example 2: Custom UI with useAuth hook
 */
function ExampleWithCustomUI() {
  const { 
    user, 
    authState, 
    isAuthenticated, 
    signIn, 
    signOut,
    signInWithGoogle 
  } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = async () => {
    setError('');
    const result = await signIn(email, password);
    if (!result.success) {
      setError(result.error?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error?.message || 'Google login failed');
    }
  };

  if (authState === AuthState.LOADING) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isAuthenticated && user) {
    return (
      <View style={styles.exampleContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back!</Text>
          <Text style={styles.cardText}>Email: {user.email}</Text>
          {user.displayName && (
            <Text style={styles.cardText}>Name: {user.displayName}</Text>
          )}
          <Text style={styles.cardText}>Provider: {user.provider}</Text>
          
          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Custom UI Example</Text>
      
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        This example shows how to build custom UI with useAuth hook
      </Text>
    </View>
  );
}

/**
 * Auth State Monitor Component
 */
function AuthStateMonitor() {
  const { authState, user, isAuthenticated } = useAuth();

  const getStateColor = () => {
    switch (authState) {
      case AuthState.AUTHENTICATED:
        return '#4caf50';
      case AuthState.UNAUTHENTICATED:
        return '#f44336';
      case AuthState.TOKEN_EXPIRED:
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <View style={[styles.statusBar, { backgroundColor: getStateColor() }]}>
      <Text style={styles.statusText}>
        Status: {authState.toUpperCase()}
      </Text>
      {user && (
        <Text style={styles.statusText}>
          User: {user.email}
        </Text>
      )}
    </View>
  );
}

/**
 * Main App Component
 */
function AppContent() {
  const [activeExample, setActiveExample] = useState<'widget' | 'custom'>('widget');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔐 Firebase Auth SDK</Text>
        <Text style={styles.headerSubtitle}>React Native Example</Text>
      </View>

      <AuthStateMonitor />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeExample === 'widget' && styles.activeTab]}
          onPress={() => setActiveExample('widget')}
        >
          <Text style={[
            styles.tabText, 
            activeExample === 'widget' && styles.activeTabText
          ]}>
            Pre-built Widget
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeExample === 'custom' && styles.activeTab]}
          onPress={() => setActiveExample('custom')}
        >
          <Text style={[
            styles.tabText,
            activeExample === 'custom' && styles.activeTabText
          ]}>
            Custom UI
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeExample === 'widget' ? (
          <ExampleWithWidget />
        ) : (
          <ExampleWithCustomUI />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Check the console for detailed logs
        </Text>
      </View>
    </SafeAreaView>
  );
}

/**
 * Root App with AuthProvider
 */
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
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  statusBar: {
    padding: 12,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  exampleContainer: {
    padding: 20,
  },
  exampleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  signOutButton: {
    marginTop: 16,
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#4285f4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});