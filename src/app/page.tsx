"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import QRCode from "qrcode";
import { toast } from "react-hot-toast";
import { QrCode, Copy, Check, Loader2, Download, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define types for component props to improve maintainability and readability
interface ThemeToggleButtonProps {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

interface InputSectionProps {
  content: string;
  setContent: (content: string) => void;
  copyToClipboard: () => Promise<void>;
  isCopied: boolean;
  generateQR: () => Promise<void>;
  isGenerating: boolean;
}

interface QrCodeDisplayProps {
  qrCode: string;
  downloadQR: () => void;
  darkMode: boolean;
}

// Reusable Theme Toggle Button Component
const ThemeToggleButton = ({ darkMode, setDarkMode }: ThemeToggleButtonProps) => (
  <button
    className="fixed top-6 right-6 z-50 rounded-full p-3 bg-white/80 dark:bg-[#23272f]/80 border border-blue-100 dark:border-blue-800 shadow-lg hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#00c2cb] dark:focus:ring-[#8b5cf6]"
    onClick={() => setDarkMode((d: boolean) => !d)}
    aria-label="Toggle dark mode"
  >
    {darkMode ? <Sun className="h-7 w-7 text-yellow-400" /> : <Moon className="h-7 w-7 text-purple-600" />}
  </button>
);

// Reusable Input Section Component
const InputSection = ({ content, setContent, copyToClipboard, isCopied, generateQR, isGenerating }: InputSectionProps) => (
  <div className="w-full flex flex-col gap-4">
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="flex-1 rounded-xl border border-blue-200/60 dark:border-blue-700/60 bg-white/80 dark:bg-[#181c23]/80 shadow-inner focus:shadow-md px-5 py-4 text-lg sm:text-xl font-medium text-[#1a202c] dark:text-[#e2e8f0] placeholder-[#4a5568] dark:placeholder-[#a0aec0] focus:outline-none focus:ring-4 focus:ring-[#00c2cb]/40 dark:focus:ring-[#8b5cf6]/40 transition-all"
        placeholder="Enter URL or text..."
        disabled={isGenerating}
        style={{ backdropFilter: 'blur(16px)' }}
        aria-label="QR input"
      />
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        onClick={copyToClipboard}
        disabled={!content || isGenerating}
        className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#e0e7ff] to-[#f0f7ff] dark:from-[#23272f] dark:to-[#23272f] border border-blue-200/60 dark:border-blue-800/60 text-purple-600 dark:text-teal-300 px-5 py-4 shadow-md hover:bg-blue-100/60 dark:hover:bg-[#23272f]/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#00c2cb] dark:focus:ring-[#8b5cf6] disabled:opacity-50"
        title="Copy input"
        aria-label="Copy input"
      >
        {isCopied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
      </motion.button>
    </div>
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.03 }}
      onClick={generateQR}
      disabled={isGenerating}
      className="mt-2 rounded-xl bg-gradient-to-r from-[#00c2cb] to-[#8b5cf6] dark:from-[#8b5cf6] dark:to-[#00c2cb] text-white font-bold px-8 py-4 shadow-lg hover:from-[#00a8af] hover:to-[#7f4be0] dark:hover:from-[#7f4be0] dark:hover:to-[#00a8af] transition-all focus:outline-none focus:ring-4 focus:ring-[#00c2cb]/60 dark:focus:ring-[#8b5cf6]/60 disabled:opacity-50 w-full text-lg sm:text-xl"
      aria-label="Generate QR Code"
    >
      {isGenerating ? <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" /> : <QrCode className="h-6 w-6 inline-block mr-2" />}
      Generate QR Code
    </motion.button>
  </div>
);

// Reusable QR Code Display Component
const QrCodeDisplay = ({ qrCode, downloadQR, darkMode }: QrCodeDisplayProps) => (
  <div className="flex flex-col items-center gap-6 w-full">
    <AnimatePresence mode="wait">
      {qrCode ? (
        <motion.div
          key="qr"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.4, 1] }}
          className="rounded-3xl border-2 border-[#00c2cb]/30 dark:border-[#8b5cf6]/30 bg-white/80 dark:bg-[#181c23]/80 shadow-2xl p-4 sm:p-8 flex items-center justify-center w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto"
          style={{ backdropFilter: 'blur(18px)' }}
        >
          <motion.img
            key={qrCode}
            src={qrCode}
            alt="Generated QR Code"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.2, 0.8, 0.4, 1] }}
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain drop-shadow-xl"
          />
        </motion.div>
      ) : (
        <motion.div
          key="placeholder"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.4, 1] }}
          className="rounded-3xl border-2 border-[#00c2cb]/20 dark:border-[#8b5cf6]/20 bg-white/60 dark:bg-[#181c23]/60 shadow-xl p-4 sm:p-8 flex items-center justify-center w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto"
          style={{ backdropFilter: 'blur(18px)' }}
        >
          <QrCode className="w-32 h-32 sm:w-40 sm:h-40 text-[#00c2cb]/20 dark:text-[#8b5cf6]/20" />
        </motion.div>
      )}
    </AnimatePresence>
    {qrCode && (
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.04 }}
        onClick={downloadQR}
        className="flex items-center gap-3 text-[#00c2cb] dark:text-[#8b5cf6] font-bold hover:underline mt-2 transition-all text-lg sm:text-xl"
        aria-label="Download QR"
      >
        <Download className="h-7 w-7" /> Download QR
      </motion.button>
    )}
  </div>
);

export default function Home() {
  // State management for QR code content, generation, and dark mode
  const [content, setContent] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Function to generate the QR code based on current content
  const generateQR = async () => {
    if (!content.trim()) {
      toast.error("Please enter some text or URL to generate a QR code");
      return;
    }

    setIsGenerating(true); // Indicate that generation is in progress
    try {
      const dataUrl = await QRCode.toDataURL(content, {
        errorCorrectionLevel: "H", // High error correction level for better readability
        margin: 2, // Minimal margin around the QR code
        width: 400, // Fixed width for the QR code image
        // Dynamic color based on dark mode
        color: { dark: darkMode ? "#e2e8f0" : "#1a202c", light: darkMode ? "#1a202c" : "#f0f7ff" }
      });
      setQrCode(dataUrl);
      toast.success("QR code generated!");
    } catch (error) {
      console.error("QR generation error:", error); // Log error for debugging
      toast.error("Failed to generate QR code.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to download the generated QR code
  const downloadQR = () => {
    if (!qrCode) return; // Only allow download if QR code exists
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-code-${Date.now()}.png`; // Unique filename for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded!");
  };

  // Function to copy the input content to clipboard
  const copyToClipboard = async () => {
    if (!content) return; // Only allow copy if content exists
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true); // Set copied state to show feedback
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (error) {
      console.error("Copy to clipboard error:", error); // Log error for debugging
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className={
      `${darkMode ? "dark" : ""} min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#eaf2ff] via-[#f5faff] to-[#eaf2ff] dark:from-[#0a111a] dark:via-[#1a202c] dark:to-[#0a111a] font-sans antialiased relative overflow-hidden`}
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Animated background blobs for extra polish */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-[#8b5cf6]/20 dark:bg-[#8b5cf6]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slow" />
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-[#00c2cb]/20 dark:bg-[#00c2cb]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob-slow animation-delay-2000" />
      </div>
      {/* Fixed dark mode button */}
      <ThemeToggleButton darkMode={darkMode} setDarkMode={setDarkMode} />
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.4, 1] }}
        className="relative z-10 w-full max-w-2xl flex flex-col justify-center items-center bg-white/60 dark:bg-[#181c23]/70 rounded-3xl shadow-2xl border border-blue-200/40 dark:border-blue-900/40 backdrop-blur-2xl px-4 sm:px-8 py-8 sm:py-12 gap-10 sm:gap-14 mx-2 my-8"
        style={{ boxShadow: darkMode ? '0 25px 100px rgba(0,0,0,0.5)' : '0 25px 100px rgba(56,189,248,0.18)' }}
      >
        {/* Title */}
          <motion.h1 
          initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.4, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00c2cb] via-[#8b5cf6] to-[#00c2cb] dark:from-[#8b5cf6] dark:via-[#00c2cb] dark:to-[#8b5cf6] drop-shadow-xl text-center mb-2"
          >
          QR Magic
          </motion.h1>
        {/* Input Section */}
        <InputSection
          content={content}
          setContent={setContent}
          copyToClipboard={copyToClipboard}
          isCopied={isCopied}
          generateQR={generateQR}
          isGenerating={isGenerating}
        />
        {/* QR Code Display */}
        <QrCodeDisplay
          qrCode={qrCode}
          downloadQR={downloadQR}
          darkMode={darkMode}
        />
      </motion.div>
    </div>
  );
} 