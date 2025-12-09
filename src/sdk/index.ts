import { FirebaseConfig } from "../config/firebase";
import { AuthManager } from "../modules/AuthManager";
import {
  AuthConfig,
  AuthResult,
  AuthState,
  AuthStateChangeCallback,
  AuthUser,
  SignUpData,
} from "../types";

export class FirebaseAuthSDK {
  private authManager: AuthManager;
  private config: AuthConfig;

  /**
   * Initialize the SDK
   * @param config - Authentication configuration
   */
  constructor(config: AuthConfig) {
    this.config = config;
    const firebaseApp = FirebaseConfig.initialize(config);
    this.authManager = new AuthManager(firebaseApp);
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    return this.authManager.getAuthState();
  }

  /**
   * Get currently authenticated user
   */
  getCurrentUser(): AuthUser | null {
    return this.authManager.getCurrentUser();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authManager.getAuthState() === AuthState.AUTHENTICATED;
  }

  /**
   * Subscribe to authentication state changes
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    return this.authManager.onAuthStateChange(callback);
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    if (!this.config.providers.emailPassword) {
      return {
        success: false,
        error: {
          type: "provider_error" as any,
          message:
            "Email/Password authentication is not enabled in configuration",
        },
      };
    }

    return this.authManager.signInWithEmailPassword({ email, password });
  }

  /**
   * Sign up with email and password
   */
  async signUp(
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResult> {
    if (!this.config.providers.emailPassword) {
      return {
        success: false,
        error: {
          type: "provider_error" as any,
          message:
            "Email/Password authentication is not enabled in configuration",
        },
      };
    }

    const signUpData: SignUpData = { email, password };
    if (displayName) {
      signUpData.displayName = displayName;
    }

    return this.authManager.signUpWithEmailPassword(signUpData);
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<AuthResult> {
    if (!this.config.providers.google) {
      return {
        success: false,
        error: {
          type: "provider_error" as any,
          message: "Google authentication is not enabled in configuration",
        },
      };
    }

    return this.authManager.signInWithGoogle();
  }

  /**
   * Sign in with Apple
   */
  async signInWithApple(): Promise<AuthResult> {
    if (!this.config.providers.apple) {
      return {
        success: false,
        error: {
          type: "provider_error" as any,
          message: "Apple authentication is not enabled in configuration",
        },
      };
    }

    return this.authManager.signInWithApple();
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    return this.authManager.signOut();
  }

  /**
   * Get enabled authentication providers
   */
  getEnabledProviders(): string[] {
    const enabled: string[] = [];

    if (this.config.providers.emailPassword) enabled.push("emailPassword");
    if (this.config.providers.google) enabled.push("google");
    if (this.config.providers.apple) enabled.push("apple");

    return enabled;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.authManager.destroy();
  }
}
