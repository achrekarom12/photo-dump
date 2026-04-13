"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type UploadState = "idle" | "uploading" | "success" | "error";

function StarDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#a855f7]">
        <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" opacity="0.8" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a855f7] to-transparent opacity-50" />
    </div>
  );
}

function FlowerPetals() {
  const [petals, setPetals] = useState<{id: number, left: string, delay: string, duration: string, size: number, opacity: number, rotation: number}[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${10 + Math.random() * 15}s`,
        size: 15 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.4,
        rotation: Math.random() * 360,
      }))
    );
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <svg
          key={p.id}
          className="floral-petal absolute text-[#fbcfe8]"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rotation}deg)`,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C9.5 2 7 6 7 12C7 18 9.5 22 12 22C14.5 22 17 18 17 12C17 6 14.5 2 12 2Z" opacity="0.6"/>
          <path d="M22 12C22 9.5 18 7 12 7C6 7 2 9.5 2 12C2 14.5 6 17 12 17C18 17 22 14.5 22 12Z" opacity="0.6"/>
          <circle cx="12" cy="12" r="3" fill="#a855f7" />
        </svg>
      ))}
    </div>
  );
}

function SuccessCheck() {
  return (
    <div className="fade-in-up flex flex-col items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-[#5eead4]/20 flex items-center justify-center border border-[#5eead4]/30 shadow-[0_0_15px_rgba(94,234,212,0.2)]">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#0d9488" strokeWidth="2" opacity="0.5" />
          <path
            d="M12 20L18 26L28 14"
            stroke="#5eead4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-animate"
          />
        </svg>
      </div>
      <p className="text-[#5eead4] font-medium text-lg">Photos shared!</p>
      <p className="text-[#fdfcff]/60 text-sm">Thank you for capturing these moments</p>
    </div>
  );
}

export default function Home() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setState("uploading");
    setFileCount(files.length);
    setProgress(0);

    try {
      const totalFiles = files.length;
      let completedFiles = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("files", file);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const currentFileProgress = e.loaded / e.total;
              const overallProgress = Math.round(((completedFiles + currentFileProgress) / totalFiles) * 100);
              setProgress(overallProgress);
            }
          });

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(xhr.responseText || "Upload failed"));
            }
          };
          
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        });

        completedFiles++;
        setProgress(Math.round((completedFiles / totalFiles) * 100));
      }

      setState("success");
      setTimeout(() => {
        setState("idle");
        setProgress(0);
      }, 4000);
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setTimeout(() => {
        setState("idle");
        setErrorMsg("");
      }, 4000);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div className="relative flex flex-col min-h-dvh">
      <FlowerPetals />

      {/* Top border */}
      <div className="w-full h-2 bg-gradient-to-r from-[#a855f7]/20 via-[#fbcfe8]/30 to-[#a855f7]/20" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Decorative frame top */}
        <div className="flex items-center gap-2 mb-2 text-[#a855f7]/60">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <polyline points="0,10 10,0 20,10 10,20" fill="currentColor" opacity="0.4" />
          </svg>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z" fill="currentColor" />
          </svg>
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="scale-x-[-1]">
             <polyline points="0,10 10,0 20,10 10,20" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        {/* Names */}
        <h1
          className="parisienne-regular text-6xl sm:text-7xl text-[#fdfcff] tracking-wide text-center drop-shadow-md"
        >
          Aarti{" "}
          <span className="text-4xl sm:text-5xl text-[#fbcfe8] drop-shadow-[0_0_8px_rgba(251,207,232,0.6)] px-2">&</span>{" "}
          Anuj
        </h1>

        {/* Date */}
        <p className="mt-4 text-sm sm:text-base tracking-[0.3em] uppercase text-[#fdfcff]/50 font-light">
          April 19, 2026
        </p>

        <StarDivider />

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-[#fdfcff]/70 text-center max-w-xs"
        >
          Share your moments from our special day
        </p>

        {/* Upload Area */}
        <div className="mt-10 w-full max-w-sm">
          {state === "idle" && (
            <div className="fade-in-up">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="upload-pulse w-full py-5 px-8 rounded-2xl bg-gradient-to-br from-[#a855f7] to-[#7e22ce] text-white font-medium text-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-[#a855f7]/50 active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-center gap-3 drop-shadow-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Share Your Photos
                </div>
              </button>
              <p className="text-center text-xs text-[#fdfcff]/40 mt-3">
                Tap to select photos or videos from your gallery
              </p>
            </div>
          )}

          {state === "uploading" && (
            <div className="fade-in-up flex flex-col items-center gap-4">
              <div className="w-full bg-[#090014] border border-[#a855f7]/30 rounded-full h-3 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                <div
                  className="h-full progress-shimmer rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(progress, 5)}%` }}
                />
              </div>
              <p className="text-[#fdfcff]/70 text-sm">
                Uploading {fileCount} {fileCount === 1 ? "photo" : "photos"}... {progress}%
              </p>
            </div>
          )}

          {state === "success" && <SuccessCheck />}

          {state === "error" && (
            <div className="fade-in-up flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-red-400 text-sm text-center">{errorMsg}</p>
              <button
                onClick={() => setState("idle")}
                className="text-[#fbcfe8] hover:text-[#a855f7] transition-colors underline text-sm"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 pt-4 text-center">
        <StarDivider />
        <p className="text-[#fdfcff]/40 text-xs tracking-wide flex items-center justify-center gap-2">
          Made with
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#a855f7" className="drop-shadow-[0_0_4px_rgba(168,85,247,0.5)]">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          for Aarti & Anuj
        </p>
      </footer>

      {/* Bottom border */}
      <div className="w-full h-2 bg-gradient-to-r from-[#a855f7]/20 via-[#fbcfe8]/30 to-[#a855f7]/20" />
    </div>
  );
}
