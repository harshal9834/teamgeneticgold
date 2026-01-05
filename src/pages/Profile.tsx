import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import GoogleLogo from "@/assets/download.svg";

import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

interface UploadData {
  fileName: string;
  totalReads: number;
  qualityPassed: number;
  createdAt?: any;
}

const Profile = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "uploads"),
      where("uid", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setUploads(snapshot.docs.map((doc) => doc.data() as UploadData));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-bio p-10">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col items-center text-center">

          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-accent p-[3px] shadow-glow">
            <div className="w-full h-full rounded-full bg-muted overflow-hidden flex items-center justify-center">
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid}`}
                alt="User Avatar"
                className="w-24 h-24 object-cover"
              />
            </div>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold mt-5">
            {user?.displayName || "User Profile"}
          </h1>

          {/* Email */}
          <p className="text-muted-foreground mt-1">
            {user?.email}
          </p>

          {/* Google Badge */}
          <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30">
            <img src={GoogleLogo} alt="Google" className="w-4 h-4 rounded-sm" />
            <span className="text-xs text-primary font-medium">
              Signed in with Google
            </span>
          </div>
        </div>

        <hr className="my-8 border-border" />

        {/* ===== UPLOAD SECTION ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Uploaded Data
          </h2>

          {/* LOADING */}
          {loading && (
            <p className="text-muted-foreground text-center">
              Loading your uploads…
            </p>
          )}

          {/* NO DATA */}
          {!loading && uploads.length === 0 && (
            <div className="bg-muted border border-border rounded-xl p-6 text-center">
              <p className="text-muted-foreground">
                📂 You haven’t uploaded any files yet.
              </p>
            </div>
          )}

          {/* DATA EXISTS */}
          {!loading && uploads.length > 0 && (
            <div className="space-y-3">
              {uploads.map((u, i) => (
                <div key={i} className="bg-muted border border-border rounded-xl p-4">
                  <p className="font-medium">{u.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    Reads: {u.totalReads?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
