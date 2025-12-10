# ja-auth-sdk Example App

This example demonstrates all features of the **ja-auth-sdk** Firebase Authentication SDK.

## Features Demonstrated

✅ **Email/Password Authentication**
- Sign up with email and password
- Sign in with existing credentials
- Password reset functionality

✅ **Google Sign-In**
- OAuth 2.0 integration
- Automatic token handling

✅ **Apple Sign-In**
- iOS native authentication
- Secure identity token generation

✅ **State Management**
- Automatic state tracking (Authenticated, Unauthenticated, TokenExpired, Loading)
- User data persistence
- Real-time state updates

✅ **Error Handling**
- Maps Firebase errors to 8 custom exception types
- User-friendly error messages

✅ **UI Flexibility**
- Pre-built AuthScreen component
- Headless mode with useAuth() hook for custom UI

## Quick Start

### Prerequisites

- Node.js 16+
- Xcode 14+ (for iOS)
- macOS with M1/M2/Intel chip
- Firebase project with Auth enabled
- Google OAuth credentials (optional)
- Apple Developer account (optional)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Install iOS pods
cd ios
pod install
cd ..
```

### Configuration

1. **Get Firebase Credentials**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing
   - Enable Authentication → Email/Password, Google, Apple
   - Download `GoogleService-Info.plist`

2. **Add GoogleService-Info.plist**
   ```bash
   # Drag GoogleService-Info.plist into Xcode
   # ios/ExampleAuthApp/GoogleService-Info.plist
   ```

3. **Update `App.tsx` Configuration**
   ```tsx
   const authConfig = {
     firebase: {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'your-project.firebaseapp.com',
       projectId: 'your-project-id',
       appId: 'YOUR_APP_ID',
     },
     providers: {
       emailPassword: { enabled: true },
       google: { enabled: true, webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com' },
       apple: { enabled: true },
     },
   };
   ```

4. **Configure Google Sign-In (Optional)**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials for iOS
   - Add Bundle ID and Team ID
   - Update `Info.plist` with Client ID

5. **Enable Apple Sign-In (Optional)**
   - In Xcode: Select target → Signing & Capabilities
   - Click + Capability → Add "Sign in with Apple"

### Run on iOS

```bash
# iOS Simulator
npm run ios

# Or manually
npx react-native run-ios

# Or in Xcode
open ios/ExampleAuthApp.xcworkspace
# Then select Product → Run (Cmd+R)
```

## App Screens

### Login Screen (Unauthenticated)
- Pre-built AuthScreen component from the SDK
- Shows configured authentication methods
- Email/Password form
- Google Sign-In button
- Apple Sign-In button
- Error messages and validation

### Home Screen (Authenticated)
- Displays logged-in user information
- UID, Email, Display Name
- Provider type
- Email verification status
- Sign out button

## Testing

### Test Email/Password
1. Click "Sign up" 
2. Enter email and password (password must be 6+ characters)
3. Create account
4. On next screen, sign in with those credentials

### Test Google Sign-In
1. Click "Sign in with Google"
2. Select Google account
3. Grant permissions
4. Automatically signed in

### Test Apple Sign-In (iOS only)
1. Click "Sign in with Apple"
2. Use your Apple ID
3. Grant permissions
4. Automatically signed in

### Test Error Handling
1. Try signing in with non-existent email
2. Try wrong password
3. Try weak password on signup
4. Network will be tested automatically

## Architecture

```
App.tsx
├── AuthProvider (from ja-auth-sdk)
│   ├── Email/Password Provider
│   ├── Google Provider
│   ├── Apple Provider
│   └── Token Manager
├── AppContent
│   ├── Loading State
│   ├── Unauthenticated Screen
│   │   └── AuthScreen (pre-built UI)
│   └── Authenticated Screen
│       └── useAuth() hook (user data)
```

## Key Components

### AuthProvider
Wraps the entire app and manages authentication state.

```tsx
<AuthProvider config={authConfig}>
  <AppContent />
</AuthProvider>
```

### AuthScreen
Pre-built UI component with sign in, sign up, and password reset.

```tsx
<AuthScreen onAuthSuccess={(user) => { ... }} />
```

### useAuth Hook
Headless mode for building custom UI.

```tsx
const { authState, user, signIn, signOut, error } = useAuth();
```

## Troubleshooting

### "GoogleService-Info.plist not found"
- Drag file into Xcode project
- Ensure it's added to the app target

### "Apple Sign-In not working"
- Enable capability in Xcode: Target → Signing & Capabilities
- Check iOS deployment target ≥ 13.0

### "Google Sign-In fails"
- Verify Client ID in Info.plist
- Check Firebase Console has OAuth credentials
- Ensure Bundle ID matches Google Cloud Console

### "Pod install fails"
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure Firebase
3. ✅ Run `npm run ios`
4. ✅ Test all authentication methods
5. ✅ Customize UI if desired using useAuth() hook

## API Reference

For complete SDK API documentation, see [../README.md](../README.md)

## Support

Refer to SDK documentation:
- **API Reference**: [../README.md](../README.md)
- **iOS Setup**: [../iOS_CONFIGURATION.md](../iOS_CONFIGURATION.md)
- **Error Handling**: [../README.md](../README.md#error-handling)

---

**Version**: 1.0.0  
**SDK Version**: 2.0.5  
**Last Updated**: December 9, 2025
