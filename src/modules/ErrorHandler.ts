import {
  InvalidCredentialsException,
  UserNotFoundException,
  EmailAlreadyInUseException,
  WeakPasswordException,
  TokenExpiredException,
  NetworkException,
  PopupClosedException,
  ProviderException,
  UnknownAuthException,
  AuthException
} from '../types/errors';

/**
 * Maps Firebase error codes to our custom exception classes
 */
export class ErrorHandler {
  /**
   * Convert Firebase error to custom AuthException
   */
  static handleFirebaseError(error: any): AuthException {
    // If it's already our custom error, return it
    if (error instanceof AuthException) {
      return error;
    }

    const errorCode = error?.code || '';
    const errorMessage = error?.message || 'An unexpected error occurred';

    // Map Firebase error codes to custom exceptions
    switch (errorCode) {
      // Invalid credentials
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
        return new InvalidCredentialsException(undefined, error);

      // User not found
      case 'auth/user-not-found':
        return new UserNotFoundException(undefined, error);

      // Email already in use
      case 'auth/email-already-in-use':
        return new EmailAlreadyInUseException(undefined, error);

      // Weak password
      case 'auth/weak-password':
        return new WeakPasswordException(undefined, error);

      // Token/Session expired
      case 'auth/id-token-expired':
      case 'auth/user-token-expired':
        return new TokenExpiredException(undefined, error);

      // Network errors
      case 'auth/network-request-failed':
      case 'auth/timeout':
        return new NetworkException(undefined, error);

      // Popup/OAuth errors
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return new PopupClosedException(undefined, error);

      case 'auth/popup-blocked':
        return new PopupClosedException('Popup was blocked by the browser. Please allow popups for this site', error);

      // Provider errors
      case 'auth/account-exists-with-different-credential':
        return new ProviderException('An account already exists with the same email but different sign-in method', error);

      case 'auth/auth-domain-config-required':
      case 'auth/operation-not-allowed':
        return new ProviderException('This sign-in method is not enabled. Please contact support', error);

      // Too many requests
      case 'auth/too-many-requests':
        return new NetworkException('Too many failed attempts. Please try again later', error);

      // User disabled
      case 'auth/user-disabled':
        return new UnknownAuthException('This account has been disabled. Please contact support', error);

      // Unknown error
      default:
        console.error('Unhandled Firebase error:', errorCode, errorMessage);
        return new UnknownAuthException(errorMessage, error);
    }
  }

  /**
   * Convert AuthException to a simple error object for API responses
   */
  static toErrorObject(exception: AuthException) {
    return {
      type: exception.type,
      message: exception.message,
      originalError: exception.originalError
    };
  }

  /**
   * Check if error is a specific type
   */
  static isErrorType(error: any, type: typeof AuthException): boolean {
    return error instanceof type;
  }
}