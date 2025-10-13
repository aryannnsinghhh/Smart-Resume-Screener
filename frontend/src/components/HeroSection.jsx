import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IconBolt, IconTarget, IconChartBar, IconUpload, IconStack } from "@tabler/icons-react";

export default function HeroSection({ onUploadClick }) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Simple gradient background instead of sparkles */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-yellow-950/10 to-neutral-950"></div>

      {/* Single gradient orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Navy grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            AI-Powered Resume
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Screening Platform
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl mb-12 text-neutral-300 max-w-3xl mx-auto"
          >
            Streamline your hiring process with intelligent resume analysis
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.98 }}
              onClick={onUploadClick}
              className="group relative px-8 py-4 bg-neutral-900 border border-yellow-500/30 rounded-xl overflow-hidden transition-all duration-75 shadow-lg hover:bg-neutral-800 hover:border-yellow-500/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 font-semibold">
                <IconUpload className="w-5 h-5 text-yellow-400" />
                Upload Resume
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 bg-neutral-900 border border-yellow-500/30 rounded-xl hover:bg-neutral-800 hover:border-yellow-500/50 transition-all duration-75 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 font-semibold">
                <IconStack className="w-5 h-5 text-yellow-400" />
                View Dashboard
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
