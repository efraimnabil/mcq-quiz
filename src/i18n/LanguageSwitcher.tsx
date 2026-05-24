"use client";

import { useLang } from "./index";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white"
      aria-label="Switch language"
    >
      {lang === "en" ? "العربية" : "English"}
    </button>
  );
}
