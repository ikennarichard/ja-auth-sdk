// src/index.ts

// Core exports
export { FirebaseConfig } from "./config/firebase";
export { AuthManager } from "./core/AuthManager";
export { ErrorHandler } from "./core/ErrorHandler";

// Type exports
export {
  AuthConfig,
  AuthError,
  AuthErrorType,
  AuthProvider,
  AuthResult,
  AuthState,
  AuthStateChangeCallback,
  AuthUser,
  EmailPasswordCredentials,
  SignUpData,
} from "./types";

// Error class exports
export {
  AuthException,
  EmailAlreadyInUseException,
  InvalidCredentialsException,
  NetworkException,
  PopupClosedException,
  ProviderException,
  TokenExpiredException,
  UnknownAuthException,
  UserNotFoundException,
  WeakPasswordException,
} from "./types/errors";

// UI components (will be added in next commits)
// export { AuthWidget } from './components/AuthWidget';

// Hooks (will be added in next commits)
// export { useAuth } from './hooks/useAuth';
