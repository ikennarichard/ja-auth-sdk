import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ErrorMapper } from "../errors/errorMapper";
import { AuthUser } from "../types";

export class GoogleProvider {
  private webClientId: string;

  constructor(config: { webClientId: string }) {
    this.webClientId = config.webClientId;
    this.initialize();
  }

  private initialize() {
    GoogleSignin.configure({
      webClientId: this.webClientId,
    });
  }

  async signIn(): Promise<AuthUser> {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const response = await GoogleSignin.signIn();

      const idToken = (response as any).data?.idToken || (response as any).idToken;

      const googleCredential = auth.GoogleAuthProvider.credential(`${idToken}`);

      const result = await auth().signInWithCredential(googleCredential);

      return this.mapToAuthUser(result.user);
    } catch (error: any) {
      if (error.code === "SIGN_IN_CANCELLED") {
        throw new Error("Sign-in cancelled");
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

  private mapToAuthUser(user: FirebaseAuthTypes.User): AuthUser {
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
