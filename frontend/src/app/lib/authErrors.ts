import { FirebaseError } from 'firebase/app';

/** Maps Firebase Auth errors to short, actionable messages for the UI. */
export function formatFirebaseAuthError(err: unknown): string {
  const code = (err as any)?.code as string | undefined;
  if (code) {
    switch (code) {
      case 'auth/configuration-not-found':
        return (
          'Authentication is not set up for this Firebase project. In the Firebase Console open Authentication, click Get started, ' +
          'then open the Sign-in method tab and enable Email/Password. ' +
          'Confirm every value in frontend/.env comes from the same project (Project settings → Your apps → Web app). ' +
          'Restart Vite after changing .env.'
        );
      case 'auth/email-already-in-use':
        return 'That email is already registered. Try signing in instead.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      case 'auth/invalid-api-key':
        return 'Invalid API key. Check VITE_FIREBASE_API_KEY in frontend/.env matches Project settings.';
      case 'auth/operation-not-allowed':
        return (
          'Email/Password sign-in is turned off for this project. In Firebase Console open Authentication → Sign-in method ' +
          'and enable Email/Password. Save, then try again.'
        );
      case 'permission-denied':
        return (
          'Firestore blocked saving your profile. In Firebase Console open Firestore → Rules and allow signed-in users to read/write ' +
          'their document at users/{userId} (see project README for an example).'
        );
      default:
        break;
    }
  }

  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/configuration-not-found':
        return (
          'Authentication is not set up for this Firebase project. In the Firebase Console open Authentication, click Get started, ' +
          'then open the Sign-in method tab and enable Email/Password. ' +
          'Confirm every value in frontend/.env comes from the same project (Project settings → Your apps → Web app). ' +
          'Restart Vite after changing .env.'
        );
      case 'auth/email-already-in-use':
        return 'That email is already registered. Try signing in instead.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      case 'auth/invalid-api-key':
        return 'Invalid API key. Check VITE_FIREBASE_API_KEY in frontend/.env matches Project settings.';
      case 'auth/operation-not-allowed':
        return (
          'Email/Password sign-in is turned off for this project. In Firebase Console open Authentication → Sign-in method ' +
          'and enable Email/Password. Save, then try again.'
        );
      case 'permission-denied':
        return (
          'Firestore blocked saving your profile. In Firebase Console open Firestore → Rules and allow signed-in users to read/write ' +
          'their document at users/{userId} (see project README for an example).'
        );
      default:
        return err.message;
    }
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Please try again.';
}
