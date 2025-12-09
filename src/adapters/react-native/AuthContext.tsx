import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FirebaseAuthSDK } from "../../sdk";
import { AuthConfig, AuthState, AuthUser } from "../../types";

interface AuthContextValue {
  // State
  authState: AuthState;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Methods
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
  signOut: () => Promise<void>;

  // SDK instance (for advanced usage)
  sdk: FirebaseAuthSDK | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  config: AuthConfig;
  children: ReactNode;
}


export function AuthProvider({ config, children }: AuthProviderProps) {
  const [sdk] = useState(() => new FirebaseAuthSDK(config));
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOADING);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = sdk.onAuthStateChange((state, currentUser) => {
      setAuthState(state);
      setUser(currentUser);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      sdk.destroy();
    };
  }, [sdk]);

  const value: AuthContextValue = {
    authState,
    user,
    isAuthenticated: authState === AuthState.AUTHENTICATED,
    isLoading: authState === AuthState.LOADING,
    signIn: (email, password) => sdk.signIn(email, password),
    signUp: (email, password, displayName) =>
      sdk.signUp(email, password, displayName),
    signInWithGoogle: () => sdk.signInWithGoogle(),
    signInWithApple: () => sdk.signInWithApple(),
    signOut: () => sdk.signOut(),
    sdk,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
