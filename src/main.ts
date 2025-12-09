// src/index.ts

// Core exports
export { AuthManager } from './modules/AuthManager';
export { ErrorHandler } from './modules/ErrorHandler';
export { FirebaseConfig } from './config/firebase';

// Type exports
export type {
  AuthState,
  AuthProvider,
  AuthConfig,
  AuthUser,
  AuthResult,
  AuthError,
  AuthErrorType,
  AuthStateChangeCallback,
  EmailPasswordCredentials,
  SignUpData
} from './types';

// Error class exports
export {
  AuthException,
  InvalidCredentialsException,
  UserNotFoundException,
  EmailAlreadyInUseException,
  WeakPasswordException,
  TokenExpiredException,
  NetworkException,
  PopupClosedException,
  ProviderException,
  UnknownAuthException
} from './types/errors';

// UI components (will be added in next commits)
// export { AuthWidget } from './components/AuthWidget';

// Hooks (will be added in next commits)
// export { useAuth } from './hooks/useAuth';