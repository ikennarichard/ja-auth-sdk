import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { AuthConfig } from '../types';


export class FirebaseConfig {
  private static app: FirebaseApp | null = null;

  static initialize(config: AuthConfig): FirebaseApp {
    // Prevent multiple initializations
    if (this.app) {
      console.warn('Firebase already initialized. Returning existing instance.');
      return this.app;
    }

    const firebaseConfig: FirebaseOptions = {
      apiKey: config.firebase.apiKey,
      authDomain: config.firebase.authDomain,
      projectId: config.firebase.projectId,
      storageBucket: config.firebase.storageBucket,
      messagingSenderId: config.firebase.messagingSenderId,
      appId: config.firebase.appId
    };

    try {
      this.app = initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
      return this.app;
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      throw new Error('Firebase initialization failed. Please check your configuration.');
    }
  }

  /**
   * Get the Firebase app instance
   */
  static getApp(): FirebaseApp {
    if (!this.app) {
      throw new Error('Firebase not initialized. Call FirebaseConfig.initialize() first.');
    }
    return this.app;
  }

  /**
   * Check if Firebase is initialized
   */
  static isInitialized(): boolean {
    return this.app !== null;
  }
}