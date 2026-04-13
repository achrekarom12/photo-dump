import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aarti & Anuj — Share Your Moments",
  description: "Upload your photos from Aarti & Anuj's wedding celebration — April 19, 2026",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#090014] text-[#fdfcff] antialiased">
        {children}
      </body>
    </html>
  );
}
