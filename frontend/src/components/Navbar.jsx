/**
 * Navbar.jsx
 * Main navigation bar with responsive design and authentication
 */
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { API_ENDPOINTS } from "../utils/constants";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        console.log("Logged out successfully");
      }
      
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="w-full bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Smart Resume Screener
            </span>
          </motion.div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) => (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className={cn(
                  "px-5 py-2 rounded-xl font-medium transition-all duration-75 relative",
                  isActive(item.path)
                    ? "bg-neutral-900 border border-yellow-500/50 shadow-lg"
                    : "bg-neutral-900/30 hover:bg-neutral-800/50 border border-transparent hover:border-yellow-500/30"
                )}
              >
                <span className={cn(
                  "relative z-10",
                  isActive(item.path) 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 font-semibold" 
                    : "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400"
                )}>{item.label}</span>
              </motion.button>
            ))}
            
            {isDashboard && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl font-medium transition-all duration-75 border border-red-500/30 hover:border-red-500/50"
              >
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-white/10 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
