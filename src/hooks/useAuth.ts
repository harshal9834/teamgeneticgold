import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      let fullName = firebaseUser.displayName || "";

      // 🔹 Pull name from Firestore if missing
      try {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          if (data.fullName) fullName = data.fullName;
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      }

      setUser({
        ...firebaseUser,
        fullName,
      });

      setLoading(false);
    });
  }, []);

  return { user, loading };
}
