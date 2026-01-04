import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GoogleLogo from "@/assets/download.svg";


export default function Login() {
  const navigate = useNavigate();

  async function login() {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed — please try again");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        <h2 className="text-2xl font-bold mb-2">
          Welcome to{" "}
          <span className="text-cyan-400">Genetic</span>
          <span className="text-amber-400">Gold</span>
        </h2>

        <p className="text-sm text-muted-foreground mb-8">
          Please sign in to continue
        </p>

        <button
          onClick={login}
          className="google-btn"
        >
          <img src={GoogleLogo} alt="google icon" />
          <span>Sign in with Google</span>
        </button>



        <p className="text-xs text-muted-foreground mt-6">
          Secure Google Authentication • No passwords stored
        </p>

      </div>
    </div>
  );
}
