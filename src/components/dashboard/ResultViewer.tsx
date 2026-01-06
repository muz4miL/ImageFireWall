import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Download, ShieldCheck } from "lucide-react";
import checkmarkIcon from "../../assets/checkmark.png";
import simulationHeatmap from "../../assets/simulation_heatmap.jpg";
import type { ScanStatus } from "./TrustDashboard";
import { CompareSlider } from "./CompareSlider";

interface ResultViewerProps {
  status: ScanStatus;
  originalImage?: string;
  fileName?: string;
  onReset?: () => void;
}

type Region = { x: number; y: number; w: number; h: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ResultViewer({
  status,
  originalImage,
  fileName,
  onReset,
}: ResultViewerProps) {
  const isAuthentic = status === "authentic";
  const isTampered = status === "tampered";

  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const demoMeta = useMemo(() => {
    const safeName = (fileName ?? "").toLowerCase();
    const isDemoTempered = safeName.includes("scan_tempered");
    const isDemoScan =
      safeName === "scan.jpg" || safeName.includes("/scan.jpg");
    const isDemo = isDemoTempered || isDemoScan;
    const region: Region = isDemoTempered
      ? { x: 0.58, y: 0.22, w: 0.22, h: 0.22 }
      : { x: 0.52, y: 0.28, w: 0.2, h: 0.2 };

    return {
      isDemo,
      isDemoTempered,
      region,
    };
  }, [fileName]);

  const leftImage =
    originalImage ?? "https://placehold.co/800x500/png?text=Uploaded+Image";

  useEffect(() => {
    if (!isEvidenceOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEvidenceOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEvidenceOpen]);

  const evidence = useMemo(() => {
    const r = demoMeta.region;
    const cx = clamp(r.x + r.w / 2, 0, 1);
    const cy = clamp(r.y + r.h / 2, 0, 1);
    return {
      rectStyle: {
        left: `${r.x * 100}%`,
        top: `${r.y * 100}%`,
        width: `${r.w * 100}%`,
        height: `${r.h * 100}%`,
      } as React.CSSProperties,
      zoomStyle: {
        backgroundImage: `url(${leftImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "260% 260%",
        backgroundPosition: `${cx * 100}% ${cy * 100}%`,
      } as React.CSSProperties,
    };
  }, [demoMeta.region, leftImage]);

  return (
    <AnimatePresence mode="wait">
      {isAuthentic && (
        <motion.div
          key="authentic"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 shadow-[0_0_18px_rgba(16,185,129,0.25)] dark:border-emerald-500/60 dark:bg-emerald-950/30 dark:text-emerald-200">
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ShieldCheck className="w-6 h-6" />
            </motion.div>
            <div>
              <p className="font-semibold text-sm tracking-wide">
                VERIFIED AUTHENTIC.
              </p>
              <p className="text-sm">
                No manipulation traces detected by Axiom Forensics ensemble
                models.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-700/60 dark:from-emerald-950/40 dark:to-slate-950">
            <div className="flex items-center gap-3 mb-3 text-emerald-700 dark:text-emerald-200">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30"
              >
                <img src={checkmarkIcon} alt="authentic" className="h-6 w-6" />
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold">
                  Integrity Report
                </p>
                <p className="text-sm font-medium">
                  {fileName ?? "Patient image"}
                </p>
              </div>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden border border-emerald-200/60 shadow-inner dark:border-emerald-700/40">
              <img
                src={leftImage}
                alt="Uploaded"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600 bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all dark:border-emerald-500 dark:bg-emerald-700/40 dark:text-emerald-50">
              <Download size={16} />
              Download Certified Report
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600/60 text-emerald-700 bg-emerald-50 text-sm font-semibold hover:bg-emerald-100 transition-all dark:border-emerald-700 dark:text-emerald-100 dark:bg-emerald-900/30"
              onClick={onReset}
              type="button"
            >
              Analyze Another Case
            </button>
          </div>
        </motion.div>
      )}

      {isTampered && (
        <motion.div
          key="tampered"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-red-400 bg-red-50 text-red-900 shadow-[0_0_20px_rgba(248,113,113,0.35)] dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="absolute -inset-1 rounded-full bg-red-500/20 blur-md" />
            </motion.div>
            <div>
              <p className="font-semibold text-sm tracking-wide">
                CRITICAL ALERT: ARTIFACTS DETECTED.
              </p>
              <p className="text-sm">
                High confidence of synthetic generation detected in highlighted
                regions.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-cyan-900/60 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-cyan-900/60">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-slate-900 dark:text-cyan-50">
                  <AlertTriangle
                    size={16}
                    className="text-red-600 dark:text-red-400"
                  />
                  <span className="text-sm font-semibold">
                    Forensic Overlay
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-cyan-500/80">
                  Drag the handle to reveal the overlay signal.
                </p>
              </div>
              <button
                className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition dark:border-cyan-800 dark:bg-cyan-950/20 dark:text-cyan-100 dark:hover:bg-cyan-900/30"
                type="button"
                onClick={() => setIsEvidenceOpen(true)}
              >
                Evidence Viewer
              </button>
            </div>

            <div className="p-3">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-cyan-900/60 dark:bg-black">
                <CompareSlider
                  leftImage={leftImage}
                  rightImage={simulationHeatmap}
                  initialValue={0.5}
                  className="h-full w-full"
                  leftAlt="Uploaded image"
                  rightAlt="Simulated forensic overlay"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-600 bg-red-600 text-white text-sm font-semibold shadow-md hover:bg-red-700 hover:shadow-lg transition-all dark:border-red-700 dark:bg-red-800/50 dark:text-red-50">
              <Download size={16} />
              Download Certified Report
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-600/70 text-red-700 bg-red-50 text-sm font-semibold hover:bg-red-100 transition-all dark:border-red-700 dark:text-red-100 dark:bg-red-900/30"
              onClick={onReset}
              type="button"
            >
              Analyze Another Case
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isTampered && isEvidenceOpen && (
          <motion.div
            key="evidence-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsEvidenceOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-cyan-900/60 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-cyan-900/60">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-cyan-500/70">
                    Evidence Viewer
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-cyan-50">
                    Suspected manipulation region
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {demoMeta.isDemo && (
                    <span className="text-xs px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-400">
                      Simulated overlay (demo)
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEvidenceOpen(false)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition dark:border-cyan-800 dark:bg-cyan-950/20 dark:text-cyan-100 dark:hover:bg-cyan-900/30"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 p-5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-cyan-500/70">
                    Source frame
                  </p>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-cyan-900/60 dark:bg-black">
                    <img
                      src={leftImage}
                      alt="Evidence source"
                      className="h-full w-full object-cover"
                    />

                    <div
                      className="absolute rounded-lg border-2 border-red-500/80"
                      style={evidence.rectStyle}
                    />
                    <motion.div
                      className="absolute rounded-lg bg-red-500/15"
                      style={evidence.rectStyle}
                      animate={{ opacity: [0.15, 0.35, 0.15] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-cyan-500/80">
                    Highlight indicates the region used for the overlay
                    visualization.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-cyan-500/70">
                    Zoom + grade
                  </p>
                  <div
                    className="aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-cyan-900/60 dark:bg-black"
                    style={evidence.zoomStyle}
                  />
                  <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-xs text-slate-600 shadow-inner dark:border-cyan-900/60 dark:bg-black/20 dark:text-cyan-200/90">
                    <p className="font-semibold text-slate-900 dark:text-cyan-50">
                      Finding summary
                    </p>
                    <p className="mt-1">
                      Localized texture + edge inconsistencies detected within
                      the marked area.
                      {demoMeta.isDemo
                        ? " (This is a simulated demo overlay for pitch visualization.)"
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAuthentic && !isTampered && (
        <motion.div
          key="placeholder"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 text-sm"
        >
          <div className="relative h-32 w-32 mb-4 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.3), transparent, rgba(6, 182, 212, 0.3), transparent)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <span className="absolute inset-1 rounded-full border border-blue-400/30 animate-ping dark:border-cyan-400/40" />
            <span className="absolute inset-3 rounded-full border border-blue-300/20 animate-ping [animation-delay:300ms] dark:border-cyan-500/30" />
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-blue-400/40 dark:border-cyan-500/50"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.2)",
                  "0 0 20px 4px rgba(59, 130, 246, 0.15)",
                  "0 0 0 0 rgba(59, 130, 246, 0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ boxShadow: "inset 0 0 20px rgba(59, 130, 246, 0.1)" }}
            />
            <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 backdrop-blur-sm flex items-center justify-center shadow-lg dark:from-slate-900 dark:to-black dark:border-cyan-800/60 dark:shadow-[0_0_30px_rgba(6,182,212,0.25)]">
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50/50 to-transparent dark:from-cyan-900/20 dark:to-transparent" />
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  filter: [
                    "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
                    "drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))",
                    "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
                  ],
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
