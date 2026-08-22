import { getAuth, signInAnonymously, type User } from "firebase/auth";

import { app } from "@/lib/firebase";

const auth = getAuth(app);

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const signInAnonymousUser = async (): Promise<User> => {
  await auth.authStateReady();

  if (auth.currentUser) {
    return auth.currentUser;
  }

  const credentials = await signInAnonymously(auth);

  return credentials.user;
};
