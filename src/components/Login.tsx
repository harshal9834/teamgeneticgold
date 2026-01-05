import { useState } from "react";
import { loginWithGoogle, loginWithEmail } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Already logged in → redirect
  if (user) return <Navigate to="/" />;

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError("");
      await loginWithEmail(email, password);
    } catch (err: any) {
      console.error("LOGIN ERROR:", err.code);

      switch (err.code) {
        case "auth/user-not-found":
          setError("No account exists with this email.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password. Try again.");
          break;

        case "auth/invalid-email":
          setError("Invalid email format.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please wait and try again.");
          break;

        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F14]">

      <div className="bg-[#0F1824] border border-[#1F2A37] rounded-2xl shadow-xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome to <span className="text-teal-400">GeneticGold</span>
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Please sign in to continue
        </p>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* GOOGLE SIGN IN */}
        <button
          onClick={loginWithGoogle}
          className="w-full bg-white text-gray-900 font-medium py-2 rounded-lg hover:bg-gray-200 mb-6 flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5"
          />
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-600 flex-1" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px bg-gray-600 flex-1" />
        </div>

        {/* EMAIL FIELD */}
        <input
          className="w-full p-2 rounded-md bg-[#0B1220] text-white border border-gray-700 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD FIELD */}
        <input
          className="w-full p-2 rounded-md bg-[#0B1220] text-white border border-gray-700 mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleEmailLogin}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 rounded-lg"
        >
          Login
        </button>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-teal-400">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
