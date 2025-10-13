/**
 * UploadSection.jsx
 * Resume upload section with drag & drop functionality
 */
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../utils/constants";
import { cn } from "../utils/cn";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !jobDescription.trim()) {
      setError("Please upload a resume and provide a job description");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD_RESUME, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Screening failed");
      }

      const data = await response.json();
      setResult(data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message || "An error occurred during screening");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 7) return "from-green-400 to-emerald-600";
    if (score >= 5) return "from-yellow-400 to-orange-600";
    return "from-red-400 to-rose-600";
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent"
          >
            Screen Your Resume
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center text-neutral-400 mb-12"
          >
            Upload a resume and get instant AI-powered analysis
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-neutral-300 mb-3">
                Upload Resume (PDF)
              </label>
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-75 cursor-pointer",
                  dragActive
                    ? "border-yellow-500 bg-yellow-500/10 scale-105"
                    : "border-neutral-700 hover:border-yellow-500/50 hover:bg-white/5"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <motion.div 
                  className="space-y-4"
                  whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
                >
                  <svg
                    className="mx-auto w-16 h-16 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {file ? (
                    <div className="space-y-2">
                      <p className="text-yellow-400 font-semibold text-lg">{file.name}</p>
                      <p className="text-neutral-500 text-sm">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-neutral-300 text-lg font-medium">
                        Drag & drop your resume here
                      </p>
                      <p className="text-neutral-500 text-sm mt-2">
                        or click to browse
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-neutral-300 mb-3">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-5 py-4 bg-neutral-900/50 border-2 border-neutral-700 rounded-2xl focus:border-yellow-500 focus:outline-none transition-all duration-75 resize-none text-white placeholder-neutral-500 backdrop-blur-xl"
                rows="6"
                placeholder="Paste the job description here..."
              />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-400 px-5 py-4 rounded-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-neutral-900 border border-yellow-500/30 rounded-xl shadow-lg transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 hover:border-yellow-500/50"
            >
              <span className="flex items-center justify-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 font-semibold text-lg">
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze Resume
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mt-10 p-8 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl border border-green-500/30 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-400">
                    Screening Complete!
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-400 text-sm">Candidate</p>
                      <p className="text-white text-lg font-semibold">{result.candidate?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">Email</p>
                      <p className="text-white">{result.candidate?.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-400 text-sm mb-2">Match Score</p>
                      <div className="flex items-center gap-3">
                        <span className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(result.match_score?.score)} bg-clip-text text-transparent`}>
                          {result.match_score?.score?.toFixed(1)}
                        </span>
                        <span className="text-2xl text-neutral-500">/10</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">Recommendation</p>
                      <span className={cn(
                        "inline-block px-4 py-2 rounded-full font-semibold text-sm",
                        result.match_score?.recommended_action === "Shortlist" && "bg-green-500/20 text-green-400 border border-green-500/50",
                        result.match_score?.recommended_action === "Maybe" && "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
                        result.match_score?.recommended_action === "Reject" && "bg-red-500/20 text-red-400 border border-red-500/50"
                      )}>
                        {result.match_score?.recommended_action}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = "/dashboard"}
                  className="mt-6 px-6 py-3 bg-neutral-900 border border-yellow-500/30 rounded-xl transition-all duration-75 hover:bg-neutral-800 hover:border-yellow-500/50"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 font-semibold">
                    View in Dashboard →
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
