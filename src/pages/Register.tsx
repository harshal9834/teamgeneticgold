import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    country: "",
    role: "",
    useCase: "",
    experience: "",
    terms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleRegister = async () => {
    setError("");

    if (!form.fullName || !form.email || !form.password) {
      return setError("Please fill all required fields.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (!form.terms) {
      return setError("You must agree to the Terms & Privacy Policy.");
    }

    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await sendEmailVerification(userCred.user);

      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        fullName: form.fullName,
        email: form.email,
        organization: form.organization || "Independent",
        country: form.country,
        role: form.role,
        useCase: form.useCase,
        experience: form.experience,
        authProvider: "email",
        emailVerified: false,
        createdAt: new Date(),
      });

      alert("Verification email sent. Please verify before logging in.");
      navigate("/login");
    } catch (err: any) {
      setError("Registration failed. Try again or use another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center px-4">
      <div className="bg-[#0F1824] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-10">

        <h1 className="text-3xl font-bold text-center text-white">
          Create Your Account
        </h1>

        <p className="text-center text-gray-400 mt-2 mb-6">
          Join the GeneticGold eDNA Biodiversity Platform
        </p>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* ==== FORM GRID ==== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <label className="text-gray-300 text-sm">Full Name *</label>
            <input
              name="fullName"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              placeholder="Harshal Mahajan"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">Email *</label>
            <input
              name="email"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm">Password *</label>
            <input
              type="password"
              name="password"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              placeholder="Min 6 characters"
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-300 text-sm">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              placeholder="Re-enter password"
              onChange={handleChange}
            />
          </div>

          {/* Organization */}
          <div>
            <label className="text-gray-300 text-sm">
              Organization / Institution
            </label>
            <input
              name="organization"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              placeholder="Optional"
              onChange={handleChange}
            />
          </div>

          {/* COUNTRY DROPDOWN */}
          <div>
            <label className="text-gray-300 text-sm">Country / Region</label>
            <select
              name="country"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Germany</option>
              <option>France</option>
              <option>Japan</option>
              <option>China</option>
              <option>Brazil</option>
              <option>Other</option>
            </select>
          </div>

          {/* ROLE */}
          <div>
            <label className="text-gray-300 text-sm">
              Professional Role
            </label>
            <select
              name="role"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option>Researcher</option>
              <option>Scientist</option>
              <option>Student</option>
              <option>Government Agency</option>
              <option>Environmental NGO</option>
              <option>Healthcare / Clinical</option>
              <option>Industry / Corporate</option>
              <option>Hobbyist</option>
              <option>Other</option>
            </select>
          </div>

          {/* USE CASE */}
          <div>
            <label className="text-gray-300 text-sm">Primary Use Case</label>
            <select
              name="useCase"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              onChange={handleChange}
            >
              <option value="">Select Use Case</option>
              <option>Biodiversity Monitoring</option>
              <option>Environmental Impact Assessment</option>
              <option>Academic Research</option>
              <option>Wildlife Conservation</option>
              <option>Fisheries / Aquaculture</option>
              <option>Public Health</option>
              <option>Teaching / Training</option>
              <option>Other</option>
            </select>
          </div>

          {/* EXPERIENCE */}
          <div className="md:col-span-2">
            <label className="text-gray-300 text-sm">Experience Level</label>
            <select
              name="experience"
              className="mt-1 p-2 w-full rounded-lg bg-[#0B1220] border border-gray-700 text-white"
              onChange={handleChange}
            >
              <option value="">Select Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </div>
        </div>

        {/* TERMS CHECKBOX */}
        <label className="flex items-center gap-2 mt-5 text-gray-300">
          <input type="checkbox" name="terms" onChange={handleChange} />
          I agree to the Terms & Privacy Policy
        </label>

        {/* BUTTON */}
        <button
          disabled={loading}
          onClick={handleRegister}
          className="mt-6 w-full py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Creating Account…" : "Register"}
        </button>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
