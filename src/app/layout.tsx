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
      <body className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-3xl px-4">
          {children}
        </div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "!bg-black !text-white !border !border-white/10",
            duration: 2000,
          }}
        />
      </body>
    </html>
  );
} 