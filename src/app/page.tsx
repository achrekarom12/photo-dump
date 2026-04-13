"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import coupleImg from "./assets/couple.png";

type UploadState = "idle" | "uploading" | "success" | "error";

export default function Home() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

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
    <div className="flex flex-col min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-outline/30">
        <nav className="flex justify-center items-center px-8 h-20 w-full max-w-none">
          <h1 className="text-xl font-['Noto_Serif'] font-bold text-primary tracking-[0.2em] uppercase mx-auto">Aarti & Anuj</h1>
        </nav>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section - Centered & Minimal */}
        <section className="relative pt-8 pb-16 px-6">
          <div className="absolute inset-0 minimal-texture pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-6 inline-block">
              <div className="w-12 h-[1px] bg-secondary/40 mx-auto mb-4"></div>
              <span className="text-secondary font-medium text-xs tracking-[0.3em] uppercase">April 19, 2026</span>
            </div>

            <h2 className="serif-display text-5xl md:text-7xl text-primary leading-tight mb-10">
              Share the <span className="italic font-normal">Magic</span>
            </h2>

            <div className="max-w-xl mx-auto mb-16">
              <p className="text-on-surface-variant text-lg leading-relaxed font-light">
                Help us preserve the memories from our special day. Your perspective makes our story beautiful.
              </p>
            </div>

            <div className="max-w-3xl mx-auto mb-20 rounded-lg overflow-hidden shadow-sm group">
              <img
                src={coupleImg.src}
                alt="Indian couple in traditional wedding attire"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => {
                  const section = document.getElementById('upload-section');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-primary text-on-primary px-12 py-5 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:bg-primary/90 hover:translate-y-[-2px]"
              >
                <span className="font-bold tracking-[0.1em] uppercase text-xs">Upload Memories</span>
              </button>
            </div>
          </div>
        </section>

        {/* Instructions & Upload */}
        <section id="upload-section" className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Simplified Instruction Line */}
            <div className="text-center mb-10">
              <p className="serif-display text-2xl text-primary font-light italic">
                &quot;High resolution, candid moments, effortlessly shared.&quot;
              </p>
              <div className="w-16 h-[1px] bg-secondary/30 mx-auto mt-8"></div>
            </div>

            {/* Centered Upload Area */}
            <div className="max-w-2xl mx-auto relative min-h-[360px]">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />

              {state === "idle" && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="fade-in-up border border-outline bg-surface-container-low rounded-xl p-16 text-center group cursor-pointer transition-all duration-500 hover:border-secondary/40 hover:bg-white absolute inset-0 flex flex-col justify-center items-center"
                >
                  <h4 className="serif-display text-2xl text-primary mb-4 font-light">Select your photos to share</h4>
                  <p className="text-on-surface-variant text-sm mb-12 font-light">PNG, JPEG, or HEIC files up to 25MB each</p>
                  <button className="border border-primary text-primary px-10 py-4 rounded-lg font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-primary hover:text-on-primary transition-all duration-300">
                    Choose Files
                  </button>
                </div>
              )}

              {state === "uploading" && (
                <div className="fade-in-up border border-outline bg-surface-container-low rounded-xl p-16 text-center flex flex-col items-center justify-center gap-8 absolute inset-0">
                  <div className="w-full max-w-sm bg-surface/50 border border-outline/50 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="h-full progress-shimmer rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(progress, 5)}%` }}
                    />
                  </div>
                  <p className="text-on-surface-variant text-sm font-light">
                    Uploading {fileCount} {fileCount === 1 ? "photo" : "photos"}... {progress}%
                  </p>
                </div>
              )}

              {state === "success" && (
                <div className="fade-in-up border border-outline bg-surface-container-low rounded-xl p-16 text-center flex flex-col items-center justify-center gap-6 absolute inset-0">
                  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" className="text-primary/20" />
                      <path
                        d="M12 20L18 26L28 14"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary check-animate"
                      />
                    </svg>
                  </div>
                  <h4 className="serif-display text-2xl text-primary font-light">Photos shared!</h4>
                  <p className="text-on-surface-variant text-sm font-light">Thank you for adding to our story.</p>
                </div>
              )}

              {state === "error" && (
                <div className="fade-in-up border border-error/30 bg-error-container/20 rounded-xl p-16 text-center flex flex-col items-center justify-center gap-6 absolute inset-0">
                  <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <p className="text-error text-sm text-center font-medium">{errorMsg}</p>
                  <button
                    onClick={() => setState("idle")}
                    className="mt-2 text-primary font-bold tracking-[0.1em] uppercase text-xs hover:text-primary/80 transition-all underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Share Button */}
          <div className="text-center mt-12">
            <button
              onClick={handleShare}
              className="border border-primary text-primary px-10 py-4 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:bg-primary hover:text-on-primary"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              )}
              <span className="font-bold tracking-[0.1em] uppercase text-xs">{copied ? "Link Copied!" : "Share this page"}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 px-8 border-t border-outline/30 mt-auto">
        <div className="flex flex-col items-center gap-10 w-full text-center">
          <div className="font-['Noto_Serif'] italic text-primary text-2xl">Aarti & Anuj</div>
          <p className="font-['Manrope'] text-[10px] tracking-[0.1em] uppercase text-on-surface-variant opacity-60">With Love | 2026</p>
        </div>
      </footer>
    </div>
  );
}
