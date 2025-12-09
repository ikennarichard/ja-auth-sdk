import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ErrorMapper } from "../errors/errorMapper";
import { AuthUser } from "../types";

export class GoogleProvider {
  private webClientId: string;
  private isInitialized: boolean = false;

  constructor(config: { webClientId: string }) {
    this.webClientId = config.webClientId;
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      GoogleSignin.configure({
        webClientId: this.webClientId, // USE WEB CLIENT ID!
        offlineAccess: false,
        forceCodeForRefreshToken: true,
        scopes: ["profile", "email"],
      });
      this.isInitialized = true;
      console.log("✅ Google Sign-In configured successfully");
    } catch (error) {
      console.error("❌ Google Sign-In configuration error:", error);
      throw error;
    }
  }

  async signIn(): Promise<AuthUser> {
    try {
      // Initialize before each sign-in attempt
      await this.initialize();

      // Check Play Services (Android only)
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      console.log("🔐 Starting Google Sign-In...");

      // Sign in to get user info
      const userInfo = await GoogleSignin.signIn();
      console.log("✅ Google Sign-In successful");

      // Get the ID token
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        console.error("❌ No ID token returned");
        throw new Error("No ID token returned from Google Sign-In");
      }

      console.log("🔑 Creating Firebase credential...");

      // Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase
      console.log("🔥 Signing in to Firebase...");
      const result = await auth().signInWithCredential(googleCredential);

      console.log("✅ Firebase sign-in successful");

      return this.mapToAuthUser(result.user);
    } catch (error: any) {
      console.error("❌ Google Sign-In error:", error);

      if (error.code === "12501") {
        // User cancelled
        throw new Error("Sign-in cancelled by user");
      }

      if (error.code === "SIGN_IN_CANCELLED") {
        throw new Error("Sign-in cancelled");
      }

      if (error.code === "DEVELOPER_ERROR") {
        throw new Error(
          "DEVELOPER_ERROR: Check SHA-1 fingerprint, package name, and webClientId configuration"
        );
      }

      throw ErrorMapper.mapFirebaseError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Google sign-out error:", error);
    }
  }

  private mapToAuthUser(user: any): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerId: "google.com",
      createdAt: user.metadata.creationTime || new Date().toISOString(),
    };
  }
}
