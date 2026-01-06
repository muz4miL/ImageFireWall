import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const stepMessages = [
  "Initializing Neural Net...",
  "Analyzing Frequency Domain...",
  "Searching for GAN Artifacts...",
  "Verifying Metadata Integrity...",
];

interface ForensicScannerProps {
  fileName: string | null;
  durationMs: number;
}

export function ForensicScanner({
  fileName,
  durationMs,
}: ForensicScannerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const progressVariants = useMemo(
    () => ({
      initial: { width: "0%" },
      animate: {
        width: "100%",
        transition: { duration: durationMs / 1000, ease: "linear" },
      },
    }),
    [durationMs]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % stepMessages.length);
    }, durationMs / stepMessages.length);

    return () => clearInterval(interval);
  }, [durationMs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-cyan-500/90">
        <span className="truncate font-mono flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <span className="absolute inset-0 rounded-full border border-blue-500/50 blur-[1px] dark:border-cyan-400/60" />
            <Loader2 className="w-3 h-3 relative" />
          </motion.div>
          {fileName ?? "Analyzing file"}
        </span>
        <span className="ml-2 text-right leading-tight">
          {stepMessages[activeStepIndex]}
        </span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden dark:bg-black dark:border dark:border-cyan-900/50 dark:rounded-sm">
        <motion.div
          className="h-full bg-blue-600 dark:bg-cyan-400 dark:shadow-[0_0_15px_cyan,inset_0_1px_1px_white]"
          variants={progressVariants}
          initial="initial"
          animate="animate"
          key={fileName ?? "progress"}
        />
      </div>
      <div className="text-xs text-slate-500 dark:text-cyan-600/80 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        Synthesizing forensic overlays ({Math.round(durationMs / 1000)}s)
      </div>
    </div>
  );
}
