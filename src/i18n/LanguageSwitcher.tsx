"use client";

import { useLang } from "./index";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded border border-gray-200 hover:border-gray-300"
      aria-label="Switch language"
    >
      {lang === "en" ? "العربية" : "English"}
    </button>
  );
}
