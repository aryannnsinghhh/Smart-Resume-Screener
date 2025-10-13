import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { IconCheck, IconAlertCircle, IconX, IconUsers } from "@tabler/icons-react";
import { cn } from "../../utils/cn";
import { STATUS } from "../../utils/constants";

export const ExpandableCard = memo(({ screening, onDelete }) => {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(false));

  const getScoreColor = (score) => {
    if (score >= 7) return "from-green-500 to-emerald-500";
    if (score >= 5) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const getGlowColor = (action) => {
    if (action === STATUS.SHORTLIST) return "shadow-green-500/50";
    if (action === STATUS.MAYBE) return "shadow-yellow-500/50";
    return "shadow-red-500/50";
  };

  return (
    <>
      {/* Modal Overlay & Content */}
      {active && (
        <>
          <div className="fixed inset-0 bg-black/60 h-full w-full z-50 animate-in fade-in duration-200" onClick={() => setActive(false)} />
          
          <div className="fixed inset-0 grid place-items-center z-[100] p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-3xl max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                className="absolute -top-2 -right-2 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full h-10 w-10 backdrop-blur-xl border border-white/20 z-10 transition-colors duration-150"
                onClick={() => setActive(false)}
              >
                <CloseIcon />
              </button>

              {/* Modal Card */}
              <div
                ref={ref}
                className="flex flex-col bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <IconUsers className="w-7 h-7 text-yellow-400" />
                        {screening.candidate_name || "Unknown"}
                      </h2>
                      <p className="text-neutral-400 text-sm md:text-base flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {screening.candidate_email || "No email"}
                      </p>
                    </div>

                    {/* Score */}
                    <div className={`px-4 md:px-6 py-3 rounded-2xl bg-gradient-to-r ${getScoreColor(screening.match_score)} flex flex-col items-center shrink-0`}>
                      <span className="text-white text-3xl md:text-4xl font-bold">
                        {parseFloat(screening.match_score).toFixed(1)}
                      </span>
                      <span className="text-white/80 text-xs">/ 10</span>
                    </div>
                  </div>

                  {/* Job & Status */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-neutral-300 bg-white/5 px-3 py-2 rounded-lg text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {screening.job_title}
                    </div>

                    <span className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs border",
                      screening.recommended_action === STATUS.SHORTLIST && "bg-green-500/20 text-green-400 border-green-500/50",
                      screening.recommended_action === STATUS.REJECT && "bg-red-500/20 text-red-400 border-red-500/50"
                    )}>
                      {screening.recommended_action === STATUS.SHORTLIST && <IconCheck className="w-4 h-4" />}
                      {screening.recommended_action === STATUS.REJECT && <IconX className="w-4 h-4" />}
                      {screening.recommended_action}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-auto max-h-[50vh] space-y-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
                  {/* Justification */}
                  {screening.justification && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Analysis
                      </h3>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                          {screening.justification}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {screening.strengths && screening.strengths.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Strengths
                      </h3>
                      <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                        <ul className="space-y-2">
                          {screening.strengths.map((strength, idx) => (
                            <li key={idx} className="text-neutral-300 text-sm flex items-start gap-2">
                              <span className="text-green-400 mt-1">✓</span>
                              <span className="flex-1">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Concerns */}
                  {screening.concerns && screening.concerns.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Areas of Concern
                      </h3>
                      <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
                        <ul className="space-y-2">
                          {screening.concerns.map((concern, idx) => (
                            <li key={idx} className="text-neutral-300 text-sm flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">⚠</span>
                              <span className="flex-1">{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Fallback if no data */}
                  {!screening.justification && (!screening.strengths || screening.strengths.length === 0) && (!screening.concerns || screening.concerns.length === 0) && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-neutral-400 text-sm text-center">No detailed analysis available.</p>
                    </div>
                  )}

                  {/* Date */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-xs text-neutral-400 mb-1">Screened On</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(screening.screened_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-white/10 bg-black/20 flex gap-3">
                  <button
                    onClick={() => {
                      setActive(false);
                      setTimeout(() => onDelete(screening.candidate_id, screening.candidate_name), 150);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 transition-colors duration-150 text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setActive(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-yellow-600 hover:bg-yellow-700 text-black transition-colors duration-150 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Card Preview */}
      <motion.div
        onClick={() => setActive(true)}
        whileHover={{ scale: 1.02, y: -3, transition: { duration: 0.1 } }}
        className={cn(
          "bg-black/40 backdrop-blur-xl border rounded-2xl p-6 relative transition-all duration-75 cursor-pointer group overflow-hidden",
          // Default dim state - subtle border
          "border-neutral-800/50 hover:bg-black/50",
          // Colored glow only on hover
          screening.recommended_action === STATUS.SHORTLIST && "hover:border-green-500/70 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]",
          screening.recommended_action === STATUS.REJECT && "hover:border-red-500/70 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
        )}
      >
        {/* Subtle Glow Effect on Hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none",
          screening.recommended_action === STATUS.SHORTLIST && "bg-green-500/5",
          screening.recommended_action === STATUS.REJECT && "bg-red-500/5"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br via-transparent",
            screening.recommended_action === STATUS.SHORTLIST && "from-green-500/10 to-emerald-500/10",
            screening.recommended_action === STATUS.REJECT && "from-red-500/10 to-rose-500/10"
          )}></div>
        </div>

        {/* Info */}
        <div className="mb-4 relative z-10">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <IconUsers className="w-5 h-5 text-neutral-200" />
            {screening.candidate_name || "Unknown"}
          </h3>
          <p className="text-xs text-neutral-400 flex items-center gap-2 mb-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {screening.candidate_email || "No email"}
          </p>
          <p className="text-xs text-neutral-400 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {screening.job_title}
          </p>
        </div>

        {/* Score */}
        <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-xl relative z-10">
          <span className="text-neutral-300 text-sm font-medium">Score:</span>
          <span className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor(screening.match_score)} bg-clip-text text-transparent`}>
            {parseFloat(screening.match_score).toFixed(1)}/10
          </span>
        </div>

        {/* Date */}
        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-neutral-500 flex items-center gap-2 relative z-10">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(screening.screened_at).toLocaleDateString()}
        </div>
      </motion.div>
    </>
  );
});

ExpandableCard.displayName = 'ExpandableCard';

const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};
