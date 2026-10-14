import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Lumina — Next-Generation Spatial Platform",
  description: "Cross-platform social, communication, and community platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-brand-indigo/30 selection:text-white">
        {/* Ambient background spatial glow shaders */}
        <div className="ambient-glow-bg">
          <div className="ambient-glow-1" />
          <div className="ambient-glow-2" />
        </div>
        <div className="relative z-10 w-full h-screen overflow-hidden flex">
          {children}
        </div>
      </body>
    </html>
  );
}
