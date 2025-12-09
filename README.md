# 🔐 Firebase Auth SDK

A **framework-agnostic** Firebase Authentication SDK with optional pre-built UI and React adapter.

## ✨ Features

- 🌍 **Framework Agnostic** - Works with React, Vue, Angular, Vanilla JS, Node.js, React Native
- 🎨 **Pre-built UI** - Optional plug-and-play authentication widget (React)
- 🎯 **Headless Mode** - Build your own UI, use our logic
- 🔄 **Automatic State Management** - Track authentication state effortlessly
- 🛡️ **Type-Safe** - Full TypeScript support
- 🚨 **Better Error Handling** - Friendly error messages instead of Firebase codes
- 🔌 **Multiple Providers** - Email/Password, Google, Apple (easily expandable)

---

## 📦 Installation

```bash
npm install firebase-auth-sdk
# or
yarn add firebase-auth-sdk
```

---

## 🚀 Quick Start

### Option 1: Vanilla JavaScript (Works Everywhere!)

```javascript
import { FirebaseAuthSDK } from 'firebase-auth-sdk';

// Initialize
const authSDK = new FirebaseAuthSDK({
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  },
  providers: {
    emailPassword: true,
    google: true,
    apple: false
  }
});

// Listen to auth state changes
authSDK.onAuthStateChange((state, user) => {
  console.log('Auth State:', state); // 'authenticated', 'unauthenticated', 'token_expired'
  console.log('User:', user);
});

// Sign in
const result = await authSDK.signIn('user@example.com', 'password123');
if (result.success) {
  console.log('Signed in!', result.user);
} else {
  console.error('Error:', result.error.message);
}

// Sign in with Google
await authSDK.signInWithGoogle();

// Sign out
await authSDK.signOut();
```

### Option 2: React with Pre-built UI Widget

```jsx
import { AuthProvider, AuthWidget } from 'firebase-auth-sdk/react';

function App() {
  return (
    <AuthProvider config={config}>
      <AuthWidget 
        config={config}
        onAuthSuccess={(user) => console.log('Welcome!', user)}
        onAuthError={(error) => console.error(error)}
      />
    </AuthProvider>
  );
}
```

### Option 3: React with Custom UI (Headless)

```jsx
import { AuthProvider, useAuth } from 'firebase-auth-sdk/react';

function App() {
  return (
    <AuthProvider config={config}>
      <MyCustomLoginForm />
    </AuthProvider>
  );
}

function MyCustomLoginForm() {
  const { signIn, signOut, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (!result.success) {
      alert(result.error.message);
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome, {user.email}!</h1>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

---

## 📚 API Reference

### Core SDK (Vanilla JS)

#### `FirebaseAuthSDK`

**Constructor**
```typescript
const authSDK = new FirebaseAuthSDK(config: AuthConfig);
```

**Methods**

| Method | Description | Returns |
|--------|-------------|---------|
| `signIn(email, password)` | Sign in with email/password | `Promise<AuthResult>` |
| `signUp(email, password, displayName?)` | Create new account | `Promise<AuthResult>` |
| `signInWithGoogle()` | Sign in with Google | `Promise<AuthResult>` |
| `signInWithApple()` | Sign in with Apple | `Promise<AuthResult>` |
| `signOut()` | Sign out current user | `Promise<void>` |
| `getCurrentUser()` | Get current user | `AuthUser \| null` |
| `getAuthState()` | Get current auth state | `AuthState` |
| `isAuthenticated()` | Check if user is logged in | `boolean` |
| `onAuthStateChange(callback)` | Subscribe to state changes | `() => void` (unsubscribe) |
| `getEnabledProviders()` | Get list of enabled providers | `string[]` |

### React Adapter

#### `useAuth()` Hook

```typescript
const {
  authState,        // Current auth state
  user,            // Current user object
  isAuthenticated, // Boolean helper
  isLoading,       // Loading state
  signIn,          // Sign in function
  signUp,          // Sign up function
  signInWithGoogle,
  signInWithApple,
  signOut,
  sdk              // Access to core SDK
} = useAuth();
```

#### `<AuthProvider>`

```jsx
<AuthProvider config={authConfig}>
  {children}
</AuthProvider>
```

#### `<AuthWidget>`

```jsx
<AuthWidget 
  config={authConfig}
  onAuthSuccess={(user) => console.log(user)}
  onAuthError={(error) => console.error(error)}
/>
```

---

## 🎯 Authentication States

The SDK tracks three main states:

| State | Description |
|-------|-------------|
| `authenticated` | User is logged in |
| `unauthenticated` | No user logged in |
| `token_expired` | Session expired, re-authentication needed |
| `loading` | Initial state while checking auth |

---

## 🚨 Error Handling

Instead of Firebase's cryptic error codes, we provide clear, typed exceptions:

### Error Types

| Error | When It Happens |
|-------|-----------------|
| `InvalidCredentialsException` | Wrong email/password |
| `UserNotFoundException` | Account doesn't exist |
| `EmailAlreadyInUseException` | Email already registered |
| `WeakPasswordException` | Password too weak (< 6 chars) |
| `TokenExpiredException` | Session expired |
| `NetworkException` | Connection issues |
| `PopupClosedException` | OAuth popup closed by user |
| `ProviderException` | OAuth provider error |
| `UnknownAuthException` | Unexpected error |

### Handling Errors

```javascript
const result = await authSDK.signIn(email, password);

if (!result.success) {
  switch (result.error.type) {
    case 'invalid_credentials':
      alert('Wrong email or password');
      break;
    case 'user_not_found':
      alert('Account not found. Sign up?');
      break;
    case 'network_error':
      alert('Check your internet connection');
      break;
    default:
      alert(result.error.message);
  }
}
```

---

## ⚙️ Configuration

```typescript
interface AuthConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  
  providers: {
    emailPassword?: boolean;  // Enable/disable email auth
    google?: boolean;         // Enable/disable Google
    apple?: boolean;          // Enable/disable Apple
  };
  
  ui?: {
    theme?: 'light' | 'dark';
    brandName?: string;
    logo?: string;
  };
}
```

---

## 🌐 Framework Support

| Framework | Support | Import |
|-----------|---------|--------|
| Vanilla JS | ✅ Full | `firebase-auth-sdk` |
| React | ✅ Full | `firebase-auth-sdk/react` |
| Vue | 🔄 Core SDK works, adapter coming soon | `firebase-auth-sdk` |
| Angular | 🔄 Core SDK works, adapter coming soon | `firebase-auth-sdk` |
| React Native | ✅ Core SDK works | `firebase-auth-sdk` |
| Node.js | ✅ Core SDK works | `firebase-auth-sdk` |

---

## 📁 Project Structure

```
firebase-auth-sdk/
├── src/
│   ├── index.ts              # Main export (framework-agnostic)
│   ├── sdk/
│   │   └── FirebaseAuthSDK.ts   # Vanilla SDK wrapper
│   ├── core/                 # Core logic (pure TypeScript)
│   │   ├── AuthManager.ts
│   │   └── ErrorHandler.ts
│   ├── types/               # Type definitions
│   │   ├── index.ts
│   │   └── errors.ts
│   ├── config/
│   │   └── firebase.ts
│   └── adapters/            # Framework-specific wrappers
│       └── react/
│           ├── AuthContext.tsx
│           ├── AuthWidget.tsx
│           └── index.ts
└── example/
    ├── vanilla/
    │   └── index.html
    └── react/
        └── App.tsx
```

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev

# Run tests
npm test
```

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

## 🎓 Examples

Check the `/example` folder for complete working examples:
- **Vanilla JS**: Pure JavaScript implementation
- **React**: Both pre-built UI and custom UI examples

---

## ❓ FAQ

**Q: Can I use this without React?**  
A: Yes! The core SDK is framework-agnostic. React adapter is optional.

**Q: How do I add more OAuth providers?**  
A: Extend the `AuthManager` class and add the provider to the config.

**Q: Does this work with Firebase v9+?**  
A: Yes, built with Firebase v10 modular SDK.

**Q: Can I customize the UI widget?**  
A: Yes, either override styles or build your own UI using the headless mode.

**Q: Is this production-ready?**  
A: Yes, but always test thoroughly in your specific environment.

---

**Made with ❤️ for developers who value clean APIs**
