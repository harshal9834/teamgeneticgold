import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import GoogleLogo from "@/assets/download.svg";

import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc
} from "firebase/firestore";

interface UploadData {
  fileName: string;
  totalReads: number;
  qualityPassed: number;
  createdAt?: any;
}

interface UserProfile {
  fullName: string;
  email: string;
  organization: string;
  country: string;
  role: string;
  useCase: string;
  experience: string;
  authProvider: string;
}

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uploads, setUploads] = useState<UploadData[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // -------- FETCH PROFILE --------
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchProfile = async () => {
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, []);

  // -------- FETCH USER UPLOADS --------
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "uploads"),
      where("uid", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setUploads(snapshot.docs.map((doc) => doc.data() as UploadData));
      setLoadingUploads(false);
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
            {profile?.fullName || user?.displayName || "User Profile"}
          </h1>

          {/* Email */}
          <p className="text-muted-foreground mt-1">
            {user?.email}
          </p>

          {/* Provider Badge */}
          {profile?.authProvider === "email" ? (
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-400/30">
              <span className="text-xs text-blue-300 font-medium">
                Signed in with Email
              </span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <img src={GoogleLogo} alt="Google" className="w-4 h-4 rounded-sm" />
              <span className="text-xs text-primary font-medium">
                Signed in with Google
              </span>
            </div>
          )}
        </div>

        <hr className="my-8 border-border" />

        {/* ===== USER DETAILS ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Profile Information
          </h2>

          {loadingProfile ? (
            <p className="text-muted-foreground">Loading profile…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-muted border border-border rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{profile?.fullName || "-"}</p>
              </div>

              <div className="bg-muted border border-border rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="font-medium">{profile?.organization || "Independent"}</p>
              </div>

              <div className="bg-muted border border-border rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{profile?.country || "-"}</p>
              </div>

              <div className="bg-muted border border-border rounded-xl p-4">
                <p className="text-sm text-muted-foreground">Professional Role</p>
                <p className="font-medium">{profile?.role || "-"}</p>
              </div>

              <div className="bg-muted border border-border rounded-xl p-4 md:col-span-2">
                <p className="text-sm text-muted-foreground">Primary Use Case</p>
                <p className="font-medium">{profile?.useCase || "-"}</p>
              </div>

              <div className="bg-muted border border-border rounded-xl p-4 md:col-span-2">
                <p className="text-sm text-muted-foreground">Experience Level</p>
                <p className="font-medium">{profile?.experience || "-"}</p>
              </div>

            </div>
          )}
        </div>

        <hr className="my-8 border-border" />

        {/* ===== UPLOAD SECTION ===== */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Uploaded Data
          </h2>

          {loadingUploads ? (
            <p className="text-muted-foreground text-center">
              Loading your uploads…
            </p>
          ) : uploads.length === 0 ? (
            <div className="bg-muted border border-border rounded-xl p-6 text-center">
              <p className="text-muted-foreground">
                📂 You haven’t uploaded any files yet.
              </p>
            </div>
          ) : (
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
