import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthConfig } from "../../types";
import { useAuth } from "./AuthContext";

interface AuthWidgetProps {
  config: AuthConfig;
  onAuthSuccess?: (user: any) => void;
  onAuthError?: (error: any) => void;
  style?: any;
}


export function AuthWidget({
  config,
  onAuthSuccess,
  onAuthError,
  style,
}: AuthWidgetProps) {
  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    user,
    isAuthenticated,
    signOut,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const result =
        mode === "login"
          ? await signIn(email, password)
          : await signUp(email, password, displayName);

      if (result.success) {
        onAuthSuccess?.(result.user);
        setEmail("");
        setPassword("");
        setDisplayName("");
      } else {
        setError(result.error?.message || "Authentication failed");
        onAuthError?.(result.error);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      onAuthError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        onAuthSuccess?.(result.user);
      } else {
        setError(result.error?.message || "Google sign-in failed");
        onAuthError?.(result.error);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      onAuthError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithApple();
      if (result.success) {
        onAuthSuccess?.(result.user);
      } else {
        setError(result.error?.message || "Apple sign-in failed");
        onAuthError?.(result.error);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      onAuthError?.(err);
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, show user dashboard
  if (isAuthenticated && user) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>Welcome back!</Text>

        <View style={styles.userCard}>
          {user.photoURL && (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          )}
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.displayName && (
            <Text style={styles.userName}>{user.displayName}</Text>
          )}
          <Text style={styles.userProvider}>
            Signed in with {user.provider}
          </Text>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, style]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {config.ui?.logo && (
          <Image
            source={{ uri: config.ui.logo }}
            style={styles.logo}
            resizeMode="contain"
          />
        )}

        <Text style={styles.title}>{config.ui?.brandName || "Welcome"}</Text>

        <Text style={styles.subtitle}>
          {mode === "login" ? "Sign in to continue" : "Create your account"}
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {config.providers.emailPassword && (
          <View style={styles.formContainer}>
            {mode === "signup" && (
              <TextInput
                style={styles.input}
                placeholder="Display Name"
                placeholderTextColor="#999"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
            />

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleEmailAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {(config.providers.google || config.providers.apple) &&
          config.providers.emailPassword && (
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
          )}

        {config.providers.google && (
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleAuth}
            disabled={loading}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        )}

        {config.providers.apple && (
          <TouchableOpacity
            style={[styles.appleButton, loading && styles.buttonDisabled]}
            onPress={handleAppleAuth}
            disabled={loading}
          >
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}

        {config.providers.emailPassword && (
          <TouchableOpacity
            onPress={() => setMode(mode === "login" ? "signup" : "login")}
            style={styles.toggleContainer}
          >
            <Text style={styles.toggleText}>
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <Text style={styles.toggleLink}>Sign up</Text>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Text style={styles.toggleLink}>Sign in</Text>
                </>
              )}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  errorContainer: {
    width: "100%",
    backgroundColor: "#fee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#c33",
    fontSize: 14,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  primaryButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#667eea",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4285f4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  appleButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#dc3545",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
  },
  toggleContainer: {
    marginTop: 24,
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  toggleLink: {
    color: "#667eea",
    fontWeight: "600",
  },
  userCard: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userProvider: {
    fontSize: 14,
    color: "#666",
  },
});
