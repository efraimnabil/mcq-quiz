"use client";

import { useState, useEffect, useRef } from "react";
import type { QuizSettings, Question, QuizData } from "@/types";
import { filterQuestions } from "@/lib/quiz";
import { decodeQuiz } from "@/lib/share";
import LoadScreen from "@/components/LoadScreen";
import SetupScreen from "@/components/SetupScreen";
import InstantQuiz from "@/components/InstantQuiz";
import ReviewQuiz from "@/components/ReviewQuiz";
import ResultsScreen from "@/components/ResultsScreen";

type Phase = "load" | "setup" | "quiz" | "results";

const PROGRESS_KEY = "mcq-progress";
const SESSION_KEY = "mcq-quiz-session";
const PHASE_ORDER: Phase[] = ["load", "setup", "quiz", "results"];

export default function Home() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [phase, setPhase] = useState<Phase>("load");
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [mounted, setMounted] = useState(false);
  const skipNextPush = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hash = window.location.hash;
      if (hash.startsWith("#q=")) {
        try {
          const data = await decodeQuiz(hash.slice(3));
          if (cancelled) return;
          try {
            localStorage.removeItem(PROGRESS_KEY);
            localStorage.removeItem(SESSION_KEY);
          } catch {}
          window.history.replaceState(null, "", window.location.pathname);
          setQuizData(data);
          setPhase("setup");
          setMounted(true);
          return;
        } catch (e) {
          console.error("Failed to load shared quiz:", e);
          try {
            window.history.replaceState(null, "", window.location.pathname);
          } catch {}
        }
      }
      try {
        const raw = localStorage.getItem(PROGRESS_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s.quizData) setQuizData(s.quizData);
          if (s.phase) setPhase(s.phase);
          if (s.settings) setSettings(s.settings);
          if (s.activeQuestions?.length) setActiveQuestions(s.activeQuestions);
          if (s.answers) setAnswers(s.answers);
        }
      } catch {}
      if (!cancelled) setMounted(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Seed browser history so the phone/browser back button walks the phase
  // chain (load → setup → quiz → results) instead of leaving the site.
  useEffect(() => {
    if (!mounted) return;
    const idx = PHASE_ORDER.indexOf(phase);
    skipNextPush.current = true;
    window.history.replaceState({ phase: PHASE_ORDER[0] }, "");
    for (let i = 1; i <= idx; i++) {
      window.history.pushState({ phase: PHASE_ORDER[i] }, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onPopState = (e: PopStateEvent) => {
      const next = (e.state?.phase as Phase) ?? "load";
      skipNextPush.current = true;
      setPhase(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }
    window.history.pushState({ phase }, "");
  }, [phase, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ phase, quizData, settings, activeQuestions, answers }));
    } catch {}
  }, [mounted, phase, quizData, settings, activeQuestions, answers]);

  function goBack() {
    window.history.back();
  }

  function handleLoad(data: QuizData) {
    setQuizData(data);
    setPhase("setup");
  }

  function handleStart(s: QuizSettings) {
    const qs = filterQuestions(quizData!.questions, s);
    setSettings(s);
    setActiveQuestions(qs);
    setAnswers({});
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    setPhase("quiz");
  }

  function handleFinish(a: Record<number, number>) {
    setAnswers(a);
    setPhase("results");
  }

  function handleRetry(wrong: Question[]) {
    setActiveQuestions(wrong);
    setAnswers({});
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    setPhase("quiz");
  }

  function handleChangeData() {
    try {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    setQuizData(null);
    setSettings(null);
    setActiveQuestions([]);
    setAnswers({});
    skipNextPush.current = true;
    window.history.replaceState({ phase: "load" }, "");
    setPhase("load");
  }

  // Render LoadScreen during SSR and before hydration to avoid mismatch
  if (!mounted) return <LoadScreen onLoad={handleLoad} />;

  if (phase === "load") {
    return <LoadScreen onLoad={handleLoad} />;
  }

  if (phase === "setup" && quizData) {
    return (
      <SetupScreen
        data={quizData}
        onStart={handleStart}
        onChangeData={handleChangeData}
      />
    );
  }

  if (phase === "quiz" && settings) {
    if (settings.mode === "instant") {
      return <InstantQuiz questions={activeQuestions} onFinish={handleFinish} onBack={goBack} />;
    }
    return <ReviewQuiz questions={activeQuestions} onFinish={handleFinish} onBack={goBack} />;
  }

  return (
    <ResultsScreen
      questions={activeQuestions}
      answers={answers}
      onRestart={() => setPhase("setup")}
      onRetry={handleRetry}
    />
  );
}
