export enum AuthState {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  TOKEN_EXPIRED = 'token_expired',
  LOADING = 'loading'
}

export enum AuthProvider {
  EMAIL_PASSWORD = 'emailPassword',
  GOOGLE = 'google',
  APPLE = 'apple'
}


export interface AuthConfig {
  // Firebase configuration
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  
  // Enable/disable specific providers
  providers: {
    [AuthProvider.EMAIL_PASSWORD]?: boolean;
    [AuthProvider.GOOGLE]?: boolean;
    [AuthProvider.APPLE]?: boolean;
  };
  
  // Optional UI configuration
  ui?: {
    theme?: 'light' | 'dark';
    brandName?: string;
    logo?: string;
  };
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  provider: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: AuthError;
}

export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  EMAIL_ALREADY_IN_USE = 'email_already_in_use',
  WEAK_PASSWORD = 'weak_password',
  TOKEN_EXPIRED = 'token_expired',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error',
  POPUP_CLOSED = 'popup_closed',
  PROVIDER_ERROR = 'provider_error'
}

/**
 * Structured error object
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  originalError?: any;
}

/**
 * Callback type for auth state changes
 */
export type AuthStateChangeCallback = (state: AuthState, user: AuthUser | null) => void;

/**
 * Sign in credentials for email/password
 */
export interface EmailPasswordCredentials {
  email: string;
  password: string;
}

/**
 * Sign up data for email/password
 */
export interface SignUpData extends EmailPasswordCredentials {
  displayName?: string;
}