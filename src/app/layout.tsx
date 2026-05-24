import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import { LanguageProvider } from "@/i18n";
import HtmlDirSync from "@/i18n/HtmlDirSync";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MCQ Quiz",
  description: "Study with multiple-choice questions from your lecture notes",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <HtmlDirSync />
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="text-center py-3 text-xs text-gray-400">
            Made with{" "}
            <span className="text-red-400">♥</span>{" "}
            <a
              href="https://www.linkedin.com/in/efraimnabil"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              Efraim Nabil
            </a>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
