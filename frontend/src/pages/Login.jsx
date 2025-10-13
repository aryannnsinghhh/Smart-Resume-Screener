import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_ENDPOINTS } from "../utils/constants";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      console.log("Attempting login to:", API_ENDPOINTS.LOGIN);

      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        setError(errorData.detail || "Invalid username or password");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        console.log("Login successful! Navigating to dashboard...");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 300);
      } else {
        setError(data.detail || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection failed. Please check if the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased overflow-hidden">
      {/* Simple gradient background matching home page */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-yellow-950/10 to-neutral-950"></div>
        
        {/* Single gradient orb matching home page */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Navy grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Login Card */}
        <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full mx-auto rounded-3xl p-8 shadow-2xl bg-black/40 backdrop-blur-xl border border-white/10 relative z-10"
      >
        {/* Subtle glow effect on card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 rounded-3xl blur opacity-30"></div>
        <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8">

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-2"
        >
          Welcome 
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-neutral-400 text-sm text-center mb-8"
        >
          Sign in to access the dashboard
        </motion.p>

        {/* Form */}
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit} 
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-yellow-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors text-yellow-50 font-medium placeholder-neutral-500"
              placeholder="Enter your username"
              required
              style={{
                WebkitTextFillColor: '#fef9e7',
                WebkitBoxShadow: '0 0 0 1000px #171717 inset',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-neutral-900 border border-yellow-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors text-yellow-50 font-medium placeholder-neutral-500"
                placeholder="Enter your password"
                required
                style={{
                  WebkitTextFillColor: '#fef9e7',
                  WebkitBoxShadow: '0 0 0 1000px #171717 inset',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm backdrop-blur-xl"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-neutral-900 border border-yellow-500/30 rounded-lg shadow-lg hover:shadow-yellow-500/30 hover:bg-neutral-800 hover:border-yellow-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 font-semibold">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </span>
          </button>
        </motion.form>

        {/* Back to Home Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <a
            href="/"
            className="text-sm text-neutral-400 hover:text-white transition-colors duration-300 inline-flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </motion.div>
        </div>
      </motion.div>

      {/* Animated Bottom Gradient Line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
      ></motion.div>
    </div>
  );
}
