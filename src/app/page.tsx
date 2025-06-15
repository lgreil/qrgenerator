"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Download, QrCode, Sparkles, Copy, Check, Loader2, Zap, Wand2 } from "lucide-react";

export default function Home() {
  const [content, setContent] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateQR = async () => {
    if (!content.trim()) {
      toast.error("Please enter some text or URL to generate a QR code");
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
      toast.success("QR code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate QR code. Please try again.");
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
    toast.success("QR code downloaded!");
  };

  const copyToClipboard = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        generateQR();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && qrCode) {
        e.preventDefault();
        downloadQR();
      }
      if (e.key === "Escape") {
        setContent("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, qrCode]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] animate-blob rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 h-[500px] w-[500px] animate-blob animation-delay-2000 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] animate-blob animation-delay-4000 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl space-y-12 rounded-[2rem] border border-white/10 bg-gray-800/40 p-8 backdrop-blur-xl shadow-2xl md:p-12"
        role="region"
        aria-label="QR Code Generator"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-blue-500/20 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm"
          >
            <Wand2 className="h-4 w-4 text-indigo-400" />
            <span>Magic QR Generation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold tracking-tight md:text-6xl"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              QR Generator
            </span>
          </motion.h1>
          
          <p className="mt-4 text-lg text-white/70 md:text-xl">
            Transform your ideas into beautiful QR codes instantly
          </p>
          
          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-white/50">
            <kbd className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">Ctrl</kbd>
            <span>+</span>
            <kbd className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">Enter</kbd>
            <span>to generate</span>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 blur transition duration-1000 group-hover:opacity-75" />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    generateQR();
                  }
                }}
                className="relative h-44 w-full resize-none rounded-2xl border border-white/10 bg-gray-800/50 px-5 py-4 text-base placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="Enter text or URL... (Ctrl + Enter to generate)"
                aria-label="QR code content"
                disabled={isGenerating}
              />
              <div className="absolute right-4 top-4 flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="rounded-xl p-2 text-white/40 hover:text-white/60 hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  aria-label="Copy to clipboard"
                  disabled={!content || isGenerating}
                >
                  {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateQR}
              disabled={isGenerating}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4 text-base font-medium text-white shadow-lg transition-all hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
              aria-label={isGenerating ? "Generating QR code..." : "Generate QR code"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center gap-2">
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <QrCode className="h-5 w-5" />
                )}
                {isGenerating ? "Generating..." : "Generate QR Code"}
              </div>
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
                  className="space-y-6"
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 blur transition duration-1000 group-hover:opacity-75" />
                    <div className="relative rounded-2xl bg-white p-4 shadow-xl">
                      <img 
                        src={qrCode} 
                        alt="Generated QR Code" 
                        className="h-48 w-48"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadQR}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base font-medium hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    aria-label="Download QR code"
                  >
                    <Download className="h-5 w-5" />
                    Download QR Code
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 blur transition duration-1000 group-hover:opacity-75" />
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 text-sm text-white/40 backdrop-blur-sm"
                    role="status"
                    aria-label="QR code preview area"
                  >
                    {isGenerating ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                        <span className="text-sm">Generating...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <QrCode className="mx-auto mb-2 h-8 w-8 text-white/20" />
                        <span>QR Code Preview</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </main>
  );
} 