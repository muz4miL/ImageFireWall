import React from "react";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import { motion } from "framer-motion";
import biometricIcon from "../../assets/biometric-icon.png";

interface UploadZoneProps {
  rootProps: DropzoneRootProps;
  inputProps: DropzoneInputProps;
  isDragActive: boolean;
}

export function UploadZone({
  rootProps,
  inputProps,
  isDragActive,
}: UploadZoneProps) {
  return (
    <div {...rootProps}>
      <motion.div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer bg-slate-50 ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:border-cyan-500 dark:shadow-[0_0_20px_rgba(6,182,212,0.4)] dark:bg-cyan-950/20"
            : "border-slate-300 hover:border-slate-400 dark:border-cyan-900/50 dark:hover:border-cyan-800 dark:bg-black/40"
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...inputProps} />
        <motion.div
          className="inline-block mb-4"
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src={biometricIcon}
            alt="Biometric Scan"
            className="h-20 w-20 mx-auto object-contain"
          />
        </motion.div>
        <p className="text-base font-semibold mb-2 tracking-tight text-slate-900 dark:text-cyan-400">
          Drag & drop medical imagery
        </p>
        <p className="text-sm font-medium text-slate-500 dark:text-cyan-600/70">
          DICOM, PNG, or JPG — single file
        </p>
      </motion.div>
    </div>
  );
}
