import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactCompareImage from "react-compare-image";
import { AlertTriangle, Download } from "lucide-react";
import checkmarkIcon from "../../assets/checkmark.png";

type Status = "idle" | "scanning" | "result";

interface ResultViewerProps {
  status: Status;
}

export function ResultViewer({ status }: ResultViewerProps) {
  return (
    <AnimatePresence mode="wait">
      {status === "result" ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-red-300 bg-red-50 text-red-900 backdrop-blur dark:border-red-700 dark:bg-red-950/40 dark:text-red-400 dark:shadow-[0_0_12px_rgba(220,38,38,0.3)]">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <AlertTriangle size={18} />
            </motion.div>
            <div>
              <p className="font-semibold text-sm">CRITICAL ALERT</p>
              <p className="text-sm text-red-800 dark:text-red-500/90">
                Manipulation artifacts detected across multiple regions.
              </p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-slate-300 bg-slate-50 shadow-sm dark:border-cyan-800 dark:bg-black/60 dark:shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <ReactCompareImage
              leftImage="https://placehold.co/800x500/png?text=Original+Scan"
              rightImage="https://placehold.co/800x500/red/white?text=Tampered+Overlay"
              sliderLineColor="#2563eb"
              handleSize={40}
            />
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all dark:border-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400 dark:shadow-[0_0_12px_rgba(6,182,212,0.4)] dark:hover:bg-cyan-900/50 dark:hover:shadow-[0_0_18px_rgba(6,182,212,0.6)]">
            <Download size={16} />
            Download Forensic Report
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="placeholder"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 text-sm"
        >
          <div className="relative h-32 w-32 mb-4 flex items-center justify-center">
            {/* Outer rotating gradient ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.3), transparent, rgba(6, 182, 212, 0.3), transparent)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Pulse rings */}
            <span className="absolute inset-1 rounded-full border border-blue-400/30 animate-ping dark:border-cyan-400/40" />
            <span className="absolute inset-3 rounded-full border border-blue-300/20 animate-ping [animation-delay:300ms] dark:border-cyan-500/30" />
            
            {/* Inner glowing ring */}
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-blue-400/40 dark:border-cyan-500/50"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.2)",
                  "0 0 20px 4px rgba(59, 130, 246, 0.15)",
                  "0 0 0 0 rgba(59, 130, 246, 0.2)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                boxShadow: "inset 0 0 20px rgba(59, 130, 246, 0.1)"
              }}
            />
            
            {/* Center container with icon */}
            <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 backdrop-blur-sm flex items-center justify-center shadow-lg dark:from-slate-900 dark:to-black dark:border-cyan-800/60 dark:shadow-[0_0_30px_rgba(6,182,212,0.25)]">
              {/* Inner glow effect */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50/50 to-transparent dark:from-cyan-900/20 dark:to-transparent" />
              
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  filter: [
                    "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
                    "drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))",
                    "drop-shadow(0 0 0px rgba(59, 130, 246, 0))"
                  ]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <img
                  src={checkmarkIcon}
                  alt="Forensic ready"
                  className="h-10 w-10 object-contain"
                />
              </motion.div>
            </div>

            {/* Orbiting dots */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-blue-400/60 dark:bg-cyan-400/70 shadow-sm" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute bottom-1 right-2 h-1 w-1 rounded-full bg-blue-300/50 dark:bg-cyan-300/60" />
            </motion.div>
          </div>
          <p className="text-sm">
            {status === "scanning"
              ? "Generating forensic overlays..."
              : "Awaiting input to begin forensic sweep"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
