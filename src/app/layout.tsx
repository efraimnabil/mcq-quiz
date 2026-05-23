import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
        <footer className="fixed bottom-0 left-0 right-0 text-center py-3 text-xs text-gray-400 pointer-events-none">
          Made with{" "}
          <span className="text-red-400">♥</span>{" "}
          <a
            href="https://www.linkedin.com/in/efraimnabil"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-500 hover:text-blue-600 transition-colors pointer-events-auto"
          >
            Efraim Nabil
          </a>
        </footer>
      </body>
    </html>
  );
}
