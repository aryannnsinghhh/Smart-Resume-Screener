import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { IconUsers, IconChartBar, IconCheck, IconAlertCircle, IconX } from "@tabler/icons-react";
import { API_ENDPOINTS, STATUS } from "../utils/constants";
import { cn } from "../utils/cn";
import { ExpandableCard } from "../components/ui/ExpandableCardOptimized";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [screenings, setScreenings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      console.log("Dashboard: Checking authentication...");
      
      // First, check authentication with a lightweight request
      const authCheckRes = await fetch(API_ENDPOINTS.GET_STATS, { 
        credentials: "include",
        method: "HEAD" // Use HEAD to avoid fetching full data
      });

      // If not authenticated, redirect immediately before loading any UI
      if (authCheckRes.status === 401) {
        console.log("Dashboard: Not authenticated - redirecting to login");
        navigate("/login", { replace: true });
        return;
      }

      // User is authenticated, now fetch data
      setIsAuthenticated(true);
      await fetchData();
    } catch (error) {
      console.error("Dashboard: Auth check error:", error);
      navigate("/login", { replace: true });
    }
  };

  const fetchData = async () => {
    try {
      console.log("Dashboard: Fetching data with credentials...");
      
      const [statsRes, screeningsRes] = await Promise.all([
        fetch(API_ENDPOINTS.GET_STATS, { credentials: "include" }),
        fetch(API_ENDPOINTS.GET_SCREENINGS, { credentials: "include" }),
      ]);

      console.log("Dashboard: Stats response status:", statsRes.status);
      console.log("Dashboard: Screenings response status:", screeningsRes.status);

      // Check if user is authenticated
      if (statsRes.status === 401 || screeningsRes.status === 401) {
        console.log("Dashboard: 401 Unauthorized - redirecting to login");
        navigate("/login", { replace: true });
        return;
      }

      if (!statsRes.ok || !screeningsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const statsData = await statsRes.json();
      const screeningsData = await screeningsRes.json();

      console.log("Dashboard: Data fetched successfully");
      setStats(statsData);
      setScreenings(screeningsData.screenings || []); // Extract screenings array from response
    } catch (error) {
      console.error("Dashboard: Error fetching data:", error);
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (candidateId, candidateName) => {
    if (!confirm(`Are you sure you want to delete ${candidateName}?`)) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.DELETE_CANDIDATE(candidateId), {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        alert("Candidate deleted successfully!");
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("Failed to delete candidate");
    }
  };

  const filteredScreenings = screenings.filter((screening) => {
    if (filter === "All") return true;
    return screening.recommended_action === filter;
  });

  const getScoreColor = (score) => {
    if (score >= 7) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (action) => {
    if (action === STATUS.SHORTLIST) return "bg-green-100 text-green-800";
    if (action === STATUS.MAYBE) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <div className="flex items-center justify-center h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <svg className="animate-spin h-16 w-16 text-yellow-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-neutral-400 text-lg">Loading...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Don't render dashboard UI until authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      {/* Background matching home and login pages */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-yellow-950/10 to-neutral-950"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      {/* Navy grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Resume Screening Dashboard
            </h1>
            <p className="text-neutral-400 text-xl">
              Track and analyze candidate evaluations
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { label: "Total Candidates", subtitle: "Unique Applicants", value: stats.total_candidates || 0, color: "from-yellow-500 to-amber-500", icon: <IconUsers className="w-8 h-8 text-yellow-300" /> },
                { label: "Total Screenings", subtitle: "Total Evaluations", value: stats.total_screenings || 0, color: "from-amber-500 to-orange-500", icon: <IconChartBar className="w-8 h-8 text-amber-300" /> },
                { label: "Shortlisted", subtitle: "Top Performers", value: stats.shortlisted || 0, color: "from-green-500 to-emerald-500", icon: <IconCheck className="w-8 h-8 text-green-300" /> },
                { label: "Rejected", subtitle: "Not Qualified", value: stats.rejected || 0, color: "from-red-500 to-rose-500", icon: <IconX className="w-8 h-8 text-red-300" /> },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.1 } }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-75"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-neutral-300 text-base font-semibold mb-1">{stat.label}</div>
                <div className="text-neutral-500 text-xs font-medium mb-3">{stat.subtitle}</div>
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <span className="text-neutral-300 font-medium mr-2 flex items-center">
              Filter by:
            </span>
            {["All", STATUS.SHORTLIST, STATUS.REJECT].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-medium transition-all duration-75 relative",
                  filter === status
                    ? "bg-neutral-900 border border-yellow-500/50 shadow-lg"
                    : "bg-neutral-900 hover:bg-neutral-800 border border-yellow-500/30 hover:border-yellow-500/50"
                )}
              >
                <span className={cn(
                  "relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400",
                  filter === status && "font-semibold"
                )}>
                  {status}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Candidates Grid */}
          <AnimatePresence mode="wait">
            {filteredScreenings.length > 0 ? (
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredScreenings.map((screening, index) => (
                  <div key={screening.id}>
                    <ExpandableCard 
                      screening={screening} 
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 9 4-18 3 9h4" />
                  </svg>
                </div>
                <p className="text-neutral-400 text-lg">No candidates found for this filter</p>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
