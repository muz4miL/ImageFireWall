import React, { useMemo } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Loader2 } from "lucide-react";

type Status = "idle" | "scanning" | "result";

interface ForensicScannerProps {
  status: Status;
  fileName: string | null;
  activeStep: string;
  durationMs: number;
}

export function ForensicScanner({
  status,
  fileName,
  activeStep,
  durationMs,
}: ForensicScannerProps) {
  const progressVariants = useMemo<Variants>(
    () => ({
      idle: { width: "0%" },
      scanning: {
        width: "100%",
        transition: { duration: durationMs / 1000, ease: "linear" },
      },
      result: { width: "100%" },
    }),
    [durationMs]
  );

  if (status === "idle") return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-cyan-500/90">
        <span className="truncate font-mono flex items-center gap-2">
          {status === "scanning" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-3 h-3" />
            </motion.div>
          )}
          {fileName ?? "Analyzing file"}
        </span>
        <span className="ml-2">{activeStep}</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden dark:bg-black dark:border dark:border-cyan-900/50 dark:rounded-sm">
        <motion.div
          className="h-full bg-blue-600 dark:bg-cyan-400 dark:shadow-[0_0_15px_cyan,inset_0_1px_1px_white]"
          variants={progressVariants}
          animate={status}
          initial="idle"
        />
      </div>
      <AnimatePresence>
        {status === "scanning" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-xs text-slate-500 dark:text-cyan-600/80"
          >
            Azure AI Forensics running ({Math.round(durationMs / 1000)}s)
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
