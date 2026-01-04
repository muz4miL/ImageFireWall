import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ShieldCheck } from "lucide-react";
import { ForensicScanner } from "./ForensicScanner";
import { UploadZone } from "./UploadZone";
import { ResultViewer } from "./ResultViewer";
import { SpotlightCard } from "./SpotlightCard";

const SCAN_DURATION_MS = 3500;

const steps = [
  { label: "Verifying Metadata...", at: 0 },
  { label: "Scanning for GAN Artifacts...", at: 900 },
  { label: "Cross-checking Clinical Hashes...", at: 1800 },
  { label: "Finalizing Report...", at: 2700 },
];

type State = "idle" | "scanning" | "result";

export function TrustDashboard() {
  const [state, setState] = useState<State>("idle");
  const [activeStep, setActiveStep] = useState(steps[0].label);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return;
    setFileName(accepted[0].name);
    setState("scanning");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  useEffect(() => {
    if (state !== "scanning") return;

    const stepTimers = steps.map((step) =>
      setTimeout(() => setActiveStep(step.label), step.at)
    );

    const doneTimer = setTimeout(() => setState("result"), SCAN_DURATION_MS);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
  }, [state]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 text-slate-900 dark:text-cyan-50 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pr-28">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md dark:bg-cyan-600 dark:text-black dark:shadow-[0_0_20px_rgba(6,182,212,0.6)] dark:border dark:border-cyan-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-cyan-500/70">
              Medical Trust Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-cyan-50">
              AI Forensic Intake
            </h1>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/50 bg-emerald-50/80 text-emerald-700 text-xs font-semibold backdrop-blur-sm dark:border-cyan-500/40 dark:bg-cyan-950/40 dark:text-cyan-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 dark:bg-cyan-400" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-cyan-400 dark:shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </span>
          SYSTEM ONLINE
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SpotlightCard className="rounded-lg border border-slate-100 bg-white shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-cyan-800/50 dark:bg-slate-900/40 dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-3 tracking-tight text-slate-900 dark:text-cyan-400">
              Upload Study
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-4 dark:text-cyan-600/80">
              Drop radiology images or clinical photos. We simulate Azure AI
              verification.
            </p>
            {state === "idle" ? (
              <UploadZone
                rootProps={getRootProps()}
                inputProps={getInputProps()}
                isDragActive={isDragActive}
              />
            ) : (
              <ForensicScanner
                status={state}
                fileName={fileName}
                activeStep={activeStep}
                durationMs={SCAN_DURATION_MS}
              />
            )}
          </div>
        </SpotlightCard>

        <SpotlightCard className="rounded-lg border border-slate-100 bg-white shadow-xl shadow-slate-200/50 backdrop-blur-sm min-h-[320px] dark:border-cyan-800/50 dark:bg-slate-900/40 dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-cyan-400">
                Forensic Output
              </h2>
              <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 dark:bg-cyan-950/30 dark:text-cyan-500 dark:border-cyan-800/50">
                {state === "result"
                  ? "Complete"
                  : state === "scanning"
                  ? "Running"
                  : "Idle"}
              </span>
            </div>
            <ResultViewer status={state} />
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
