import { AuthErrorType } from './index';


export class AuthException extends Error {
  public readonly type: AuthErrorType;
  public readonly originalError?: any;

  constructor(type: AuthErrorType, message: string, originalError?: any) {
    super(message);
    this.name = 'AuthException';
    this.type = type;
    this.originalError = originalError;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when login credentials are invalid
 */
export class InvalidCredentialsException extends AuthException {
  constructor(message = 'Invalid email or password', originalError?: any) {
    super(AuthErrorType.INVALID_CREDENTIALS, message, originalError);
    this.name = 'InvalidCredentialsException';
  }
}

/**
 * Thrown when user account does not exist
 */
export class UserNotFoundException extends AuthException {
  constructor(message = 'User account does not exist', originalError?: any) {
    super(AuthErrorType.USER_NOT_FOUND, message, originalError);
    this.name = 'UserNotFoundException';
  }
}

/**
 * Thrown when email is already registered
 */
export class EmailAlreadyInUseException extends AuthException {
  constructor(message = 'This email address is already in use', originalError?: any) {
    super(AuthErrorType.EMAIL_ALREADY_IN_USE, message, originalError);
    this.name = 'EmailAlreadyInUseException';
  }
}

/**
 * Thrown when password doesn't meet requirements
 */
export class WeakPasswordException extends AuthException {
  constructor(message = 'Password is too weak. Use at least 6 characters', originalError?: any) {
    super(AuthErrorType.WEAK_PASSWORD, message, originalError);
    this.name = 'WeakPasswordException';
  }
}

/**
 * Thrown when authentication token has expired
 */
export class TokenExpiredException extends AuthException {
  constructor(message = 'Your session has expired. Please sign in again', originalError?: any) {
    super(AuthErrorType.TOKEN_EXPIRED, message, originalError);
    this.name = 'TokenExpiredException';
  }
}

/**
 * Thrown when network connection fails
 */
export class NetworkException extends AuthException {
  constructor(message = 'Network error. Please check your internet connection', originalError?: any) {
    super(AuthErrorType.NETWORK_ERROR, message, originalError);
    this.name = 'NetworkException';
  }
}

/**
 * Thrown when OAuth popup is closed by user
 */
export class PopupClosedException extends AuthException {
  constructor(message = 'Sign-in popup was closed before completion', originalError?: any) {
    super(AuthErrorType.POPUP_CLOSED, message, originalError);
    this.name = 'PopupClosedException';
  }
}

/**
 * Thrown when OAuth provider encounters an error
 */
export class ProviderException extends AuthException {
  constructor(message = 'Authentication provider error', originalError?: any) {
    super(AuthErrorType.PROVIDER_ERROR, message, originalError);
    this.name = 'ProviderException';
  }
}

/**
 * Generic unknown error
 */
export class UnknownAuthException extends AuthException {
  constructor(message = 'An unexpected error occurred', originalError?: any) {
    super(AuthErrorType.UNKNOWN_ERROR, message, originalError);
    this.name = 'UnknownAuthException';
  }
}