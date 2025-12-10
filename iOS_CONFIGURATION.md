# iOS Configuration Guide for ja-auth-sdk

## Overview
This guide provides step-by-step instructions to set up the Firebase Authentication SDK for iOS with support for Email/Password, Google Sign-In, and Apple Sign-In.

---

## Prerequisites

- **Xcode** 14.0 or higher
- **iOS Deployment Target**: 12.0 or higher
- **CocoaPods** installed
- **Firebase Project** created in Firebase Console
- **Apple Developer Account** (for Apple Sign-In)
- **Google Cloud Console** project (for Google Sign-In)

---

## Part 1: Firebase Setup

### 1.1 Download GoogleService-Info.plist

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Your apps**
4. Select your iOS app
5. Click **Download GoogleService-Info.plist**
6. Move the file to your Xcode project root
7. In Xcode: Right-click project → **Add Files to Project**
8. Select `GoogleService-Info.plist` and ensure it's added to your target

### 1.2 Enable Authentication Methods

In Firebase Console:
1. Go to **Authentication** → **Sign-in method**
2. Enable:
   - ✅ **Email/Password**
   - ✅ **Google**
   - ✅ **Apple**

---

## Part 2: Apple Sign-In Configuration

### 2.1 Configure Apple App ID

1. Go to [Apple Developer Account](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles** → **Identifiers**
3. Select your App ID (or create a new one)
4. Enable **Sign in with Apple** capability
5. Click **Save**

### 2.2 Create Service ID (for Web)

1. In **Identifiers**, select **Services IDs**
2. Click **+** to create a new Services ID
3. Set:
   - **Description**: e.g., "Firebase Apple Sign-In"
   - **Identifier**: `com.yourcompany.yourapp.signin` (unique)
4. Click **Continue** → **Save**
5. Double-click the Service ID you just created
6. Check **Sign in with Apple**
7. Click **Configure**
8. Add your **Primary App ID**
9. Add **Return URL**: `https://yourproject.firebaseapp.com/__/auth/handler`
10. Click **Save**

### 2.3 Create Private Key for Apple Sign-In

1. In **Certificates, Identifiers & Profiles** → **Keys**
2. Click **+** to create a new key
3. Name it: "Apple Sign-In Key"
4. Check **Sign in with Apple**
5. Click **Configure**
6. Select your **Primary App ID**
7. Click **Save**
8. Click **Continue** → **Register**
9. **Download** the `.p8` key file (save securely - you can only download once!)

### 2.4 Add Key to Firebase

1. Go to Firebase Console → Your Project
2. **Project Settings** → **Service Accounts**
3. Click **Generate New Private Key**
4. In **Apple** section, upload your `.p8` key file
5. Enter the **Team ID** and **Key ID** (from your downloaded file)

### 2.5 Configure Xcode Project

1. Open your iOS project in Xcode
2. Select your app target
3. Go to **Signing & Capabilities**
4. Click **+ Capability**
5. Add **Sign in with Apple**
6. Ensure **Team** is set correctly
7. Verify the Bundle ID matches your Apple App ID

---

## Part 3: Google Sign-In Configuration

### 3.1 Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **iOS**
6. Add your app's **Bundle ID**
7. Add **Team ID** (found in Xcode → Project → General)
8. Click **Create**
9. Note your **Client ID**

### 3.2 Configure in Info.plist

Add to your `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
    </array>
  </dict>
</array>
<key>GIDClientID</key>
<string>YOUR_CLIENT_ID.apps.googleusercontent.com</string>
```

### 3.3 Update Firebase Console

1. Firebase Console → Your Project → **Project Settings** → **Your apps**
2. Select your iOS app
3. Go to **Google** tab
4. Enter your **iOS Client ID**
5. Click **Save**

---

## Part 4: Install Dependencies

### 4.1 Install CocoaPods Dependencies

```bash
cd ios
pod install
cd ..
```

### 4.2 Update Podfile (if needed)

Make sure your `Podfile` includes:

```ruby
target 'YourApp' do
  pod 'Firebase/Auth'
  pod 'Firebase/Core'
  pod 'GoogleSignIn'
  pod 'RNAppleAuthentication'
  
  # ... other pods
end
```

Then run:
```bash
pod install
```

---

## Part 5: Configure React Native Code

### 5.1 Initialize Firebase in AppDelegate.m

```objc
#import <Firebase/Firebase.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  // ... rest of initialization
  return YES;
}
```

### 5.2 Handle Google Sign-In Redirect

```objc
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary *)options {
  return [[GIDSignIn sharedInstance] handleURL:url];
}
```

### 5.3 Handle Apple Sign-In Redirect

```objc
#import <AuthenticationServices/AuthenticationServices.h>

- (void)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
  // Handle Apple Sign-In callbacks if needed
}
```

---

## Part 6: React Native Setup

### 6.1 Install SDK in Your React Native App

```bash
npm install ja-auth-sdk --legacy-peer-deps
# or
yarn add ja-auth-sdk
```

### 6.2 Example Implementation

```tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, AuthScreen, useAuth } from 'ja-auth-sdk';

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
    emailPassword: {
      enabled: true,
      requireEmailVerification: false
    },
    google: {
      enabled: true,
      webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
    },
    apple: {
      enabled: true
    }
  },
  ui: {
    theme: "light",
    primaryColor: "#007AFF"
  }
};

function App() {
  return (
    <AuthProvider config={authConfig}>
      <AuthScreen 
        onAuthSuccess={(user) => {
          console.log('User signed in:', user);
          // Navigate to home screen
        }}
      />
    </AuthProvider>
  );
}

export default App;
```

### 6.3 Alternative: Headless Mode with Custom UI

```tsx
import React, { useState } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import { AuthProvider, useAuth } from 'ja-auth-sdk';

function LoginForm() {
  const { signIn, signOut, authState, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => {
    const result = await signIn.emailPassword(email, password);
    if (result.success) {
      Alert.alert('Success', `Welcome ${result.user?.displayName || 'User'}!`);
    } else {
      Alert.alert('Error', result.error?.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signIn.google();
    if (!result.success) {
      Alert.alert('Error', result.error?.message);
    }
  };

  const handleAppleSignIn = async () => {
    const result = await signIn.apple();
    if (!result.success) {
      Alert.alert('Error', result.error?.message);
    }
  };

  if (authState === 'Authenticated') {
    return (
      <View>
        <Text>Welcome {user?.email}!</Text>
        <Button title="Sign Out" onPress={signOut} />
      </View>
    );
  }

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In with Email" onPress={handleEmailSignIn} />
      <Button title="Sign In with Google" onPress={handleGoogleSignIn} />
      <Button title="Sign In with Apple" onPress={handleAppleSignIn} />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider config={authConfig}>
      <LoginForm />
    </AuthProvider>
  );
}
```

---

## Part 7: Troubleshooting

### Issue: "GoogleService-Info.plist not found"
- **Solution**: Ensure the file is in project root and added to Xcode target

### Issue: Apple Sign-In button not appearing
- **Solution**: Check that Sign in with Apple capability is enabled in Xcode

### Issue: "Invalid Client ID" for Google
- **Solution**: 
  - Verify Bundle ID matches in Google Cloud Console
  - Check that Client ID is correct in Info.plist
  - Regenerate credentials if needed

### Issue: "Token Exchange failed" errors
- **Solution**: 
  - Verify Firebase rules allow sign-in
  - Check all credentials are correct
  - Clear app cache and reinstall

### Issue: Email verification not working
- **Solution**: Enable "Email/Password" in Firebase Authentication

---

## Part 8: Testing

### 8.1 Test Email/Password Auth

```tsx
const testEmailAuth = async () => {
  const result = await signIn.emailPassword('test@example.com', 'password123');
  console.log('Email auth result:', result);
};
```

### 8.2 Test Google Sign-In

```tsx
const testGoogleAuth = async () => {
  const result = await signIn.google();
  console.log('Google auth result:', result);
};
```

### 8.3 Test Apple Sign-In

```tsx
const testAppleAuth = async () => {
  const result = await signIn.apple();
  console.log('Apple auth result:', result);
};
```

---

## Security Best Practices

1. ✅ **Never commit** sensitive files like `.p8` keys or `GoogleService-Info.plist`
2. ✅ **Use environment variables** for API keys
3. ✅ **Enable** Firebase Security Rules to restrict data access
4. ✅ **Rotate keys** periodically
5. ✅ **Monitor** Firebase Authentication logs for suspicious activity
6. ✅ **Enable 2FA** on your Apple Developer and Google Cloud accounts

---

## Additional Resources

- [Firebase iOS Documentation](https://firebase.google.com/docs/ios/setup)
- [Google Sign-In for iOS](https://developers.google.com/identity/sign-in/ios)
- [Sign in with Apple Documentation](https://developer.apple.com/documentation/authenticationservices/implementing_user_authentication_with_sign_in_with_apple)
- [React Native Firebase Documentation](https://rnfirebase.io/)

---

## Summary

Your SDK is now configured for iOS with:
- ✅ Email/Password authentication
- ✅ Google Sign-In
- ✅ Apple Sign-In
- ✅ Full TypeScript support
- ✅ Error handling and state management
- ✅ Pre-built UI or headless mode

You can now run your iOS app and test the authentication flows!
