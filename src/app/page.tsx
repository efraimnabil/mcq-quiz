"use client";

import { useState, useEffect } from "react";
import type { QuizSettings, Question, QuizData } from "@/types";
import { filterQuestions } from "@/lib/quiz";
import LoadScreen from "@/components/LoadScreen";
import SetupScreen from "@/components/SetupScreen";
import InstantQuiz from "@/components/InstantQuiz";
import ReviewQuiz from "@/components/ReviewQuiz";
import ResultsScreen from "@/components/ResultsScreen";

type Phase = "load" | "setup" | "quiz" | "results";

const PROGRESS_KEY = "mcq-progress";
const SESSION_KEY = "mcq-quiz-session";

export default function Home() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [phase, setPhase] = useState<Phase>("load");
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ phase, quizData, settings, activeQuestions, answers }));
    } catch {}
  }, [mounted, phase, quizData, settings, activeQuestions, answers]);

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

  function handleChangeData() {
    try {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    setQuizData(null);
    setSettings(null);
    setActiveQuestions([]);
    setAnswers({});
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
      return <InstantQuiz questions={activeQuestions} onFinish={handleFinish} onBack={() => setPhase("setup")} />;
    }
    return <ReviewQuiz questions={activeQuestions} onFinish={handleFinish} onBack={() => setPhase("setup")} />;
  }

  return (
    <ResultsScreen
      questions={activeQuestions}
      answers={answers}
      onRestart={() => setPhase("setup")}
    />
  );
}
