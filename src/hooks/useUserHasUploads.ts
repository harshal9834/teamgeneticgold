import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "./useAuth";

export default function useUserHasUploads() {
  const { user } = useAuth();
  const [hasUploads, setHasUploads] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "uploads"),
      where("uid", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setHasUploads(!snap.empty);
      setLoading(false);
    });

    return () => unsub();
  }, [user?.uid]);

  return { hasUploads, loading };
}
