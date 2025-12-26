import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mafilu - Bağımsız Sinema Platformu",
  description: "Bağımsız yapımcıların filmlerini keşfedin ve izleyin. Türkiye'nin ilk bağımsız sinema platformu.",
  keywords: ["bağımsız sinema", "film izle", "indie film", "yapımcı", "kısa film"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0510] text-[#F5F3FF]`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

