import { auth, db } from "../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

// =========================
// 🔹 GOOGLE LOGIN
// =========================
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  // Create profile ONLY if it does not exist
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      fullName: user.displayName ?? "",
      email: user.email,
      authProvider: "google",
      role: "User",
      createdAt: serverTimestamp(),
    });
  }

  return user;
}

// =========================
// 🔹 EMAIL LOGIN
// =========================
export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// =========================
// 🔹 EMAIL REGISTER
// =========================
export async function registerUser(
  email: string,
  password: string,
  fullName: string
) {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  const user = res.user;

  await sendEmailVerification(user);

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    fullName,
    email,
    authProvider: "email",
    createdAt: serverTimestamp(),
  });

  return user;
}
