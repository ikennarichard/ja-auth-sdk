import React, { useState } from "react";
import { AuthConfig } from "../../types";
import { useAuth } from "./AuthContext";

interface AuthWidgetProps {
  config: AuthConfig;
  onAuthSuccess?: (user: any) => void;
  onAuthError?: (error: any) => void;
}

/**
 * Pre-built authentication UI component
 * Plug-and-play login/signup form with all enabled providers
 */
export function AuthWidget({
  config,
  onAuthSuccess,
  onAuthError,
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div style={styles.container}>
        <h2 style={styles.title}>Welcome back!</h2>
        <div style={styles.userInfo}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.displayName && (
            <p>
              <strong>Name:</strong> {user.displayName}
            </p>
          )}
          <p>
            <strong>Provider:</strong> {user.provider}
          </p>
        </div>
        <button style={styles.signOutBtn} onClick={signOut}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {mode === "login" ? "Sign In" : "Create Account"}
      </h2>

      {error && <div style={styles.error}>{error}</div>}

      {config.providers.emailPassword && (
        <form onSubmit={handleEmailAuth} style={styles.form}>
          {mode === "signup" && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={styles.input}
                placeholder="John Doe"
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="your@email.com"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={styles.primaryBtn} disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>
      )}

      {(config.providers.google || config.providers.apple) &&
        config.providers.emailPassword && <div style={styles.divider}>OR</div>}

      {config.providers.google && (
        <button
          onClick={handleGoogleAuth}
          style={styles.googleBtn}
          disabled={loading}
        >
          Sign in with Google
        </button>
      )}

      {config.providers.apple && (
        <button
          onClick={handleAppleAuth}
          style={styles.appleBtn}
          disabled={loading}
        >
          Sign in with Apple
        </button>
      )}

      {config.providers.emailPassword && (
        <div style={styles.toggleText}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span style={styles.link} onClick={() => setMode("signup")}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={styles.link} onClick={() => setMode("login")}>
                Sign in
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Inline styles for the widget
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "32px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center",
    color: "#333",
  },
  error: {
    background: "#fee",
    color: "#c33",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  primaryBtn: {
    padding: "12px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  googleBtn: {
    padding: "12px",
    background: "#4285f4",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
  },
  appleBtn: {
    padding: "12px",
    background: "#000",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
  },
  signOutBtn: {
    padding: "12px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
  divider: {
    textAlign: "center",
    margin: "16px 0",
    color: "#999",
    fontSize: "14px",
  },
  toggleText: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "600",
  },
  userInfo: {
    background: "#f8f9fa",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
};
