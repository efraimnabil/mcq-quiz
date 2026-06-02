"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "ar";
const LANG_KEY = "mcq-lang";

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  uploadFile: string;
  pasteJSON: string;
  dropFile: string;
  orClickToBrowse: string;
  pasteHere: string;
  loadQuestions: string;
  invalidJSON: string;
  howToGenerate: string;
  aiGuideText: string;
  copied: string;
  copy: string;
  viewSchema: string;
  questionsLectures: (q: number, l: number) => string;
  copiedLink: string;
  failed: string;
  share: string;
  change: string;
  quizMode: string;
  instantFeedback: string;
  endOfQuizReview: string;
  filterByLecture: string;
  allLectures: string;
  shuffleQuestions: string;
  shuffleQuestionsDesc: string;
  shuffleOptions: string;
  shuffleOptionsDesc: string;
  noQuestions: string;
  startQuiz: (n: number) => string;
  back: string;
  questionOf: (current: number, total: number) => string;
  explanation: string;
  correct: string;
  incorrect: (answer: string) => string;
  seeResults: string;
  nextQuestion: string;
  questionsNav: string;
  submit: string;
  previous: string;
  submitQuiz: string;
  next: string;
  answered: (done: number, total: number) => string;
  correctOf: (score: number, total: number) => string;
  excellent: string;
  goodJob: string;
  keepStudying: string;
  needsImprovement: string;
  retry: (n: number) => string;
  backToSetup: string;
}

const en: Translations = {
  appTitle: "MCQ Quiz",
  appSubtitle: "Load your questions to get started",
  uploadFile: "Upload File",
  pasteJSON: "Paste JSON",
  dropFile: "Drop your .json file here",
  orClickToBrowse: "or click to browse",
  pasteHere: "Paste your JSON here…",
  loadQuestions: "Load Questions",
  invalidJSON: "Invalid JSON:",
  howToGenerate: "How to generate JSON from a PDF",
  aiGuideText:
    "Send your PDF to any AI (ChatGPT, Claude, Gemini…) with the prompt below, then paste or save the result as a .json file.",
  copied: "Copied!",
  copy: "Copy",
  viewSchema: "View JSON schema",
  questionsLectures: (q, l) => `${q} questions · ${l} lectures`,
  copiedLink: "Copied! ✓",
  failed: "Failed",
  share: "Share ↗",
  change: "Change ↗",
  quizMode: "Quiz Mode",
  instantFeedback: "⚡ Instant Feedback",
  endOfQuizReview: "📋 End-of-Quiz Review",
  filterByLecture: "Filter by Lecture",
  allLectures: "All Lectures",
  shuffleQuestions: "Shuffle Questions",
  shuffleQuestionsDesc: "Randomize question order",
  shuffleOptions: "Shuffle Options",
  shuffleOptionsDesc: "Randomize A / B / C / D order",
  noQuestions: "No questions in selection",
  startQuiz: (n) => `Start Quiz — ${n} Questions`,
  back: "← Back",
  questionOf: (current, total) => `Question ${current} of ${total}`,
  explanation: "Explanation:",
  correct: "✓ Correct!",
  incorrect: (answer) => `✗ Incorrect — correct answer: ${answer}`,
  seeResults: "See Results",
  nextQuestion: "Next Question →",
  questionsNav: "Questions",
  submit: "Submit",
  previous: "← Previous",
  submitQuiz: "Submit Quiz",
  next: "Next →",
  answered: (done, total) => `${done}/${total} answered`,
  correctOf: (score, total) => `${score} correct out of ${total}`,
  excellent: "Excellent!",
  goodJob: "Good job!",
  keepStudying: "Keep studying!",
  needsImprovement: "Needs improvement",
  retry: (n) => `🔁 Retry ${n} wrong answer${n !== 1 ? "s" : ""}`,
  backToSetup: "↩ Back to Setup",
};

const ar: Translations = {
  appTitle: "اختبار MCQ",
  appSubtitle: "حمّل أسئلتك عشان تبدأ",
  uploadFile: "ارفع ملف",
  pasteJSON: "الصق JSON",
  dropFile: "اسقّط ملف .json هنا",
  orClickToBrowse: "أو اضغط عشان تختار",
  pasteHere: "الصق الـ JSON هنا…",
  loadQuestions: "حمّل الأسئلة",
  invalidJSON: "الـ JSON غلط:",
  howToGenerate: "إزاي تعمل JSON من PDF",
  aiGuideText:
    "ابعت الـ PDF لأي AI (ChatGPT أو Claude أو Gemini…) مع البرومبت اللي تحت، وبعدين الصق النتيجة أو احفظها كملف .json",
  copied: "اتنسخ!",
  copy: "انسخ",
  viewSchema: "شوف الـ JSON schema",
  questionsLectures: (q, l) => `${q} سؤال · ${l} محاضرة`,
  copiedLink: "اتنسخ! ✓",
  failed: "فشل",
  share: "شارك ↗",
  change: "غيّر ↗",
  quizMode: "نوع الامتحان",
  instantFeedback: "⚡ جواب فوري",
  endOfQuizReview: "📋 مراجعة في الآخر",
  filterByLecture: "اختار المحاضرة",
  allLectures: "كل المحاضرات",
  shuffleQuestions: "خلّط الأسئلة",
  shuffleQuestionsDesc: "رتّبهم بشكل عشوائي",
  shuffleOptions: "خلّط الإجابات",
  shuffleOptionsDesc: "رتّب الخيارات بشكل عشوائي",
  noQuestions: "مفيش أسئلة في الاختيار ده",
  startQuiz: (n) => `ابدأ الامتحان — ${n} سؤال`,
  back: "رجوع →",
  questionOf: (current, total) => `السؤال ${current} من ${total}`,
  explanation: "الشرح:",
  correct: "✓ صح!",
  incorrect: (answer) => `✗ غلط — الإجابة الصح: ${answer}`,
  seeResults: "شوف النتيجة",
  nextQuestion: "← السؤال الجاي",
  questionsNav: "الأسئلة",
  submit: "سلّم",
  previous: "اللي فات →",
  submitQuiz: "سلّم الامتحان",
  next: "← الجاي",
  answered: (done, total) => `${done}/${total} اتجاوبوا`,
  correctOf: (score, total) => `${score} صح من ${total}`,
  excellent: "ممتاز!",
  goodJob: "كويس!",
  keepStudying: "ذاكر أكتر!",
  needsImprovement: "لازم تذاكر أكتر",
  retry: (n) => `🔁 عيد ${n} إجابة غلط`,
  backToSetup: "↩ ارجع للإعداد",
};

const translations = { en, ar };

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangContextValue>({
  lang: "ar",
  setLang: () => {},
  t: ar,
  dir: "rtl",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY) as Lang | null;
      if (stored === "ar" || stored === "en") setLangState(stored);
    } catch {}
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  }

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang], dir }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
