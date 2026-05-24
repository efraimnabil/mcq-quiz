import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "اختبار MCQ",
  description: "ذاكر من أسئلة الاختيار من متعدد بتاعة محاضراتك",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
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
      </body>
    </html>
  );
}
