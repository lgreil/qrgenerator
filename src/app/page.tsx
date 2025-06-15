"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Download, QrCode, Sparkles } from "lucide-react";

export default function Home() {
  const [content, setContent] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQR = async () => {
    if (!content.trim()) {
      toast.error("Enter something to generate");
      return;
    }

    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(content, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 400,
        color: { dark: "#fff", light: "#000" }
      });
      setQrCode(dataUrl);
      toast.success("QR code ready!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded!");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to generate QR code
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        generateQR();
      }
      // Ctrl/Cmd + D to download QR code
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && qrCode) {
        e.preventDefault();
        downloadQR();
      }
      // Escape to clear input
      if (e.key === "Escape") {
        setContent("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, qrCode]);

  return (
    <main className="flex min-h-screen items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-6 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-sm"
      >
        <div className="text-center">
          <h1 className="text-2xl font-medium">QR Generator</h1>
          <p className="mt-1 text-sm text-white/60">Create QR codes instantly</p>
          <p className="mt-2 text-xs text-white/40">
            Press <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-[10px]">Ctrl</kbd> + <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-[10px]">Enter</kbd> to generate
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    generateQR();
                  }
                }}
                className="h-28 w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm placeholder-white/40 focus:border-white/20 focus:outline-none"
                placeholder="Enter text or URL... (Ctrl + Enter to generate)"
              />
              <Sparkles className="absolute right-3 top-3 h-4 w-4 text-white/40" />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={generateQR}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black disabled:opacity-50"
            >
              <QrCode className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate"}
            </motion.button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {qrCode ? (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-3"
                >
                  <div className="rounded-xl bg-white p-2.5">
                    <img src={qrCode} alt="QR Code" className="h-36 w-36" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={downloadQR}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm font-medium hover:border-white/20"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-36 w-36 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-white/40"
                >
                  QR Code
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </main>
  );
} 