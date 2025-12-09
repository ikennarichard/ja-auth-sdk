import type { FirebaseApp } from "firebase/app";
import {
  Auth,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import {
  AuthState,
  type AuthResult,
  type AuthStateChangeCallback,
  type AuthUser,
  type EmailPasswordCredentials,
  type SignUpData,
} from "../types";
import { ErrorHandler } from "./ErrorHandler";

export class AuthManager {
  private auth: Auth;
  private currentAuthState: AuthState = AuthState.LOADING;
  private currentUser: AuthUser | null = null;
  private stateChangeCallbacks: Set<AuthStateChangeCallback> = new Set();
  private unsubscribeAuthListener: (() => void) | null = null;

  constructor(firebaseApp: FirebaseApp) {
    this.auth = getAuth(firebaseApp);
    this.initializeAuthListener();
  }

  /**
   * Initialize Firebase auth state listener
   */
  private initializeAuthListener(): void {
    this.unsubscribeAuthListener = onAuthStateChanged(
      this.auth,
      (firebaseUser) => {
        if (firebaseUser) {
          this.currentUser = this.mapFirebaseUser(firebaseUser);
          this.updateAuthState(AuthState.AUTHENTICATED);
        } else {
          this.currentUser = null;
          this.updateAuthState(AuthState.UNAUTHENTICATED);
        }
      },
      (error: any) => {
        console.error("Auth state change error:", error);
        // Check if token expired
        if (
          error.code === "auth/id-token-expired" ||
          error.code === "auth/user-token-expired"
        ) {
          this.updateAuthState(AuthState.TOKEN_EXPIRED);
        }
      }
    );
  }

  /**
   * Update auth state and notify listeners
   */
  private updateAuthState(newState: AuthState): void {
    this.currentAuthState = newState;
    this.notifyStateChange();
  }

  /**
   * Notify all registered callbacks of state change
   */
  private notifyStateChange(): void {
    this.stateChangeCallbacks.forEach((callback) => {
      callback(this.currentAuthState, this.currentUser);
    });
  }

  /**
   * Map Firebase User to our AuthUser type
   */
  private mapFirebaseUser(firebaseUser: User): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      provider: firebaseUser.providerData[0]?.providerId || "unknown",
    };
  }

  /**
   * Register a callback for auth state changes
   */
  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    this.stateChangeCallbacks.add(callback);
    // Immediately call with current state
    callback(this.currentAuthState, this.currentUser);

    // Return unsubscribe function
    return () => {
      this.stateChangeCallbacks.delete(callback);
    };
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    return this.currentAuthState;
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmailPassword(
    credentials: EmailPasswordCredentials
  ): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );

      const user = this.mapFirebaseUser(userCredential.user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      const authException = ErrorHandler.handleFirebaseError(error);
      return {
        success: false,
        error: ErrorHandler.toErrorObject(authException),
      };
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmailPassword(data: SignUpData): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      // Update profile with display name if provided
      if (data.displayName) {
        await updateProfile(userCredential.user, {
          displayName: data.displayName,
        });
      }

      const user = this.mapFirebaseUser(userCredential.user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      const authException = ErrorHandler.handleFirebaseError(error);
      return {
        success: false,
        error: ErrorHandler.toErrorObject(authException),
      };
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);

      const user = this.mapFirebaseUser(userCredential.user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      const authException = ErrorHandler.handleFirebaseError(error);
      return {
        success: false,
        error: ErrorHandler.toErrorObject(authException),
      };
    }
  }

  /**
   * Sign in with Apple
   */
  async signInWithApple(): Promise<AuthResult> {
    try {
      const provider = new OAuthProvider("apple.com");
      const userCredential = await signInWithPopup(this.auth, provider);

      const user = this.mapFirebaseUser(userCredential.user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      const authException = ErrorHandler.handleFirebaseError(error);
      return {
        success: false,
        error: ErrorHandler.toErrorObject(authException),
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error) {
      const authException = ErrorHandler.handleFirebaseError(error);
      throw authException;
    }
  }

  /**
   * Clean up and unsubscribe from listeners
   */
  destroy(): void {
    if (this.unsubscribeAuthListener) {
      this.unsubscribeAuthListener();
    }
    this.stateChangeCallbacks.clear();
  }
}
