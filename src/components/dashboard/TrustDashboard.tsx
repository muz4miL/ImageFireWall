import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { ForensicScanner } from "./ForensicScanner";
import { UploadZone } from "./UploadZone";
import { ResultViewer } from "./ResultViewer";
import { SpotlightCard } from "./SpotlightCard";

const SCAN_DURATION_MS = 4000;

export type ScanStatus = "idle" | "scanning" | "authentic" | "tampered";

type ScanResult = Exclude<ScanStatus, "idle" | "scanning">;

interface ScanHistoryEntry {
  filename: string;
  timestamp: string;
  result: ScanResult;
  confidence: number;
}

export function TrustDashboard() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);

  const telemetry = useMemo(() => {
    const total = scanHistory.length;
    const authenticCount = scanHistory.filter(
      (s) => s.result === "authentic"
    ).length;
    const tamperedCount = total - authenticCount;
    const last = scanHistory.at(-1);
    const recent = scanHistory.slice(Math.max(0, total - 10));
    const maxConf = Math.max(1, ...recent.map((r) => r.confidence));
    return { total, authenticCount, tamperedCount, last, recent, maxConf };
  }, [scanHistory]);

  const transitionVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    }),
    []
  );

  const calcConfidence = (result: ScanResult, filename?: string) => {
    const name = (filename ?? "").toLowerCase();
    if (name === "scan.jpg") return 99.3;
    if (name.startsWith("scan_tempered.")) return 91.7;

    const base = result === "authentic" ? 96 : 88;
    const variance = Math.random() * 4;
    return Number((base + variance).toFixed(1));
  };

  const handleFileDrop = (file: File, targetStatus: ScanResult) => {
    const name = file.name;
    const url = URL.createObjectURL(file);
    setFileName(name);
    setFilePreview(url);
    setScanStatus("scanning");

    setTimeout(() => {
      setScanStatus(targetStatus);
      setScanHistory((prev) => [
        ...prev,
        {
          filename: name,
          timestamp: new Date().toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          result: targetStatus,
          confidence: calcConfidence(targetStatus, name),
        },
      ]);
    }, SCAN_DURATION_MS);
  };

  const handleReset = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setFileName(null);
    setScanStatus("idle");
  };

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 text-slate-900 dark:text-cyan-50 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pr-28">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md dark:bg-cyan-600 dark:text-black dark:shadow-[0_0_20px_rgba(6,182,212,0.6)] dark:border dark:border-cyan-400">
            <BadgeCheck size={22} />
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
            <AnimatePresence mode="wait">
              {scanStatus === "idle" && (
                <motion.div key="upload" {...transitionVariants}>
                  <UploadZone onFileDrop={handleFileDrop} />
                </motion.div>
              )}

              {scanStatus === "scanning" && (
                <motion.div key="scanner" {...transitionVariants}>
                  <ForensicScanner
                    fileName={fileName}
                    durationMs={SCAN_DURATION_MS}
                  />
                </motion.div>
              )}

              {(scanStatus === "authentic" || scanStatus === "tampered") && (
                <motion.div
                  key="case-summary"
                  {...transitionVariants}
                  className="space-y-4"
                >
                  <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-sm p-4 dark:border-cyan-900/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/10" />
                    <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

                    <div className="relative flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-cyan-500/70">
                          Session snapshot
                        </p>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-cyan-50">
                          {fileName ?? "Uploaded study"}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 dark:text-cyan-500/80">
                          {scanStatus === "authentic"
                            ? "Axiom Forensics verified integrity."
                            : "Synthetic artifacts flagged for review."}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${
                          scanStatus === "authentic"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800"
                        }`}
                      >
                        {scanStatus === "authentic" ? "Authentic" : "Tampered"}
                      </span>
                    </div>

                    <div className="relative mt-4 grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-lg bg-white/80 border border-slate-100 px-3 py-2 shadow-inner dark:bg-slate-950/50 dark:border-cyan-900/60">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-cyan-500/80">
                          AI Confidence
                        </p>
                        <p className="text-base font-semibold text-slate-900 dark:text-cyan-50">
                          {scanHistory.at(-1)?.confidence.toFixed(1) ?? "96.4"}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/80 border border-slate-100 px-3 py-2 shadow-inner dark:bg-slate-950/50 dark:border-cyan-900/60">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-cyan-500/80">
                          Timestamp
                        </p>
                        <p className="text-base font-semibold text-slate-900 dark:text-cyan-50">
                          {scanHistory.at(-1)?.timestamp ?? "Just now"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/80 border border-slate-100 px-3 py-2 shadow-inner dark:bg-slate-950/50 dark:border-cyan-900/60">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-cyan-500/80">
                          Next Step
                        </p>
                        <p className="text-base font-semibold text-slate-900 dark:text-cyan-50">
                          Share with Audit Team
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-4 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3 shadow-inner dark:border-cyan-900/60 dark:bg-black/20">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-cyan-500/70">
                            Integrity Signals
                          </p>
                          <p className="text-xs text-slate-500 dark:text-cyan-500/80">
                            {telemetry.total} scan
                            {telemetry.total === 1 ? "" : "s"} •{" "}
                            {telemetry.tamperedCount} flagged
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-cyan-500/80">
                            Last Confidence
                          </p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-cyan-50">
                            {(telemetry.last?.confidence ?? 0).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-end gap-1.5 h-12">
                        {telemetry.recent.map((r) => {
                          const height = Math.max(
                            12,
                            Math.round((r.confidence / telemetry.maxConf) * 48)
                          );
                          const barClass =
                            r.result === "authentic"
                              ? "bg-emerald-500/70 dark:bg-emerald-400/70"
                              : "bg-red-500/70 dark:bg-red-400/70";
                          return (
                            <div
                              key={`${r.timestamp}-${r.filename}`}
                              className={`w-full rounded-sm ${barClass}`}
                              style={{ height }}
                              title={`${r.filename} • ${r.confidence.toFixed(
                                1
                              )}%`}
                            />
                          );
                        })}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-cyan-500/80">
                        <span>Green = Verified</span>
                        <button
                          onClick={handleReset}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-900/5 hover:bg-slate-900/10 transition dark:border-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-100 dark:hover:bg-cyan-900"
                          type="button"
                        >
                          Analyze Another Case
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SpotlightCard>

        <SpotlightCard className="rounded-lg border border-slate-100 bg-white shadow-xl shadow-slate-200/50 backdrop-blur-sm min-h-[320px] dark:border-cyan-800/50 dark:bg-slate-900/40 dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-cyan-400">
                Forensic Output
              </h2>
              <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 dark:bg-cyan-950/30 dark:text-cyan-500 dark:border-cyan-800/50">
                {scanStatus === "authentic" || scanStatus === "tampered"
                  ? "Complete"
                  : scanStatus === "scanning"
                  ? "Running"
                  : "Idle"}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center pt-6">
              <AnimatePresence mode="wait">
                {(scanStatus === "authentic" || scanStatus === "tampered") && (
                  <motion.div
                    key="result"
                    {...transitionVariants}
                    className="w-full"
                  >
                    <ResultViewer
                      status={scanStatus}
                      originalImage={filePreview ?? undefined}
                      fileName={fileName ?? undefined}
                      onReset={handleReset}
                    />
                  </motion.div>
                )}
                {scanStatus !== "authentic" && scanStatus !== "tampered" && (
                  <motion.div
                    key="placeholder"
                    {...transitionVariants}
                    className="w-full"
                  >
                    <ResultViewer status={scanStatus} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SpotlightCard>
      </div>

      <SpotlightCard className="mt-8 rounded-2xl border border-slate-100/70 bg-gradient-to-br from-white to-slate-50 shadow-xl shadow-slate-200/60 backdrop-blur-sm dark:border-cyan-800/60 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-[0_0_20px_rgba(6,182,212,0.12)]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-cyan-500/70">
                Session Log
              </p>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-cyan-50">
                Continuous Evidence Trail
              </h3>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-full bg-slate-900/5 text-slate-700 border border-slate-200 shadow-sm dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-800/80">
              {scanHistory.length} record{scanHistory.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm dark:border-cyan-900/60">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500 bg-slate-50/80 border-b border-slate-200 dark:text-cyan-400 dark:bg-slate-900/60 dark:border-cyan-900/70">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">AI Confidence</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 dark:divide-cyan-900/60">
                {scanHistory.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 px-4 text-slate-500 dark:text-cyan-600/80 text-center"
                    >
                      No scans yet. Upload a study to populate the session
                      trail.
                    </td>
                  </tr>
                )}
                {scanHistory
                  .slice()
                  .reverse()
                  .map((entry, idx) => {
                    const badgeClasses =
                      entry.result === "authentic"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800"
                        : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800";
                    return (
                      <tr
                        key={`${entry.timestamp}-${idx}`}
                        className="align-middle bg-white/60 hover:bg-emerald-50/40 transition dark:bg-slate-950/40 dark:hover:bg-cyan-950/30"
                      >
                        <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-cyan-400/80">
                          {entry.timestamp}
                        </td>
                        <td className="py-4 px-4 text-slate-900 font-semibold dark:text-cyan-50">
                          {entry.filename}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${badgeClasses}`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                            {entry.result === "authentic"
                              ? "Authentic"
                              : "Tampered"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-900 font-semibold dark:text-cyan-50">
                          {entry.confidence.toFixed(1)}%
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition dark:border-cyan-800 dark:bg-cyan-950/20 dark:text-cyan-100 dark:hover:bg-cyan-900/30">
                            View Report
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
