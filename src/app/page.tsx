"use client";

import { useState, useRef, useCallback } from "react";

type UploadState = "idle" | "uploading" | "success" | "error";

function FloralDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose to-transparent" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rose">
        <path
          d="M12 2C12 2 8 6 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 6 12 2 12 2Z"
          fill="currentColor"
          opacity="0.6"
        />
        <path
          d="M12 22C12 22 8 18 8 14C8 14 10 16 12 16C14 16 16 14 16 14C16 18 12 22 12 22Z"
          fill="currentColor"
          opacity="0.4"
        />
        <path
          d="M2 12C2 12 6 8 10 8C10 8 8 10 8 12C8 14 10 16 10 16C6 16 2 12 2 12Z"
          fill="currentColor"
          opacity="0.5"
        />
        <path
          d="M22 12C22 12 18 8 14 8C14 8 16 10 16 12C16 14 14 16 14 16C18 16 22 12 22 12Z"
          fill="currentColor"
          opacity="0.5"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose to-transparent" />
    </div>
  );
}

function FallingPetals() {
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: 8 + Math.random() * 12,
    opacity: 0.2 + Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <svg
          key={p.id}
          className="petal absolute"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
          width={p.size}
          height={p.size}
          viewBox="0 0 20 20"
          fill="none"
        >
          <ellipse cx="10" cy="10" rx="6" ry="10" fill="#d4a0a0" transform="rotate(30 10 10)" />
        </svg>
      ))}
    </div>
  );
}

function SuccessCheck() {
  return (
    <div className="fade-in-up flex flex-col items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-sage/30 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#7a8c6e" strokeWidth="2" opacity="0.5" />
          <path
            d="M12 20L18 26L28 14"
            stroke="#7a8c6e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-animate"
          />
        </svg>
      </div>
      <p className="text-deep-sage font-medium text-lg">Photos shared!</p>
      <p className="text-dark/50 text-sm">Thank you for capturing these moments</p>
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

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(xhr.responseText || "Upload failed"));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });

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
      <FallingPetals />

      {/* Floral top border */}
      <div className="w-full h-2 bg-gradient-to-r from-rose/30 via-gold/40 to-rose/30" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Floral frame top */}
        <div className="flex items-center gap-2 mb-2 text-rose/40">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <path d="M0 10C10 10 10 0 20 0C10 0 10 10 0 10Z" fill="currentColor" />
            <path d="M0 10C10 10 10 20 20 20C10 20 10 10 0 10Z" fill="currentColor" opacity="0.6" />
          </svg>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="3" fill="currentColor" />
          </svg>
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="scale-x-[-1]">
            <path d="M0 10C10 10 10 0 20 0C10 0 10 10 0 10Z" fill="currentColor" />
            <path d="M0 10C10 10 10 20 20 20C10 20 10 10 0 10Z" fill="currentColor" opacity="0.6" />
          </svg>
        </div>

        {/* Names */}
        <h1
          className="text-5xl sm:text-6xl font-bold text-dark tracking-tight text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Aarti{" "}
          <span className="text-3xl sm:text-4xl font-normal italic text-rose">&</span>{" "}
          Anuj
        </h1>

        {/* Date */}
        <p className="mt-3 text-sm sm:text-base tracking-[0.3em] uppercase text-dark/50 font-light">
          April 19, 2026
        </p>

        <FloralDivider />

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-dark/70 text-center max-w-xs"
          style={{ fontFamily: "'Playfair Display', serif" }}
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
                className="upload-pulse w-full py-5 px-8 rounded-2xl bg-gradient-to-br from-rose to-deep-rose text-white font-medium text-lg shadow-lg shadow-rose/30 active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Share Your Photos
                </div>
              </button>
              <p className="text-center text-xs text-dark/40 mt-3">
                Tap to select photos or videos from your gallery
              </p>
            </div>
          )}

          {state === "uploading" && (
            <div className="fade-in-up flex flex-col items-center gap-4">
              <div className="w-full bg-blush rounded-full h-3 overflow-hidden">
                <div
                  className="h-full progress-shimmer rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(progress, 5)}%` }}
                />
              </div>
              <p className="text-dark/60 text-sm">
                Uploading {fileCount} {fileCount === 1 ? "photo" : "photos"}... {progress}%
              </p>
            </div>
          )}

          {state === "success" && <SuccessCheck />}

          {state === "error" && (
            <div className="fade-in-up flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c44" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-red-400 text-sm text-center">{errorMsg}</p>
              <button
                onClick={() => setState("idle")}
                className="text-rose underline text-sm"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 pt-4 text-center">
        <FloralDivider />
        <p className="text-dark/30 text-xs tracking-wide flex items-center justify-center gap-2">
          Made with
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4a0a0">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          for Aarti & Anuj
        </p>
      </footer>

      {/* Bottom border */}
      <div className="w-full h-2 bg-gradient-to-r from-rose/30 via-gold/40 to-rose/30" />
    </div>
  );
}
