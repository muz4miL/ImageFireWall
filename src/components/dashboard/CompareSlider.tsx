import React, { useCallback, useMemo, useRef, useState } from "react";

interface CompareSliderProps {
  leftImage: string;
  rightImage: string;
  leftAlt?: string;
  rightAlt?: string;
  /** 0..1 */
  initialValue?: number;
  className?: string;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function CompareSlider({
  leftImage,
  rightImage,
  leftAlt = "Left image",
  rightAlt = "Right image",
  initialValue = 0.5,
  className = "",
}: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [value, setValue] = useState(() => clamp01(initialValue));
  const [isDragging, setIsDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    setValue(clamp01(x));
  }, []);

  const onHandlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerIdRef.current = e.pointerId;
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      updateFromClientX(e.clientX);
    },
    [updateFromClientX]
  );

  const onHandlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      if (pointerIdRef.current !== e.pointerId) return;
      updateFromClientX(e.clientX);
    },
    [isDragging, updateFromClientX]
  );

  const onHandlePointerUp = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  const clipStyle = useMemo(
    () => ({
      clipPath: `inset(0 ${(1 - value) * 100}% 0 0)`,
    }),
    [value]
  );

  const handleStyle = useMemo(
    () => ({
      left: `${value * 100}%`,
    }),
    [value]
  );

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden ${className}`}
      aria-label="Image comparison slider"
    >
      <img
        src={leftImage}
        alt={leftAlt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <img
        src={rightImage}
        alt={rightAlt}
        className="absolute inset-0 h-full w-full object-cover"
        style={clipStyle}
        draggable={false}
      />

      {/* Handle (drag only — clicking elsewhere does not move) */}
      <div
        className="absolute top-0 bottom-0"
        style={handleStyle}
        aria-hidden="true"
      >
        <div className="absolute -translate-x-1/2 top-0 bottom-0 w-px bg-red-500/70 dark:bg-red-400/70" />

        <div
          className={`absolute -translate-x-1/2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-red-200 bg-white/90 shadow-md backdrop-blur-sm dark:border-red-900/60 dark:bg-black/70 ${
            isDragging ? "shadow-lg" : "hover:shadow-lg"
          }`}
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          onPointerCancel={onHandlePointerUp}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value * 100)}
          tabIndex={0}
        >
          <div className="absolute inset-0 rounded-full ring-1 ring-red-500/10 dark:ring-red-400/10" />
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            <div className="h-4 w-1 rounded-full bg-red-500/40 dark:bg-red-400/40" />
            <div className="h-4 w-1 rounded-full bg-red-500/40 dark:bg-red-400/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
