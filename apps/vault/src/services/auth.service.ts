// Re-export from shared auth package
export { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, getCurrentUser, getLinkedIdentities, linkGoogleAccount, unlinkGoogleAccount, onAuthStateChange } from '@pompcore/auth';
export type { LinkedIdentity } from '@pompcore/auth';
