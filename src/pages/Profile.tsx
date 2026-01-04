import useAuth from "../hooks/useAuth";
import GoogleLogo from "@/assets/download.svg";

const Profile = () => {
  const { user } = useAuth();

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

          {/* Status Badge with Google Logo */}
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

          <div className="bg-muted border border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground">
              📂 Your uploaded files will appear here soon.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
