import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "QR Generator",
  description: "Create beautiful QR codes instantly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white antialiased">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "!bg-gray-900 !text-white !border !border-white/10 !rounded-xl !shadow-lg",
            duration: 2000,
          }}
        />
      </body>
    </html>
  );
} 