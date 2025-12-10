# iOS Setup Instructions for ja-auth-sdk

This folder contains templates and examples for setting up your React Native iOS app with the `ja-auth-sdk`.

## Files in this Folder

1. **Info.plist.template** - Configuration template for your app's Info.plist
2. **AppDelegate.m.example** - Example AppDelegate configuration
3. **Podfile.example** - Example Podfile with all required dependencies

---

## Quick Start (10 minutes)

### Step 1: Create/Navigate to Your iOS Project

```bash
# If you don't have a React Native project yet:
npx create-expo-app MyAuthApp
cd MyAuthApp
```

### Step 2: Install the SDK

```bash
npm install ja-auth-sdk --legacy-peer-deps
```

### Step 3: Install Native Dependencies

```bash
npm install @react-native-firebase/app \
            @react-native-firebase/auth \
            @react-native-google-signin/google-signin \
            @invertase/react-native-apple-authentication \
            --legacy-peer-deps

# Then update Pods
cd ios
pod install
cd ..
```

### Step 4: Copy Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Download `GoogleService-Info.plist` for your iOS app
3. Move it to your iOS project root
4. In Xcode: Right-click project → "Add Files to Project"
5. Select the `GoogleService-Info.plist` file

### Step 5: Configure Info.plist

Copy the content from `Info.plist.template` and update:

```xml
<!-- Replace YOUR_GOOGLE_CLIENT_ID with your actual Client ID -->
<string>com.googleusercontent.apps.YOUR_GOOGLE_CLIENT_ID</string>
```

### Step 6: Enable Apple Sign-In Capability

1. Open Xcode: `open ios/YourApp.xcworkspace`
2. Select your app target
3. Go to **Signing & Capabilities**
4. Click **+ Capability**
5. Search for and add **Sign in with Apple**

### Step 7: Create a Basic Auth Screen

Create `AuthApp.tsx`:

```tsx
import React from 'react';
import { AuthProvider, AuthScreen } from 'ja-auth-sdk';

const authConfig = {
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  providers: {
    emailPassword: { enabled: true },
    google: {
      enabled: true,
      webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
    },
    apple: { enabled: true }
  }
};

export default function App() {
  return (
    <AuthProvider config={authConfig}>
      <AuthScreen 
        onAuthSuccess={(user) => {
          console.log('User signed in:', user);
        }}
      />
    </AuthProvider>
  );
}
```

### Step 8: Run on iOS

```bash
npm run ios
# Or manually in Xcode: Product → Run (Cmd+R)
```

---

## Detailed Setup Guides

For complete setup instructions, see the main documentation:

- **[iOS_CONFIGURATION.md](../iOS_CONFIGURATION.md)** - Complete iOS configuration guide
- **[README.md](../README.md)** - SDK API reference and examples

---

## Configuration Details

### AppDelegate Setup

The example `AppDelegate.m.example` shows how to:

1. Initialize Firebase
2. Handle Google Sign-In callbacks
3. Handle Apple Sign-In (automatic)
4. Set up deep linking

Copy the relevant sections to your actual `AppDelegate.m` file.

### Podfile Setup

The example `Podfile.example` includes:

- Firebase Core & Auth
- Google Sign-In SDK
- React Native Firebase modules
- Apple Authentication (built-in)
- Post-install scripts for compatibility

Merge the relevant pods into your actual `Podfile`, then run `pod install`.

---

## Environment Configuration

### Firebase Setup

1. Create/select a Firebase project: https://console.firebase.google.com/
2. Add an iOS app to your project
3. Download `GoogleService-Info.plist`
4. Enable these auth methods:
   - Email/Password
   - Google
   - Apple

### Google Sign-In

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create OAuth 2.0 credentials (iOS)
3. Add your Bundle ID and Team ID
4. Copy the Client ID to `Info.plist` and your app config

### Apple Sign-In

1. Go to Apple Developer: https://developer.apple.com/
2. Configure your App ID to support Sign in with Apple
3. Create a Service ID for web authentication
4. Generate and upload authentication key to Firebase

---

## Troubleshooting

### Build Errors

**Error: "CocoaPods: pod install fails"**
```bash
# Clear cache and reinstall
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**Error: "FirebaseCore linking error"**
```bash
# Rebuild with pod install
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Runtime Errors

**Error: "GoogleService-Info.plist not found"**
- Ensure file is in iOS project root
- Add to Xcode target: File Inspector → Target Membership

**Error: "Apple Sign-In not available"**
- Verify Sign in with Apple capability is enabled
- Check iOS Deployment Target ≥ 13.0

**Error: "Google Sign-In fails"**
- Verify Client ID in Info.plist matches Firebase
- Check URL schemes are properly configured
- Ensure GoogleService-Info.plist is correct

---

## Testing Checklist

- [ ] Email/Password sign up
- [ ] Email/Password sign in
- [ ] Email/Password sign out
- [ ] Google Sign-In
- [ ] Apple Sign-In
- [ ] Password reset
- [ ] Email verification (if enabled)
- [ ] Error handling (invalid credentials, etc.)
- [ ] State persistence (user remains signed in after app restart)

---

## Next Steps

1. **Complete the setup**: Follow the Quick Start section
2. **Test all auth methods**: Use the testing checklist above
3. **Customize UI**: Replace `AuthScreen` with your own UI using `useAuth()` hook
4. **Deploy**: Build production app with `npm run ios -- --configuration Release`

---

## Files Reference

| File | Purpose | Action |
|------|---------|--------|
| `Info.plist.template` | Configuration template | Copy to your Info.plist |
| `AppDelegate.m.example` | Sample AppDelegate | Copy relevant sections |
| `Podfile.example` | Dependency example | Merge into your Podfile |

---

## Support

For more information:
- SDK Documentation: [../README.md](../README.md)
- Firebase iOS Guide: https://firebase.google.com/docs/ios/setup
- Google Sign-In: https://developers.google.com/identity/sign-in/ios
- Sign in with Apple: https://developer.apple.com/sign-in-with-apple/

---

**Ready to build? Start with the Quick Start section above! 🚀**
